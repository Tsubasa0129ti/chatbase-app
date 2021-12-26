import React,{useState,useEffect} from 'react';
import Header from '../../components/block/header';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSms , faUserPlus , faUserLock } from "@fortawesome/free-solid-svg-icons";

import '../../styles/layouts/users/main.scss';

function Index(props){
    const [message,setMessage] = useState('');
    useEffect(() => {
        if(props.location.state){
            setMessage(props.location.state.message);
        }
    });
    console.log(message);

    return(
        <div className='main'>
            <Header message={message} />
            <div className='main_page'>
                <div className='main-top'>
                    <p className='main-icon'>
                        <FontAwesomeIcon icon={faSms} size='3x' />
                    </p>
                    <p className='main-title'>React Chat</p>
                    <p className='main-description'>description</p>
                </div>
                <div className='nav-button'>
                    <button
                        className='toLogin'
                        onClick={
                            (e) => {
                                e.preventDefault();
                                props.history.push('/users/login');
                            }
                        }
                    >
                        <FontAwesomeIcon icon={faUserLock} /> Login
                    </button>

                    <button
                        className='toCreate'
                        onClick={
                            (e) => {
                                e.preventDefault();
                                props.history.push('/users/new');
                            }
                        }
                    >
                        <FontAwesomeIcon icon={faUserPlus} /> Get Account
                    </button>
                </div>
                <div className='main-bottom'>
                    <a href="/" className='toHome'>Home</a>
                </div>
            </div>
        </div>
    )
}

export default Index;