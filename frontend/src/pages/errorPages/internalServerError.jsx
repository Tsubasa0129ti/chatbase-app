import { useEffect, useState } from "react";
import Header from "../../components/block/header";

function InternalServerError(props){
    const [message,setMessage] = useState('');

    useEffect(() => {
        setMessage(props.location.state.message);
    },[]) ;

    return(
        <div>
            <Header loggedIn={null} />
            <p>statusCode500 : Internal Server Error</p>
            <p>{message}</p>
        </div>
    )
}

export default InternalServerError;
//ただし、エラーの詳細をもっと取得できればよし。エラー箇所とサーバーからのメッセージ。