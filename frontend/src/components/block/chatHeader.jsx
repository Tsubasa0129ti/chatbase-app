import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserCircle} from '@fortawesome/free-regular-svg-icons'

import Log from '../../components/atoms/log';
import SearchWindow from '../atoms/searchWindow';

import '../../styles/components/block/chatHeader.scss';

function ChatHeader(){
    return(
        <div className='chat-header'>
            <div className='header-title'>
                <a href="/">React Chat</a>
            </div>
            <div className='header-main'>
                <div className='search-box'>
                    <SearchWindow /> 
                </div>
                <div className='navigation'>
                    <a className='toMypage' href="/users/mypage"><FontAwesomeIcon icon={faUserCircle} size='2x' /></a>
                    <Log className='log' isLoggedIn={true} />
                </div>
                
            </div>
        </div>
    )
}

export default React.memo(ChatHeader);