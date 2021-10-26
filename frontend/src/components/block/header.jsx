import React from 'react';
import {withRouter} from 'react-router-dom'; //一応つけておく、いらなければ削除OK

import Logout from '../module/logout';

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>

            </div>
        )
    }
}

export default withRouter(Header);