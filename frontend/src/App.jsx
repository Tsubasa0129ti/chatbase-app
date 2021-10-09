import './App.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Home from "./components/pages/homePages/index";
import Users from "./components/pages/userPages/index";
import Profile from "./components/pages/profilePages/index";
import Chat from "./components/pages/chatPages/index";
import NotFound from './components/pages/ErrorPages/notFound';

//現状だと全てこのファイル内でのルーティングをしている　これを大まかに分割して、routingファイルを個別に分割する
//その他現状解決しなければならない問題点　post処理の方法について　これはroutingを用意するかどうか（reactでのやり方が不明）
function App() {
  return(
    <BrowserRouter>
      {/* header  これもさらに細分化して作成する予定（例　ログインステータス　リンクののヘッダー）*/}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route //これを別のファイルに移行する
          path="/users"
          render={({match:{url}}) => (　//このurlという情報は創出送出する必要があるのではないか
            <Users url={url} />
          )}
        />
        <Route 
          path="/profile"
          render = {({match : {url}}) => (
            <Profile url={url} />
          )}
        />  
        <Route 
          path="/chat" 
          render = {({match : {url}}) => (
            <Chat url={url} />
          )}
        />  
        <Route exact component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
