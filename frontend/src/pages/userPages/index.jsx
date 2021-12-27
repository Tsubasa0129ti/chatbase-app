import {Route,Switch} from 'react-router-dom';

//①まずはここで必要なファイルのimport
import Index from './main';
import New from './new';
import Login from './login';
import Mypage from './mypage';
import Edit from './edit';
import NotFound from '../errorPages/notFound';

import Delete from '../../components/module/delete';
import Headers from '../../components/block/header';

//exportする中継地点のRouteの関数の設置
function Users(props) {
    return(
        <Switch>   
        <Route path={props.url} exact={true} component={Index} />
        <Route path={`${props.url}/new`} exact={true} component={New} />
        <Route path={`${props.url}/login`} exact={true} component={Login} />
        <Route path={`${props.url}/mypage`} exact={true} component={Mypage} />
        <Route path={`${props.url}/mypage/edit`} exact={true} component={Edit} />
        <Route path={`${props.url}/mypage/delete`} exact={true} component={Delete}/>
        <Route path={`${props.url}/header`} exact={true} component={Headers} />
        <Route component={NotFound} />
      </Switch>
    )
}


export default Users;