import React, { useEffect, useState } from "react"
import "./Wrapper.css"
import { Switch, Route, Redirect, Link } from "react-router-dom"
import Welcome from "../welcome/Welcome"
import Room from "../room/Room"
import MainLogo from "./logos/MAIN_LOGO.svg"
import Info from "../info/Info"
import Wave from "../../components/wave/Wave"
// import roomData from "../../data/roomData"
import { RoomDataObject } from "../../../types/RoomDataObject"
import { userSettingsObject } from "../../../types/userSettingsObject"
import { NormalRange } from "tone/build/esm/core/type/Units"

enum settingsGroup {
	environment = "ENVIRONMENT",
	effects = "EFFECTS",
	inputs = "INPUTS",
	outputs = "OUTPUTS",
}

enum settingsName {
	delay = "DELAY",
	reverb = "REVERB",
	chorus = "CHORUS",
	input = "INPUT",
	output = "OUTPUT",
}
interface Props {
	userAmpVal: number
	isUserAudioOn: boolean
	setIsUserAudioOn: (isUserAudioOn: boolean) => void
	setIsRecording: (isRecording: boolean) => void
	isRecording: boolean
	enterSocketRoom: (
		roomid: string | null | undefined,
		peerid: string | null
	) => void
	peerid: string | null
	roomid: string | undefined | null
	endAllCalls: () => void
	updateSetting: (
		settingsGroup: settingsGroup,
		settingsName: settingsName,
		paramName: string,
		updatedValue: number | NormalRange
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
	isUserAudioOn,
	setIsUserAudioOn,
	allRoomsData,
	enterSocketRoom,
	peerid,
	roomid,
	roomAudioSettings,
	setRoomAudioSettings,
	updateSetting,
	leaveSocketRoom,
	endAllCalls,
	setIsRecording,
	isRecording,
	userAmpVal,
}) => {
	const [
		isJoinRoomOptionsMenuOpen,
		setisJoinRoomOptionsMenuOpen,
	] = useState<boolean>(false)

	return (
		<div className='wrapper'>
			<Switch>
				<Route
					exact
					path={`/room/:${roomid}`}
					render={props => (
						<Room
							{...props}
							isRecording={isRecording}
							setIsRecording={setIsRecording}
							roomAudioSettings={roomAudioSettings}
							setRoomAudioSettings={setRoomAudioSettings}
							roomid={roomid}
							updateSetting={updateSetting}
							isUserAudioOn={isUserAudioOn}
							setIsUserAudioOn={setIsUserAudioOn}
						/>
					)}></Route>
				<Route path='/welcome'>
					<Welcome
						roomid={roomid}
						allRoomsData={allRoomsData}
						enterSocketRoom={enterSocketRoom}
						peerid={peerid}
					/>
				</Route>
				<Route exact path='/'>
					<Redirect to='/welcome' />
				</Route>
				<Route path='/'>
					<Redirect to='/welcome'></Redirect>
				</Route>
			</Switch>
			<Wave numberOfPeers={1} userAmpVal={userAmpVal} />
			<div className='logo-container'>
				<div
					className={
						isJoinRoomOptionsMenuOpen
							? "join-options-container active"
							: "join-options-container"
					}>
					<div
						onClick={() => {
							if (peerid) {
								console.log("entering a socket room")
								enterSocketRoom(null, peerid)
								if (roomid) {
									leaveSocketRoom(roomid, peerid)
									endAllCalls()
								}
							}
						}}
						className='join-options'>
						join new
					</div>
					<div
						className='join-options'
						onClick={() => {
							if (allRoomsData && peerid) {
								endAllCalls()
								if (roomid) {
									const filteredRooms = allRoomsData.filter(
										(object: RoomDataObject) => object.roomid !== roomid
									)
									if (filteredRooms.length > 0) {
										const randomId = Math.floor(
											Math.random() * filteredRooms.length
										)
										const randomRoomObject: RoomDataObject =
											filteredRooms[randomId]
										leaveSocketRoom(roomid, peerid)
										enterSocketRoom(randomRoomObject.roomid, peerid)
									} else {
										leaveSocketRoom(roomid, peerid)
										enterSocketRoom(null, peerid)
									}
								} else {
									if (allRoomsData.length > 0) {
										const allRoomids = allRoomsData.map(
											(roomDataObject: RoomDataObject) => roomDataObject.roomid
										)
										const randomId = Math.floor(
											Math.random() * allRoomids.length
										)
										const randomRoom = allRoomids[randomId]
										enterSocketRoom(randomRoom, peerid)
									} else {
										enterSocketRoom(null, peerid)
									}
								}
							}
						}}>
						join random
					</div>
					<Link to='/welcome' style={{ textDecoration: "none" }}>
						<div
							className='join-options'
							onClick={() => {
								leaveSocketRoom(roomid, peerid)
								endAllCalls()
							}}>
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
