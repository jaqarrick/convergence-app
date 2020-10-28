//default settings when client connects to new room

import { uuid } from "uuidv4"
import { userSettingsObject } from "../../../types/userSettingsObject"
const audioRackSettings: userSettingsObject[] = [
	{
		name: "environment",
		id: uuid(),
		options: [
			{
				name: "reverb",
				id: uuid(),
				params: {
					decay: 5,
				},
			},
		],
	},
	{
		name: "options",
		id: uuid(),
		options: [
			{
				name: "delay",
				id: uuid(),
				params: {},
			},
		],
	},
]

export default audioRackSettings
