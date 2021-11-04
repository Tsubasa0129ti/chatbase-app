//これに関しては、fetchをなくす。その代わり、UIをまともに作り替える。
import React from 'react';
import Header from '../../components/block/header';

class Index extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message : ''
        }
    }

    componentDidMount(){
        if(this.props.location.state){ //他のページからもらったエラーを取得
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <h3>User Main Page</h3>
            </div>
        )
    }
}

export default Index;
//ここにリダイレクトがある場合は、受け取り層の作成をする。ってかない気がしてきた。