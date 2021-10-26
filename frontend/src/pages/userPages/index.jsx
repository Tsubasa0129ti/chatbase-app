import {Route,Switch} from 'react-router-dom';

//①まずはここで必要なファイルのimport
import Index from './main';
import New from './new';
import Login from './login';
import Mypage from './mypage';
import Account from './account';
import Edit from './edit';
import NotFound from '../errorPages/notFound';

import Delete from '../../components/module/delete';

//exportする中継地点のRouteの関数の設置
function Users(props) {
    return(
        <Switch>   
        <Route path={props.url} exact={true} component={Index} />
        {/* <Route path={`${props.url}/:id`} exact={true} component={} /> 不要かも*/}
        <Route path={`${props.url}/new`} exact={true} component={New} />
        <Route path={`${props.url}/login`} exact={true} component={Login} />
        <Route path={`${props.url}/mypage`} exact={true} component={Mypage} />
        <Route path={`${props.url}/mypage/show`} exact={true} component={Account} />
        <Route path={`${props.url}/mypage/edit`} exact={true} component={Edit} />
        <Route path={`${props.url}/mypage/delete`} exact={true} component={Delete}/>
        <Route component={NotFound} />
      </Switch>
    )
}


export default Users;

//ログアウトについて作成し、これを一旦mypageで読み込んでいるが、これは孫コンポーネントとして利用するため、後で親コンポーネント（header）を作成する。