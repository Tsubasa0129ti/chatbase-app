import {useState,useEffect,useContext} from 'react';
import { useHistory } from 'react-router';

import Header from '../../components/block/header';
import {HandleError,Code401,Code500} from '../../components/module/errorHandler';

import AccountDelete from '../../components/ReactModal/accountDelete';
import ProfileComment from '../../components/atoms/profileComment';

import { UserDeleteStore } from '../../components/module/store';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog , faAddressCard , faEdit , faTrashAlt ,faIdCard ,faUser , faChartLine , faBlog} from "@fortawesome/free-solid-svg-icons";
import {faComments} from '@fortawesome/free-regular-svg-icons'

import '../../styles/layouts/users/mypage.scss';

function Mypage(){
    const [user,setUser] = useState({});
    const {dispatch} = useContext(UserDeleteStore);
    const history = useHistory();

    useEffect(() => {
        fetch('/api/users/mypage')
        .then(HandleError)
        .then((obj) => {
            setUser(obj.user);
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    },[]);

    const popup = (e) => {
        e.preventDefault();
        dispatch({type:'popup'});
    }

    const menu = (e) => { //この取得方法は大幅に変更の可能性あり。
        e.preventDefault();

        var popup = e.currentTarget.nextElementSibling;
        if(popup.className === 'prevPopup'){
            popup.classList.replace('prevPopup','popup-menu');
        }else{
            popup.classList.replace('popup-menu','prevPopup');
        }
    }

    if(!user.name){
        return null;
    }else{
        if(!user.profile) {
            return(
                <div className='mypage'>
                    <Header loggedIn={true} />
                    <div className='users_mypage'>
                        <div className='mypage-top'>
                            <p className='mypage-title'>My Page</p>
                            <div className='mypage-menu'>
                                <button className='menu-button' onClick={menu}>
                                    <FontAwesomeIcon icon={faCog} size='3x' className='cog-icon' />
                                </button>
                                <div className='prevPopup'>
                                    <a href="/users/mypage/edit" className='toEdit'><FontAwesomeIcon icon={faEdit} /> Edit Account</a>
                                    <a href="/" className='toDelete' onClick={popup}><FontAwesomeIcon icon={faTrashAlt} /> Delete Account</a>
                                </div>
                            </div>
                            
                            <p className='welcome-msg'>Welcome back {user.name.first + ' ' + user.name.last}</p>
                        </div>
                        <div className='user-info'>
                            <div className='userInfo-title'>
                                <p className='title-content'>ユーザー情報</p>
                            </div>
                            <div className='username-record user-record'>
                                <label htmlFor="username" className='label'>username :</label>
                                <input type="text" className='username-value user-value' value={user.name.first + ' ' + user.name.last} readOnly />
                            </div>
                            <div className='email-record user-record'>
                                <label htmlFor="email" className='label'>Email :</label>
                                <input type="text" className='email-value user-value' value={user.email} readOnly />
                            </div>
                        </div>
                        <div className='toCreateProfile'>
                            <p className='profileDesc'>プロフィールを作成すると、自身の自己紹介などを設定することができます。</p>
                            <a href="/profile/new" className='toProfile' ><FontAwesomeIcon icon={faAddressCard} /> Create Profile</a>
                        </div>
                    </div>
                    <AccountDelete />
                </div>
            )
        }else{
            return(
                <div className='mypage'>
                    <Header loggedIn={true} />
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
                                <a href='/' onClick={popup}>
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
                                <p className='username'>Welcome back, {user.name.first + ' ' + user.name.last}</p>
                                <ProfileComment intro={user.profile.intro} />
                            </div>
                            <div className='profile-detail'>
                                <div className='about'>
                                    <p className='about-top'><FontAwesomeIcon icon={faUser} /> About</p>
                                    <div className='contact-info'>
                                        <p>Contact Information</p>
                                        <div className='content'>
                                            <label htmlFor="email" className='label'>Email :</label>
                                            <input type="text" className='item' value={user.email} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="country" className='label'>Country :</label>
                                            <input type="text" className='item' value={user.profile.country} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="Address" className='label'>Address :</label>
                                            <input type="text" className='item' value={user.profile.address} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="professional" className='label'>Professional :</label>
                                            <input type="text" className='item' value={user.profile.professional} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="site" className='label'>Site :</label>
                                            <input type="text" className='item' value={user.profile.site} disabled />
                                        </div>
                                    </div>
                                    <div className='basic-info'>
                                        <p>Basic Information</p>
                                        <div className='content'>
                                            <label htmlFor="gender" className='label'>Gender :</label>
                                            <input type="text" className='item' value={user.profile.gender} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="age" className='label'>Age :</label>
                                            <input type="text" className='item' value={user.profile.age} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="birthday" className='label'>Birthday :</label>
                                            <input type="text" className='item' value={user.profile.birthday} disabled />
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <AccountDelete />
                </div>
            )
        }
    }

    
}

export default Mypage;
