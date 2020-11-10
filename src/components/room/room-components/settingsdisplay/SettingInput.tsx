import { Settings } from "http2"
import React, { ChangeEvent, useCallback, useState } from "react"
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
	value: number | NormalRange
	maxVal: number
	minVal: number
	rangeAmount: string
	settingsGroup: settingsGroup
	settingsName: settingsName
	paramName: string
	updateSetting: (
		settingsGroup: settingsGroup,
		settingsName: settingsName,
		paramName: string,
		updatedValue: number | NormalRange
	) => void
}
const SettingsInput: React.FC<Props> = ({
	updateSetting,
	value,
	maxVal,
	minVal,
	rangeAmount,
	settingsGroup,
	settingsName,
	paramName,
}) => {
	const [currentValue, setCurrentValue] = useState<number>(value)
	const handleInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setCurrentValue(Number(e.target.value))
		},
		[setCurrentValue]
	)

	return (
		<input
			type='range'
			min={rangeAmount === "normal" ? minVal * 1000 : minVal}
			value={currentValue}
			max={rangeAmount === "normal" ? maxVal * 1000 : maxVal}
			onChange={handleInput}
			onMouseUp={(e: any) => {
				const valueToUpdate =
					rangeAmount === "normal"
						? Number(e.target.value) / 1000
						: Number(e.target.value)
				updateSetting(settingsGroup, settingsName, paramName, valueToUpdate)
			}}
		/>
	)
}

export default SettingsInput
