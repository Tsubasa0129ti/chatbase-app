import React,{useState,useEffect} from 'react';
import { useHistory,useLocation } from 'react-router';

import Header from '../../components/block/header';
import { HandleError,Code401,Code500 } from '../../components/module/errorHandler';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

function Id(props){
    const [userData,setUserData] = useState({
        username : '',
        country : '未設定',
        professional : '未設定',
        email : '',
        birthday : '未設定'
    });

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        var id = pathname.split('/')[3];

        fetch(`/api/profile/${id}`)
        .then(HandleError)
        .then((obj) => {
            console.log(obj)
            if(!obj.profileExist){
                setUserData({
                    username : obj.user.name.first + ' ' + obj.user.name.last,
                    email : obj.user.email
                });
            }else{
                setUserData({
                    username : obj.user.name.first + ' ' + obj.user.name.last,
                    intro : obj.user.profile.intro,
                    country : obj.user.profile.country,
                    professional : obj.user.profile.professional,
                    email : obj.user.email,
                    birthday : obj.user.profile.birthday
                });
            }
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status >= 500){
                Code500(err,history);
            }
        });
    },[]);


    return(
        <div>
            <Header />
            <div className='main'>
                <div className='profile-top'>
                    <div className='icon'>
                        <FontAwesomeIcon icon={faUser} size='10x' className='icon' />
                    </div>
                    <p className='username'>{userData.username}</p>
                    <div className='comment'>
                        <input type="text" className='user-comment' value={userData.intro} />
                    </div>
                </div> 
                <div className='profile-main'>
                    <div className='profile-block'>
                        <label htmlFor="country">Country</label>
                        <input type="text" className='profile-item' value={userData.country} disabled />
                    </div>
                    <div className='profile-block'>
                        <label htmlFor="professional">
                            <label htmlFor="professional">Professional</label>
                            <input type="text" className='profile-item' value={userData.professional} disabled />
                        </label>
                    </div>
                    <div className='profile-block'>
                        <label htmlFor="email">Email</label>
                        <input type="text" className='profile-item' value={userData.email} disabled />
                    </div>
                    <div className='profile-block'>
                        <label htmlFor="birthday">Birthday</label>
                        <input type="text" className='profile-item' value={userData.birthday} disabled />
                    </div>
                </div>
            </div>
        </div>
    )
}

//将来的には、データベース内の公開範囲設定を参照し、これを分岐に用いることによって、情報の公開範囲を決める予定
export default Id;