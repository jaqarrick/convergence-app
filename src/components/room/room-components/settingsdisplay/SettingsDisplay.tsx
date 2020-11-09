import React from "react"
import "./SettingsDisplay.css"
import {
	audioOption,
	ParamsObject,
	userSettingsObject,
} from "../../../../../types/userSettingsObject"
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

interface Props {
	currentMenu: userSettingsObject | null | undefined
	updateSetting: (
		settingsGroup: settingsGroup,
		settingsName: settingsName,
		paramName: string,
		updatedValue: number | NormalRange
	) => void
}
const SettingsDisplay: React.FC<Props> = ({ currentMenu, updateSetting }) => (
	<div
		className={
			currentMenu !== null
				? "settings-display-container active"
				: "settings-display-container"
		}>
		<div className='settings-display'>
			{currentMenu?.options.map((audioOptionsObject: audioOption) => {
				return (
					<div key={audioOptionsObject.id} className='option-container'>
						<div className='option-name'> {audioOptionsObject.name} </div>
						<div className='params-container'>
							{audioOptionsObject.params.map((paramsObject: ParamsObject) => {
								return (
									<div key={paramsObject.id} className='param-container'>
										<div className='param-name'> {paramsObject.paramName}</div>
										<input
											type='range'
											min={
												paramsObject.rangeAmount === "normal"
													? paramsObject.minVal * 1000
													: paramsObject.minVal
											}
											max={
												paramsObject.rangeAmount === "normal"
													? paramsObject.maxVal * 1000
													: paramsObject.maxVal
											}
											value={
												paramsObject.rangeAmount === "normal"
													? paramsObject.value * 1000
													: paramsObject.value
											}
											onChange={e => {
												const valueToUpdate =
													paramsObject.rangeAmount === "normal"
														? Number(e.target.value) / 1000
														: Number(e.target.value)
												updateSetting(
													currentMenu.settingsGroup,
													audioOptionsObject.name,
													paramsObject.paramName,
													valueToUpdate
												)
											}}
										/>
										<div className='param-value-container'>
											<div className='param-value'>{paramsObject.value} </div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	</div>
)

export default SettingsDisplay
