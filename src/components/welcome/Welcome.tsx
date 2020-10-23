import React from "react"
import "./Welcome.css"
// import { v4 as uuidv4 } from "uuid"
import TextBanner from "../textbanner/TextBanner"
import { Link } from "react-router-dom"
import Wave from "../wave/Wave"
import { RoomDataObject } from "../../../types"
interface Props {
	allRoomsData: RoomDataObject[] | null
	peerid: string | null
	enterSocketRoom: (roomid: string | null, peerid: string | null) => void
}
const Welcome: React.FC<Props> = ({
	enterSocketRoom,
	peerid,
	allRoomsData,
}) => {
	return (
		<div className='welcome-container'>
			<div className={"text-banner-container upper-container"}>
				<TextBanner direction={"left"} />
			</div>
			<div className={"text-banner-container lower-container"}>
				<TextBanner direction={"right"} />
			</div>
			<Wave numberOfPeers={1} />
			<div className='room-data-container'>
				{allRoomsData
					? allRoomsData.map(roomObject => {
							return (
								<Link
									onClick={() => {
										enterSocketRoom(roomObject.roomid, peerid)
									}}
									key={roomObject.roomid}
									to={`/room/${roomObject.roomid}`}>
									{" "}
									{roomObject.roomid}{" "}
								</Link>
							)
					  })
					: ""}
			</div>
		</div>
	)
}

export default Welcome
