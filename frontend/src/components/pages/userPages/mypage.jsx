import React from "react";
import {Link} from "react-router-dom";

//最初に基本的にログインしているかどうかの分岐を加える　ログインの有無に関する分岐をもっとうまくやりたい
class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : "",
            error : ""
        }
    }

    componentDidMount(){
        fetch(`/api/users/mypage`)
        .then((res) => {
            if(!res.ok){
                console.error('サーバーエラー');
            }
            return res.json();
        })
        .then((obj) => {
            //リクエストを送ったら、サーバーが勝手にログインIDを判断して、それに基づくuserを返す
            if(obj.result === "success"){
                this.setState({
                    username : obj.username.first + obj.username.last
                });
            }else if(obj.result === "Authentication Error"){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {error : obj.result}
                });
            }
        }).catch((err) => {
            console.error(err.message);
        })

        if(this.props.location.state){
            this.setState({
                error : this.props.location.state.error
            });
        }
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h2>My Page</h2>
                    <p>Welcom back {this.state.username}</p>
                </div>
                <div className="errorMsg">{this.state.error}</div>
                <div className="link">
                    <Link to="/users/mypage/show">アカウント管理</Link>
                    <Link to="/users/mypage/edit">アカウントの編集</Link>
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