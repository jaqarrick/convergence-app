import { useEffect, useCallback, useMemo } from "react"

import io from "socket.io-client"
import { userSettingsObject } from "../../types/userSettingsObject"

const useSockets = (
	url: string,
	onRoomUpdate: any,

	updateAllRoomsData: (rooms: any[]) => void,
	setRoomAudioSettings: (newSettings: userSettingsObject[]) => void
) => {
	// const socket = useMemo(() => io.connect(url), [url])
	const socket = useMemo(() => io.connect(), [])
	const urlstring = useMemo(() => url, [url])

	useEffect(() => {
		socket.on("update socket room", onRoomUpdate)
	}, [socket, onRoomUpdate])

	useEffect(() => {
		socket.on("send rooms", updateAllRoomsData)
	}, [socket, updateAllRoomsData])

	useEffect(() => {
		socket.on("recieve updated room audio settings", (data: any) => {
			setRoomAudioSettings(data)
		})
	}, [setRoomAudioSettings, socket])
	const useSocketEmitEffect = (emitEvent: string, data?: any, deps?: any[]) =>
		useEffect(() => {
			socket.emit(emitEvent, data)
		}, [emitEvent, data])

	const useSocketEmitCallback = useCallback(
		(emitEvent: string, data?: any, deps?: any[]) => {
			socket.emit(emitEvent, data)
		},
		[socket]
	)
	const enterSocketRoom = useCallback(
		(roomid: string | null | undefined, peerid: string | null) => {
			socket.emit("update room", { roomid, peerid })
		},
		[socket]
	)
	const leaveSocketRoom = useCallback(
		(roomid: string | null | undefined, peerid: string | null) => {
			if (peerid && roomid) {
				console.log("leave room event fired")
				socket.emit("leave room", { roomid, peerid })
			} else if (!roomid) {
				console.log("It looks like you're not in a room yet")
			} else if (!peerid) {
				console.log("You don't have an assigned peerid... something went wrong")
			}
		},
		[socket]
	)

	return {
		leaveSocketRoom,
		useSocketEmitCallback,
		useSocketEmitEffect,
		enterSocketRoom,
		socket,
	}
}

export default useSockets
