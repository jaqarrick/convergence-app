interface RoomDataObject {
  roomid: string
  peerids: PeerDataObject[]
}

interface PeerDataObject {
  peerid: string
}

export default RoomDataObject
