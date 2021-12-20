import '../../styles/components/atoms/button.scss';

function Log(props){
    console.log(props);
    if(props.isLoggedIn){　//フックなら変更
        return(

            <a href="/" 
                className='button log_button' 
                onClick={e=>{
                    props.logout();
                    e.preventDefault();
                }}
            >Logout</a>

        )
    }else{
        return(
            <a href="/"
                className='button log_button'
                onClick={e=>{
                    props.login();
                    e.preventDefault();
                }}
            >Login</a>
            
        )
    }
}

export default Log;