import React from 'react';
import {withRouter} from 'react-router-dom';

//import usePrevious from '../events/usePrevious'; 

import Log from '../atoms/log';
import Navigation from '../atoms/navigation';
import Title from '../atoms/title';
import Status from '../atoms/status';
import Message from '../atoms/message';

import '../../styles/components/block/header.scss';

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false,
            username : '',
            message : '',
        }
    }

    componentDidMount(){
        const error = new Error();

        fetch('/api/users/previousCheck')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            console.log('pass1');
            if(obj.result === 'Authenticated'){
                this.setState({
                    isLoggedIn : true,
                    username : obj.username,
                });
            }
        }).catch((err) => {
            console.log(err);
            if(err.status >= 500){
                this.setState({
                    message : `${err.status} : ${err.message}`
                });
            }else{
                this.setState({
                    message : err.message
                });
            }
        });
    }

    componentDidUpdate(prevProps){ //これが読み込まれるタイミングは、propsを受け取ったタイミング。つまり初回からpropsをもっている
        if(prevProps.message !== this.props.message){ //propsとstateの変化時に読み込まれてしまうため、条件を設けている
            this.setState({
                message : this.props.message
            });
        }  
    }

    logout(){
        const error = new Error();

        fetch('/api/users/logout')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            this.props.history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログアウトしました。'}
            });
        }).catch((err) => {
            if(err.status >= 500){
                this.setState({
                    message : `${err.status} : ${err.message}`
                });
            }else{
                this.setState({
                    message : err.message
                });
            }
        });
    }

    render(){
        return(
            <div className='header'>
                <div className='in_header box'>
                    <div className='header-top'>
                        <div className='header-left'>
                            <Title />
                        </div>
                        <div className='header-right'>
                            <div className='navigation'>
                                <Navigation to='/' name='Home' />
                                <Navigation to='/users' name='Account' />
                                <Navigation to='/profile' name='Profile' />
                                <Navigation to='/chat' name='Chat' />
                            </div>
                            <div className='log'>
                                <Log 
                                    isLoggedIn={this.state.isLoggedIn} 
                                    login={() => {this.props.history.push('/users/login')}} 
                                    logout={this.logout.bind(this)} 
                                />
                            </div>
                        </div>
                        <div className='clear'></div>
                    </div>
                    <div className='middle-border box'></div>
                    <div className='header-buttom login-status'>    
                        <Status 
                            isLoggedIn={this.state.isLoggedIn} 
                            username={this.state.username} 
                        />     
                    </div>
                </div>
                <Message message={this.state.message}　/> 
            </div>
        )
    }
}



/* function Header(props){
    const [loggedIn,setLoggedIn] = useState(false);
    const [username,setUsername] = useState('');
    const [message,setMessage] = useState('');
    const previousMessage = usePrevious(message);

    useEffect(() => {
        const error = new Error();

        fetch('/api/users/previousCheck')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'Authenticated'){
                setLoggedIn(true);
                setUsername(obj.username);
            }
        }).catch((err) => {
            if(err.status >= 500){
                setMessage(`${err.status} : ${err.message}`);
            }else{
                setMessage(err.message);
            }
        });
    },[]);

    useEffect(() => {
        console.log(previousMessage);
        console.log(props.message);
        if(previousMessage !== props.message){
            setMessage(props.message);
        } //これでいけたかも？　受け取ったpropsと前のmessageの比較をしている
    });

    function logout(e){ //別のファイルにログアウトのイベントを作成する（これの不足点は適切にstateを送信するということ）

        e.preventDefault();
        console.log('起動');
        const error = new Error();

        fetch('/api/users/logout')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            props.history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログアウトしました。'}
            });
        }).catch((err) => {
            if(err.status >= 500){
                this.setState({　//これをイベントとするのであれば、setStateではなく、stateをここまで伝える必要がある
                    message : `${err.status} : ${err.message}`
                });
            }else{
                this.setState({
                    message : err.message
                });
            }
        }); 
    }

    return(
        <div className='header'>
            <div className='in_header box'>
                <div className='header-top'>
                    <div className='header-left'>
                        <Title />
                    </div>
                    <div className='header-right'>
                        <div className='navigation'>
                            <Navigation to='/' name='Home' />
                            <Navigation to='/users' name='Account' />
                            <Navigation to='/profile' name='Profile' />
                            <Navigation to='/chat' name='Chat' />
                        </div>
                        <div className='log'>
                            <Log 
                                loggedIn={loggedIn} 
                                login={() => {props.history.push('/users/login')}} 
                                logout={logout} 
                            />
                        </div>
                    </div>
                    <div className='clear'></div>
                </div>
                <div className='middle-border box'></div>
                <div className='header-buttom login-status'>    
                    <Status 
                        loggedIn={loggedIn} 
                        username={username} 
                    />     
                </div>
            </div>
            <Message message={message}　/>
        </div>
    )
} */



export default withRouter(Header);