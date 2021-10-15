import {Route,Switch} from "react-router-dom";

//①まずはここで必要なファイルのimport
import UserIndex from "./main";
import UserNew from "./userNew";
import Login from "./login";
import Mypage from "./mypage";
import Account from "./account";
import Edit from "./edit";

//exportする中継地点のRouteの関数の設置
function Users(props) {
    return(
        <Switch>   
        <Route path={props.url} exact component={UserIndex} />
        {/* <Route path={`${props.url}/:id`} exact component={} /> 不要かも*/}
        <Route path={`${props.url}/new`} exact component={UserNew} />
        <Route path={`${props.url}/login`} exact component={Login} />
        {/* <Route path={`${url}/logout`} exact component={} />  これに関しては不要かも*/} 
        <Route path={`${props.url}/mypage`} exact component={Mypage} />
        <Route path={`${props.url}/mypage/show`} exact component={Account} />
        <Route path={`${props.url}/mypage/edit`} exact component={Edit} />
        {/* <Route path={`${url}/mypage/delete`} exact component={} 　不要かも/> */}
        {/* ここにもnotFound必要かも */}
      </Switch>
    )
}


export default Users;