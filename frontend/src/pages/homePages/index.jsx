import React from 'react';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            msg : ''
        };
    }

    componentDidMount(){
        if(this.props.location.state){
            this.setState({
                msg : this.props.location.state.msg
            });
        }
    }

    render(){
        return(
            <div>
                <h2>Page</h2>
                <p>{this.state.msg}</p>
            </div>
        )
    }
}

export default Home;