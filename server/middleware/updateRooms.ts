import { joinRoom } from "./joinRoom"
import {
	SerializedRoomDataObject,
	RoomDataObject,
} from "../../types/RoomDataObject"
import SerializeRooms from "./serializeRooms"
const { v4: uuidv4 } = require("uuid")
let rooms: RoomDataObject[] = []

const updateRooms = (
	roomid: string | null,
	peerid: string | null,
	socket: any,
	io: any
) => {
	//if no roomid is specified, create a random roomid and add it to the room data array
	if (!roomid) {
		const randomRoomid: string = uuidv4()
		//create a new room object with a roomid and array of peerids
		const roomObject: RoomDataObject = {
			roomid: randomRoomid,
			peerids: new Set([peerid]),
		}
		rooms.push(roomObject)
		joinRoom(socket, io, randomRoomid)
	} else {
		//if roomid is specified, find that specific roomObject in rooms
		// console.log(roomid)
		//find the room object in the array
		const getCurrentObject = (
			property: string,
			arrayOfObjects: RoomDataObject[]
		) =>
			arrayOfObjects.find(
				(object: RoomDataObject) => object.roomid === property
			)
		const currentRoom: RoomDataObject = getCurrentObject(roomid, rooms)
		if (currentRoom) {
			//join the room
			joinRoom(socket, io, roomid)
			//update the peers in the room
			//check if the peerid already exists in the room
			//if it doesn't, add the peerid to the array
			if (!currentRoom.peerids.has(peerid)) {
				currentRoom.peerids.add(peerid)
			}
		} else {
			throw "the current room can't be found... something went wrong"
		}
	}
	//send the updated list of room data back to all clients connected
	// console.log("Here are the rooms :", SerializeRooms(rooms))
	io.emit("send rooms", SerializeRooms(rooms))
}

//this is an initial request from a socket that has connected
const sendRooms = (socket: any): void => {
	const roomsToSend = SerializeRooms(rooms)
	socket.emit("send rooms", roomsToSend)
	console.log("sent rooms list")
}

const leaveSocketRoom = (socket: any, roomid: string, peerid: string): void => {
	//find the room object that the peer is in
	console.log(rooms)

	//removes the peer from the room object and leaves the socket room
	const updatedRooms = rooms.map((roomObject: RoomDataObject) => {
		if (roomObject.roomid === roomid) {
			if (roomObject.peerids.has(peerid)) {
				roomObject.peerids.delete(peerid)
				socket.leave(roomid)
			}
		}
		return roomObject
	})
	const filteredRooms = updatedRooms.filter(
		(roomObject: RoomDataObject) => roomObject.peerids.size >= 1
	)

	console.log(filteredRooms)
	rooms = filteredRooms
	console.log(rooms)
	socket.emit("send rooms", SerializeRooms(rooms))
}

export { updateRooms, sendRooms, leaveSocketRoom }
//if there is no roomid specified, create a random roomid
//socket.join that room
//update the rooms array with the roomid, and inside the room object add an array of peerids

//if a roomid is specified, socket.join that room
//then update the room object in rooms

//after all this, emit an event that returns the rooms array

// const sendUpdatedRooms = (io, currentRoomId, currentPeerId = null) => {
//   console.log(currentRoomId, currentPeerId)
//   const getCurrentObject = (property, arrayOfObjects) => {
//     return arrayOfObjects.find(({ roomid }) => roomid === property)
//   }

//   const currentObject = getCurrentObject(currentRoomId, rooms)
//   if (currentRoomId && !currentObject & !currentPeerId) {
//     rooms.push({ roomid: currentRoomId, peerids: [] })
//   } else if (currentObject && currentRoomId && currentPeerId) {
//     currentObject.peerids = [...currentObject.peerids, currentPeerId]
//     console.log(currentObject)
//   }
//   io.emit("update room list", rooms)
// }

// module.exports = sendUpdatedRooms

// const joinRoom = (socket, io, roomid) => {
//     socket.join(roomid)
//     const data = {
//       message: `A new user has joined the room (${roomid})`,
//       roomid: roomid,
//     }
//     io.in(roomid).emit("confirm room join", data)
//   }

//   module.exports = joinRoom
