import { useEffect, useMemo } from "react"
import { Compressor, Gain } from "tone"
import AudioRackSettingsObject from "../../../types/AudioRackSettingsObject"
import settings from "./settings"

export default function useAudioRack(rackSettings: AudioRackSettingsObject) {
	const ac: AudioContext = useMemo(() => new AudioContext(), [])
	const masterGain = useMemo(() => ac.createGain, [ac])
}
