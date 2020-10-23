export const joinRoom = (socket: any, io: any, roomid: string) => {
	socket.join(roomid)
	const data = {
		message: `A new user has joined the room (${roomid})`,
		roomid: roomid,
	}
	io.in(roomid).emit("confirm room join", data)
	socket.emit("update socket room", roomid)
}
