import React,{useState,useEffect} from 'react';
import {withRouter,useHistory} from 'react-router-dom';

import { HandleError } from '../module/errorHandler';

import Log from '../atoms/log';

import '../../styles/components/block/header.scss';

function Header(props){
    const [loggedIn,setLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetch('/api/users/loginCheck')
        .then(HandleError)
        .then((obj) => {
            setLoggedIn(true);
        }).catch((err) => {
            if(err.status === 401){
                setLoggedIn(false);
            }else if(err.status === 500){
                history.push({
                    pathname : '/error/500',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }
        });
    },[]);

    const logout = () => {
        fetch('/api/users/logout')
        .then(HandleError)
        .then((obj) => {
            history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログアウトしました。'}
            });
        }).catch((err) => {
            if(err.status === 500){
                history.push({
                    pathname : '/error/500',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }
        });
    }

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
                    <Log 
                        className='btn log-btn'
                        isLoggedIn={loggedIn}
                        login={() => {
                            history.push('/users/login');
                        }}
                        logout={() => {
                            logout();
                        }} 
                    />
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

export default withRouter(Header);