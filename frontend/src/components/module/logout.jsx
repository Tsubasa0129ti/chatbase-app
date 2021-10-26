import React from 'react';
import {withRouter} from 'react-router-dom';

class Logout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            error : ''
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        e.preventDefault();

        fetch('/api/users/logout')
        .then((res) => {
            if(!res.ok){
                console.log("サーバーエラー");
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === "success"){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {msg : 'ログアウトしました。'}
                });
            }
        }).catch((err) => {
            console.error(err.message);
        })
    }

    render(){
        return(
            <button onClick={this.handleClick}>Logout</button>
        )
    }
}

export default withRouter(Logout);