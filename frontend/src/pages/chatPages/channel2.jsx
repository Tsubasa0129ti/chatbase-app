import React from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'react-uuid';

import ChatHeader from '../../components/block/chatHeader';
import ChannelDB from '../../components/module/channelDB';
import ChannelSocket from '../../components/module/channelSocket';

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
            socket : []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){

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
                })
            }
        }

        const target = e.target;
        target['chat_message'].value = '';
    }

    render(){
        if(!this.state.userId){
            return null;
        }else{
            return(
                <div>
                    <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />

                    <div className='chat_main'>
                        <div className='channel_information'>
                            <p>チャンネル名　{this.state.channel.channelName}</p>
                            <p>チャンネル詳細　{this.state.channel.channelDetail}</p>
                            <p>作成者　{this.state.channel.createdBy}</p>
                        </div>
                        <ChannelDB chatData={this.state.chatData} userId={this.state.userId} />
                        <ChannelSocket socket={this.state.socket} userId={this.state.userId} />
                        <form className='message_submit' onSubmit={this.handleSubmit}>
                            <input type="text" name='chat_message' onChange={this.handleChange} />
                            <input type="submit" value='送信' />
                        </form>
                    </div>
                </div>
            )
        }
    }
}

export default Channel;