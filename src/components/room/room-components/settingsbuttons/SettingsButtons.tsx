import React, { useState } from "react"
import "./SettingsButtons.css"
import AudioOffButton from "./logos/audio-off-button.svg"
import AudioOnButton from "./logos/audio-on-button.svg"
import RecordButton from "./logos/record-button.svg"
import ConvergeButton from "./logos/converge-button.svg"

interface Props {}
const SettingsButtons: React.FC<Props> = () => {
	const [isAudioOn, setIsAudioOn] = useState<boolean>(true)
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [isConverging, setIsConverging] = useState<boolean>(false)

	return (
		<div className='settings-buttons'>
			<div
				onClick={() => setIsAudioOn(!isAudioOn)}
				className={
					isAudioOn ? "settings-button audio-active" : "settings-button"
				}>
				{" "}
				{isAudioOn ? (
					<img src={AudioOnButton} alt='audio on button' />
				) : (
					<img src={AudioOffButton} alt='audio off button' />
				)}
			</div>
			<div
				onClick={() => setIsConverging(!isConverging)}
				className={
					isConverging ? "settings-button converging-active" : "settings-button"
				}>
				{" "}
				<img src={ConvergeButton} alt='converge button'></img>
			</div>
			<div
				onClick={() => setIsRecording(!isRecording)}
				className={
					isRecording ? "settings-button recording-active" : "settings-button"
				}>
				<img src={RecordButton} alt='record button'></img>
			</div>
		</div>
	)
}

export default SettingsButtons
