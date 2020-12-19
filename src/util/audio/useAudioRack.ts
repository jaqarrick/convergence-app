import { useCallback, useEffect, useMemo, useState } from "react"
import * as Tone from "tone"
import { ToneAudioNode } from "tone"
import { NormalRange } from "tone/build/esm/core/type/Units"
import download from "downloadjs"
import {
	userSettingsObject,
	ParamsObject,
	audioOption,
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
	setRoomAudioSettings: any, //fix this
	roomAudioSettings: userSettingsObject[],
	socket: any,
	isRecording: boolean,
	isUserAudioOn: boolean,
	setStream: (stream: MediaStream) => void
) {
	const compressor = useMemo(() => new Tone.Compressor(-20, 4), [])

	const [delay, setDelay] = useState<ToneAudioNode>(new Tone.PingPongDelay())

	//update delay on update settings
	useEffect(
		() =>
			setDelay((prevDelay: ToneAudioNode) => {
				prevDelay.dispose()
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
			}),
		[setDelay, roomAudioSettings]
	)

	const baseToneVol = useMemo(() => new Tone.Volume(), [])

	const [reverb, setReverb] = useState<ToneAudioNode>(new Tone.Reverb())
	//update reverb on change settings
	useEffect(
		() =>
			setReverb((prevReverb: ToneAudioNode) => {
				prevReverb.dispose()
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
			}),

		[roomAudioSettings]
	)

	const [userVol, setUserVol] = useState<ToneAudioNode>(
		new Tone.Volume({ mute: true })
	)

	useEffect(() => {
		if (isUserAudioOn) {
			setUserVol((prevVol: ToneAudioNode) => {
				prevVol.dispose()

				return new Tone.Volume({ mute: false })
			})
		} else if (!isUserAudioOn) {
			setUserVol((prevVol: any) => {
				prevVol.dispose()
				return new Tone.Volume({ mute: true })
			})
		}
	}, [setUserVol, isUserAudioOn])

	const [userMeter] = useState<any>(new Tone.Meter())
	const [userAmpVal] = useState<number>(10)
	// useEffect(() => {
	// 	setInterval(() => {
	// 		setUserAmpVal(
	// 			userMeter.getValue() < -35 ? 5 : 70 + userMeter.getValue() * 2
	// 		)
	// 	}, 100)
	// }, [setUserAmpVal])

	const connectUserStream = useCallback(
		(mediaStream: MediaStream) => {
			let a: HTMLAudioElement | null = new Audio()
			a.muted = true
			a.srcObject = mediaStream
			a.addEventListener("canplaythrough", () => {
				a = null
			})
			const src = ac.createMediaStreamSource(mediaStream)
			Tone.connect(src, userVol)
			const dest = ac.createMediaStreamDestination()
			userVol.fan(userMeter, baseToneVol)
			Tone.connect(userVol, dest)
			setStream(dest.stream)
		},
		[setStream, baseToneVol, userVol, userMeter]
	)

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
	// useEffect(() => console.log(chorus), [chorus])
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>()

	const startRecording = useCallback(() => {
		if (mediaRecorder) {
			mediaRecorder.start()
		}
	}, [mediaRecorder])

	const stopRecording = useCallback(() => {
		if (mediaRecorder && mediaRecorder.state === "recording") {
			mediaRecorder.stop()
		}
	}, [mediaRecorder])

	const downloadAudio = useCallback((data: BlobPart[]) => {
		const blob = new Blob(data, {
			type: "audio/wav; codecs=MS_PCM",
		})
		download(blob, "converge.wav", "audio/wav")
	}, [])
	const createRecording = useCallback(
		e => {
			let chunks = []
			chunks.push(e.data)
			downloadAudio(chunks)
		},
		[downloadAudio]
	)
	useEffect(() => {
		mediaRecorder?.addEventListener("dataavailable", createRecording)
	}, [mediaRecorder, createRecording])

	useEffect(() => {
		if (isRecording) {
			startRecording()
		}
		if (!isRecording) {
			stopRecording()
		}
	}, [isRecording, startRecording, stopRecording])

	const masterLimiter = useMemo(() => new Tone.Limiter(-10), [])

	const [hasCompletedChain, setHasCompletedChain] = useState<boolean>(false)
	const completeChain = useCallback(() => {
		if (!hasCompletedChain) {
			const recordingDestination: MediaStreamAudioDestinationNode = ac.createMediaStreamDestination()
			masterLimiter.fan(ac.destination, recordingDestination)
			setMediaRecorder(new MediaRecorder(recordingDestination.stream))
		}
	}, [hasCompletedChain, setMediaRecorder, masterLimiter])
	useEffect(() => {
		Tone.connect(compressor, baseToneVol)
		// Tone.connect(baseToneVol, chorus)
		Tone.connect(baseToneVol, delay)
		// Tone.connect(chorus, delay)
		baseToneVol.mute = false
		Tone.connect(delay, reverb)
		Tone.connect(reverb, masterLimiter)
		setHasCompletedChain(true)
		completeChain()
	}, [completeChain, compressor, reverb, delay, baseToneVol, masterLimiter])

	useEffect(() => {
		baseGain.gain.value = 2
		Tone.connect(baseGain, compressor)
	}, [baseGain, baseToneVol, compressor])

	const connectStream = useCallback(
		(stream: MediaStream) => {
			console.log("stream connecting")
			let a: HTMLAudioElement | null = new Audio()
			a.muted = true
			a.srcObject = stream
			a.addEventListener("canplaythrough", () => {
				a = null
			})
			const src = ac.createMediaStreamSource(stream)
			Tone.connect(src, baseGain)
		},
		[baseGain]
	)

	return {
		connectUserStream,
		connectStream,
		updateSetting,
		userAmpVal,
	}
}
