import React from "react"
import "./SettingsDisplay.css"
import { audioOption } from "../../../../../types/userSettingsObject"

interface Props {
	currentMenu: any
	updateEffect: (
		effectName: string,
		effectGroup: string,
		paramName: string,
		update: string | number
	) => void
}
const SettingsDisplay: React.FC<Props> = ({ currentMenu, updateEffect }) => (
	<div
		className={
			currentMenu !== null
				? "settings-display-container active"
				: "settings-display-container"
		}>
		{currentMenu ? currentMenu.name : ""}
		<div>
			{" "}
			{currentMenu
				? currentMenu.options.map((optionsObject: audioOption) => {
						if (optionsObject.name === "reverb") {
							console.log(optionsObject.params.decay)
							return (
								<input
									type='range'
									min={1}
									max={30}
									value={optionsObject.params.decay}
									onChange={e => {
										const update = e.target.value
										updateEffect(
											optionsObject.name,
											"environment",
											"decay",
											update
										)
									}}
									key={optionsObject.id}></input>
							)
						}
						return <div key={optionsObject.id}>{optionsObject.name}</div>
				  })
				: ""}
		</div>
	</div>
)

export default SettingsDisplay
