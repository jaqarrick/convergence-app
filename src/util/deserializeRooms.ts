import {
	RoomDataObject,
	SerializedRoomDataObject,
} from "../../types/RoomDataObject"

const deserializeRooms = (
	serializedRooms: SerializedRoomDataObject[]
): RoomDataObject[] =>
	serializedRooms.map((object: SerializedRoomDataObject) => {
		const { roomid, peerids } = object
		return {
			roomid: roomid,
			peerids: new Set(peerids),
		}
	})

export default deserializeRooms
