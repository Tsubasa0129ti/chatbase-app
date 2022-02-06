import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

import {HandleError,Code401, Code500} from '../module/errorHandler';
import {ProfileStore} from '../module/store';


function UserProfile(props){
    const [userData,setUserData] = useState({
        username : '',
        email : '',
        intro : '',
        country : '',
        professional : '',
        birthday : ''
    });
    const [profile,setProfile] = useState(false);
    const [error,setError] = useState(false);
    const {state,dispatch} = useContext(ProfileStore);
    const history = useHistory();
    

    useEffect(() => {
        const id = state.id;

        if(id){
            fetch(`/api/profile/${id}`)
            .then(HandleError)
            .then((obj) => {
                if(obj.profile){
                    setProfile(true);
                }
                setUserData({
                    username : obj.user.name.first + '_' + obj.user.name.last,
                    email : obj.user.email,
                    intro : obj.user.profile.intro,
                    country : obj.user.profile.country,
                    professional : obj.user.profile.professional,
                    birthday : obj.user.profile.birthday
                });
            }).catch((err) => {
                if(err.status === 401){
                    Code401(err,history);
                }else if(err.status === 410){
                    setError(true);
                }else if(err.status === 500){
                    Code500(err,history);
                }
            });
        } 
    },[state.id]);

    const Close = (e) => {
        e.preventDefault();

        dispatch({type:'close'});
    }

    if(!state.show){
        return null;
    }else{
        console.log(userData.name)
        if(error){
            return(
                <div className='overray'>
                    <div className='content'>
                        <div className='content-top'>
                            <p>Error</p>
                            <button onClick={Close}>X</button>
                        </div>
                        <div className='content-main'>
                            <p>現在そのユーザーは存在しません。</p>
                        </div>
                    </div>
                </div>
            )
        }else{
            if(!profile){
                return(
                    <div className='overray'>
                        <div className='content'>
                            <div className='content-top'>
                                <p>Profile</p>
                                <button onClick={Close}>X</button>
                            </div>
                            <div className='content-main'>
                                <div className='profile-head'>
                                    <p>{userData.username}</p>
                                </div>
                                <div className='profile-list'>
                                    <label htmlFor="email">Email</label>
                                    <input type="text" className='profile-item' value={userData.email} disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }else{
                return(
                    <div className='overray'>
                        <div className='content'>
                            <div className='content-top'>
                                <p>Profile</p>
                                <button onClick={Close}>X</button>
                            </div> 
                            <div className='content-main'>
                                <div className='profile-head'>
                                    <div className='icon'>
                                        <FontAwesomeIcon icon={faUser} size='10x' className='icon' />
                                    </div>
                                    <p className='username'>名前</p>
                                    <div className='comment'>
                                        <input type="text" className='user-comment' value={userData.intro} />
                                    </div>
                                </div>
                                <div className='profile-list'>
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
                    </div>
                )
            }
        }
    }    
}

//将来的には、データベース内の公開範囲設定を参照し、これを分岐に用いることによって、情報の公開範囲を決める予定
export default UserProfile;