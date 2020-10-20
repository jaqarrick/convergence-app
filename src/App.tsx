import React, { useCallback, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import io from "socket.io-client"
import Peer from "peerjs"
import "./App.css"
import Wrapper from "./components/wrapper/Wrapper"
import { RoomDataObject } from "./types"

//This is established as soon as client connects
const peer = new Peer({
	host: "localhost",
	port: 9000,
	path: "/convergence",
})
const socket = io.connect("http://localhost:5000")
const App: React.FC = () => {
	const history = useHistory()
	const [stream, setStream] = useState<null | MediaStream>(null)
	const [myPeerId, setMyPeerId] = useState<string | null>(null)
	const [roomid, setRoomid] = useState<string | null>(null)
	const [allRoomsData, setAllRoomsData] = useState<RoomDataObject[] | null>(
		null
	)
	useEffect(() => {
		peer.on("open", (id: string) => {
			setMyPeerId(id)
		})
	})
	useEffect(() => {
		socket.emit("request room data")
	}, [])
	useEffect(() => {
		socket.on("send rooms", (rooms: RoomDataObject[]) => {
			setAllRoomsData(rooms)
		})
	}, [setAllRoomsData])

	useEffect(() => console.log(allRoomsData), [allRoomsData])
	useEffect(() => {
		socket.on("welcome", (msg: string) => console.log(msg))
	})

	useEffect(() => {
		socket.on("update socket room", (roomid: string) => {
			console.log(roomid)
			setRoomid(roomid)
			history.push(`/room/${roomid}`)
		})
	}, [setRoomid, history])

	useEffect(() => {
		console.log(roomid)
	}, [roomid])
	const enterSocketRoom = useCallback(
		(roomid: string | null, peerid: string | null): void => {
			console.log(roomid, peerid)
			socket.emit("update room", { roomid, peerid })
		},
		[]
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

	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			await initUserAudio()
		} // Execute the created function directly
		init()
	}, [initUserAudio])

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
