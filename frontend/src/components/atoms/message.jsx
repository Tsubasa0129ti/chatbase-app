function Message(props){
    if(props.message){

        return(
            <p>{props.message}</p>
        )
    }else{
        return null;
    }
}

export default Message;