import React from 'react';
import Header from '../../components/block/header';

class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            email : '',
            message : ''
        }
    }

    componentDidMount(){
        fetch('/api/users/mypage/show')
        .then((res) => {
            if(!res.ok){
                //ここはサーバー内のエラーを受け取る
                console.error('サーバーエラー');
            }
            return res.json()
        })
        .then((obj) => {    
            if(obj.result === 'success'){
                this.setState({
                    first : obj.user.name.first,
                    last : obj.user.name.last,
                    email : obj.user.email
                });
            }else if(obj.result === 'Authentication Error'){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }else if(obj.result === 'Error'){
                console.error(obj.error);
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }
        }).catch((err) => {　//このcatchのエラーに関してはPromise rejectの場合に処理される
            console.error(err.message);
        });
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <h3>User Data</h3>
                <div>
                    <label htmlFor='name'>Name</label>
                    <p>{this.state.first + ' ' + this.state.last}</p>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <p>{this.state.email}</p>
                </div>
            </div>
        )
    }
}

export default Account;

//ここについての残り、UIとprofile作成後に手をつける（profileの有無による分岐を必要とする）
//追記　10/25 fetchのサーバーエラーの出力をサーバーから受け取れるようにするかも（これに関しては、他のページも同様）
//追記　10/28　一応headerにmessageの送信をしているけど、エラーなどのメッセージを出力する予定がなければ消しても良い