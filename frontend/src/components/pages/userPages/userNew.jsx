import {useState,useEffect} from "react";

function UserNew(){
    const [message,setMessage] = useState('');
    useEffect(() => {
        fetch('/api/users/new')
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
    },[]);
    return(
        //これに関しては、あとはcreate formの作成をして、データの送信をできるようにすれば良い（正直データの受け取りはここでは必要ないかも）
        //ここの役割は、指定のパスの際にformをレンダリングし、送信情報をサーバーに伝えることができれば良い
        <div className="form">
            <h1>UserNew</h1>
            <h2>{message}</h2>
        </div>
    )
}

export default UserNew;