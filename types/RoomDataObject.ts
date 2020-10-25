export interface RoomDataObject {
	roomid: string
	peerids: Set<string>
}

export interface SerializedRoomDataObject {
	roomid: string
	peerids: string[]
}
