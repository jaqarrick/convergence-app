import e from "express"
import { useCallback, useEffect, useMemo } from "react"
import Tone, {
	PitchShift,
	Context,
	Compressor,
	Gain,
	EQ3,
	ToneAudioNode,
} from "tone"
import AudioRackSettingsObject from "../../../types/AudioRackSettingsObject"
import settings from "./settings"

export default function useAudioRack(
	rackSettings: AudioRackSettingsObject,
	setConnected: (arg0: boolean) => void
) {
	const ac: AudioContext = useMemo(() => new AudioContext(), [])
	const eq3 = useMemo(() => new EQ3().connect(ac.destination), [ac])
	const compressor = useMemo(() => new Compressor(), [])
	const analyser = useMemo(() => ac.createAnalyser(), [ac])
	const context = useMemo(() => new Context(ac), [ac])
	const baseGain = useMemo(() => ac.createGain(), [])
	const gain = useMemo(() => new Gain(), [])

	useEffect(() => {
		baseGain.connect(analyser)
		Tone.connect(analyser, eq3)
		eq3.connect(compressor)
		compressor.connect(ac.destination)
	}, [baseGain, eq3, compressor])

	const connectStream = useCallback(
		(stream: MediaStream) => {
			console.log("call received")
			const src: MediaStreamAudioSourceNode = ac.createMediaStreamSource(stream)
			src.connect(baseGain)
			setConnected(true)
		},
		[ac, setConnected]
	)

	return {
		connectStream,
	}
}
