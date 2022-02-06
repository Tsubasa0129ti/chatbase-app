import React,{useState,useEffect} from 'react';

import ChatPopup from './chatPopup';
import {mouseEnter,mouseLeave} from './mouseMove';

function DatabaseMessage(props){
    const [item,setItem] = useState("");

    const Content = (element) => {
        var content = [];
        element.messages.forEach((message) => {
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
                    <ChatPopup userId={props.userId} />
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
                        <p>{element.date}</p>
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