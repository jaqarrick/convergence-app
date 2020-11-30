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
	// peer = new Peer()
}

console.log(peer)
console.log(window.location.hostname)
console.log(window.location.protocol)
console.log(window.location.port)

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
		socket.on("reset room", () => history.push("/welcome/"))
	}, [socket, history])

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
	const { connectUserStream, connectStream, updateSetting } = useAudioRack(
		setRoomAudioSettings,
		roomAudioSettings,
		socket,
		isRecording,
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
	useEffect(() => {
		const allPeersInRoom: Set<string> | undefined = allRoomsData?.find(
			(object: RoomDataObject) => object.roomid === roomid
		)?.peerids
		if (allPeersInRoom) {
			setCurrentPeers(
				new Set(
					[...allPeersInRoom].filter((peerId: string) => peerId !== myPeerId)
				)
			)
		}
	}, [allRoomsData, roomid, setCurrentPeers, myPeerId])
	useEffect(() => console.log(currentPeers), [currentPeers])
	//initiates the client's media stream
	const initUserAudio = useCallback(async () => {
		let newStream: null | MediaStream = null
		try {
			newStream = await navigator.mediaDevices.getUserMedia({ audio: true })
			setStream(newStream)
			connectUserStream(newStream)
		} catch (err) {
			throw err
		}
	}, [setStream, connectUserStream])

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
		console.log("ended calls")
		allCalls.forEach(call => {
			call.close()
		})
		setConnected(false)
		setAllCalls([])
	}, [allCalls, setConnected])
	useEffect(() => {
		peer.on("call", (call: any) => {
			console.log("call received")
			if (stream) {
				setAllCalls(prev => [...prev, call])
				call.answer(stream)
				call.on("stream", connectStream)
				setConnected(true)
			}
		})
	}, [stream, setConnected, connectStream, setAllCalls])

	//calling function
	useEffect(() => {
		//check if only person in room
		if (currentPeers && currentPeers.size === 0 && roomid) {
			console.log("you are the only peer in the room")
			setConnected(true)
		} else if (currentPeers && currentPeers.size >= 1 && roomid && !connected) {
			console.log("the room size is greater than 1")
			setConnected(true)
			currentPeers?.forEach((id: string) => {
				if (stream) {
					console.log("init call!")
					const call = peer.call(id, stream)
					call.on(
						"stream",
						(remoteStream: MediaStream) => {
							console.log("retrieving local stream from call")
							connectStream(remoteStream)
						},
						(err: Error) => console.log("Failed to get local stream", err)
					)
				}
			})
		}
	}, [currentPeers, connected, roomid, stream, connectStream, setConnected])

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
