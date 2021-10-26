import {useState,useEffect} from 'react';

function ChatIndex(){
    const [message,setMessage] = useState('');
    useEffect(() => {
        fetch('/api/chat')
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
    });
    return(
        <div className="chat">
            <h1>Chat Main Page</h1>
            <p>{message}</p>
        </div>
    )
}

export default ChatIndex;