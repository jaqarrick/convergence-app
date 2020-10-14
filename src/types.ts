export interface RoomDataObject {
	roomid: string
	peerids: PeerDataObject[]
}

interface PeerDataObject {
	peerid: string
}

export interface SettingsMenuButtonObject {
	name: string
	id: number
}
