import {Route,Switch} from 'react-router-dom';

import ChatPage from './main';
import Search from './search';
import Guide from './guide';
import Channel from './channel';
import NotFound from '../errorPages/notFound';

import {DeleteProvider,ProfileProvider,AddChannelProvider} from '../../components/module/store';
import SocketContext,{socketIO} from '../../components/module/socket.io';

function Chat(props) {//レンダリング層の大規模な修正が必要になった。ちなみに、後でreact-router-domの使い方についてもう少し深ぼってみる。
    return(
        <Switch>
            <Route 
                path={`${props.url}`} 
                exact
                render={() => {
                    return(
                        <AddChannelProvider>
                            <ChatPage />
                        </AddChannelProvider>
                    )
                }}
            />
            <Route
                path={`${props.url}/search`}
                exact
                render={() => {
                    return(
                        <AddChannelProvider>
                            <Search />
                        </AddChannelProvider>
                    ) 
                }}
            />
            <Route path={`${props.url}/guide`} exact component={Guide} />
            <Route 
                path={`${props.url}/page/:id`}
                exact
                render={() => {
                    return (
                        <DeleteProvider>
                            <ProfileProvider>
                                <SocketContext.Provider value={socketIO}>
                                    <Channel />
                                </SocketContext.Provider>
                            </ProfileProvider>
                        </DeleteProvider>
                    ) 
                }}
            />
            <Route component={NotFound} />
        </Switch>  
    )
}

export default Chat;