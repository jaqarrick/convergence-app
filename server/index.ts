import express from "express"
const app = express()
import http from "http"
import compression from "compression"
import morgan from "morgan"
import { ExpressPeerServer } from "peer"
import path, { normalize } from "path"
const normalizePort = port => parseInt(port, 10)
const PORT = normalizePort(process.env.PORT || 5000)
const dev = app.get("env") !== "production"

const server = new http.Server(app)
const peerServer = ExpressPeerServer(server)
app.use("/peerjs", peerServer)

if (!dev) {
	// app.disable("x-powered-by")
	// app.use(compression())
	// app.use(morgan("common"))
	app.use(express.static(path.resolve(__dirname, "..", "build")))
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "..", "build", "index.html"))
	})
}
import ioSocket from "socket.io"
const io = ioSocket(server)
import { sendUpdatedRooms } from "./middleware/sendUpdatedRooms"
import { joinRoom } from "./middleware/joinRoom"
import {
	updateRooms,
	sendRooms,
	updateSocketIdToPeerIdMap,
	leaveRoom,
} from "./middleware/updateRooms"
import { RoomidPacket } from "../types/RoomDataObject"
import roomState from "./middleware/roomState"

io.on("connection", (socket: any) => {
	// sendUpdatedRooms(io, null)
	console.log("A user has connected!")
	socket.emit("welcome", "welcome to convergence")
	// socket.on("update room", roomid => {
	//   sendUpdatedRooms(io, roomid)
	// })

	//handles initial request of rooms on App render
	socket.on("request room data", () => sendRooms(socket))
	socket.on("send peer package", (peerid: string) => {
		const socketid = socket.id
		console.log(`peer id: ${peerid}, socketid: ${socketid}`)
		updateSocketIdToPeerIdMap(
			"add",
			socketid,
			roomState,
			socket,
			io,
			null,
			peerid
		)
	})
	//handles joining a new or existing room
	socket.on("update room", (data: RoomidPacket) => {
		const roomid: any = data.roomid
		const peerid: any = data.peerid
		console.log(`Peerid: ${peerid}`)
		updateRooms(roomid, peerid, socket, io)
	})
	socket.on("update peers", (data: RoomidPacket) => {
		const { roomid, peerid } = data
		sendUpdatedRooms(io, roomid, peerid)
	})

	socket.on("leave room", (data: RoomidPacket) => {
		const { roomid, peerid } = data
		leaveRoom(io, socket, roomid, peerid)
	})

	socket.on("send updated room audio settings", data => {
		const { roomid, updatedSettings } = data
		if (roomid) {
			console.log("settings received")

			socket
				.to(roomid)
				.emit("recieve updated room audio settings", updatedSettings)
		}
	})

	socket.on("disconnecting", () => {
		console.log(socket.id, socket.rooms)
		const socketRooms = Object.keys(socket.rooms)
		if (socketRooms.length === 2) {
			const currentRoomArray = socketRooms.filter(
				(key: string) => key !== socket.id
			)
			const currentRoom = currentRoomArray[0]
			updateSocketIdToPeerIdMap(
				"disconnect",
				socket.id,
				roomState,
				socket,
				io,
				currentRoom
			)
		}
	})
	socket.on("disconnect", () => {
		console.log("A user has disconnected!")
	})
})

server.listen(PORT, () => {
	console.log("backend server is up and running on Port: " + PORT)
})
