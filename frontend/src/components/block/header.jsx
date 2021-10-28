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
        }
    }

    componentDidMount(){
        fetch('/api/users/previousCheck')
        .then((res) => {
            if(!res.ok){
                console.error('サーバーエラー');
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
            console.error(err.message);
        });
    }

    logout(){
        console.log("loaded");
        fetch('/api/users/logout')
        .then((res) => {
            if(!res.ok){
                console.error('サーバー内エラー');
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === "success"){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'ログアウトしました。'}
                });
            }
        }).catch((err) => {
            console.error(err.message);
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
                        <Message message={this.props.message}　/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);