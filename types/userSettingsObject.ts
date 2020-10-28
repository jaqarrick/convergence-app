export interface userSettingsObject {
	name: string
	id: string
	options: audioOption[]
	//this should be audioOption[] | userAudioOption[]
}

export interface audioOption {
	name: string
	id: string
	params: any
}
