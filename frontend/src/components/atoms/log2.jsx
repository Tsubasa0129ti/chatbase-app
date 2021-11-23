import '../../styles/components/atoms/button2.scss';

function Log(props){
    if(props.isLoggedIn){
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