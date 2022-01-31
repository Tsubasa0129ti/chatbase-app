import './App.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Home from './pages/homePages/index';
import Users from './pages/userPages/index';
import Profile from './pages/profilePages/index';
import Chat from './pages/chatPages/index';
import Error from './pages/errorPages/internalServerError';
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
        <Route 
          path="/error/internalServerError"
          exact component={Error}
        />
        <Route exact component={NotFound} />
        
      </Switch>
    </BrowserRouter>
  )
}

export default App;
