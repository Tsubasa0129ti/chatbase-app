import React from "react";

class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            email : '',
            error : ''
        }
    }

    componentDidMount(){
        fetch('/api/users/mypage/show')
        .then((res) => {
            if(!res.ok){
                //ここにもエラー処理を追加する必要がある。これについてはサーバー内のエラーを出力するため
                console.error("サーバーエラー");//エラーの出力方法は変えるが、とりあえずこれを行う
            }
            return res.json()
        })
        .then((obj) => {    
            if(obj.result === "success"){
                this.setState({
                    first : obj.user.name.first,
                    last : obj.user.name.last,
                    email : obj.user.email
                });
            }else if(obj.result === "Authentication Error"){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {error : obj.result}
                });
            }else if(obj.result === "Error"){
                console.error(obj.error);
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {error : obj.result}
                });
            }
        }).catch((err) => {　//このcatchのエラーに関してはPromise rejectの場合に処理される
            console.error(err.message);
        });
    }

    render(){
        return(
            <div>
                <h3>User Data</h3>
                <div>
                    <label htmlFor="name">Name</label>
                    <p>{this.state.first + " " + this.state.last}</p>
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <p>{this.state.email}</p>
                </div>
            </div>
        )
    }
}

export default Account;

//ここについての残り、UIとprofile作成後に手をつける（profileの有無による分岐を必要とする）
//追記　10/25 fetchのサーバーエラーの出力をサーバーから受け取れるようにするかも（これに関しては、他のページも同様）