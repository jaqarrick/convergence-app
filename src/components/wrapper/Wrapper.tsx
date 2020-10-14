import React from "react"
import "./Wrapper.css"
import { Switch, Route, Redirect } from "react-router-dom"
import Welcome from "../welcome/Welcome"
import Room from "../room/Room"
import MainLogo from "./logos/MAIN_LOGO.svg"
import Info from "../info/Info"
import roomData from "../../data/roomData"

export default function Wrapper() {
	return (
		<div className='wrapper'>
			<Switch>
				<Route
					path='/room'
					render={props => <Room {...props} roomData={roomData} />}></Route>
				<Route path='/welcome'>
					<Welcome />
				</Route>
				<Route exact path='/'>
					<Redirect to='/room' />
				</Route>
			</Switch>
			<div className='logo-container'>
				<img src={MainLogo} alt='main logo' />
			</div>
			<Info />
		</div>
	)
}
