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

let peer: any
if (window.location.protocol === "https:") {
	console.log("the protocol is https")
	peer = new Peer({
		host: "convergence-stage.herokuapp.com",
		port: 443,
		secure: true,
		path: "/peerjs",
	})
} else {
	console.log("the protocol is not https")
	peer = new Peer({
		host: window.location.hostname,
		port: parseInt(window.location.port),
		path: "/peerjs",
	})
}

console.log(window.location.protocol)
console.log(window.location.port)
const audioCtx = new AudioContext()

const App: React.FC = () => {
	const history = useHistory()
	const match = useRouteMatch<{ roomid: string }>("/room/:roomid")
	const roomid: null | string | undefined = match?.params.roomid

	const [allRoomsData, setAllRoomsData] = useState<RoomDataObject[] | null>([])
	const [currentPeers, setCurrentPeers] = useState<Set<string>>()
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [isUserAudioOn, setIsUserAudioOn] = useState<boolean>(true)

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
	} = useSockets(onRoomUpdate, updateAllRoomsData, setRoomAudioSettings)

	useEffect(() => {
		if (myPeerId) {
			console.log(`My peer id: ${myPeerId} and it's been sent to the server`)
			socket.emit("send peer package", myPeerId)
		}
	}, [myPeerId, socket])
	useEffect(() => {
		if (roomid && myPeerId) {
			enterSocketRoom(roomid, myPeerId)
		}
	}, [enterSocketRoom, myPeerId, roomid])
	const [stream, setStream] = useState<null | MediaStream>(null)

	useSocketEmitEffect("request room data")
	const [connected, setConnected] = useState<Boolean>(false)
	useEffect(() => console.log(connected), [connected])
	const {
		connectUserStream,
		connectStream,
		updateSetting,
		switchUserAudio,
	} = useAudioRack(
		setConnected,
		setRoomAudioSettings,
		roomAudioSettings,
		socket,
		isRecording,
		setIsRecording,
		isUserAudioOn,
		setStream
	)

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

	//initiates the client's media stream
	const initUserAudio = useCallback(async () => {
		let newStream: null | MediaStream = null
		try {
			newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
			// setStream(newStream)
			connectUserStream(newStream)
		} catch (err) {
			throw err
		}
	}, [setStream, connectUserStream])

	// useEffect(() => {
	// 	//connects user stream to rack
	// 	if (stream) {
	// 		connectUserStream(stream)
	// 	}
	// }, [stream, connectStream])

	// This initate getUserMedia fn above
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			await initUserAudio()
		} // Execute the created function directly
		init()
	}, [initUserAudio])

	const [allCalls, setAllCalls] = useState<any[]>([])
	//init call anytime peers change
	const endAllCalls = useCallback(() => {
		allCalls.forEach(call => {
			call.close()
		})
		setAllCalls([])
	}, [allCalls])
	useEffect(() => {
		peer.on("call", (call: any) => {
			console.log("call received")
			if (stream) {
				setAllCalls(prev => [...prev, call])
				call.answer(stream)
				call.on("stream", connectStream)
			}
		})
	}, [stream, setConnected, connectStream, setAllCalls])

	useEffect(() => {
		if (currentPeers && currentPeers.size <= 1 && roomid) {
			console.log(currentPeers.size)
		}
		if (currentPeers && currentPeers.size > 1 && roomid) {
			console.log(currentPeers)
			currentPeers?.forEach((id: string) => {
				if (stream) {
					console.log("init call!")
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
				updateSetting={updateSetting}
				leaveSocketRoom={leaveSocketRoom}
				endAllCalls={endAllCalls}
				setIsRecording={setIsRecording}
				isRecording={isRecording}
				isUserAudioOn={isUserAudioOn}
				setIsUserAudioOn={setIsUserAudioOn}
			/>{" "}
		</div>
	)
}

export default App
