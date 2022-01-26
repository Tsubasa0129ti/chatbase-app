import React from 'react';
import Header from '../../components/block/header';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message : ''
        };
    }

    componentDidMount(){
        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} loggedIn={null} />
                <div>
                    <h2>Page</h2>
                </div>
            </div>
        )
    }
}

export default Home;