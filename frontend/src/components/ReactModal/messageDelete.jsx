import { useEffect, useContext } from 'react';

import {DeleteStore} from '../module/store';
import SocketContext from '../../components/module/socket.io';
import {getBlock,getSocketBlock} from '../module/socketEvent';

import '../../styles/components/ReactModal/messageDelete.scss';

function MessageDelete(){
    const {state,dispatch} = useContext(DeleteStore);

    const socketIO = useContext(SocketContext);

    const Cancel = (e) => {
        e.preventDefault();
        dispatch({type : 'close'});
    }

    const Delete = (e) => {
        e.preventDefault();
        const target = e.currentTarget;
        var deleteModal = target.parentNode;

        var customId = deleteModal.children[3].lastChild.value;

        socketIO.emit('delete',{customId:customId});

        dispatch({type:'close'});
    }

    useEffect(() => {
        socketIO.once('delete',(data) => {
            var block;
            var parent;
            if(getBlock(data)){
                block = getBlock(data);
                parent = block.parentNode;
                console.log(parent);

                if(parent.childElementCount <= 2){ //多分ここの分岐が不十分なのかな,何度かやってみた感じ一回起こった時以外は問題なさそうだけど。。。
                    console.log('上')
                    parent.style.display = 'none';
                }else{
                    console.log('下')
                    block.style.display = 'none';
                }

            }else{
                block = getSocketBlock(data);
                parent = block.parentNode;
                parent.style.display = 'none';
            }
        });
        return () => {
            socketIO.once('delete');
        }
    })

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

//たまにエラーが発生してしまうので、そこの点についてもう少しテストをするので、一旦コンソールへの書き込みは残しておく。