import React from "react"
import SettingsButtons from "../../settingsbuttons/SettingsButtons"

interface Props {
	name: string
}
const MenuButton: React.FC<Props> = ({ name }) => {
	return (
		<div className='menu-button'>
			{" "}
			<span>{name}</span>{" "}
		</div>
	)
}

export default MenuButton
