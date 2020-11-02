import { PeerServer } from "peer"
import Peer from "peerjs"

const peerServer = PeerServer({ port: 9000, path: "/convergence" }, server => {
	console.log(server)
	console.log("the peer server is up and running on port 9000")
})

peerServer.on("connection", client => {
	console.log("a peer client has connected")
	console.log(client.getId())
})
