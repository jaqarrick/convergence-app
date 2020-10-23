import express from "express"
const app = express()
import http from "http"
const server = new http.Server(app)

import ioSocket from "socket.io"
const io = ioSocket(server)
import { sendUpdatedRooms } from "./middleware/sendUpdatedRooms"
import { joinRoom } from "./middleware/joinRoom"
import { updateRooms, sendRooms } from "./middleware/updateRooms"

io.on("connection", (socket: any) => {
	// sendUpdatedRooms(io, null)
	console.log("A user has connected!")
	socket.emit("welcome", "welcome to convergence")
	// socket.on("update room", roomid => {
	//   sendUpdatedRooms(io, roomid)
	// })

	//handles initial request of rooms on App render
	socket.on("request room data", () => sendRooms(socket))

	//handles joining a new or existing room
	socket.on("update room", (data: any) => {
		const roomid: any = data.roomid
		const peerid: any = data.peerid
		updateRooms(roomid, peerid, socket, io)
	})
	socket.on("update peers", (data: any) => {
		const { roomid, peerid } = data
		sendUpdatedRooms(io, roomid, peerid)
	})
	socket.on("disconnect", () => {
		console.log("A user has disconnected!")
		//need to add a function here that removes and updates rooms data
	})
})

const PORT = 5000
server.listen(PORT, () => {
	console.log("backend server is up and running on Port: " + PORT)
})
