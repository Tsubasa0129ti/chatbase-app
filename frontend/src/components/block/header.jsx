import React,{useState,useEffect} from 'react';
import {withRouter,useHistory} from 'react-router-dom';

import Log from '../atoms/log';

import '../../styles/components/block/header.scss';

function Header(props){
    const [loggedIn,setLoggedIn] = useState(false);
    /* const [message,setMessage] = useState(''); */

    const history = useHistory();

    //ここでログインの有無の判断をしていたのか　じゃあpropsとして送る形にするしかないか　ただし、上のstateが変化したタイミングでここにも影響を及ぼすことの確認をする

    /* useEffect(() => {
        //ここで初期のログインチェックを行う。
        const error = new Error();

        fetch('/api/users/loginCheck')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            console.log('pass1');
            if(obj.result === 'Authenticated'){
                setLoggedIn(true);
            }
        }).catch((err) => {
            console.log(err);
            if(err.status >= 500){ //サーバー側のエラーページを作成する。（ヘッダーのエラーの場合、メッセージの取得箇所が存在しないため・というか全て共通化するかも）
                history.push({
                    pathname : '/error/500',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                history.push({
                    pathname : '/error/500',
                    state : {message : err.message}
                });
            }
        });
    },[]); */

    const logout = () => {
        const error = new Error();

        fetch('/api/users/logout')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログアウトしました。'}
            });
        }).catch((err) => {
            if(err.status >= 500){
                history.push({
                    pathname : '/error/500',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                history.push({
                    pathname : '/error/500',
                    state : {message : err.message}
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
//必要なこと。ログインの有無は取得が必要（これでログインかログアウトかを変えるから）。

export default withRouter(Header); //補足　もし、メッセージの受け取り機能が必要なら追加