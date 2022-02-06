import React,{useState,useEffect,useContext} from 'react';

import ChatPopup from './chatPopup';
import {mouseEnter,mouseLeave} from './mouseMove';
import {ProfileStore} from './store';

function SocketMessage(props){
    const [item,setItem] = useState([]);
    const {state,dispatch} = useContext(ProfileStore);

    const profileShow = (e) => {
        e.preventDefault();

        var target = e.target;
        var id = target.dataset.user;

        dispatch({type:'popup',id:id});
    }

    const Content = (message) => {
        const content = [];
        content.push(
            <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
                <a 
                    href={`/profile/account/${message.userId}`}
                    data-user={message.userId}
                    onClick={profileShow}
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