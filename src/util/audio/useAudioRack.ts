import { useCallback, useEffect, useMemo, useState } from "react"
import * as Tone from "tone"
import { Chorus, Recorder, Signal } from "tone"
import { NormalRange } from "tone/build/esm/core/type/Units"
import {
	userSettingsObject,
	audioOption,
	ParamsObject,
} from "../../../types/userSettingsObject"
import { getParamsArray, getParamsObject } from "../getParams"

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

const ac = new AudioContext()
Tone.setContext(ac)

export default function useAudioRack(
	setConnected: (arg0: boolean) => void,
	setRoomAudioSettings: any, //fix this
	roomAudioSettings: userSettingsObject[],
	socket: any,
	isRecording: boolean,
	setIsRecording: (isRecording: boolean) => void
) {
	const compressor = useMemo(() => new Tone.Compressor(), [])
	const chorus = useMemo(() => {
		const params = getParamsArray(
			roomAudioSettings,
			settingsGroup.effects,
			settingsName.chorus
		)
		const wet: ParamsObject | undefined = params
			? getParamsObject(params, "wet")
			: undefined
		const fr: ParamsObject | undefined = params
			? getParamsObject(params, "frequency")
			: undefined
		const delayTime: ParamsObject | undefined = params
			? getParamsObject(params, "delayTime")
			: undefined
		const depth: ParamsObject | undefined = params
			? getParamsObject(params, "depth")
			: undefined

		return new Chorus({
			wet: wet?.value,
			frequency: fr?.value,
			delayTime: delayTime?.value,
			depth: depth?.value,
		})
	}, [roomAudioSettings])
	const delay = useMemo(() => {
		const params = getParamsArray(
			roomAudioSettings,
			settingsGroup.effects,
			settingsName.delay
		)

		const delayTime: ParamsObject | undefined = params
			? getParamsObject(params, "delayTime")
			: undefined
		const wet: ParamsObject | undefined = params
			? getParamsObject(params, "wet")
			: undefined
		const feedback: ParamsObject | undefined = params
			? getParamsObject(params, "feedback")
			: undefined
		return new Tone.PingPongDelay({
			delayTime: delayTime?.value,
			feedback: feedback?.value,
			wet: wet?.value,
		})
	}, [roomAudioSettings])

	const baseToneVol = useMemo(() => new Tone.Volume(), [])
	const reverb = useMemo(() => {
		const params = getParamsArray(
			roomAudioSettings,
			settingsGroup.environment,
			settingsName.reverb
		)

		const decay: ParamsObject | undefined = params
			? getParamsObject(params, "decay")
			: undefined

		const wet: ParamsObject | undefined = params
			? getParamsObject(params, "wet")
			: undefined
		return new Tone.Reverb({
			decay: decay?.value,
			wet: wet?.value,
		})
	}, [roomAudioSettings])
	const baseGain = useMemo(() => ac.createGain(), [])

	const updateSetting = useCallback(
		(
			settingsGroup: settingsGroup,
			settingsName: settingsName,
			paramName: string,
			updatedValue: number | NormalRange
		) =>
			setRoomAudioSettings((prevSettings: userSettingsObject[]) =>
				prevSettings.map((userSettingsObject: userSettingsObject) => {
					if (userSettingsObject.settingsGroup === settingsGroup) {
						//return updated userSEttingsObject with different
						userSettingsObject.options = userSettingsObject.options.map(
							(audioOption: audioOption) => {
								if (audioOption.name === settingsName) {
									audioOption.params = audioOption.params.map(
										(paramsObject: ParamsObject) => {
											if (paramsObject.paramName === paramName) {
												paramsObject.value = updatedValue
											}
											return paramsObject
										}
									)
								}
								return audioOption
							}
						)
					}
					return userSettingsObject
				})
			),
		[setRoomAudioSettings]
	)
	useEffect(() => console.log(delay), [delay])
	useEffect(() => {
		Tone.connect(compressor, baseToneVol)
		Tone.connect(baseToneVol, chorus)
		Tone.connect(chorus, delay)
		baseToneVol.mute = false
		Tone.connect(delay, reverb)
		Tone.connect(reverb, ac.destination)
		// reverb.fan(ac.destination, ac.destination)
	}, [compressor, reverb, delay, baseToneVol, chorus])
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

	useEffect(() => console.log(isRecording), [isRecording])

	//set up tone recorder

	useEffect(() => {
		console.log(isRecording)
	}, [isRecording])

	return {
		connectStream,
		updateSetting,
	}
}
