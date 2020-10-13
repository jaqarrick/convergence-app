export interface RoomDataObject {
  roomid: string
  peerids: PeerDataObject[]
}

interface PeerDataObject {
  peerid: string
}


export interface SettingsListObject {
	id: number
	name: string
}