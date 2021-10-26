import {Route,Switch} from "react-router-dom";

//①まずはここで必要なファイルのimport
import UserIndex from "./main";
import UserNew from "./userNew";
import Login from "./login";
import Mypage from "./mypage";
import Account from "./account";
import Edit from "./edit";
import NotFound from "../ErrorPages/notFound";

//exportする中継地点のRouteの関数の設置
function Users(props) {
    return(
        <Switch>   
        <Route path={props.url} exact={true} component={UserIndex} />
        {/* <Route path={`${props.url}/:id`} exact={true} component={} /> 不要かも*/}
        <Route path={`${props.url}/new`} exact={true} component={UserNew} />
        <Route path={`${props.url}/login`} exact={true} component={Login} />
        <Route path={`${props.url}/mypage`} exact={true} component={Mypage} />
        <Route path={`${props.url}/mypage/show`} exact={true} component={Account} />
        <Route path={`${props.url}/mypage/edit`} exact={true} component={Edit} />
        {/* <Route path={`${url}/mypage/delete`} exact={true} component={} 　不要かも/> */}
        <Route component={NotFound} />
      </Switch>
    )
}


export default Users;

//ログアウトについて作成し、これを一旦mypageで読み込んでいるが、これは孫コンポーネントとして利用するため、後で親コンポーネント（header）を作成する。