import {useState,useEffect,useContext,useRef} from 'react';

import SocketContext from '../module/socket.io';
import {getBlock,getSocketBlock} from '../module/socketEvent';

import {TextUpdateStore} from '../module/store';

import '../../styles/components/atoms/messageUpdate.scss';

function MessageUpdate(){
    const [value,setValue] = useState('');
    const form = useRef(null);

    const socketIO = useContext(SocketContext);
    const {updateState,updateDispatch} = useContext(TextUpdateStore);

    useEffect(() => {
        if(updateState.data){
            setValue(updateState.data.currentText);
        }
    },[updateState]);

    const handleChange = (e) => {
        e.preventDefault();

        var target = e.target;
        var value = target.value;

        setValue(value);  
    }

    const Cancel = (e) => {
        e.preventDefault();

        var current = form.current;
        current.style.display = 'none';

        var textBox = current.parentNode.children[2];
        textBox.style.display = 'block';
        setValue(updateState.data.currentText);

        updateDispatch({type : 'close'});
    }

    const Update = (e) => {
        e.preventDefault();

        var message = {
            customId : updateState.data.customId,
            newMsg : value
        }

        if(value ==='' || value === updateState.data.currentText ){
            Cancel(e)
        }else{
            socketIO.emit('update',message);
            updateDispatch({type:'close'});
        }
    }

    useEffect(() => { //この層に関しては変更を受け取っているだけなので、一旦は放置にしてもよさそうかな いや場所を移動したことによりcurrentの取得するものが変化してしまうのでここに対してのアプローチも必要となった。
        socketIO.once('update',(data) => {
            var current = form.current;
            current.style.display = 'none';

            var block = getBlock(data);
            if(getBlock(data) === undefined){
                block = getSocketBlock(data);
            }else{
                block = getBlock(data);
            }

            var text = block.children[2];
            text.textContent = data.text;
            text.style.display = 'block';

            setValue(data.text);
        });
        return () => {
            socketIO.off('update');
        }
    });

    return(
        <form className='msg-update-form' ref={form} style={{display:"none"}}>
            <input className='input' type="text" onChange={handleChange} value={value} />
            <div className='btn-wrap'>
                <input className='cancel-btn' type="submit" value='キャンセル' onClick={Cancel} />
                <input className='update-btn' type="submit" value='保存する' onClick={Update} />
            </div> 
        </form>
    )
}

export default MessageUpdate;
/* 
修正点
①domの取得方法が少しややこしいのでこれの改善をする。
②この画面が表示されているときはpopupが消失しないようにする。でないと、動かした時にmessageだけが存在しないものになってしまう。
→一応修正できたけど、コレにさらに優先度とか光とかつけて目立つようにするなりしようかな
③編集者以外のレンダリングが凄まじい勢いで発生してしまう

あとは、UIとかやっていこうかな
*/