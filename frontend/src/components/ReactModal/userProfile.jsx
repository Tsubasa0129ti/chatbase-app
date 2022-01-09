import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

function UserProfile(props){
    console.log(props);
    if(!props.show){
        return null;
    }else{
        if(!props.profileExist){
            return(
                <div className='overray'>
                    <div className='content'>
                        <div className='content-top'>
                            <p>Profile</p>
                            <button onClick={props.onCloseCallback}>×</button>
                        </div>
                        <div className='content-main'>
                            <div className='profile-head'>
                                <p>{props.userData.name.first + ' ' + props.userData.name.last}</p>
                            </div>
                            <div className='profile-list'>
                                <label htmlFor="email">Email</label>
                                <input type="text" className='profile-item' value={props.userData.email} disabled />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div　className='overray'>
                    <div className='content'>
                        <div className='content-top'>
                            <p>Profile</p>
                            <button onClick={props.onCloseCallback}>×</button>
                        </div> 
                        <div className='content-main'>
                            <div className='profile-head'>
                                <div className='icon'>
                                    <FontAwesomeIcon icon={faUser} size='10x' className='icon' />
                                </div>
                                <p className='username'>{props.userData.name.first + ' ' + props.userData.name.last}</p>
                                <div className='comment'>
                                    <input type="text" className='user-comment' value={props.userData.profile.intro} />
                                </div>
                            </div>
                            <div className='profile-list'>
                                <div className='profile-block'>
                                    <label htmlFor="country">Country</label>
                                    <input type="text" className='profile-item' value={props.userData.profile.country} disabled />
                                </div>
                                <div className='profile-block'>
                                    <label htmlFor="professional">
                                        <label htmlFor="professional">Professional</label>
                                        <input type="text" className='profile-item' value={props.userData.profile.professional} disabled />
                                    </label>
                                </div>
                                <div className='profile-block'>
                                    <label htmlFor="email">Email</label>
                                    <input type="text" className='profile-item' value={props.userData.email} disabled />
                                </div>
                                <div className='profile-block'>
                                    <label htmlFor="birthday">Birthday</label>
                                    <input type="text" className='profile-item' value={props.userData.profile.birthday} disabled />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )
        }

        
    }    
}

//将来的には、データベース内の公開範囲設定を参照し、これを分岐に用いることによって、情報の公開範囲を決める予定
export default UserProfile;