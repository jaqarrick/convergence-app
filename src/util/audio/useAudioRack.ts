import { useCallback, useEffect, useMemo } from "react"
import * as Tone from "tone"
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
	roomid?: string
) {
	const compressor = useMemo(() => new Tone.Compressor(), [])
	const delay = useMemo(() => new Tone.PingPongDelay(1), [])
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
		Tone.connect(compressor, delay)
		Tone.connect(delay, reverb)
		Tone.connect(reverb, ac.destination)
	}, [compressor, reverb, delay])
	useEffect(() => {
		baseGain.gain.value = 2
		Tone.connect(baseGain, compressor)
	}, [baseGain, compressor])

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
