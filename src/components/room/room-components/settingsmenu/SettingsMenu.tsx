import React from "react"
import "./SettingsMenu.css"
import MenuButton from "./components/MenuButton"
import { userSettingsObject } from "../../../../../types/userSettingsObject"

interface Props {
	switchMenus: (menuName: string | null) => void
	currentMenuName: string | null | undefined
	menusList: userSettingsObject[]
}
const SettingsMenu: React.FC<Props> = ({
	switchMenus,
	menusList,
	currentMenuName,
}) => (
	<div className='settings-menu-container'>
		{" "}
		{menusList.map(object => (
			<MenuButton
				currentMenuName={currentMenuName}
				switchMenus={switchMenus}
				key={object.id}
				name={object.settingsGroup}
			/>
		))}{" "}
		{}
	</div>
)

export default SettingsMenu
