import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

import {HandleError,Code401, Code500} from '../module/errorHandler';
import {ProfileStore} from '../module/store';


function UserProfile(props){
    const [userData,setUserData] = useState({});
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
                setUserData(obj.user);
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
        if(error || !userData.name){ //初期レンダリング時はこちらをレンダリングさせている。
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
                                    <p>{userData.name.first + ' ' + userData.name.last}</p>
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
                                    <p className='username'>{userData.name.first + ' ' + userData.name.last}</p>
                                    <div className='comment'>
                                        <input type="text" className='user-comment' value={userData.profile.intro} />
                                    </div>
                                </div>
                                <div className='profile-list'>
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
                    </div>
                )
            }
        }
    }    
}

//将来的には、データベース内の公開範囲設定を参照し、これを分岐に用いることによって、情報の公開範囲を決める予定
export default UserProfile;