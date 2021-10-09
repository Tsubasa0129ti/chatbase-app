import {useState,useEffect} from "react";

function UserIndex(){
    const [message,setMessage] = useState('');
    useEffect(() => {
        fetch('/api/users')
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
    });
    return(
        <div className="userIndex">
            <h1>User</h1>
            <h2>{message}</h2>
        </div>
    )
}

export default UserIndex;