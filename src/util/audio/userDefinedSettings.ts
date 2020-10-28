import { uuid } from "uuidv4"
import { userSettingsObject } from "../../../types/userSettingsObject"
const userDefinedSettings: userSettingsObject[] = [
	{
		name: "inputs",
		id: uuid(),
		options: [
			{
				name: "input",
				id: uuid(),
				params: {
					isConnected: true,
				},
			},
		],
	},
	{
		name: "outputs",
		id: uuid(),
		options: [
			{
				name: "input",
				id: uuid(),
				params: {
					isConnected: true,
				},
			},
		],
	},
]

export default userDefinedSettings
