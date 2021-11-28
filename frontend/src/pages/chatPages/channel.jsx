import React from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'react-uuid';

import ChatHeader from '../../components/block/chatHeader';

const ENDPOINT = 'http://localhost:3001';
const socket = socketIOClient(ENDPOINT);

class Channel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false,
            userId : '',
            username : '',
            channel : {},
            chatData : [],
            chat_message : '',
            socket : [],
            message : '',
            test : []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        //構想　ここでは、channel内のデータを全て読み込む
        console.log(this.props.history);
        var path = this.props.location.pathname;
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

    handleSubmit(e){ //messageの送信層
        /* 問題点２つの整理
        	①socket.onの効果がインクリメントしてしまう 一応、イベントリスナの削除をすることでこれを解決
            ②stateにオブジェクトを内蔵した配列を入れ込むことができない　stateの更新をすることはできたが、一回クリック時には変化がない、ライフサイクルの問題が発生
        */
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

                console.log(message);
                socket.emit('message',message);

                socket.once("accepter",(data) => {
                    //以下の呼び出しが行われていない
                    console.log(data);
                    this.setState(prevState => ({
                        socket : [...prevState.socket,{
                            userId : data.userId,
                            username : data.user,
                            date : data.date,
                            time : data.time,
                            text : data.text,
                            customId : data.customId
                        }]
                    }))
                    console.log(this.state.socket);
                })
            }
        }

        const target = e.target;
        target['chat_message'].value = '';
    }

    Content(i,chatData){
        const messages = chatData[i].messages;
        let content = [];
        for(var j=0;j<messages.length;j++){
            content.push(
                <div>
                    <a href={`/users/${messages[j].userId}`}>{messages[j].username}</a>
                    <p>{messages[j].time}</p>
                    <p>{messages[j].text}</p>
                    <input type='hidden' value={messages[j].customId} />
                </div>
            )
        }
        console.log(content);
        return content;
    }

    render(){
        if(!this.state.channel){//
            return null;
        }else{

            const chatData = this.state.chatData;
    
            const items = [];
            for(var i=0;i<chatData.length;i++){　//ここが呼び出される回数は、chatData(日付)の量に依存する
                console.log("aaa");
                console.log(chatData)
                items.push(
                    <div>
                        <p>{chatData[i].date}</p>
                        {this.Content(i,chatData)}
                    </div>
                )
            }

            if(this.state.socket){
                var array = this.state.socket;
                console.log(array);
                const socketItems = [];
                for(var j=0;j<array.length;j++){//ここのトリガー条件がおかしい
                    socketItems.push(
                        <div>
                            <div>
                                <p>{array[j].date}</p>
                            </div>
                            <a href={`/users/${array[j].userId}`}>{array[j].username}</a>
                            <p>{array[j].time}</p>
                            <p>{array[j].text}</p>
                            <input type='hidden' value={array[j].customId} />
                        </div>
                    )
                }

                return(
                    <div>
                        <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                        <div className='channel_information'>
                            <p>チャンネル名　{this.state.channel.channelName}</p>
                            <p>チャンネル詳細　{this.state.channel.channelDetail}</p>
                            <p>作成者　{this.state.channel.createdBy}</p>
                        </div>
                        <div className='channel_database'>
                            {items}{/* ここでデータベースからの出力は完了 */}
                        </div>
                        <div className='channel_socket'>
                            {socketItems}
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name='chat_message' onChange={this.handleChange} />
                            <input type="submit" value='送信' />
                        </form>
                    </div>
                )
            }

            return(
                <div>
                    <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                    <div className='channel_information'>
                        <p>チャンネル名　{this.state.channel.channelName}</p>
                        <p>チャンネル詳細　{this.state.channel.channelDetail}</p>
                        <p>作成者　{this.state.channel.createdBy}</p>
                    </div>
                    <div className='channel_database'>
                        {items}{/* ここでデータベースからの出力は完了 */}
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name='chat_message' onChange={this.handleChange} />
                        <input type="submit" value='送信' />
                    </form>
                </div>
            )
        }
    }
}

export default Channel;

//とりあえず、socketそうに関しては分割するべきだが、今回は一旦無理やり条件分岐をしつつテストを行う