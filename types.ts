// export interface RoomDataObject {
// 	roomid: string
// 	peerids: any
// }

interface PeerDataObject {
	peerid: string
}

export interface SettingsMenuButtonObject {
	name: string
	id: number
}

export interface RoomDataObject {
	roomid: string
	peerids: Set<string>
}

export interface SerializedRoomDataObject {
	roomid: string
	peerids: string[]
}
