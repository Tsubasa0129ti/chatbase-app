import React from 'react';

import ChatPopup from '../../components/module/chatPopup';

class ChannelDB extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show : false,
            self : false,
            userId : this.props.userId
        }
        this.mouseenterEvent = this.mouseenterEvent.bind(this);
        this.mouseleaveEvent = this.mouseleaveEvent.bind(this);
    }

    mouseenterEvent(e){

        //この時にstateの変化を実行する（propsとして渡す値の真偽値の変更） 確認したいこと　→ 全部のポップアップが表示されてしまう
        var userInfo = e.currentTarget.children[0].href;
        var userId = userInfo.split('/')[5];

        //ここから直接currentTargetのstyleの変更を実行する
        e.currentTarget.children[4].style.display = 'inline-block';

        if(userId === this.state.userId){
            //変更　currentTargetに対して直接に追加してあげる
            this.setState({
                show : true,
                self : true
            });
        }else{
            this.setState({
                show : true,
                self : false
            });
        }
    }

    mouseleaveEvent(e){
        e.currentTarget.children[4].style.display = 'none';

        this.setState({
            show : false
        });
    }


    Content(chatData,i){
        const messages = chatData[i].messages;
        var content = [];
        for(var j=0;j<messages.length;j++){
            
            var index = `${j}×${i};`//数値の取得を正確にできるようになれば、、、
            var className = 'database_message' + index;
            
            content.push(
                <div 
                    className='aaa_test'
                    onMouseEnter={this.mouseenterEvent}
                    onMouseLeave={this.mouseleaveEvent}
                >
                    <a 
                        className='test' 
                        href={`/profile/account/${messages[j].userId}`}
                        data-user={messages[j].userId}
                        onClick={this.props.profileShow}    
                    >
                        {messages[j].username}
                    </a>
                    <p>{messages[j].time}</p>
                    <p>{messages[j].text}</p>
                    <input type='hidden' value={messages[j].customId} />
                    <div style={{display : 'none'}}>
                        <ChatPopup socket={false}　show={this.state.show} self={this.state.self} userId={this.state.userId} />
                    </div>
                </div>
            )
        }
        return content;
    }

    render(){
        const chatData = this.props.chatData;
        const chat = [];
        for(var i=0;i<chatData.length;i++){
            chat.push(
                <div　className='ccc_test'>
                    <p>{chatData[i].date}</p>
                    {this.Content(chatData,i)}
                </div>
            )
        }
        

        return(
            <div className='channel_record'>
                {chat}
            </div>
        )
    }
}

export default ChannelDB;