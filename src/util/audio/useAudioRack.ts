import { useCallback, useEffect, useMemo } from "react"
import * as Tone from "tone"
import AudioRackSettingsObject from "../../../types/AudioRackSettingsObject"

const ac = new AudioContext()
Tone.setContext(ac)

export default function useAudioRack(
	rackSettings: AudioRackSettingsObject,
	setConnected: (arg0: boolean) => void
) {
	const compressor = useMemo(() => new Tone.Compressor(), [])
	const delay = useMemo(() => new Tone.PingPongDelay(10), [])
	const reverb = useMemo(() => new Tone.Reverb(10), [])
	const baseGain = useMemo(() => ac.createGain(), [])

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
	}
}
