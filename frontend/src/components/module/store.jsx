import { useReducer,createContext } from "react";
import {reducer_deleteModal,reducer_profileModal,reducer_addChannelModal} from "./reducer";

const deleteState = {
    show : false,
    deleteData : '',
    block : ''
}

const DeleteStore = createContext();

const DeleteProvider = ({children}) => { //これの名前の変更もしつつ
    const [state,dispatch] = useReducer(reducer_deleteModal,deleteState);
    return <DeleteStore.Provider value={{state,dispatch}}>{children}</DeleteStore.Provider>
}

//ここからまだ実験段階
const ProfileStore = createContext();

const profileState = {
    show : false,
    id : ''
}

const ProfileProvider = ({children}) => { //storeに関しては再利用可能なのか
    const [state,dispatch] = useReducer(reducer_profileModal,profileState);
    return <ProfileStore.Provider value={{state,dispatch}}>{children}</ProfileStore.Provider>
}


const AddChannelStore = createContext();

const addChannelState = {
    show : false
}

const AddChannelProvider = ({children}) => {
    const [state,dispatch] = useReducer(reducer_addChannelModal,addChannelState);
    return <AddChannelStore.Provider value={{state,dispatch}}>{children}</AddChannelStore.Provider>
}

export {DeleteStore,DeleteProvider,ProfileStore,ProfileProvider,AddChannelStore,AddChannelProvider};