import React from "react"
import "./SettingsDisplay.css"
import {
	audioOption,
	ParamsObject,
	userSettingsObject,
} from "../../../../../types/userSettingsObject"

interface Props {
	currentMenu: userSettingsObject | null | undefined
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
											min={paramsObject.minVal}
											max={paramsObject.maxVal}
											value={paramsObject.value}
											onChange={e => console.log(e.target.value)}
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
