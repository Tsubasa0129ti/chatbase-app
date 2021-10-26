import './App.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Home from './pages/homePages/index';
import Users from './pages/userPages/index';
import Profile from './pages/profilePages/index';
import Chat from './pages/chatPages/index';
import NotFound from './pages/errorPages/notFound';

function App() {
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route
          path="/users"
          render={({match:{url}}) => (
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
