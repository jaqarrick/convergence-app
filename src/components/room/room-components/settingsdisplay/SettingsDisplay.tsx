import React from "react"
import "./SettingsDisplay.css"

interface Props {
	currentSetting: null | string
}
const SettingsDisplay: React.FC<Props> = ({ currentSetting }) => (
	<div className='settings-display-container'>
		{" "}
		Settings Display: {currentSetting}{" "}
	</div>
)

export default SettingsDisplay
