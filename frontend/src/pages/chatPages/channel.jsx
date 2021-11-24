import React from 'react';

import ChatHeader from '../../components/block/chatHeader';

class Channel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false,
            username : '',
            channel : {},
            chatData : [],
            message : ''
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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

    onChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

    onSubmit(e){
        e.preventDefault();

        //ここもfetchだが、とりあえずsocketに送る感じかな
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
        if(!this.state.channel){
            return null;
        }else{

            const chatData = this.state.chatData;
    
            const items = [];
            for(var i=0;i<chatData.length;i++){
                items.push(
                    <div>
                        <p>{chatData[i].date}</p>
                        {this.Content(i,chatData)}
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
                    <div className='channel_socket'></div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name='input_form' onChange={this.handleChange} />
                        <input type="submit" value='送信' />
                    </form>
                </div>
            )
        }
    }
}

export default Channel;