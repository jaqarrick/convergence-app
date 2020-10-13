import React from "react"
import "./Wrapper.css"
import { Switch, Route, Redirect } from "react-router-dom"
import Welcome from "../welcome/Welcome"
import Room from "../room/Room"
export default function Wrapper() {
	return (
		<div className='wrapper'>
			<Switch>
				<Route path='/room'>
					<Room />
				</Route>
				<Route path='/welcome'>
					<Welcome />
				</Route>
				<Route exact path='/'>
					<Redirect to='/welcome' />
				</Route>
			</Switch>
		</div>
	)
}
