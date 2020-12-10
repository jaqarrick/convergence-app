import React, { useCallback, useEffect, useState } from "react"
import "./Room.css"
import { RouteChildrenProps } from "react-router-dom"
import SettingsMenu from "./room-components/settingsmenu/SettingsMenu"
import SettingsButtons from "./room-components/settingsbuttons/SettingsButtons"
import SettingsDisplay from "./room-components/settingsdisplay/SettingsDisplay"
import { userSettingsObject } from "../../../types/userSettingsObject"
import userDefinedSettings from "../../util/audio/userDefinedSettings"
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
interface RouteProps extends RouteChildrenProps<{ roomid: string }> {}
interface PassedProps {
	isUserAudioOn: boolean
	setIsUserAudioOn: (isUserAudioOn: boolean) => void
	roomid: string | undefined | null
	roomAudioSettings: userSettingsObject[]
	setRoomAudioSettings: (settings: userSettingsObject[]) => void
	setIsRecording: (isRecording: boolean) => void
	updateSetting: (
		settingsGroup: settingsGroup,
		settingsName: settingsName,
		paramName: string,
		updatedValue: number | NormalRange
	) => void
	isRecording: boolean
}

const Room: React.FC<PassedProps & RouteProps> = ({
	match,
	roomid,
	roomAudioSettings,
	updateSetting,
	setIsRecording,
	isRecording,
	setIsUserAudioOn,
	isUserAudioOn,
}) => {
	const [currentMenu, setCurrentMenu] = useState<
		userSettingsObject | null | undefined
	>(null)

	const [userSettings, setUserSettings] = useState<userSettingsObject[]>(
		userDefinedSettings
	)

	const [menusList, setMenusList] = useState<userSettingsObject[]>([
		...userSettings,
		...roomAudioSettings,
	])

	useEffect(() => {
		setMenusList([...userSettings, ...roomAudioSettings])
	}, [roomAudioSettings, userSettings, setMenusList])

	const switchMenus = useCallback(
		(menuName: string | null | undefined) => {
			const current = menusList.find(
				(settingsObject: userSettingsObject) =>
					settingsObject.settingsGroup === menuName
			)
			if (current) {
				setCurrentMenu(current)
			} else {
				setCurrentMenu(null)
			}
		},
		[setCurrentMenu, menusList]
	)

	return (
		<div className='room-container'>
			<SettingsButtons
				setIsRecording={setIsRecording}
				isRecording={isRecording}
				isUserAudioOn={isUserAudioOn}
				setIsUserAudioOn={setIsUserAudioOn}
			/>
			<SettingsMenu
				switchMenus={switchMenus}
				currentMenuName={currentMenu?.settingsGroup}
				menusList={menusList}
			/>
			<SettingsDisplay
				currentMenu={currentMenu}
				updateSetting={updateSetting}
			/>
		</div>
	)
}

export default Room
