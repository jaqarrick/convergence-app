import React from "react"
import "./SettingsButtons.css"
import AudioOffButton from "./logos/audio-on-button.svg"
import AudioOnButton from "./logos/audio-off-button.svg"
import RecordButton from "./logos/record-button.svg"
import ConvergeButton from "./logos/converge-button.svg"

interface Props {}
const SettingsButtons: React.FC<Props> = () => (
	<div className='settings-buttons'>
		<div className='settings-button'>
			{" "}
			<img src={AudioOnButton} alt='audio on button'></img>
		</div>
		<div className='settings-button'>
			{" "}
			<img src={ConvergeButton} alt='converge button'></img>
		</div>
		<div className='settings-button'>
			<img src={RecordButton} alt='record button'></img>
		</div>
	</div>
)

export default SettingsButtons
