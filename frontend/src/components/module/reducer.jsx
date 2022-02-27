const reducer_deleteModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true,
                deleteData : action.deleteData,
            }
        case 'close':
            return {
                ...state,
                show : false,
                deleteData : '',
            }
        default:
            return state
    }
}

const reducer_profileModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true,
                id : action.id
            }
        case 'close':
            return {
                ...state,
                show :false,
                id : ''
            }
        case 'error':
            return {
                ...state,
                show : false,
                message : '410 : 現在そのユーザーは使われておりません。'
            }
        default:
            return state
    }
}

const reducer_addChannelModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true
            }
        case 'close':
            return {
                ...state,
                show : false
            }
        default :
            return state
    }
}

const reducer_userDeleteModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true
            }
        case 'close':
            return {
                ...state,
                show : false
            }
        default :
            return state
    }
}

const reducer_textUpdatePop = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true,
                data : action.data
            }
        case 'close':
            return {
                ...state,
                show : false,
                data : ''
            }
        default :
            return state
    } 
}
 
export {reducer_deleteModal,reducer_profileModal,reducer_addChannelModal,reducer_userDeleteModal,reducer_textUpdatePop};