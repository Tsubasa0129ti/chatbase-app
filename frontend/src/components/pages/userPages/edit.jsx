import React from "react";

class Edit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            error : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch("/api/users/mypage/edit")
        .then((res) => res.json())
        .then((obj) => {
            if(obj.result === "success"){
                this.setState({
                    first : obj.name.first,
                    last : obj.name.last
                })
            }else{
                //ユーザー検索のエラー renderの分岐をする（エラーが存在する場合には、エラーを出力させる機構）
                this.setState({
                    error : obj.err
                });
            }
        }).catch((err) => {
            this.props.history.push("/users/login");
        })
    }

    handleChange(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name] : value
        });
    }

    handleSubmit(e){
        e.preventDefault();

        console.log(this.state.first);

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
        .then((res) => res.json())
        .then((obj) => {
            if(obj.result === "success"){
                this.props.history.push("/users/mypage");
            }else{
                this.props.history.push("/users/mypage/edit");
            }
        }).catch((err) => {
            this.props.history.push("/users/login");
        })
    }
    
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h3>User Edit</h3>
                <div className="errorMsg"></div>
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

//これに関する不足点　①サーバー全般　②バリデーション機能　③ログインチェック機能