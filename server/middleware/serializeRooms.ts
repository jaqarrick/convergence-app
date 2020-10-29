//input is rooms data array, which contains:

import {
	RoomDataObject,
	SerializedRoomDataObject,
} from "../../types/RoomDataObject"

//[...{roomid: string, peerids: set}]
const SerializeRooms = (rooms: RoomDataObject[]): SerializedRoomDataObject[] =>
	rooms.map((roomObject: RoomDataObject) => {
		const { roomid, peerids } = roomObject
		const peeridsArray = Array.from(peerids)
		return {
			roomid: roomid,
			peerids: peeridsArray,
		}
	})

//output is [{roomid: string, peerids: string[]}]

export default SerializeRooms
