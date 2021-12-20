import React,{useState,useEffect} from 'react';
import Header from '../../components/block/header';

function Index(props){
    const [message,setMessage] = useState('');
    useEffect(() => {
        if(props.location.state){
            setMessage(props.location.state.message);
        }
    });

    return(
        <div>
            <Header message={message} />
            <h3>User Main Page</h3>
        </div>
    )
}

export default Index;