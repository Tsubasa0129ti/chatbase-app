import { useReducer,createContext } from "react";
import {reducer_deleteModal,reducer_profileModal} from "./reducer";


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

export {DeleteStore,DeleteProvider,ProfileStore,ProfileProvider};