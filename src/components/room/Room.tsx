import React, { useCallback, useEffect, useState } from "react"
import "./Room.css"
import { RouteChildrenProps } from "react-router-dom"
import SettingsMenu from "./room-components/settingsmenu/SettingsMenu"
import SettingsButtons from "./room-components/settingsbuttons/SettingsButtons"
import SettingsDisplay from "./room-components/settingsdisplay/SettingsDisplay"
import { userSettingsObject } from "../../../types/userSettingsObject"
import userDefinedSettings from "../../util/audio/userDefinedSettings"

interface RouteProps extends RouteChildrenProps<{ roomid: string }> {}
interface PassedProps {
	roomid: string | undefined | null
	roomAudioSettings: userSettingsObject[]
	setRoomAudioSettings: (settings: userSettingsObject[]) => void
	updateEffect: (
		effectName: string,
		effectGroup: string,
		paramName: string,
		update: string | number
	) => void
}

const Room: React.FC<PassedProps & RouteProps> = ({
	match,
	roomid,
	roomAudioSettings,
	updateEffect,
}) => {
	const [currentMenu, setCurrentMenu] = useState<any>(null)

	const [userSettings, setUserSettings] = useState<userSettingsObject[]>(
		userDefinedSettings
	)

	const [menusList, setMenusList] = useState<userSettingsObject[]>([
		...userSettings,
		...roomAudioSettings,
	])
	const switchMenus = useCallback(
		(menuName: string | null) => {
			const current = menusList.find(({ name }) => name === menuName)
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
			<SettingsButtons />
			<SettingsMenu
				switchMenus={switchMenus}
				currentMenuName={currentMenu?.name}
				menusList={menusList}
			/>
			<SettingsDisplay currentMenu={currentMenu} updateEffect={updateEffect} />
			<h5
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
				}}>
				{" "}
				{roomid}{" "}
			</h5>
		</div>
	)
}

export default Room
