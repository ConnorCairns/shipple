export const initialState = {
    connected: false,
    date: new Date(),
    name: "",
    walkingDist: 10,
    crawlID: ""
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'updateDate':
            return {...state, date: action.payload}
        case 'updateName':
            return {...state, name: action.payload}
        case 'connected':
            return {...state, connected: true}
        case 'updateWalkingDist':
            return {...state, walkingDist: action.payload}
        case 'updateCrawlID':
            return {...state, crawlID: action.payload}
        default:
            return state
    }
}

export default reducer