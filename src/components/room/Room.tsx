import React, { useState } from "react"
import "./Room.css"
import SettingsMenu from "./room-components/settingsmenu/SettingsMenu"
import SettingsButtons from "./room-components/settingsbuttons/SettingsButtons"
import SettingsDisplay from "./room-components/settingsdisplay/SettingsDisplay"
import { SettingsListObject } from "../../types"

interface Props {}
const Room: React.FC<Props> = () => {
	const [settingsList] = useState<SettingsListObject[]>([
		{ id: 0, name: "environment" },
		{ id: 1, name: "effects" },
		{ id: 2, name: "inputs" },
		{ id: 3, name: "outputs" },
		{ id: 4, name: "invite" },
	])
	const [currentSetting, setCurrentSetting] = useState<string | null>(null)
	return (
		<div className='room-container'>
			<SettingsButtons />
			<SettingsMenu settingsList={settingsList} />
			<SettingsDisplay currentSetting={currentSetting} />
		</div>
	)
}

export default Room
