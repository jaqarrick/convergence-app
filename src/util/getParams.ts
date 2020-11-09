import {
	userSettingsObject,
	audioOption,
	ParamsObject,
} from "../.././types/userSettingsObject"

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
export const getParamsArray = (
	allSettings: userSettingsObject[],
	settingsGroup: settingsGroup,
	settingsName: settingsName
): ParamsObject[] | undefined => {
	//find the current settings group
	const currentSettingsGroupObject = () =>
		allSettings.find(
			(userSettingsObject: userSettingsObject) =>
				userSettingsObject.settingsGroup === settingsGroup
		)
	const currentSettingsObject = () =>
		currentSettingsGroupObject()?.options.find(
			(audioOptionObject: audioOption) =>
				audioOptionObject.name === settingsName
		)

	return currentSettingsObject()?.params
}

export const getParamsObject = (
	paramsArray: ParamsObject[],
	paramName: string
): ParamsObject | undefined =>
	paramsArray.find(
		(paramsObject: ParamsObject) => paramsObject.paramName === paramName
	)
