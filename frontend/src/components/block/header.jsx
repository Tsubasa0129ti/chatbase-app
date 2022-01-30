import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import { HandleError, Code500 } from '../module/errorHandler';

import Log from '../atoms/log';

import '../../styles/components/block/header.scss';

function Header(props){
    const [loggedIn,setLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if(props.loggedIn === null){
            fetch('/api/users/setLoggedIn')
            .then(HandleError)
            .then((obj) => {
                if(obj.isAuthenticated){
                    setLoggedIn(true);
                }else{
                    setLoggedIn(false);
                }
            }).catch((err) => {
                if(err.status === 500){
                    Code500(err,history);
                }
            });
        }
    },[]);

    return(
        <div className='header'>
            <div className='header-inner'>
                <div className='header-left'>
                    <a href="/">React Chat</a>
                </div>
                <nav className='header-navi'>
                    <ul>
                        <li><a href="/users">Account</a></li>
                        <li><a href="/chat">Chat</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
                <div className='header-right'>
                    <Log className='btn log-btn' isLoggedIn={props.loggedIn || loggedIn} />
                    <button 
                        className='btn signup-btn'
                        onClick={() => {history.push('/users/new')}}
                    >
                        登録
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default Header;