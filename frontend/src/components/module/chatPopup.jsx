import React, { useState,useEffect,useRef } from 'react';
import socketIOClient from 'socket.io-client';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSmile,faReply,faEdit,faEraser} from '@fortawesome/free-solid-svg-icons';

import MessageEdit from '../../components/atoms/messageEdit';

import {showContext} from '../../context/showContext';

const ENDPOINT = 'http://localhost:3001';
const socket = socketIOClient(ENDPOINT);

/* class ChatPopup extends React.Component{
    constructor(props){
        super(props);
        this.forEdit = this.forEdit.bind(this);
    }

    forEdit(e){ //これはまだ未完　最終版は、元のテキストの部分にinputを埋め込む形に変更する
        e.preventDefault();

        const target = e.currentTarget;
        var editor = target.closest('.chat_popup').children[4];
        editor.style.display = 'inline-block';
    }

    edit(e){
        const target = e.currentTarget;
        var newMsg = target.closest('.message_edit').firstChild.value;

        var path = this.props.location.pathname;
        var chatId = path.split('/')[3];

        var block;
        var customId;
        if(!this.props.socket){
            block = target.closest('.aaa_test');
            customId = block.children[3].value;
        }else{
            block = target.closest('.bbb_test');
            customId = block.children[3].value;
        }

        const message = {
            chatId :  chatId,
            userId : this.props.userId,
            customId : customId,
            newMsg : newMsg,     
        };
        socket.emit('update',message);

        socket.once('update',(data) => {
            block.children[2].textContent = data.text;
        });

        var editor = target.closest('.message_editor');
        editor.style.display = 'none';
        
    }//初期段階は上記でOK 但し、その後に、inputを現在のテキストと置き換えるということをする あと、二つのクラス名については後で修正を加える予定（ちなみに繰り返し構文のため、今後クラス名の重複は発生するがこれについては後）

    cancel(e){
        const target = e.currentTarget;

        var editor = target.closest('.message_editor');
        editor.style.display = 'none';
    }

    render(){ //この下のコンポーネントは、クリック時の処理　こちらはdisplayのnoneとshowの状態下で繰り返し読み込まれるもの（ただ、おそらくそこまでの負荷はないはず）
        console.log(this.props.popup);
        if(!this.props.show){
            return null;
        }else{
            if(this.props.self){
                return(
                    <div className='chat_popup'>
                        <a href="/" className='reaction_button' onClick={this.reaction}>
                            <img src="reaction_icon" alt="reaction_icon" />リアクションボタン
                        </a>
                        <a href='/' className='reply_button' onClick={this.reply}>
                            <img src='reply_icon' alt='reply_icon' />リプライボタン
                        </a>
                        <div>
                            <a href='/' className='edit_button' onClick={this.forEdit}>
                                <img src='edit_button' alt='edit_icon' />編集ボタン
                            </a>
                        </div>
                        <div>
                            <a href='/' className='delete_button' onClick={this.context.showEvent}>
                                <img src='delete_icon' alt='delete_icon' />削除ボタン
                            </a>
                        </div>
                        <div style={{display:'none'}} className='message_editor'>
                            <MessageEdit onCancelCallback={this.cancel.bind(this)} onEditCallback={this.edit.bind(this)} />
                        </div>
                    </div>
                )
            }else{
                console.log('aaa')
                return(
                    <div>
                        <a href="/" className='reaction_button' onClick={this.reaction}>
                            <img src="reaction_icon" alt="reaction_icon" />AAA
                        </a>
                        <a href='/' className='reply_button' onClick={this.reply}>
                            <img src='reply_icon' alt='reply_icon' />BBB
                        </a>
                    </div>
                )
            }
        }
        
    }
}

ChatPopup.contextType = showContext; */


function ChatPopup(props){
    const [content,setContent] = useState('');
    const el = useRef(null);

    const reaction = (e) => {
        e.preventDefault();
        console.log('reaction');
    }

    const reply = (e) => {
        e.preventDefault();
        console.log('replay');
    }

    const update = (e) => {
        e.preventDefault();
        console.log('update');
    }

    const erase = (e) => {
        e.preventDefault();
        console.log('erase');
    }

    useEffect(() => {
        var current = el.current;
        console.log(current);
        var parent = current.parentNode; //ここがたまにエラーになってしまうparentNodeがエラーになるのならば、currentが受け取れrていない可能性もあるかも
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
    },[]);

    if(content === ''){
        return (
            <div ref={el}></div>
        );
    }else{
        return (
            <div style={{display:'none'}}>{content}</div>
        )
    }
}

export default ChatPopup;

//初期ロードの時にcurrentが読み取れない時がある。useRefの取得できるタイミングを知る必要性があるか