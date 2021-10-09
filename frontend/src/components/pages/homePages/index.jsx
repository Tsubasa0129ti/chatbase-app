import {useState,useEffect} from "react";

function Home() {
    const [message,setMessage] = useState('');
    useEffect(() => {
        fetch('/api')
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
    },[])
    return (
        <div className="Home">
            <h1>Home</h1>
            <p>{message}</p>
        </div>
    );
}

export default Home;