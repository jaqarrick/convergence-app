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
	console.log("Here are the rooms :", SerializeRooms(rooms))
	io.emit("send rooms", SerializeRooms(rooms))
}

//this is an initial request from a socket that has connected
const sendRooms = (socket: any): void => {
	const roomsToSend = SerializeRooms(rooms)
	socket.emit("send rooms", roomsToSend)
	console.log("sent rooms list")
}

const leaveSocketRoom = (
	io: any,
	socket: any,
	roomid: string,
	peerid: string
): void => {
	//find the room object that the peer is in

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

	rooms = filteredRooms
	io.emit("send rooms", SerializeRooms(rooms))
}

export { updateRooms, sendRooms, leaveSocketRoom }
