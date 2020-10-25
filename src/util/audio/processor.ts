import { Compressor } from "tone"
import settings from "./settings.json"

class EffectsRack {
	volume: number

	constructor() {
		this.volume = settings.volume
	}

	updateVol = (newVol: number) => {
		this.volume = newVol
	}
}

export default EffectsRack
