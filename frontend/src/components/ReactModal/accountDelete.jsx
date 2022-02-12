import {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import { HandleError, Code401, Code500 } from '../module/errorHandler';
import { UserDeleteStore } from '../module/store';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

import '../../styles/components/ReactModal/accountDelete.scss';

function AccountDelete() {
    const {state,dispatch} = useContext(UserDeleteStore);
    const history = useHistory();

    const deleteEvent = (e) => {
        e.preventDefault();

        fetch(`/api/users/mypage/delete`,{
            method : 'DELETE',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then(HandleError)
        .then((obj) => {
            history.push({
                pathname : obj.redirectPath,
                state : {message : 'アカウントの削除に成功しました。'}
            });
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    }

    const Cancel = (e) => {
        e.preventDefault();
        dispatch({type:'close'});
    }

    if(!state.show){
        return null;
    }else{
        return(
            <div className='overray'>
                <div className='deleteModal'>
                    <FontAwesomeIcon icon={faExclamationTriangle} size='3x' className='warn-icon' />
                    <p className='delete'>Delete Account</p>
                    <p className='delete-message'>*you will permanently lose your profile*</p>
                    <button className='cancel-button' onClick={Cancel} >Cancel</button>
                    <button className='delete-button' onClick={deleteEvent} >Delete</button>
                </div>
            </div>
        )
    }
}

export default AccountDelete;