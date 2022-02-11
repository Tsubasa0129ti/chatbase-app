import {useState,useEffect} from 'react';
import { useHistory } from 'react-router';

import Header from '../../components/block/header';
import { HandleError,Code303,Code401,Code500 } from '../../components/module/errorHandler';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

function Id(props){
    const [userData,setUserData] = useState({});
    const history = useHistory();

    useEffect(() => {
        fetch(`/api/profile/account`)
        .then(HandleError)
        .then((obj) => {
            setUserData(obj.user);
        }).catch((err) => {
            if(err.status === 303){
                Code303(err,history);
            }else if(err.status === 401){
                Code401(err,history);
            }else if(err.status >= 500){
                Code500(err,history);
            }
        });
    },[]);

    if(!userData.profile){
        return null;
    }else{
        return(
            <div>
                <Header loggedIn={true} />
                <div className='main'>
                    <div className='profile-top'>
                        <div className='icon'>
                            <FontAwesomeIcon icon={faUser} size='10x' className='icon' />
                        </div>
                        <p className='username'>{userData.name.first + ' ' + userData.name.last}</p>
                        <div className='comment'>
                            <input type="text" className='user-comment' value={userData.profile.intro} />
                        </div>
                    </div> 
                    <div className='profile-main'>
                        <div className='profile-block'>
                            <label htmlFor="country">Country</label>
                            <input type="text" className='profile-item' value={userData.profile.country} disabled />
                        </div>
                        <div className='profile-block'>
                            <label htmlFor="professional">
                                <label htmlFor="professional">Professional</label>
                                <input type="text" className='profile-item' value={userData.profile.professional} disabled />
                            </label>
                        </div>
                        <div className='profile-block'>
                            <label htmlFor="email">Email</label>
                            <input type="text" className='profile-item' value={userData.email} disabled />
                        </div>
                        <div className='profile-block'>
                            <label htmlFor="birthday">Birthday</label>
                            <input type="text" className='profile-item' value={userData.profile.birthday} disabled />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Id;
//これは自身のプロフィールがどのように表示されているのかを確認することができるようにするために残す。ただし,profileありのバージョンのみを残す（mypageありverからのリンクでとばす）のちにここに設定を置く予定