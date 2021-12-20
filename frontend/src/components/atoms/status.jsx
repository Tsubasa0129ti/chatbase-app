function Status(props){
    if(props.isLoggedIn){ //もしフックに変更するならloggedInに変更
        return(
            <p>Status : Logged in as {props.username}</p>
        )
    }else{
        return(
            <p>Status : Guest</p>
        )
    }
}

export default Status;