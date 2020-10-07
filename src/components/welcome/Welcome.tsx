import React, { useEffect, useCallback, useState } from "react"
import "./Welcome.css"
import { v4 as uuidv4 } from "uuid"
import TextBanner from "../textbanner/TextBanner"
import Info from "../info/Info"
import MainLogo from "./logos/MAIN_LOGO.svg"
interface Props {
  // history: any
  updateRoom: (roomid: string) => void
  allRooms: any[]
  joinRoom: (roomid: string) => void
}
const Welcome: React.FC<Props> = ({
  // history,
  updateRoom,
  allRooms,
  joinRoom,
}) => {
  useEffect(() => console.log(allRooms), [allRooms])
  const [isListOpen, setIsListOpen] = useState<Boolean>(true)
  const createNewRoom = useCallback(() => {
    const roomId = uuidv4()
    updateRoom(roomId)
  }, [updateRoom])

  return (
    <div className='welcome-container'>
      <div className={"text-banner-container upper-container"}>
        <TextBanner direction={"left"} />
      </div>
      <div className={"text-banner-container lower-container"}>
        <TextBanner direction={"right"} />
      </div>
      <Info />
      <div className='logo-container'>
        <img src={MainLogo} alt='main logo' />
      </div>

      <div className='old-welcome'>
        <button onClick={createNewRoom}> Join New Room </button>
        <button onClick={() => setIsListOpen(!isListOpen)}>
          {" "}
          Join Existing Room{" "}
        </button>
        <div className={isListOpen ? "room-list active" : "room-list"}>
          <ul>
            {allRooms.map(({ roomid }) => (
              <li
                onClick={() => {
                  updateRoom(roomid)
                }}
                key={roomid}>
                {" "}
                {roomid}{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Welcome
