import React, { useCallback, useEffect, useState } from "react"
import "./App.css"
import { Switch, Route, Redirect, useHistory } from "react-router-dom"
import io from "socket.io-client"
import Welcome from "./components/welcome/Welcome"
import RoomComponent from "./components/roomcomponent/RoomComponent"
import RoomDataObject from "./types"

const socket = io.connect("http://localhost:5000")

function App() {
  let history = useHistory()
  const [currentRoom, setCurrentRoom] = useState("")
  const [currentPeer, setCurrentPeer] = useState<any>(null)
  const [currentRoomObject, setCurrentRoomObject] = useState<RoomDataObject>()
  const [allRooms, setAllRooms] = useState<any[]>([])
  useEffect(() => {
    setCurrentRoomObject(allRooms.find(({ roomid }) => roomid === currentRoom))
  }, [allRooms, setCurrentRoomObject, currentRoom])
  useEffect(() => console.log(currentRoomObject), [currentRoomObject])
  socket.on("update room list", (rooms: RoomDataObject[]) => {
    setAllRooms(rooms)
  })
  socket.on("confirm room join", (data: any) => {
    const { message, roomid } = data
    setMessage(message)
    setCurrentRoom(roomid)
  })
  const updateRoom = useCallback(
    roomid => {
      history.push(`/rooms/${roomid}`)
      setCurrentRoom(roomid)
      socket.emit("update room", roomid)
    },
    [setCurrentRoom, history]
  )

  const updateSocketPeers = useCallback((roomid, peerid) => {
    socket.emit("update peers", { roomid, peerid })
  }, [])
  const [message, setMessage] = useState<string>("")
  const joinRoom = useCallback(roomid => {
    socket.emit("join room", roomid)
    console.log(`You have joined room: ${roomid}`)
  }, [])

  return (
    <div className='wrapper'>
      <Switch>
        <Route
          exact
          path={"/rooms/:roomid"}
          render={props => (
            <RoomComponent
              {...props}
              updateSocketPeers={updateSocketPeers}
              setCurrentPeer={setCurrentPeer}
              currentPeer={currentPeer}
              currentRoom={currentRoom}
              currentRoomObject={currentRoomObject}
              message={message}
            />
          )}
        />
        <Route path='/welcome'>
          <Welcome
            allRooms={allRooms}
            updateRoom={updateRoom}
            joinRoom={joinRoom}
          />
        </Route>
        <Route exact path='/'>
          <Redirect to='/welcome' />
        </Route>
      </Switch>
    </div>
  )
}

export default App
