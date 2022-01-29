import React from 'react'; 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

import '../../styles/components/ReactModal/accountDelete.scss';

function AccountDelete(props) {

    if(!props.show){
        return null;
    }else{
        return(
            <div className='overray'>
                <div className='deleteModal'>
                    <FontAwesomeIcon icon={faExclamationTriangle} size='3x' className='warn-icon' />
                    <p className='delete'>Delete Account</p>
                    <p className='delete-message'>*you will permanently lose your profile*</p>
                    <button className='cancel-button' onClick={props.onCancelCallback} >Cancel</button>
                    <button className='delete-button' onClick={props.onDeleteCallback} >Delete</button>
                </div>
            </div>
        )
    }
    
}

export default AccountDelete;