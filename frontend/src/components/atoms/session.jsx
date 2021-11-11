function Session(props){
    console.log(props);
    if(props.isLoggedIn){
        return(
            <p>
                セッションの有効期限　：　{props.expires}  <button onClick={props.extend}>延長する</button>
            </p>
        )
    }else{
        return null;
    }
}

export default Session;