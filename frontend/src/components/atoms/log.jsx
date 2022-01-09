import '../../styles/components/atoms/button.scss';

function Log(props){
    if(props.isLoggedIn){
        return(
            <button 
                className='log-btn'
                onClick={() => {props.logout()}}
            >
                ログアウト
            </button>
        )
    }else{
        return(
            <button
                className='log-btn'
                onClick={props.login}
            >
                ログイン
            </button>
        )
    }
}

export default Log;