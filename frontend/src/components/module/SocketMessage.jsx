import {useState,useEffect,useContext} from 'react';

import ChatPopup from '../atoms/chatPopup';
import {mouseEnter,mouseLeave} from './mouseMove';
import {ProfileStore} from './store';
import MessageUpdate from '../atoms/messageUpdate';

import '../../styles/components/module/socketMessage.scss';

function SocketMessage(props){
    const [item,setItem] = useState([]);
    const {dispatch} = useContext(ProfileStore);

    const profileShow = (e) => {
        e.preventDefault();

        var target = e.target;
        var id = target.dataset.user;

        dispatch({type:'popup',id:id});
    }

    const Content = (message) => {
        const content = [];
        content.push(
            <div className='msgFromSocket' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
                <a 
                    href={`/profile/account/${message.userId}`}
                    data-user={message.userId}
                    onClick={profileShow}
                    className='message_user'
                >
                    {message.username}
                </a>
                <p className='message_time'>{message.time}</p>
                <p className='message_text'>{message.text}</p>
                <input type='hidden' value={message.customId} />
                <ChatPopup userId={props.userId}  />
                <MessageUpdate />
            </div>
        );
        return content;
    }

    useEffect(() => {
        var socket = props.socket;
        if(socket){
            socket.forEach((message) => {
                var newItem;
                if(!message.date){
                    newItem = (
                        <div className='socketData'>
                            {Content(message)}
                        </div>
                    );
                }else{
                    newItem = (
                        <div className='socketData'>
                            <p className='message_date'>{message.date}</p>
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