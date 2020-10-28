import React from "react"

interface Props {
	name: string
	currentMenuName: string | null | undefined
	switchMenus: (menuName: string | null) => void
}
const MenuButton: React.FC<Props> = ({
	name,
	currentMenuName,
	switchMenus,
}) => {
	return (
		<div
			onClick={() => {
				if (currentMenuName === name) {
					switchMenus(null)
				} else {
					switchMenus(name)
				}
			}}
			className={
				currentMenuName === name ? "menu-button active" : "menu-button"
			}>
			{" "}
			<span>{name}</span>{" "}
		</div>
	)
}

export default MenuButton
