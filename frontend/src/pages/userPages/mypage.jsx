import React from 'react';
import {Link} from 'react-router-dom';
import Header from '../../components/block/header';

class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : '',
            message : ''
        }
    }

    componentDidMount(){
        const error = new Error(); //前もってエラーを呼び出す

        fetch('/api/users/mypage')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.message = res.statusText;
                error.status = res.status;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            this.setState({
                username : obj.username.first + obj.username.last
            });
        }).catch((err) => {//全てのエラーをここで受け取る　ただエラーメッセージが少し微妙そうなのでそこについて考える（もしくは自身で定義する）
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                this.props.history.push({
                    pathname : '/users',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                this.props.history.push({
                    pathname : '/users',
                    state : {message : err.message}
                });
            }
        });

        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <div>
                    <h2>My Page</h2>
                    <p>Welcom back {this.state.username}</p>
                </div>
                <div className='link'>
                    <Link to='/users/mypage/show'>アカウント管理</Link>
                    <Link to='/users/mypage/edit'>アカウントの編集</Link>
                
                </div>
                <div>
                    {/* アカウントの詳細についての分岐と削除について */}
                </div>
            </div>
        )
    }
}

export default Mypage;

//このページに関する詳細。ログイン後にリダイレクトされる場所　全体画面　リンクなどがある予定　そのほかのuserに関する情報を入れるページにする予定　そのため、fetchでuserデータを受け取る必要がある


//ここでやらなければならないこと　profileの有無の分岐
//追記　fetchの２パターンのエラー処理の作成

/* 構想　条件付きレンダー（profileの有無による）を行い、条件によってUIを変化させる。このため、サーバーからprofileが存在するかどうかの情報を取得する。
    profileが存在しない場合、①アカウントの編集②profileの作成③アカウントの削除④アカウントの閲覧
    profileが存在する場合、①アカウントの編集②profileの編集③アカウントの削除④アカウントの閲覧
    ただ、mypageがこれだけだと物足りないので何かを付随させたい
    後に入れる候補としては
    ①写真（プロフ画、）
    ②後は、投稿系統（ブログなど）を作成した場合にそれに付随したもの

*/
