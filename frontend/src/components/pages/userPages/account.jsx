import React from "react";

class Account extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            email : ''
        }
    }

    componentDidMount(){
        fetch('/api/users/mypage/show') //これデータ送ってもらうだけなら統一可能かもしれない
        .then((res) => res.json())
        .then((obj) => {
            if(obj.result === "success"){
                this.setState({
                    first : obj.user.name.first,
                    last : obj.user.name.last,
                    email : obj.user.email
                });
            }else{
                this.props.history.push(obj.redirectPath);
            }
            
        }).catch((err) => {
            this.props.history.push("/users/login");
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