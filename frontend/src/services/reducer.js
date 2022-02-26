export const initialState = {
    connected: false,
    date: new Date("2/27/2022"),
    name: "Event name",
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
        case 'updateName':
            return {...state, name: action.payload}
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