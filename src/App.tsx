import React, { useCallback, useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import Peer from "peerjs"
import "./App.css"
import Wrapper from "./components/wrapper/Wrapper"
// import { RoomDataObject } from "./types"
import useSockets from "./util/useSockets"
import { RoomDataObject, SerializedRoomDataObject } from "../types"
import deserializeRooms from "./util/deserializeRooms"

//This is established as soon as client connects
const peer = new Peer({
	host: "localhost",
	port: 9000,
	path: "/convergence",
})
// const socket = io.connect("http://localhost:5000")

const App: React.FC = () => {
	const history = useHistory()
	const match = useRouteMatch<{ roomid: string }>("/room/:roomid")
	const roomid: null | string | undefined = match?.params.roomid
	const [allRoomsData, setAllRoomsData] = useState<RoomDataObject[] | null>([])
	const [currentPeers, setCurrentPeers] = useState<Set<string>>()
	//event fired whenever all rooms are updated
	const updateAllRoomsData = useCallback(
		(rooms: SerializedRoomDataObject[]) =>
			setAllRoomsData(deserializeRooms(rooms)),
		[setAllRoomsData]
	)

	const onRoomUpdate = useCallback(
		roomid => {
			history.push("/room/" + roomid)
		},
		[history]
	)
	const {
		useSocketEmitCallback,
		useSocketEmitEffect,
		enterSocketRoom,
	} = useSockets("http://localhost:5000", onRoomUpdate, updateAllRoomsData)

	useSocketEmitEffect("request room data")

	const [stream, setStream] = useState<null | MediaStream>(null)
	const [myPeerId, setMyPeerId] = useState<string | null>(null)

	//as soon as peer is created, sets client peer id to specific string
	useEffect(() => {
		peer.on("open", (id: string) => {
			setMyPeerId(id)
		})
	})

	useEffect(() => console.log(allRoomsData), [allRoomsData])
	//update the current peers whenever the rooms data changes
	//we need to take the peers array and turn it back into a set and then set that set to currentpeers
	// useEffect(() => {
	// 	console.log("peers changed")
	// 	const currentRoom = allRoomsData?.find(({ roomid }) => roomid === roomid)
	// 	console.log(currentRoom?.peerids)
	// 	// setCurrentPeers(currentRoom?.peerids)
	// }, [allRoomsData, setCurrentPeers, roomid])

	//updates current peers
	useEffect(
		() =>
			setCurrentPeers(
				allRoomsData?.find((object: RoomDataObject) => object.roomid === roomid)
					?.peerids
			),
		[allRoomsData, roomid, setCurrentPeers]
	)
	const initUserAudio = useCallback(async () => {
		let newStream: null | MediaStream = null
		try {
			newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
			setStream(newStream)
		} catch (err) {
			throw err
		}
	}, [setStream])

	//This initate getUserMedia fn above
	// useEffect(() => {
	// 	// Create an scoped async function in the hook
	// 	async function init() {
	// 		await initUserAudio()
	// 	} // Execute the created function directly
	// 	init()
	// }, [initUserAudio])

	return (
		<div className='wrapper'>
			<Wrapper
				peerid={myPeerId}
				roomid={roomid}
				enterSocketRoom={enterSocketRoom}
				allRoomsData={allRoomsData}
			/>{" "}
		</div>
	)
}

export default App
