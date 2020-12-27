import { uuid } from "uuidv4"
import { userSettingsObject } from "../../../types/userSettingsObject"
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

const userDefinedSettings: userSettingsObject[] = [
	// {
	// 	settingsGroup: settingsGroup.inputs,
	// 	id: uuid(),
	// 	options: [
	// 		{
	// 			name: settingsName.input,
	// 			id: uuid(),
	// 			params: [
	// 				{
	// 					paramName: "connected?",
	// 					minVal: 0,
	// 					maxVal: 1,
	// 					value: 0,
	// 					id: uuid(),
	// 					rangeAmount: 'thousand'
	// 				},
	// 			],
	// 		},
	// 	],
	// },
]

export default userDefinedSettings
