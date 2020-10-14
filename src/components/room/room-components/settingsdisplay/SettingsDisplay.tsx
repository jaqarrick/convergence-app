import React from "react"
import "./SettingsDisplay.css"

interface Props {
	currentMenu: any
}
const SettingsDisplay: React.FC<Props> = ({ currentMenu }) => (
	<div
		className={
			currentMenu !== null
				? "settings-display-container active"
				: "settings-display-container"
		}>
		{currentMenu ? currentMenu.name : ""}
	</div>
)

export default SettingsDisplay
