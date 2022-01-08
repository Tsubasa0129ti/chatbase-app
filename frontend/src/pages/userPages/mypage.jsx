import React,{useState,useEffect} from 'react';
import { useHistory,useLocation } from 'react-router';
import Header from '../../components/block/header';
import AccountDelete from '../../components/ReactModal/accountDelete';
import ProfileComment from '../../components/atoms/profileComment';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog , faAddressCard , faEdit , faTrashAlt ,faIdCard ,faUser , faChartLine , faBlog , faComment} from "@fortawesome/free-solid-svg-icons";
import {faComments} from '@fortawesome/free-regular-svg-icons'

import '../../styles/layouts/users/mypage.scss';

function Mypage(props){
    const [user,setUser] = useState({});
    const [username,setUsername] = useState('');
    const [profile,setProfile] = useState(false);
    const [show,setShow] = useState(false);
    const [message,setMessage] = useState('');

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const error = new Error();

        fetch('/api/users/mypage')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.message = res.statusText;
                error.status = res.status;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            setUsername(obj.user.name.first + ' ' + obj.user.name.last);
            setUser(obj.user);
            if(obj.profile){
                setProfile(true);
            }
        }).catch((err) => {
            if(err.status === 401){
                history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                history.push({
                    pathname : '/users',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                history.push({
                    pathname : '/users',
                    state : {message : err.message}
                });
            }
        });
    },[]);

    useEffect(() => {
        if(location.state){
            setMessage(location.state.message);
        }
    },[]);

    const cancel = () => {
        setShow(false);
    };

    const deleteEvent = () => {
        const error = new Error();

        fetch(`/api/users/mypage/delete`,{
            method : 'DELETE',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
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
                state : {message : 'アカウントの削除に成功しました。'}
            });
        }).catch((err) => {
            if(err.status >= 500){
                history.push({
                    pathname : '/users/mypage',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                history.push({
                    pathname : '/users/mypage',
                    state : {message : err.message}
                });
            }
        });
    };

    if(!profile) {
        return(
            <div className='mypage'>
                <Header />
                <div className='users_mypage'>
                    <div className='mypage-top'>
                        <p　className='mypage-title'>My Page</p>
                        <div className='mypage-menu'>
                            <button 
                                className='menu-button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    var popup = e.currentTarget.nextElementSibling;
                                    if(popup.className === 'prevPopup'){
                                        popup.classList.replace('prevPopup','popup-menu');
                                    }else{
                                        popup.classList.replace('popup-menu','prevPopup');
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faCog} size='3x' className='cog-icon' />
                            </button>
                            <div className='prevPopup'>
                                <button 
                                    className='toEdit'
                                    onClick={() => history.push('/users/mypage/edit')}
                                >
                                    <FontAwesomeIcon icon={faEdit} /> Edit Account
                                </button>
                                <button
                                    className='toDelete'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShow(true);
                                    } }
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} /> Delete Account
                                </button>
                            </div>
                        </div>
                        
                        <p className='welcome-msg'>Welcome back {username}</p>
                    </div>
                    <div className='user-info'>
                        <div className='userInfo-title'>
                            <p className='title-content'>ユーザー情報</p>
                        </div>
                        <div className='username-record user-record'>
                            <label htmlFor="username" className='label'>username:</label>
                            <input type="text" className='username-value user-value' value={username} readOnly />
                        </div>
                        <div className='email-record user-record'>
                            <label htmlFor="email" className='label'>Email:</label>
                            <input type="text" className='email-value user-value' value={user.email} readOnly />
                        </div>
                    </div>
                    <div className='toCreateProfile'>
                        <p className='profileDesc'>プロフィールを作成すると、自身の自己紹介などを設定することができます。</p>
                        <button
                            className='toProfile' 
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    history.push('/profile/new');
                                }
                            }
                        >
                            <FontAwesomeIcon icon={faAddressCard} /> Create Profile
                        </button>
                    </div>
                </div>
                <AccountDelete
                    show={show}
                    onCancelCallback={() => {cancel()}}
                    onDeleteCallback={() => {deleteEvent()}}
                />
            </div>
        )
    }else{
        return(
            <div className='mypage'>
                <Header />
                <div class='container'>
                    <div className='aside'>
                        <div className='user-icon'>
                            <FontAwesomeIcon icon={faUser} size='10x' className='icon' />
                        </div>
                        <div className='setting'>
                            <div className='text-line'>
                                <p><FontAwesomeIcon icon={faCog} /> Setting</p>
                            </div>
                            <a href="/users/mypage/edit"><FontAwesomeIcon icon={faEdit} /> Edit Account</a>
                            <a href="/profile/edit"><FontAwesomeIcon icon={faIdCard} /> Edit Profile</a>
                            <a 
                                href='/' 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShow(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} /> Delete
                            </a>
                        </div>
                        <div className='application'>
                            <div className='text-line'>
                              <p><FontAwesomeIcon icon={faChartLine} /> Application</p>  
                            </div>
                            <a href="/chat"><FontAwesomeIcon icon={faComments} /> Chat Page</a>
                            <a href="/blog"><FontAwesomeIcon icon={faBlog} /> Blog Page</a>
                        </div>
                    </div>
                    <div className='main'>
                        <div className='profile-header'>
                            <p className='username'>Welcome back, {username}</p>
                            <ProfileComment intro={user.profile.intro} />
                        </div>
                        <div className='profile-detail'>
                            <div className='about'>
                                <p className='about-top'><FontAwesomeIcon icon={faUser} /> About</p>
                                <div className='contact-info'>
                                    <p>Contact Information</p>
                                    <div className='content'>
                                        <label htmlFor="email" className='label'>Email　:</label>
                                        <input type="text" className='item' value={user.email} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="country" className='label'>Country　:</label>
                                        <input type="text" className='item' value={user.profile.country} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="Address" className='label'>Address　:</label>
                                        <input type="text" className='item' value={user.profile.address} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="professional" className='label'>Professional</label>
                                        <input type="text" className='item' value={user.profile.professional} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="belongings" className='label'>Belongings　:</label>
                                        <input type="text" className='item' value={user.profile.belongings} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="site" className='label'>Site　:</label>
                                        <input type="text" className='item' value={user.profile.site} disabled />
                                    </div>
                                </div>
                                <div className='basic-info'>
                                    <p>Basic Information</p>
                                    <div className='content'>
                                        <label htmlFor="gender" className='label'>Gender　:</label>
                                        <input type="text" className='item' value={user.profile.gender} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="age" className='label'>Age　:</label>
                                        <input type="text" className='item' value={user.profile.age} disabled />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="birthday" className='label'>Birthday　:</label>
                                        <input type="text" className='item' value={user.profile.birthday} disabled />
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <AccountDelete
                    show={show}
                    onCancelCallback={() => {cancel()}}
                    onDeleteCallback={() => {deleteEvent()}}
                />
            </div>
        )
    }
}

export default Mypage;
