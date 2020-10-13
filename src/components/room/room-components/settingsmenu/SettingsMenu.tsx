import React from "react"
import "./SettingsMenu.css"
import { SettingsListObject } from "../../../../types"
import MenuButton from "./components/MenuButton"

interface Props {
	settingsList: SettingsListObject[]
}
const SettingsMenu: React.FC<Props> = ({ settingsList }) => (
	<div className='settings-menu-container'>
		{" "}
		{settingsList.map(object => (
			<MenuButton key={object.id} name={object.name} />
		))}{" "}
	</div>
)

export default SettingsMenu
