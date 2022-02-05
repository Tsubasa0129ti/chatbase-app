import { useState,useEffect,useRef} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSmile,faReply,faEdit,faEraser} from '@fortawesome/free-solid-svg-icons';

import MessageUpdate from '../atoms/messageUpdate';

import {showContext} from '../../context/showContext'; //deleteをどのように行なっていたのかについてふりかえりつつ...

/* class ChatPopup extends React.Component{
    render(){
        return(
            <div>
                <a href='/' className='delete_button' onClick={this.context.showEvent}>
                    <img src='delete_icon' alt='delete_icon' />削除ボタン
                </a>
            </div>  
        )
    }
}

ChatPopup.contextType = showContext; */


function ChatPopup(props){
    const [content,setContent] = useState('');
    const el = useRef(null);
    const box = useRef(null);

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
        console.log('erase');
    }

    useEffect(() => {
        var current = el.current;

        if(current){
            var parent = current.parentNode;
            var userId = parent.children[0].dataset.user;

            if(props.userId === userId){
                var popup = (
                    <div className='popup_box'>
                        <div className='reaction_button'>
                            <a href="/" onClick={reaction}><FontAwesomeIcon icon={faSmile} /></a>
                        </div>
                        <div className='reply_button'>
                            <a href="/" onClick={reply}><FontAwesomeIcon icon={faReply} /></a>
                        </div>
                        <div className='edit_button'>
                            <a href="/" onClick={update}><FontAwesomeIcon icon={faEdit} /></a>
                        </div>
                        <div className='delete_button'>
                            <a href="/" onClick={erase}><FontAwesomeIcon icon={faEraser} /></a>
                        </div>
                        <MessageUpdate userId={props.userId} />
                    </div>
                )
            }else{
                var popup = (
                    <div className='popup_box'>
                        <div className='reaction_button'>
                            <a href="/" onClick={reaction}><FontAwesomeIcon icon={faSmile} /></a>
                        </div>
                        <div className='reply_button'>
                            <a href="/" onClick={reply}><FontAwesomeIcon icon={faReply} /></a>
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
            <div ref={box} style={{display:'none'}}>{content}</div>
        )
    }
}

export default ChatPopup;
//参考　useRef createRefの二つのパターンがあり、前者はレンダリング時の結果を返すのに対して、後者は常に最新のものを返す