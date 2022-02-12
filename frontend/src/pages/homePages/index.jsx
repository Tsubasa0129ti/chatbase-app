import React,{useState,useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import Header from '../../components/block/header';

function Home(){
    const [message,setMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        if(location.state){
            setMessage(location.state.message);
        }
    },[]);

    return(
        <div>
            <Header loggedIn={null} />
            <div>
                <h2>Page</h2>
                <h3>{message}</h3>
            </div>
        </div>
    )
}

export default Home;