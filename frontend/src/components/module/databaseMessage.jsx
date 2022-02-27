import {useState,useEffect,useContext} from 'react';

import ChatPopup from '../atoms/chatPopup';
import MessageUpdate from '../atoms/messageUpdate';
import {mouseEnter,mouseLeave} from './mouseMove';
import {ProfileStore} from '../module/store';

import '../../styles/components/module/databaseMessage.scss';

function DatabaseMessage(props){
    const [item,setItem] = useState("");
    const {dispatch} = useContext(ProfileStore);

    const profileShow = (e) => {
        e.preventDefault();

        var target = e.target;
        var id = target.dataset.user;

        dispatch({type:'popup',id:id});
    }

    const Content = (element) => {
        var content = [];
        element.messages.forEach((message) => {
            content.push(
                <div className='message_box' onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
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
                    <ChatPopup userId={props.userId} />
                    <MessageUpdate />
                </div>
            );
        });
        return content;
    }

    useEffect(() => {
        var chatData = props.chatData;
        if(chatData){
            chatData.forEach((element) => {
                var newItem = (
                    <div className='oneDayMessage'>
                        <p className='message_date'>{element.date}</p>
                        {Content(element)}
                    </div>
                );
                setItem(oldItem => [...oldItem,newItem]);
            });
        }
    },[props.chatData]);
    return(
        <div className='database_message'>
            {item}
        </div>
    )
}

export default DatabaseMessage;