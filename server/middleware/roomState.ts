import { RoomStateObject } from "../../types/RoomDataObject"
const roomState: RoomStateObject = {
	rooms: [],
	socketIdToPeerIdMap: new Map(),
}

export default roomState
