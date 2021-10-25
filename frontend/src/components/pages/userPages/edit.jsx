import React from "react";

class Edit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            error : '',
            first_error : '',
            last_error : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch("/api/users/mypage/edit")
        .then((res) => {
            if(!res.ok){
                console.error('サーバーエラ〜'); //エラーメッセージは変更する
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === "success"){
                this.setState({
                    first : obj.name.first,
                    last : obj.name.last
                });
            }else if(obj.result === "Authentication Error"){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {error : obj.result}
                });
            }else if(obj.result === "Error"){
                console.error(obj.error);
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {error : obj.result}
                });
            }
        }).catch((err) => { //③これは、そもそも初期値の取得ができないということだから、mypageに一旦飛ばすべきかな
            console.error(err.message);
            this.props.history.push({
                pathname : '/users/mypage',
                state : {error : 'fetch error at /users/mypage/edit'}
            });
        })
    }

    handleChange(e){
        const target = e.target;
        const value = target.value;　　//ここにバリデーション機能を入れる
        const name = target.name;

        //first_errorの出力
        if(target.name === 'first'){
            //firstのエラー作成
            if(nameChecker(value)){
                this.setState({
                    first_error : 'First Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        first_error : "First Name : 名前は4~7文字で記入してください"
                    });
                }else{
                    this.setState({
                        first_error : ''
                    });
                }
            }
        }

        if(target.name === 'last'){
            //lastのエラー作成
            if(nameChecker(value)){
                this.setState({
                    last_error : 'Last Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        last_error : "Last Name : 名前は4~7文字で記入してください"
                    });
                }else{
                    this.setState({
                        last_error : ''
                    });
                }
            }
        }

        //全てに合致している場合に関しては、stateを設置

        function nameChecker(str){
            var checker = str.match(/[A-Z]{1}[A-Za-z]*/);
            if(!checker){
                return true;
            }
        };

        this.setState({
            [name] : value
        });
    }

    handleSubmit(e){
        e.preventDefault();
        //エラーが存在する場合、データのfetchができないように設定している（これによりフロントエンドのバリデーションは完了！）
        if(this.state.first_error || this.state.last_error){
            this.setState({
                error : 'エラーの修正をしてください。'
            })
        }else{
            fetch(`/api/users/mypage/update`,{　
                method : "PUT",
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    name : {
                        first : this.state.first,
                        last : this.state.last
                    }
                })
            })
            .then((res) => {
                if(!res.ok){
                    console.error('サーバーエラー');
                }
                return res.json();
            })
            .then((obj) => {
                if(obj.result === "success"){
                    this.setState({
                        error : ''
                    });
                    this.props.history.push("/users/mypage");
                }else if(obj.result === "Authentication Error"){
                    this.props.history.push({
                        pathname : '/users/login',
                        state : {error : obj.result}
                    });
                }else if(obj.result === "Update Error"){
                    console.error(obj.error);
                    this.setState({
                        error : 'User Edit Error'
                    });
                    this.props.history.push("/users/mypage/edit");
                }
            }).catch((err) => {
                console.error(err.message); //このエラー処理に関しては未定
                this.props.history.push({
                    pathname : '/users/mypage/edit'
                });
            });
        }

        
    }
    
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h3>User Edit</h3>
                <div className="errorMsg">
                    <h2>{this.state.error}</h2>
                    <p>{this.state.first_error}</p>
                    <p>{this.state.last_error}</p>    
                </div>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" name="first" value={this.state.first} onChange={this.handleChange} />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" name="last" value={this.state.last} onChange={this.handleChange} />
                </div>
                <input type="submit" value="送信" />
            </form>
        )
    }
}

export default Edit;

//これに関する不足点　①サーバー全般　②バリデーション機能(フロント部分は完了)　③その他のエラーに関するチェックがまだ
//追記　①fetchのサーバー側のエラーメッセージ　②promiseのエラー処理に関して