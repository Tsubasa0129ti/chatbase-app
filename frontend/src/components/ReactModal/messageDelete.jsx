import '../../styles/components/ReactModal/messageDelete.scss';

function MessageDelete(props){
    if(!props.show){
        return null;
    }else{
        return(
            <div className='overlay'>
                <div className='delete_modal'>
                    <h3>メッセージを削除する</h3>
                    <a href="/" onClick={props.onCancelCallback}>X</a>
                    <p>このメッセージを本当に削除しますか？削除後は元に戻すことはできません。</p>
                    <div className='preDelete_message'>
                        <p>{props.deleteData.username}</p>
                        <p>{props.deleteData.date} {props.deleteData.time}</p>
                        <p>{props.deleteData.text}</p>
                        <input type="hidden" value={props.deleteData.customId} />
                    </div>
                    <input type="submit" value='キャンセル' onClick={props.onCancelCallback} />
                    <input type="submit" value='削除する' onClick={props.onDeleteCallback} />
                </div>
            </div>
        )
    }
}

export default MessageDelete;