import React from 'react';

class Guide extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message : ''
        }
    }

    componentDidMount(){
        //ログインチェックを行う
    }

    render(){
        return(
            <div>
                <p>Guide Page</p>
            </div>
        ) 
    }
}

export default Guide;