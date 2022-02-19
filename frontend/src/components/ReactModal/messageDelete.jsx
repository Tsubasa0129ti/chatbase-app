import { useContext } from 'react';
import {useLocation} from 'react-router-dom'

import {DeleteStore} from '../module/store';
import SocketContext from '../../components/module/socket.io';
import '../../styles/components/ReactModal/messageDelete.scss';

function MessageDelete(){
    const {state,dispatch} = useContext(DeleteStore);
    const location = useLocation();

    const socketIO = useContext(SocketContext); //おそらくこれでdeleteもいけるはず。

    const Cancel = (e) => {
        e.preventDefault();
        dispatch({type : 'close'});
    }

    const Delete = (e) => {
        e.preventDefault();
        const target = e.currentTarget;
        var deleteModal = target.parentNode;

        var path = location.pathname;
        var chatId = path.split('/')[3];
        var customId = deleteModal.children[3].lastChild.value;

        const message = {
            chatId : chatId,
            customId : customId
        };

        socketIO.emit('delete',message);

        socketIO.once('delete',(data) => {
            var block = state.block;
            var parent = block.parentNode;

            if(block.closest('.socket_message')){
                parent.style.display = 'none';
            }else{
                if(parent.childElementCount <= 2){
                    parent.style.display = 'none';
                }
                block.style.display = 'none';
            }
        });

        dispatch({type:'close'});
    }

    if(!state.show){
        return null;
    }else{
        return(
            <div className='overlay'>
                <div className='delete_modal'>
                    <h3>メッセージを削除する</h3>
                    <a href="/" onClick={Cancel}>X</a>
                    <p>このメッセージを本当に削除しますか？削除後は元に戻すことはできません。</p>
                    <div className='preDelete_message'>
                        <p>{state.deleteData.username}</p>
                        <p>{state.deleteData.date} {state.deleteData.time}</p>
                        <p>{state.deleteData.text}</p>
                        <input type="hidden" value={state.deleteData.customId} />
                    </div>
                    <input type="submit" value='キャンセル' onClick={Cancel} />
                    <input type="submit" value='削除する' onClick={Delete} />
                </div>
            </div>
        )
    }
}

export default MessageDelete;