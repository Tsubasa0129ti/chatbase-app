import {useState,useEffect,useContext,useRef} from 'react';
import { useLocation } from 'react-router-dom';

import SocketContext from '../module/socket.io';

function MessageUpdate(props){
    const [value,setValue] = useState('');
    const form = useRef(null);

    const socketIO = useContext(SocketContext);
    const location = useLocation();

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

    const Cancel = (e) => { //テキストに関しても、displayを消すので、戻す必要がある。情報が更新されるように設定したい。
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
        var customId = block.children[3].value;

        var path = location.pathname;
        var chatId = path.split('/')[3];

        var message = {
            chatId : chatId,
            userId : props.userId,
            customId : customId,
            newMsg : value
        }

        socketIO.emit('update',message);

        socketIO.once('update',(data) => {
            block.children[2].textContent = data.text;
        });

        //displayの処理
        current.style.display = 'none';

        var messageBox = block.children[2];
        messageBox.style.display = 'block';
    }


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
 */