import React from 'react';
import {withRouter} from 'react-router-dom';

class AddChannel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message : '',
            channelName : '',
            channelDetail : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.close = this.close.bind(this)
    }

    handleChange(e){
        //　stateの更新
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

    handleSubmit(e){
        e.preventDefault();
        //作成実行のfetch
        const error = new Error();

        console.log(`fetch : ${this.state.channelName} _ ${this.state.channelDetail}`);

        fetch('/api/chat/create',{
            method : 'POST',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                channelName : this.state.channelName,
                channelDetail : this.state.channelDetail,
            })
        })
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
        }).then((obj) => {
            this.props.history.push({
                pathname : obj.redirectPath,
                state : {message : 'チャンネル作成に成功しました。'}
            });
        }).catch((err) => {
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                this.setState({
                    message : `${err.status} : ${err.message}`
                });
            }else{
                this.props.history.push({
                    pathname : '/users/mypage',
                    state : {message : err.message}
                });
            }
        })
    }

    close(e){
        //popupを閉じる 現在popupの有無についての切り替えをすることができない
        e.preventDefault();
        this.setState({
            add : false
        });
    }

    render(){
        console.log(this.state.add);
        if(!this.props.add){
            return null
        }else{
            return(
                <form onSubmit={this.handleSubmit}>
                    <div className='description'>
                        <h3>チャンネルを作成する</h3>
                        <p>チャンネルとはコミュニケーションを取る場所です。特定のトピックに基づいてチャンネルを作ると良いでしょう。</p>
                    </div>
                    <div className='close'>
                        <a href="/"　className='close_button' onClick={this.props.onEventCallback}>×</a>
                    </div>
                    <div className='channel_name'>
                        <label htmlFor="channelName">チャンネル名</label>
                        <input type="text" className='channelName' name='channelName' required onChange={this.handleChange} />
                    </div>
                    <div className='detail'>
                        <label htmlFor="channel_detail">
                            <label htmlFor="channelDetail">チャンネル詳細</label>
                            <input type="text" className='channelDetail' name='channelDetail' required onChange={this.handleChange} />
                        </label>
                    </div>
                    <input type="submit" value='作成' />
                </form>
            )
        }
    }
        
}

export default withRouter(AddChannel);