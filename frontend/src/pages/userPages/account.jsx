import React from 'react';
import Header from '../../components/block/header';

class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            profileExist : false,
            username : '',
            email : '',
            intro : '',
            age : '',
            prefecture : '',
            address : '',
            birthday : '',
            belongings : '',
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
            if(obj.profileExist){
                this.setState({
                    profileExist : true,
                    username : obj.user.name.first + ' ' + obj.user.name.last,
                    email : obj.user.email,
                    intro : obj.user.profile.intro,
                    age : obj.user.profile.age,
                    prefecture : obj.user.profile.prefecture,
                    address : obj.user.profile.address,
                    birthday : obj.user.profile.birthday,
                    belongings : obj.user.profile.belongins
                });
            }else{
                this.setState({
                    username : obj.user.name.first + ' ' + obj.user.name.last,
                    email : obj.user.email
                });
            }
        }).catch((err) => {　//このcatchのエラーに関してはPromise rejectの場合に処理される
            console.error(err.message);
        });

        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    render(){
        if(this.state.profileExist){
            return(
                <div>
                    <Header message={this.state.message} />
                    <h3>User Data</h3>
                    <div>
                        <label htmlFor='username'>Username</label>
                        <p>{this.state.username}</p>
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <p>{this.state.email}</p>
                    </div>

                    <h5>your profile</h5>
                    <div>
                        <label htmlFor="intro">Intro</label>
                        <p>{this.state.intro}</p>
                    </div>
                    <div>
                        <label htmlFor="age">Age</label>
                        <p>{this.state.age}</p>
                    </div>
                    <div>
                        <label htmlFor="prefecture">Prefecture</label>
                        <p>{this.state.prefecture}</p>
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <p>{this.state.address}</p>
                    </div>
                    <div>
                        <label htmlFor="birthday">Birthday</label>
                        <p>{this.state.birthday}</p>
                    </div>
                    <div>
                        <label htmlFor="belongings">Belongings</label>
                        <p>{this.state.belongings}</p>
                    </div>
                </div>
            )
        }else{
            return(
                <div>
                    <Header message={this.state.message} />
                <h3>User Data</h3>
                <div>
                    <label htmlFor='name'>Name</label>
                    <p>{this.state.username}</p>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <p>{this.state.email}</p>
                </div>
                </div>
            )
        }
    }
}

export default Account;

//ここについての残り、UI
//追記　10/25 fetchのサーバーエラーの出力をサーバーから受け取れるようにするかも（これに関しては、他のページも同様）
//追記　10/28　一応headerにmessageの送信をしているけど、エラーなどのメッセージを出力する予定がなければ消しても良い
//追記　10/30 profileの有無による分岐は完了、ついでにageの追加をした