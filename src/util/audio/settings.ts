//default settings when client connects to new room

import { v4 as uuid } from "uuid"
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
					wet: 0.5,
				},
			},
		],
	},
	{
		name: "effects",
		id: uuid(),
		options: [
			{
				name: "delay",
				id: uuid(),
				params: {
					wet: 0.5,
					delayTime: 0.5,
					feedback: 0.2,
				},
			},
			{
				name: "delay",
				id: uuid(),
				params: {
					wet: 0.1,
					frequency: 2,
					delayTime: 500,
					depth: 0.5,
				},
			},
			{
				name: "distortion",
				id: uuid(),
				params: {
					wet: 0.0,
					distortion: 0,
				},
			},
		],
	},
]

export default audioRackSettings
