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
const peer = new Peer({
	host: "192.168.0.6",
	port: 9000,
	path: "/convergence",
})

const audioCtx = new AudioContext()
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
	const [roomAudioSettings, setRoomAudioSettings] = useState<
		userSettingsObject[]
	>(settings)

	useEffect(() => console.log(roomAudioSettings), [roomAudioSettings])

	const {
		useSocketEmitCallback,
		useSocketEmitEffect,
		enterSocketRoom,
		socket,
	} = useSockets(
		"http://192.168.0.6:5000",
		onRoomUpdate,
		updateAllRoomsData,
		setRoomAudioSettings
	)

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
	const [myPeerId, setMyPeerId] = useState<string | null>(null)

	//as soon as peer is created, sets client peer id to specific string
	useEffect(() => {
		peer.on("open", (id: string) => {
			setMyPeerId(id)
		})
	})

	useEffect(() => console.log(allRoomsData), [allRoomsData])

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
			/>{" "}
		</div>
	)
}

export default App
