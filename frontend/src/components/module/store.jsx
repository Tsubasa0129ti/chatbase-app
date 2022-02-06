import { useReducer,createContext } from "react";
import reducer from "./reducer";


const initialState = {
    show : false,
    deleteData : '',
    block : ''
}

const Store = createContext();

const Provider = ({children}) => {
    const [state,dispatch] = useReducer(reducer,initialState);
    return <Store.Provider value={{state,dispatch}}>{children}</Store.Provider>
}

export {Store,Provider};