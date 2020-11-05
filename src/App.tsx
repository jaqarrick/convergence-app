import React, { useCallback, useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import Peer from "peerjs"
import "./App.css"
import Wrapper from "./components/wrapper/Wrapper"
// import { RoomDataObject } from "./types"
import useSockets from "./util/useSockets"
import {
	RoomDataObject,
	SerializedRoomDataObject,
} from "../types/RoomDataObject"
import deserializeRooms from "./util/deserializeRooms"
import useAudioRack from "./util/audio/useAudioRack"
import settings from "./util/audio/settings"
import { userSettingsObject } from "../types/userSettingsObject"
import { connect } from "socket.io-client"
//This is established as soon as client connects
// const peer = new Peer({
// 	host: "localhost",
// 	port: 9000,
// 	path: "/convergence",
// })

let peer: any
if (window.location.protocol === "https") {
	peer = new Peer({
		host: "convergence-stage.herokuapp.com",
		port: 443,
		secure: true,
		path: "/peerjs",
	})
} else {
	peer = new Peer({
		host: window.location.hostname,
		port: parseInt(window.location.port),
		path: "/peerjs",
	})
}
// const peer = new Peer()

console.log(peer)
console.log(window.location.protocol)
console.log(window.location.port)
const audioCtx = new AudioContext()
// const socket = io.connect("http://localhost:5000")

const App: React.FC = () => {
	const history = useHistory()
	const match = useRouteMatch<{ roomid: string }>("/room/:roomid")
	const roomid: null | string | undefined = match?.params.roomid

	// const [roomid, setRoomid] = useState<null | string | undefined>(
	// 	match?.params.roomid
	// )

	const [allRoomsData, setAllRoomsData] = useState<RoomDataObject[] | null>([])
	const [currentPeers, setCurrentPeers] = useState<Set<string>>()
	//event fired whenever all rooms are updated
	const updateAllRoomsData = useCallback(
		(rooms: SerializedRoomDataObject[]) =>
			setAllRoomsData(deserializeRooms(rooms)),
		[setAllRoomsData]
	)
	const [myPeerId, setMyPeerId] = useState<string | null>(null)

	useEffect(() => console.log(`current room id: ${roomid}`), [roomid])

	useEffect(() => {
		console.log(allRoomsData)
	}, [allRoomsData])
	const onRoomUpdate = useCallback(
		roomid => {
			history.push("/room/" + roomid)
		},
		[history]
	)
	const [roomAudioSettings, setRoomAudioSettings] = useState<
		userSettingsObject[]
	>(settings)

	const {
		leaveSocketRoom,
		useSocketEmitEffect,
		enterSocketRoom,
		socket,
	} = useSockets(
		"http://localhost:5000",
		onRoomUpdate,
		updateAllRoomsData,
		setRoomAudioSettings
	)

	useEffect(() => {
		console.log(myPeerId)
		if (myPeerId) {
			console.log(`my peer id: ${myPeerId} and it's been sent to the server`)
			socket.emit("send peer package", myPeerId)
		}
	}, [myPeerId, socket])
	useEffect(() => {
		if (roomid && myPeerId) {
			enterSocketRoom(roomid, myPeerId)
		}
	}, [enterSocketRoom, myPeerId, roomid])

	useSocketEmitEffect("request room data")
	const [connected, setConnected] = useState<Boolean>(false)

	const { connectStream, updateEffect } = useAudioRack(
		setConnected,
		setRoomAudioSettings,
		roomAudioSettings,
		socket,
		roomid
	)
	const [stream, setStream] = useState<null | MediaStream>(null)

	//as soon as peer is created, sets client peer id to specific string
	useEffect(() => {
		peer.on("error", (err: Error) => {
			console.log(err)
		})
		peer.on("open", (id: string) => {
			console.log(id)
			setMyPeerId(id)
		})
	})

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

	useEffect(() => {
		if (stream) {
			connectStream(stream)
		}
	}, [stream, connectStream])

	// This initate getUserMedia fn above
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			await initUserAudio()
		} // Execute the created function directly
		init()
	}, [initUserAudio])

	//init call anytime peers change
	useEffect(() => {
		peer.on("call", (call: any) => {
			if (stream) {
				call.answer(stream)
				call.on("stream", connectStream)
			}
		})
	}, [stream, setConnected, connectStream])

	useEffect(() => {
		if (currentPeers && currentPeers.size > 1 && roomid) {
			if (!connected) {
				currentPeers?.forEach((id: string) => {
					if (stream) {
						peer.call(id, stream)
						const src: MediaStreamAudioSourceNode = audioCtx.createMediaStreamSource(
							stream
						)
						const gain: GainNode = audioCtx.createGain()
						src.connect(gain)
						gain.connect(audioCtx.destination)
					}
				})
			}
		}
	}, [currentPeers, connected, roomid, stream])

	return (
		<div className='wrapper'>
			<Wrapper
				peerid={myPeerId}
				roomid={roomid}
				enterSocketRoom={enterSocketRoom}
				allRoomsData={allRoomsData}
				roomAudioSettings={roomAudioSettings}
				setRoomAudioSettings={setRoomAudioSettings}
				updateEffect={updateEffect}
				leaveSocketRoom={leaveSocketRoom}
			/>{" "}
		</div>
	)
}

export default App
