export const initialState = {
    count: 0,
    date: new Date(),
    name: "",
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'updateDate':
            return {...state, date: action.payload}
        case 'updateName':
            return {...state, name: action.payload}
        case 'increment':
            return {...state, count: state.count + 1}
        default:
            return state
    }
}

export default reducer