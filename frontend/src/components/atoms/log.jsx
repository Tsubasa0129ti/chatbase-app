import { useHistory,useLocation } from 'react-router-dom';

import { HandleError, Code500 } from '../module/errorHandler';
import '../../styles/components/atoms/button.scss';

function Log(props){
    const history = useHistory();
    const location = useLocation();

    const login = () => {
        history.push('/users/login');
    }

    const logout = () => {
        fetch('/api/users/logout')
        .then(HandleError)
        .then((obj) => {
            history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログアウトしました。'}
            });
            if(location.pathname = '/'){
                history.go();
            }
        }).catch((err) => {
            if(err.status === 500){
                Code500(err,history);
            }
        });
    }

    if(!props.isLoggedIn){
        return(
            <button className='log-btn' onClick={login}>ログイン</button>
        )
    }else{
        return(
            <button className='log-btn' onClick={logout}>ログアウト</button>
        )        
    }
}

export default Log;