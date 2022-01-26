import React,{useState,useEffect} from 'react';
import {withRouter,useHistory} from 'react-router-dom';

import { HandleError } from '../module/errorHandler';

import Log from '../atoms/log';

import '../../styles/components/block/header.scss';

function Header(props){
    const history = useHistory();
    const [loggedIn,setLoggedIn] = useState(false);

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
                    history.push({
                        pathname : '/error/500',
                        state : {message : `${err.status} : ${err.message}`}
                    });
                }
            });
        }
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
                        isLoggedIn={props.loggedIn || loggedIn}
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