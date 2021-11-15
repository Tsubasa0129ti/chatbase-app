import '../../styles/components/atoms/message.scss';

function Message(props){
    if(props.message){
        return(
            <div className='message_box'>
                <p className='message'>{props.message}</p>
            </div>
        )
    }else{
        return null;
    }
}

export default Message;

//同様に、pageのスタート位置（heightのmargin）を変更する必要がある。