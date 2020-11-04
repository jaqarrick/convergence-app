    	//find the current room to leave by filtering the socket rooms

    	// socket.rooms // array []

    	// // Keep a map of peerids to socketids
    	// const socketIdsToPeerIds = {
    	// 	'socketId': 'peerId'
    	// }

    	// class SocketToPeerIdsMap {
    	// 	map: {[key: string]: string} = {}

    	// 	constructor() {}

    	// 	get(socketId: string) {
    	// 		if (this.map.hasOwnProperty(socketId)) {
    	// 			return this.map[socketId]
    	// 		} else {
    	// 			return undefined
    	// 		}
    	// 	}

    	// 	set(socketId, peerId) {
    	// 		// Check to make sure socketId doesn't already exist, other error handling
    	// 		this.map[socketId] = peerId
    	// 		return true
    	// 	}

    	// 	delete() {}
    	// }

    	// const socketPeerMap = new SocketToPeerIdsMap()

    	// socketPeerMap.set('beep', 'boop')
    	// socketIdsToPeerIds['beep'] = 'boop'

    	// interface Participant {
    	// 	socketId: string;
    	// 	peerId: string;
    	// }

    	// interface Room {
    	// 	roomId: string;
    	// 	participants: Participant[];
    	// }

    	// const roomState: { [key: string]: Room } = {}

    	// interface RoomsState {
    	// 	[key: string]: Room;
    	// 	// rooms: Room[]
    	// }

    	// // roomids here? (yes)
    	// // finds the roomobject that contains socket.id
    	// removing the
    	// rooms = [{
    	// 	roomid: string
    	// 	ids: set[ {socketid, peerid}]

    	// }]
    	//request room and peerid
    	//leave the room and disconnect the peerid

// // Pass by value vs. pass by reference
// const roomA = [] // 123 Main Street (location in memory)
// const roomB = roomA // 123 Main Street (location in memory)
// const roomC = 10 // primitives

// roomB.push('beep')

// console.log(roomA, roomC) // => ['beep']

// const initialState = {
// rooms: [],
// peers: []
// }

// // Redux
// // Action name
// const CREATE_ROOM = 'create-room'

// // Action handler
// const createRoomHandler = () => uuid4()

// // Reducer
// const reducer = (actionName, previousState) => {
// switch(actionName) {
// case CREATE_ROOM: // previousState.rooms.push(createRoomHandler())
// return { ...previousState, rooms: [ ...previousState.rooms, createRoomHandler() ]}
// }
// }

// state = reducer(CREATE_ROOM, state)
