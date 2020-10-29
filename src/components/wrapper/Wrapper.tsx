import React from "react"
import "./Wrapper.css"
import { Switch, Route, Redirect, Link } from "react-router-dom"
import Welcome from "../welcome/Welcome"
import Room from "../room/Room"
import MainLogo from "./logos/MAIN_LOGO.svg"
import Info from "../info/Info"
// import roomData from "../../data/roomData"
import { RoomDataObject } from "../../../types/RoomDataObject"
import { userSettingsObject } from "../../../types/userSettingsObject"

interface Props {
	enterSocketRoom: (
		roomid: string | null | undefined,
		peerid: string | null
	) => void
	peerid: string | null
	roomid: string | undefined | null
	updateEffect: (
		effectName: string,
		effectGroup: string,
		paramName: string,
		update: string | number
	) => void
	leaveSocketRoom: (
		roomid: string | null | undefined,
		peerid: string | null
	) => void
	allRoomsData: RoomDataObject[] | null
	setRoomAudioSettings: (settings: userSettingsObject[]) => void
	roomAudioSettings: userSettingsObject[]
}
const Wrapper: React.FC<Props> = ({
	allRoomsData,
	enterSocketRoom,
	peerid,
	roomid,
	roomAudioSettings,
	setRoomAudioSettings,
	updateEffect,
	leaveSocketRoom,
}) => {
	return (
		<div className='wrapper'>
			<Switch>
				<Route
					exact
					path={`/room/:${roomid}`}
					render={props => (
						<Room
							{...props}
							roomAudioSettings={roomAudioSettings}
							setRoomAudioSettings={setRoomAudioSettings}
							roomid={roomid}
							updateEffect={updateEffect}
						/>
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
			<div className='logo-container'>
				<div className='join-options-container'>
					<div
						onClick={() => {
							enterSocketRoom(roomid, peerid)
						}}
						className='join-options'>
						join new
					</div>
					<div
						className='join-options'
						onClick={() => {
							if (allRoomsData) {
								const randomId = Math.floor(Math.random() * allRoomsData.length)
								const randomRoomObject: RoomDataObject = allRoomsData[randomId]
								const randomRoomid = randomRoomObject.roomid
								if (randomRoomid) {
									enterSocketRoom(randomRoomid, peerid)
								} else {
									enterSocketRoom(null, peerid)
								}
							}
						}}>
						join random
					</div>
					<Link to='/welcome'>
						<div
							className='join-options'
							onClick={() => leaveSocketRoom(roomid, peerid)}>
							{" "}
							leave room
						</div>{" "}
					</Link>
				</div>
				<Link to='/welcome'>
					{" "}
					<img src={MainLogo} alt='main logo' />
				</Link>
			</div>
			<Info />
		</div>
	)
}

export default Wrapper
