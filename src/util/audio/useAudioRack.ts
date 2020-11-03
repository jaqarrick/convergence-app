import { useCallback, useEffect, useMemo } from "react"
import * as Tone from "tone"
import { optionsFromArguments } from "tone"
import {
	userSettingsObject,
	audioOption,
} from "../../../types/userSettingsObject"

const ac = new AudioContext()
Tone.setContext(ac)

export default function useAudioRack(
	setConnected: (arg0: boolean) => void,
	setRoomAudioSettings: any, //fix this
	roomAudioSettings: userSettingsObject[],
	socket: any,
	roomid?: string | null | undefined
) {
	const getInitSettings = useCallback(
		(settingType: string, settingName: string) => {
			//get the current settings object
			const currentSettingType = roomAudioSettings.find(
				(setting: userSettingsObject) => setting.name === settingType
			)

			//find the effect in 'options'
			if (currentSettingType) {
				const currentSetting = currentSettingType.options.find(
					(option: audioOption) => option.name === settingName
				)

				if (currentSetting && currentSetting.params) {
					return currentSetting.params
				}
			}
			//return object of params
		},
		[roomAudioSettings]
	)
	const compressor = useMemo(() => new Tone.Compressor(), [])
	const delay = useMemo(() => {
		const params = getInitSettings("effects", "delay")
		const { wet, delayTime, feedback } = params
		const _delay = new Tone.PingPongDelay(delayTime, feedback)
		return _delay
	}, [getInitSettings])
	const baseToneVol = useMemo(() => new Tone.Volume(), [])
	const reverb = useMemo(() => new Tone.Reverb(5), [])
	const baseGain = useMemo(() => ac.createGain(), [])

	const updateReverb = useCallback(() => {
		const parentObj = roomAudioSettings.find(
			(setting: userSettingsObject) => setting.name === "environment"
		)
		const reverbOptions = parentObj?.options.find(
			(optionObject: audioOption) => optionObject.name === "reverb"
		)
		reverb.decay = reverbOptions?.params.decay
	}, [reverb, roomAudioSettings])

	useEffect(updateReverb, [roomAudioSettings])
	const updateEffect = useCallback(
		(
			effectName: string,
			effectGroup: string,
			paramName: string,
			update: string | number
		) => {
			setRoomAudioSettings((prev: userSettingsObject[]) => {
				const updatedSettings = prev.map(
					(settingsObject: userSettingsObject) => {
						if (settingsObject.name === effectGroup) {
							settingsObject.options.map((option: audioOption) => {
								if (option.name === effectName) {
									option.params.decay = update
									return option
								}
								return option
							})
						}
						return settingsObject
					}
				)
				if (roomid) {
					socket.emit("send updated room audio settings", {
						roomid,
						updatedSettings,
					})
				}
				return updatedSettings
			})
		},
		[setRoomAudioSettings, roomid, socket]
	)

	useEffect(() => {
		Tone.connect(compressor, baseToneVol)
		Tone.connect(baseToneVol, delay)
		baseToneVol.mute = false
		Tone.connect(delay, reverb)
		Tone.connect(reverb, ac.destination)
	}, [compressor, reverb, delay, baseToneVol])
	useEffect(() => {
		baseGain.gain.value = 2
		Tone.connect(baseGain, compressor)
	}, [baseGain, compressor, baseToneVol])

	const connectStream = useCallback(
		(stream: MediaStream) => {
			const src = ac.createMediaStreamSource(stream)
			console.log(src)
			Tone.connect(src, baseGain)
			setConnected(true)
		},
		[setConnected, baseGain]
	)

	return {
		connectStream,
		updateEffect,
	}
}
