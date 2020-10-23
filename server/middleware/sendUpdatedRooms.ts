let rooms: any[] = []

export const sendUpdatedRooms = (
	io: any,
	currentRoomId: any,
	currentPeerId: any = null
) => {
	console.log(currentRoomId, currentPeerId)
	const getCurrentObject = (property: any, arrayOfObjects: any) => {
		return arrayOfObjects.find(
			(arrayOfObjects: any) => arrayOfObjects.roomid === property
		)
	}

	const currentObject = getCurrentObject(currentRoomId, rooms)
	if (currentRoomId && !currentObject && !currentPeerId) {
		rooms.push({ roomid: currentRoomId, peerids: [] })
	} else if (currentObject && currentRoomId && currentPeerId) {
		currentObject.peerids = [...currentObject.peerids, currentPeerId]
		console.log(currentObject)
	}
	io.emit("update room list", rooms)
}
