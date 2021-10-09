import {Route,Switch} from "react-router-dom";

//①まずはここで必要なファイルのimport
import UserIndex from "./main";
import UserNew from "./userNew";

//exportする中継地点のRouteの関数の設置
function Users(props) {
    return(
        <Switch>   
        <Route path={props.url} exact component={UserIndex} />
        {/* <Route path={`${url}/:id`} exact component={} /> */}
        <Route path={`${props.url}/new`} exact component={UserNew} />
        {/* <Route path={`${url}/create`} exact component={} />
        <Route path={`${url}/login`} exact component={} />
        <Route path={`${url}/auth`} exact component={} />
        <Route path={`${url}/logout`} exact component={} />
        <Route path={`${url}/mypage`} exact component={} />
        <Route path={`${url}/mypage/show`} exact component={} />
        <Route path={`${url}/mypage/edit`} exact component={} />
        <Route path={`${url}/mypage/update`} exact component={} />
        <Route path={`${url}/mypage/delete`} exact component={} /> */}
        {/* ここにもnotFound必要かも */}
      </Switch>
    )
}


export default Users;