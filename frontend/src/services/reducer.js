export const initialState = {
    connected: false,
    date: new Date("2/27/2022"),
    crawlName: "",
    userName: "",
    walkingDist: 10,
    carbon: 10,
    uberSavings: 50,
    pintOptions: 100,
    crawlID: "https://youtu.be/dQw4w9WgXcQ",
    algorithm: "ai",
    responses: 10
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