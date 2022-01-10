import React from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'react-uuid';

import ChatHeader from '../../components/block/chatHeader';
import ChannelDB from '../../components/module/channelDB';
import ChannelSocket from '../../components/module/channelSocket';
import MessageDelete from '../../components/ReactModal/messageDelete';
import {showContext} from '../../context/showContext';
import UserProfile from '../../components/ReactModal/userProfile';

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
            show : false,
            deleteData : {},
            block : {},
            showAccount : false,
            profileExist : false,
            userData : {},
            message : ''
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
                /* console.error('res.ok:',res.ok);

                console.log(res);


                console.error('res.status',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error; */


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
                            <ChannelDB 
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
}

export default Channel;