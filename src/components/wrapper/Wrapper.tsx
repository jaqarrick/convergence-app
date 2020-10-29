import React, { useEffect, useState } from "react"
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
	const [isJoinRoomOptionsMenuOpen, setisJoinRoomOptionsMenuOpen] = useState<
		boolean
	>(false)
	useEffect(() => console.log(roomid), [roomid])
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
				<div
					className={
						isJoinRoomOptionsMenuOpen
							? "join-options-container active"
							: "join-options-container"
					}>
					<div
						onClick={() => {
							console.log("enter")
							enterSocketRoom(null, peerid)
							if (roomid) {
								leaveSocketRoom(roomid, peerid)
							}
						}}
						className='join-options'>
						join new
					</div>
					<div
						className='join-options'
						onClick={() => {
							if (allRoomsData) {
								if (roomid) {
									const filteredRooms = allRoomsData.filter(
										(object: RoomDataObject) => object.roomid !== roomid
									)
									if (filteredRooms.length > 0) {
										const randomId = Math.floor(
											Math.random() * filteredRooms.length
										)
										const randomRoomObject: RoomDataObject =
											allRoomsData[randomId]
										enterSocketRoom(randomRoomObject.roomid, peerid)
										leaveSocketRoom(roomid, peerid)
									} else {
										enterSocketRoom(null, peerid)
										leaveSocketRoom(roomid, peerid)
									}
								} else {
									enterSocketRoom(roomid, peerid)
									if (roomid) {
										leaveSocketRoom(roomid, peerid)
									}
								}
							}
						}}>
						join random
					</div>
					<Link to='/welcome' style={{ textDecoration: "none" }}>
						<div
							className='join-options'
							onClick={() => leaveSocketRoom(roomid, peerid)}>
							{" "}
							leave room
						</div>{" "}
					</Link>
				</div>{" "}
				<img
					onClick={() =>
						setisJoinRoomOptionsMenuOpen(!isJoinRoomOptionsMenuOpen)
					}
					src={MainLogo}
					alt='main logo'
				/>
			</div>
			<Info />
		</div>
	)
}

export default Wrapper
