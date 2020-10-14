import React, { useCallback, useState } from "react"
import "./Room.css"
import SettingsMenu from "./room-components/settingsmenu/SettingsMenu"
import SettingsButtons from "./room-components/settingsbuttons/SettingsButtons"
import SettingsDisplay from "./room-components/settingsdisplay/SettingsDisplay"
import { SettingsMenuButtonObject } from "../../types"

interface Props {
	roomData: any[]
}
const Room: React.FC<Props> = ({ roomData }) => {
	const [currentMenu, setCurrentMenu] = useState<any>(null)

	const switchMenus = useCallback(
		(menuName: string | null) => {
			const current = roomData.find(({ name }) => name === menuName)
			if (current) {
				setCurrentMenu(current)
			} else {
				setCurrentMenu(null)
			}
		},
		[setCurrentMenu, roomData]
	)

	const [menusList] = useState<SettingsMenuButtonObject[]>(
		roomData.map((object, i) => {
			return {
				name: object.name,
				id: i,
			}
		})
	)

	return (
		<div className='room-container'>
			<SettingsButtons />
			<SettingsMenu
				switchMenus={switchMenus}
				currentMenuName={currentMenu?.name}
				menusList={menusList}
			/>
			<SettingsDisplay currentMenu={currentMenu} />
		</div>
	)
}

export default Room
