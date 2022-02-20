import {useState,useEffect,useContext,useRef} from 'react';

import SocketContext from '../module/socket.io';
import {getBlock,getSocketBlock} from '../module/socketEvent';

function MessageUpdate(){
    const [value,setValue] = useState('');
    const form = useRef(null);

    const socketIO = useContext(SocketContext);

    useEffect(() => {
        var current = form.current;
        var text = current.parentNode.parentNode.parentNode.children[2].textContent;
        setValue(text);
    },[]);

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

        var messageBox = current.parentNode.parentNode.parentNode.children[2];
        messageBox.style.display = 'block'; //一応これでも可能だけど、流石にこの取得の仕方は可読性等に問題あり、、、

        var text = messageBox.textContent;
        setValue(text);
    }

    const Update = (e) => {
        e.preventDefault();

        var current = form.current;
        var block = current.parentNode.parentNode.parentNode;
        var currentText = block.children[2].textContent;
        var customId = block.children[3].value; 

        var message = {
            customId : customId,
            newMsg : value
        }

        if(value ==='' || value === currentText ){
            Cancel(e)
        }else{
            socketIO.emit('update',message);
        }
    }

    useEffect(() => {
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
        <form ref={form} style={{display:"none"}}>
            <input type="text" onChange={handleChange} value={value} />
            <input type="submit" value='Cancel' onClick={Cancel} />
            <input type="submit" value='Update' onClick={Update} />
        </form>
    )
}

export default MessageUpdate;
/* 
修正点
①domの取得方法が少しややこしいのでこれの改善をする。
②この画面が表示されているときはpopupが消失しないようにする。でないと、動かした時にmessageだけが存在しないものになってしまう。
③編集者以外のレンダリングが凄まじい勢いで発生してしまう
*/