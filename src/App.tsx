import React, { useCallback, useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import Peer from "peerjs"
import "./App.css"
import Wrapper from "./components/wrapper/Wrapper"
// import { RoomDataObject } from "./types"
import useSockets from "./util/useSockets"
import { RoomDataObject, SerializedRoomDataObject } from "../types"
import deserializeRooms from "./util/deserializeRooms"
import { Gain, ToneAudioBuffer } from "tone"

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
	const {
		useSocketEmitCallback,
		useSocketEmitEffect,
		enterSocketRoom,
	} = useSockets("http://192.168.0.6:5000", onRoomUpdate, updateAllRoomsData)

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

	// This initate getUserMedia fn above
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			await initUserAudio()
		} // Execute the created function directly
		init()
	}, [initUserAudio])

	//init call anytime peers change
	const [connected, setConnected] = useState<Boolean>(false)
	useEffect(() => {
		peer.on("call", (call: any) => {
			if (stream) {
				call.answer(stream)
				call.on("stream", (peerstream: MediaStream) => {
					console.log("call received")
					console.log(peerstream)
					const peerSrc: MediaStreamAudioSourceNode = audioCtx.createMediaStreamSource(
						peerstream
					)
					const peerGain: GainNode = audioCtx.createGain()
					peerSrc.connect(peerGain)
					peerGain.connect(audioCtx.destination)
					// const gain = new Gain(0).toDestination()
					// gain.connect(src)
					setConnected(true)
				})
			}
		})
	}, [stream, setConnected])

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
			/>{" "}
		</div>
	)
}

export default App
