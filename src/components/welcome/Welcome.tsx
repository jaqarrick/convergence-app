import React from "react"
import "./Welcome.css"
// import { v4 as uuidv4 } from "uuid"
import TextBanner from "../textbanner/TextBanner"
import Wave from "../wave/Wave"
interface Props {}
const Welcome: React.FC<Props> = () => {
	return (
		<div className='welcome-container'>
			<div className={"text-banner-container upper-container"}>
				<TextBanner direction={"left"} />
			</div>
			<div className={"text-banner-container lower-container"}>
				<TextBanner direction={"right"} />
			</div>
			<Wave numberOfPeers={1} />
		</div>
	)
}

export default Welcome
