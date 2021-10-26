import {useState,useEffect} from 'react';

function ProfileIndex(){
    const [message,setMessage] = useState('');
    useEffect(() => {
        fetch('/api/users/mypage/profile')
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
    });
    return(
        <div className="chat">
            <h1>Profile Page</h1>
            <p>{message}</p>
        </div>
    )
}

export default ProfileIndex;