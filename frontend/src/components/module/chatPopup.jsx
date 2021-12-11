import React from 'react';
import {withRouter} from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import MessageEdit from '../../components/atoms/messageEdit';
import MessageDelete from '../../components/atoms/messageDelete';

const ENDPOINT = 'http://localhost:3001';
const socket = socketIOClient(ENDPOINT);

class ChatPopup extends React.Component{
    constructor(props){
        super(props);
        this.forEdit = this.forEdit.bind(this);
        this.forDelete = this.forDelete.bind(this);
    }

    forEdit(e){ //これはまだ未完　最終版は、元のテキストの部分にinputを埋め込む形に変更する
        e.preventDefault();

        const target = e.currentTarget;
        var editor = target.closest('.chat_popup').children[4];
        editor.style.display = 'inline-block';
    }

    forDelete(e){
        //メッセージの削除（モーダルで画面全体に確認画面の表示を行い、削除もしくはキャンセル）
        e.preventDefault();

        const target = e.currentTarget;
        var deleter = target.closest('.chat_popup').children[5];

    }

    //想定　編集等のボタンをクリックすると、そのpopupが出現する。ちなみにこれについてはコンポーネントを用意し読み込む。

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
                            {/* <MessageEdit onEventCallBack={this.edit.bind(this)} /> */}
                        </div>
                        <div>
                            <a href='/' className='delete_button' onClick={this.forDelete}>
                                <img src='delete_icon' alt='delete_icon' />削除ボタン
                            </a>
                            {/* <MessageDelete onEventCallBack={this.delete.bind(this)} /> */}
                        </div>
                        <div style={{display:'none'}} className='message_editor'>
                            <MessageEdit onCancelCallback={this.cancel.bind(this)} onEditCallback={this.edit.bind(this)} />
                        </div>
                        <div style={{display:'none'}} className='message_deleter'>
                            <MessageDelete onCancelCallback={this.cancel.bind(this)} onDeleteCallback={this.delete.bind(this)} />
                        </div>
                    </div>
                )
            }else{
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

export default withRouter(ChatPopup);

//displayの適用を親コンポーネントと子コンポーネントの双方で変化させる必要があるかもしれない　
//displayが双方にある場合であっても、親が変化しても子要素はそのまま変化しない

//想定は、ここの中で編集用popupを可視化し、この下のコンポーネントのcancelとeditでpopupを解除する予定