import React from "react"
import "./SettingsButtons.css"
import AudioOffButton from "./logos/audio-off-button.svg"
import AudioOnButton from "./logos/audio-on-button.svg"
import RecordButton from "./logos/record-button.svg"
// import ConvergeButton from "./logos/converge-button.svg"

interface Props {
	setIsRecording: (isRecording: boolean) => void
	isRecording: boolean
	isUserAudioOn: boolean
	setIsUserAudioOn: (isUserAudioOn: boolean) => void
}

const SettingsButtons: React.FC<Props> = ({
	setIsRecording,
	isRecording,
	isUserAudioOn,
	setIsUserAudioOn,
}) => (
	<div className='settings-buttons'>
		<div
			onClick={() => setIsUserAudioOn(!isUserAudioOn)}
			className={
				isUserAudioOn ? "settings-button audio-active" : "settings-button"
			}>
			{" "}
			{isUserAudioOn ? (
				<img src={AudioOnButton} alt='audio on button' />
			) : (
				<img src={AudioOffButton} alt='audio off button' />
			)}
		</div>
		{/* <div
				onClick={() => setIsConverging(!isConverging)}
				className={
					isConverging ? "settings-button converging-active" : "settings-button"
				}>
				{" "}
				<img src={ConvergeButton} alt='converge button'></img>
			</div> */}
		<div
			onClick={() => setIsRecording(!isRecording)}
			className={
				isRecording ? "settings-button recording-active" : "settings-button"
			}>
			<img src={RecordButton} alt='record button'></img>
		</div>
	</div>
)

export default SettingsButtons
