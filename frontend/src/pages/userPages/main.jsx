import {useState,useEffect} from 'react';
import {useLocation,useHistory} from 'react-router-dom';
import Header from '../../components/block/header';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSms , faUserPlus , faUserLock } from "@fortawesome/free-solid-svg-icons";

import '../../styles/layouts/users/main.scss';

function Index(){
    const [message,setMessage] = useState(''); //ここに関して、messageを送信しているが、コレについてはheaderにheaderに受け取る層が無いため使用していない
    const location = useLocation();
    const history = useHistory();

    useEffect(() => { //ここの詳細の確認をする。
        if(location.state){
            setMessage(location.state.message);
        }
    },[location.state]);

    return(
        <div className='main'>
            <Header message={message} loggedIn={null} />
            <div className='main_page'>
                <div className='main-top'>
                    <p className='main-icon'>
                        <FontAwesomeIcon icon={faSms} size='3x' />
                    </p>
                    <p className='main-title'>React Chat</p>
                    <p className='main-description'>description</p>
                </div>
                <div className='nav-button'>
                    <button
                        className='toLogin'
                        onClick={
                            (e) => {
                                e.preventDefault();
                                history.push('/users/login');
                            }
                        }
                    >
                        <FontAwesomeIcon icon={faUserLock} /> Login
                    </button>

                    <button
                        className='toCreate'
                        onClick={
                            (e) => {
                                e.preventDefault();
                                history.push('/users/new');
                            }
                        }
                    >
                        <FontAwesomeIcon icon={faUserPlus} /> Get Account
                    </button>
                </div>
                <div className='main-bottom'>
                    <a href="/" className='toHome'>Home</a>
                </div>
            </div>
        </div>
    )
}

export default Index;

//messageを使用しないのであれば、message関連のものを全て削除する。