import React from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = `http://localhost:3001`;
export const socketIO = socketIOClient(ENDPOINT,{
    withCredentials : true,
    autoConnect : 10000,
    transports : ['websocket']
});
const SocketContext = React.createContext(socketIO);

export default SocketContext;

