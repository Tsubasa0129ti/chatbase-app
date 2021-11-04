import React from 'react';
import {withRouter} from 'react-router-dom';

import Log from '../atoms/log';
import Navigation from '../atoms/navigation';
import Title from '../atoms/title';
import Status from '../atoms/status';
import Message from '../atoms/message';

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false,
            username : '',
            message : ''
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
            if(obj.result === 'Authenticated'){
                this.setState({
                    isLoggedIn : true,
                    username : obj.username,
                });
            }
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
                <div className='header-top'>
                    <div className='title'><Title /></div>
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
                <div className='header-buttom'>
                    <div className='login-status'>
                        <Status 
                            isLoggedIn={this.state.isLoggedIn} 
                            username={this.state.username} 
                        />
                    </div>
                    <div className='message'>
                        <Message message={this.state.message}　/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);