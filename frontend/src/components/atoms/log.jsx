function Log(props){
    console.log(props);
    if(props.isLoggedIn){
        return(
            <button onClick={props.logout}>Logout</button>
        )
    }else{
        return(
            <button onClick={props.login}>Login</button>
        )
    }
}

export default Log;