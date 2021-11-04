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
        const error = new Error();

        fetch('/api/users/logout')
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
        })
        .then((obj) => {
            this.props.history.push({
                pathname : obj.redirectPath,
                state : {msg : 'ログアウトしました。'}
            });
        }).catch((err) => {
            if(err.status >= 500){

            }else{

            }
        })
    }

    render(){
        return(
            <button onClick={this.handleClick}>Logout</button>
        )
    }
}

export default withRouter(Logout);