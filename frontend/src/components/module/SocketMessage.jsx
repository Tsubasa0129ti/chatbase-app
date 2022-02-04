import React,{useState,useEffect} from 'react';

import ChatPopup from './chatPopup';
import {mouseEnter,mouseLeave} from './mouseMove';

/* class SocketMessage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show : false,
            self : false,
            userId : this.props.userId
        }
        //this.mouseenterEvent = this.mouseenterEvent.bind(this);
        //this.mouseleaveEvent = this.mouseleaveEvent.bind(this);
    }

    mouseenterEvent(e){
        var userInfo = e.currentTarget.children[0].href;
        var userId = userInfo.split('/')[5];

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

    render(){
        console.log(this.props.socket);

        if(!this.props.socket){ //これないと初期レンダリングでエラーが発生する
            return null;
        }else{
            var socket = this.props.socket;

            const socketItems = [];
            for(var j=0;j<socket.length;j++){//これについて、もし記入中一切ロードをせずに日付を跨いだ場合には、挙動が不明。もしかしたら、新規の日付の出力がなくなるか、いずれにせよデータベースとの出力となんかしらことなる可能性がある

                var className = 'database_message' + j;

                socketItems.push(
                    <div>
                        <div>
                            <p>{socket[j].date}</p>
                        </div>
                        <div 
                            className='bbb_test'
                            onMouseEnter={this.mouseenterEvent}
                            onMouseLeave={this.mouseleaveEvent}
                        >
                            <a 
                                href={`/profile/account/${socket[j].userId}`}
                                data-user={socket[j].userId}
                                onClick={this.props.profileShow}
                            >
                                {socket[j].username}
                            </a>
                            <p>{socket[j].time}</p>
                            <p>{socket[j].text}</p>
                            <input type='hidden' value={socket[j].customId} />

                            <div style={{display:'none'}}>
                                <ChatPopup socket={true} show={this.state.show} self={this.state.self} userId={this.state.userId} />
                            </div>
                        </div>
                    </div>
                )
            }

            return(
                <div className='channel_instant'>
                    {socketItems}
                </div>
            )
        }
    }
} */

//export default ChannelSocket;

function SocketMessage(props){
    const [item,setItem] = useState([]);

    const Content = (message) => {
        const content = [];
        content.push(
            <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
                <a 
                    href={`/profile/account/${message.userId}`}
                    data-user={message.userId}
                >
                    {message.username}
                </a>
                <p>{message.time}</p>
                <p>{message.text}</p>
                <input type='hidden' value={message.customId} />
                <ChatPopup userId={props.userId}  />
            </div>
        );
        return content;
    }


    useEffect(() => {
        var socket = props.socket;
        if(socket){
            socket.forEach((message) => {
                if(!message.date){
                    var newItem = (
                        <div>
                            {Content(message)}
                        </div>
                    );
                }else{
                    var newItem = (
                        <div>
                            <p>{message.date}</p>
                            {Content(message)}
                        </div>
                    );
                }
                setItem([...item,newItem]);
            });            
        }
    },[props.socket]);  
    
    return(
        <div className='socket_message'>
            {item}
        </div>
    )
}

export default SocketMessage;