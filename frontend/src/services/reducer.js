export const initialState = {
    connected: false,
    date: new Date(),
    crawlName: "",
    userName: "",
    walkingDist: 10,
    crawlID: "",
    algorithm: "ai"
}

export const reducer = (state, action) => {
    switch(action.type){
        case 'updateDate':
            return {...state, date: action.payload}
        case 'updateUserName':
            return {...state, userName: action.payload}
        case 'updateCrawlName':
            return {...state, crawlName: action.payload}
        case 'connected':
            return {...state, connected: true}
        case 'updateWalkingDist':
            return {...state, walkingDist: action.payload}
        case 'updateCrawlID':
            return {...state, crawlID: action.payload}
        case 'updateAlgorithm':
            return {...state, algorithm: action.payload}
        default:
            return state
    }
}

export default reducer