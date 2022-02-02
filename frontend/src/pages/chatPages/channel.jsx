import React, { useState,useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'react-uuid';
import { useLocation, useHistory } from 'react-router-dom';

import ChatHeader from '../../components/block/chatHeader'; //ここに関しては、header単体の修正をする。
import DatabaseMessage from '../../components/module/databaseMessage'; //大方問題なし
import SocketMessage from '../../components/module/SocketMessage'; //大方問題無し
import MessageDelete from '../../components/ReactModal/messageDelete'; //一旦放置
import {showContext} from '../../context/showContext';//一旦放置
import UserProfile from '../../components/ReactModal/userProfile';//一旦放置

import {HandleError,Code401,Code500} from '../../components/module/errorHandler';

const ENDPOINT = 'http://localhost:3001';
const socketIO = socketIOClient(ENDPOINT);

/* class Channel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false, //個々の使用用途がheaderに対しての送出のみ。header内部でイベントを取得することができればここは不要になる
            userId : '', //これはsessionが完了すれば入らなくなる可能性もあり
            username : '', //これはsessionとheaderの整備で不要化するかも（popupの出現に必要な可能性もありだが。。。）
            channel : {},
            chatData : [],
            chat_message : '', //これは必要だが、もしかしたら子コンポーネントとして扱うかも
            socket : [],
            show : false,
            deleteData : {}, //これもここで管理する必要があるかkな？
            block : {},
            showAccount : false,
            profileExist : false,
            userData : {},
            message : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){//これに関しては、useEffectでのセットを行う。ただし、成功時の処理はそのほかの項目が終わってからしかできなそうか

        var path = this.props.location.pathname; //この層をもっと簡単にできるかもしれない。location
        const id = path.split('/')[3];

        const error = new Error();

        fetch(`/api/chat/${id}`)
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        }).then((obj) => {
            
            this.setState({
                isLoggedIn : obj.isLoggedIn,
                userId : obj.userId,
                username : obj.username,
                channel : obj.channel,
                chatData : obj.channel.chatData
            });

        }).catch((err) => {
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                console.error(`${err.status} : ${err.message}`);
            }else{
                console.error(err.message);
            }
        });
    }

    handleChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

    handleSubmit(e){
        //socketとのやりとりはここで行う
        e.preventDefault();
        
        //socketの配列を更新する
        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 
        var customId = uuid();
        var path = this.props.location.pathname;
        const chatId = path.split('/')[3];

        if(this.state.chat_message){
            if(socket !== undefined){
                const message = {
                    id : chatId,
                    userId : this.state.userId,
                    username : this.state.username,
                    text : this.state.chat_message,
                    date : `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日(${dayGetter[date.getDay()]})`,
                    time : `${date.getHours()}:${date.getMinutes()}`,
                    customId : customId,
                }

                socket.emit('message',message);

                socket.once("accepter",(data) => {
                    this.setState(prevState => ({ //そっか、前のsocketのデータもstateに入れ続ける必要があるのか
                        socket : [...prevState.socket,{
                            userId : data.userId,
                            username : data.user,
                            date : data.date,
                            time : data.time,
                            text : data.text,
                            customId : data.customId
                        }]
                    }))
                })
            }
        }

        const target = e.target;
        target['chat_message'].value = '';
        this.setState({
            chat_message : ''
        })
    }

    cancel(e){
        e.preventDefault();
        this.setState({
            show : false
        });
    }

    delete(e){
        e.preventDefault();
        const target = e.currentTarget;
        var deleteModal = target.closest('.delete_modal');

        var path = this.props.location.pathname;
        var chatId = path.split('/')[3];
        var customId = deleteModal.children[3].lastChild.value;

        const message = {
            chatId : chatId,
            customId : customId
        };
        socket.emit('delete',message);

        socket.once('delete',(data) => {
            var block = this.state.block;
            block.style.display = 'none';
        });
        
        this.setState({
            show : false
        });
    }

    profileShow(e) { //イベント自体は発火するけど、エラーまで行っていない
        e.preventDefault();

        console.log('yeah')
        const target = e.target;
        const id = target.dataset.user;

        const error = new Error();

        fetch(`/api/profile/${id}`)
        .then((res) => {
            if(!res.ok){
                return res.json().then(function(err) {

                    error.statusText = err.message;
                    if(err.message === "Cannot read property 'profile' of null"){
                        error.status = 410;
                    }else{
                        error.status = 500;
                    }
                    
                    console.error('res.status:',error.status);
                    console.error('res.statusText:',error.statusText);

                    throw error;
                });
            }
            return res.json();
        }).then((obj) => { //単純にprofileの有無によって分岐するだけだが、どのように行うか。。。
            console.log(obj.user);
            this.setState({
                userData : obj.user,
                showAccount : true
            });

            if(obj.profileExist){
                this.setState({
                    profileExist : true
                });
            }
        }).catch((err) => {
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status === 410){
                this.setState({
                    message : '現在そのアカウントは存在しません。'
                });
            }else if(err.status >= 500){
                this.props.history.push({
                    pathname : '/users/mypage',
                    state : {message : `${err.status} : ${err.message}`}
                })
            }else{
                console.log("bbb");
                this.props.history.push({
                    pathname : '/users',
                    stete : {message : err.message}
                });
            }
        });
    }

    close(e) {
        e.preventDefault();
        this.setState({
            profileExist : false,
            showAccount : false,
            user : {}
        });
    }

    render(){
        console.log(this.state.socket);

        if(!this.state.userId){
            return null;
        }else{
            return(
                <div>
                    <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />

                    <showContext.Provider value=
                        {{
                            showEvent : (e) => {
                                e.preventDefault();

                                var target = e.currentTarget;
                        
                                var block;
                                var deleteData;
                                var newDate;
                                if(target.closest('.aaa_test')){
                                    block = target.closest('.aaa_test');

                                    var dayChat = block.closest('.ccc_test');

                                    deleteData = {
                                        username : block.children[0].textContent,
                                        time : block.children[1].textContent,
                                        text : block.children[2].textContent,
                                        customId : block.children[3].value,
                                        date : dayChat.children[0].textContent,
                                    }

                                }else{
                                    block = target.closest('.bbb_test');
                                    newDate = block.previousElementSibling.firstElementChild;

                                    if(newDate.textContent){
                                        deleteData = {
                                            username : block.children[0].textContent,
                                            time : block.children[1].textContent,
                                            text : block.children[2].textContent,
                                            customId : block.children[3].value,
                                            date : newDate.textContent,
                                        }
                                    }else{
                                        var record = block.closest('.channel_instant').previousElementSibling;
                                        newDate = record.lastElementChild.children[0];
                                        
                                        deleteData = {
                                            username : block.children[0].textContent,
                                            time : block.children[1].textContent,
                                            text : block.children[2].textContent,
                                            customId : block.children[3].value,
                                            date : newDate.textContent,
                                        }
                                    }
                                }
                                console.log(block);

                                this.setState({
                                    show : true,
                                    deleteData : deleteData,
                                    block : block
                                });
                            }
                        }}>
                        <div className='chat_main'>
                            <div className='channel_information'>
                                <p>チャンネル名　{this.state.channel.channelName}</p>
                                <p>チャンネル詳細　{this.state.channel.channelDetail}</p>
                                <p>作成者　{this.state.channel.createdBy}</p>
                                <p>{this.state.message}</p>
                            </div>
                            <DatabaseMessage 
                                chatData={this.state.chatData} 
                                userId={this.state.userId}
                                profileShow={this.profileShow.bind(this)}
                            />
                            <ChannelSocket
                                socket={this.state.socket}
                                userId={this.state.userId}
                                profileShow={this.profileShow.bind(this)}
                            />
                            <form className='message_submit' onSubmit={this.handleSubmit}>
                                <input type="text" name='chat_message' onChange={this.handleChange} />
                                <input type="submit" value='送信' />
                            </form>
                        </div>
                    </showContext.Provider>

                    <MessageDelete 
                        show={this.state.show} 
                        deleteData={this.state.deleteData} 
                        onCancelCallback={this.cancel.bind(this)}
                        onDeleteCallback={this.delete.bind(this)}
                    />
                    <UserProfile
                        userData={this.state.userData}
                        show={this.state.showAccount}
                        profileExist={this.state.profileExist}
                        onCloseCallback={this.close.bind(this)}
                    />
                </div>
            )
        }
    }
} */



//messageDeleteとuserProfileに関しては、コンポーネントへのイベントの移行ができそう。ただ先にDatabaseMessageとchannelSocketの大きなイベントの対処から行うべきか
//form送信層を作ってしまうのはありかもしれない。ここで（プラスでupdateとdelete）socketとの接続を限定的に行うようにすることも可能なはず。かなりコンパクトになるかもしれない

function Channel(props){
    const [userId,setUserId] = useState(''); //これはsessionが適用され次第削除したい。
    const [username,setUsername] = useState(''); //同様
    const [text,setText] = useState('');
    const [channel,setChannel] = useState({});
    const [chatData,setChatData] = useState([]); //chatのメッセージ管理を行
    const [socket,setSocket] = useState(''); //socketのメッセージ管理を行う
    const [message,setMessage] = useState('');

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {//初期ロード時に読み込むもの
        var path = location.pathname;
        var id = path.split("/")[3];

        fetch(`/api/chat/${id}`)
        .then(HandleError)
        .then((obj) => {
            setUserId(obj.userId);
            setUsername(obj.username);
            setChannel(obj.channel);
            setChatData(obj.channel.chatData)
        })
        .catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    },[]);

    const handleChange = (e) => { //例えば、送信機能を故コンポーネントに委ねてしまうという手段。これを行うと、可読性の向上にはつながると思うが、
        const target = e.target;
        const value = target.value;

        setText(value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        //socketの配列を更新する
        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 
        var customId = uuid();
        var path = location.pathname;
        const chatId = path.split('/')[3];

        if(text){
            if(socketIO !== undefined){
                const message = {
                    id : chatId,
                    userId : userId,
                    username : username,
                    text : text,
                    date : `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日(${dayGetter[date.getDay()]})`,
                    time : `${date.getHours()}:${date.getMinutes()}`,
                    customId : customId,
                }

                socketIO.emit('message',message);

                socketIO.once("accepter",(data) => {
                    var newSocket = {
                        userId : data.userId,
                        username : data.user,
                        date : data.date,
                        time : data.time,
                        text : data.text,
                        customId : data.customId
                    }

                    setSocket([...socket,newSocket]);
                });
            }
        }

        const target = e.target;
        target['text'].value = '';
        setText('');
        console.log(`socketInSetText : ${socket}`);
    }

    return(
        <div>
            <ChatHeader isLoggedIn={true} />

            <div className='chat_main'>
                <div className='channel_information'>
                    <p>チャンネル名 : {channel.channelName}</p>
                    <p>チャンネル詳細 : {channel.channelDetail}</p>
                    <p>作成者 : {channel.createdBy}</p>
                    <p>{message}</p>
                </div>
                <DatabaseMessage 
                    chatData={chatData} 
                    userId={userId}
                />
                <SocketMessage
                    socket={socket}
                    userId={userId}
                />
                <form className='message_submit' onSubmit={handleSubmit}>
                    <input type="text" name='text' onChange={handleChange} />
                    <input type="submit" value='送信' />
                </form>
            </div>
        </div>
    )
}

//一旦初期機能（messageの表示と追加）以外を無視して考える。

export default Channel;