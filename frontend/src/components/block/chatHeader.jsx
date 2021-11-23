import React from 'react';
import {withRouter} from 'react-router-dom';

import Navigation from '../../components/atoms/navigation2';
import Log from '../../components/atoms/log2';
import Status from '../../components/atoms/status';
import Message from '../../components/atoms/message';
import SearchPopup from '../../components/module/searchPopup';

import '../../styles/components/block/chatHeader.scss';

import search_icon from '../../assets/search_icon.png';

class ChatHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            search : false,
            message : ''
        }
        this.search = this.search.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.message !== this.props.message){
            this.setState({
                message : this.props.message
            });
        }  
    }

    logout(){ //ログアウトはここが最上位のコンポーネントとして扱う（これの管理はheaderで行う）
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

    search(e){
        //searchの出現　例えば子要素としてpopupはあらかじめ表示　ただしdisplay設定をnoneにしておき、ボタンクリックで変化させるなど
        e.preventDefault();
        var flag = this.state.search;
        this.setState({
            search : !flag
        });
    }

    render(){
        return(
            <div className='chat_header'>
                <div className='header_box'>
                    <div className='header_top'>
                        <p>Chat Page</p>
                    </div>
                    <div className='header_middle'>
                        <div className='search'>
                            <a href="/"  className='search_button' onClick={this.search}>
                                <img src={search_icon} alt='search_icon' className='search_icon' />
                            </a>
                        </div>
                        <div className='log'>
                            <Log 
                                isLoggedIn={this.props.isLoggedIn} 
                                login={() => {this.props.history.push('/users/login')}} 
                                logout={this.logout.bind(this)} 
                            />
                        </div>
                        <div className='navigation'>
                            <Navigation to='/' name='Home' />
                            <Navigation to='/users' name='Account' />
                            <Navigation to='/profile' name='Profile' />
                            <Navigation to='/chat' name='Chat' />
                        </div>
                        
                    </div>
                    
                    <div className='middle_border'></div>
                    <div className='header_bottom'>
                        <Status 
                            isLoggedIn={this.props.isLoggedIn} 
                            username={this.props.username} 
                        />
                    </div>
                </div>
                <div className='header_message'>
                    <Message message={this.state.message}　/> 
                </div>
                <div className='search_popup'>
                    <SearchPopup search={this.state.search} />
                </div>
            </div>
        )
    }
}

export default withRouter(ChatHeader);