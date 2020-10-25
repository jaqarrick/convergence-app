import React, { useCallback, useState } from "react"
import "./Room.css"
import { RouteChildrenProps } from "react-router-dom"
import SettingsMenu from "./room-components/settingsmenu/SettingsMenu"
import SettingsButtons from "./room-components/settingsbuttons/SettingsButtons"
import SettingsDisplay from "./room-components/settingsdisplay/SettingsDisplay"
import SettingsMenuButtonObject from "../../../types/SettingsMenuButtonObject"

interface RouteProps extends RouteChildrenProps<{ roomid: string }> {}
interface PassedProps {
	roomData: any[]
	roomid: string | undefined | null
}
const Room: React.FC<PassedProps & RouteProps> = ({
	roomData,
	match,
	roomid,
}) => {
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
