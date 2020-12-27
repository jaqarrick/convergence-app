//default settings when client connects to new room

import { v4 as uuid } from "uuid"
import { userSettingsObject } from "../../../types/userSettingsObject"

enum settingsName {
	delay = "DELAY",
	reverb = "REVERB",
	chorus = "CHORUS",
}

enum settingsGroup {
	environment = "ENVIRONMENT",
	effects = "EFFECTS",
}

const audioRackSettings: userSettingsObject[] = [
	{
		settingsGroup: settingsGroup.environment,
		id: uuid(),
		options: [
			{
				name: settingsName.reverb,
				id: uuid(),
				params: [
					{
						paramName: "wet",
						value: 0.5,
						maxVal: 1,
						minVal: 0,
						id: uuid(),
						rangeAmount: "normal",
					},
					{
						paramName: "decay",
						value: 5,
						minVal: 0,
						maxVal: 20,
						id: uuid(),
						rangeAmount: "ten",
					},
				],
			},
		],
	},
	{
		settingsGroup: settingsGroup.effects,
		id: uuid(),
		options: [
			{
				name: settingsName.delay,
				id: uuid(),
				params: [
					{
						paramName: "wet",
						value: 0.0,
						maxVal: 1.0,
						minVal: 0.0,
						id: uuid(),
						rangeAmount: "normal",
					},
					{
						paramName: "delayTime",
						value: 0.5,
						maxVal: 5,
						minVal: 0,
						id: uuid(),
						rangeAmount: "ten",
					},
					{
						paramName: "feedback",
						value: 0.2,
						maxVal: 1,
						minVal: 0,
						id: uuid(),
						rangeAmount: "normal",
					},
				],
			},
		],
	},
]

export default audioRackSettings
