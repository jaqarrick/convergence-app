import React from "react"
import "./Wrapper.css"
import { Switch, Route, Redirect } from "react-router-dom"
import Welcome from "../welcome/Welcome"
import Room from "../room/Room"
import MainLogo from "./logos/MAIN_LOGO.svg"
import Info from "../info/Info"
import roomData from "../../data/roomData"
import { RoomDataObject } from "../../../types/RoomDataObject"

interface Props {
	enterSocketRoom: (
		roomid: string | null | undefined,
		peerid: string | null
	) => void
	peerid: string | null
	roomid: string | undefined | null
	allRoomsData: RoomDataObject[] | null
}
const Wrapper: React.FC<Props> = ({
	allRoomsData,
	enterSocketRoom,
	peerid,
	roomid,
}) => {
	return (
		<div className='wrapper'>
			<Switch>
				<Route
					exact
					path={`/room/:${roomid}`}
					render={props => (
						<Room {...props} roomData={roomData} roomid={roomid} />
					)}></Route>
				<Route path='/welcome'>
					<Welcome
						allRoomsData={allRoomsData}
						enterSocketRoom={enterSocketRoom}
						peerid={peerid}
					/>
				</Route>
				<Route exact path='/'>
					<Redirect to='/welcome' />
				</Route>
			</Switch>
			<div
				onClick={() => {
					console.log("enter random room")
					enterSocketRoom(roomid, peerid)
				}}
				className='logo-container'>
				<img src={MainLogo} alt='main logo' />
			</div>
			<Info />
		</div>
	)
}

export default Wrapper
