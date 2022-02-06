import React, { useState,useEffect} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import uuid from 'react-uuid';

import ChatHeader from '../../components/block/chatHeader'; //ここに関しては、header単体の修正をする。
import DatabaseMessage from '../../components/module/databaseMessage';
import SocketMessage from '../../components/module/SocketMessage';
import MessageDelete from '../../components/ReactModal/messageDelete';
import UserProfile from '../../components/ReactModal/userProfile';

import {HandleError,Code401,Code500} from '../../components/module/errorHandler';

const ENDPOINT = 'http://localhost:3001';
const socketIO = socketIOClient(ENDPOINT);

/* class Channel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showAccount : false,
            profileExist : false,
        }
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
        return(     
            <UserProfile
                userData={this.state.userData}
                show={this.state.showAccount}
                profileExist={this.state.profileExist}
                onCloseCallback={this.close.bind(this)}
            />
        )
        
    }
} */

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
                <MessageDelete />
                <UserProfile />
            </div>
        </div>
    )
}

export default Channel;