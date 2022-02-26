import { useState, useEffect, useRef, useContext } from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSmile,faReply,faEdit,faEraser} from '@fortawesome/free-solid-svg-icons';

import MessageUpdate from './messageUpdate';
import {DeleteStore} from '../module/store';

import '../../styles/components/atoms/chatPopup.scss';

function ChatPopup(props){ //props.userIdによる分岐さえなくすことができれば、channelのsetUserIdを消すことができる。
    const [content,setContent] = useState('');
    const el = useRef(null);
    const box = useRef(null);

    const {dispatch} = useContext(DeleteStore);

    const reaction = (e) => {
        e.preventDefault();
        console.log('reaction');
    }

    const reply = (e) => {
        e.preventDefault();
        console.log('replay');
    }

    const update = (e) => {//一応現状では、inputの発生とtextの消失をdisplayの変化によって実現している。
        e.preventDefault();

        var target = box.current;//現在獲得可能な最上位を取得

        var parent = target.parentNode;
        var textElement = parent.children[2];
        textElement.style.display = 'none';

        var current = box.current;
        var form = current.children[0].children[4];
        form.style.display = 'inline-block'
    }

    const erase = (e) => {
        e.preventDefault();

        var target = e.currentTarget;
        var block = target.parentNode.parentNode.parentNode.parentNode;
        var date;

        if(block.closest('.database_message')){
            date = block.parentNode.firstChild.textContent;
        }else{
            if(block.previousElementSibling){
                date = block.previousElementSibling.textContent;
            }else{
                var socketMessage = block.closest('.socket_message');
                date = socketMessage.previousElementSibling.lastChild.firstChild.textContent;
            }
        }

        var deleteData = {
            username : block.children[0].textContent,
            time : block.children[1].textContent,
            text : block.children[2].textContent,
            customId : block.children[3].value,
            date : date
        }

        dispatch({type : 'popup',deleteData : deleteData});
    }

    useEffect(() => {
        var current = el.current;

        if(current){
            var parent = current.parentNode;
            var userId = parent.children[0].dataset.user;
            var popup;

            if(props.userId === userId){
                popup = (
                    <div className='popup_box'>
                        <div className='reaction_button'>
                            <a href="/" onClick={reaction}><FontAwesomeIcon icon={faSmile} className='icon' /></a>
                        </div>
                        <div className='reply_button'>
                            <a href="/" onClick={reply}><FontAwesomeIcon icon={faReply} className='icon' /></a>
                        </div>
                        <div className='edit_button'>
                            <a href="/" onClick={update}><FontAwesomeIcon icon={faEdit} className='icon' /></a>
                        </div>
                        <div className='delete_button'>
                            <a href="/" onClick={erase}><FontAwesomeIcon icon={faEraser} className='icon' /></a>
                        </div>
                        <MessageUpdate userId={props.userId} />
                    </div>
                )
            }else{
                popup = (
                    <div className='popup_box'>
                        <div className='reaction_button'>
                            <a href="/" onClick={reaction}><FontAwesomeIcon icon={faSmile} className='icon' /></a>
                        </div>
                        <div className='reply_button'>
                            <a href="/" onClick={reply}><FontAwesomeIcon icon={faReply} className='icon' /></a>
                        </div>
                    </div>
                )
            }
            setContent(popup);
        }
    },[]);

    if(content === ''){
        return (
            <div ref={el}></div>
        );
    }else{
        return (
            <div className='popup_container' ref={box} style={{display:'none'}}>{content}</div>
        )
    }
}

export default ChatPopup;