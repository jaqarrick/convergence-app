export interface userSettingsObject {
	settingsGroup: settingsGroup
	id: string
	options: audioOption[]
	//this should be audioOption[] | userAudioOption[]
}

export interface audioOption {
	name: settingsName
	id: string
	params: ParamsObject[]
}

export interface ParamsObject {
	paramName: string
	minVal: number
	maxVal: number
	value: number
	id: string
}

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
