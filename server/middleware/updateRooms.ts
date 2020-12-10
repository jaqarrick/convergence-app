import { joinRoom } from "./joinRoom"
import { RoomDataObject, RoomStateObject } from "../../types/RoomDataObject"
import SerializeRooms from "./serializeRooms"
const { v4: uuidv4 } = require("uuid")

import roomState from "./roomState"

const updateSocketIdToPeerIdMap = (
	method: string,
	socketid: string,
	roomState: RoomStateObject,
	socket?: any,
	io?: any,
	roomid?: string,

	peerid?: string
) => {
	if (method === "add") {
		roomState.socketIdToPeerIdMap.set(socketid, peerid)
	}
	if (method === "disconnect") {
		//find the peerid in the map
		const peerIdToRemove: string = roomState.socketIdToPeerIdMap.get(socketid)
		if (peerIdToRemove) {
			const newRoomData: RoomDataObject[] = roomState.rooms.map(
				(roomDataObject: RoomDataObject) => {
					if (roomDataObject.peerids.has(peerIdToRemove)) {
						if (roomid) {
							socket.leave(roomid)
						}
						roomDataObject.peerids.delete(peerIdToRemove)
						return roomDataObject
					}
					return roomDataObject
				}
			)

			const filteredNewRoomData = newRoomData.filter(
				(roomDataObject: RoomDataObject) => roomDataObject.peerids.size >= 1
			)
			roomState.rooms = filteredNewRoomData
			io.emit("send rooms", SerializeRooms(roomState.rooms))
		}
	}
}

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

		//compare and swap //TODO
		const CAS = (roomObject: RoomDataObject, roomState: RoomStateObject) => {
			const prevRoomState = roomState.rooms
			const newRoomState = [...prevRoomState, roomObject]
			roomState.rooms = newRoomState
		}
		CAS(roomObject, roomState)
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
		const currentRoom: RoomDataObject = getCurrentObject(
			roomid,
			roomState.rooms
		)
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
			socket.emit("reset room")
			console.log("the current room can't be found... something went wrong")
		}
	}
	//send the updated list of room data back to all clients connected
	console.log("Here are the rooms :", SerializeRooms(roomState.rooms))
	io.emit("send rooms", SerializeRooms(roomState.rooms))
}

//this is an initial request from a socket that has connected
const sendRooms = (socket: any): void => {
	const roomsToSend = SerializeRooms(roomState.rooms)
	socket.emit("send rooms", roomsToSend)
	console.log("sent rooms list")
}

const leaveRoom = (
	io: any,
	socket: any,
	roomid: string,
	peerid: string
): void => {
	//find the room object that the peer is in

	//removes the peer from the room object and leaves the socket room
	const updatedRooms = roomState.rooms.map((roomObject: RoomDataObject) => {
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

	roomState.rooms = filteredRooms
	io.emit("send rooms", SerializeRooms(roomState.rooms))
}

export { updateRooms, leaveRoom, sendRooms, updateSocketIdToPeerIdMap }
