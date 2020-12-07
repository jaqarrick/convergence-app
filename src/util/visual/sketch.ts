import p5 from "p5"

const s = (
	sketch: any,
	amplitude = 5,
	canvasWidth: number = 1000,
	canvasHeight: number = 400
) => {
	let xspacing = 1 // Distance between each horizontal location
	let w // Width of entire wave
	let theta = 0.1 // Start angle at 0
	// let amplitude = 0 // Height of wave
	let period = canvasWidth // How many pixels before the wave repeats
	let dx: any // Value for incrementing x
	let yvalues: any // Using an array to store height values for the wave

	sketch.setup = () => {
		sketch.createCanvas(canvasWidth, canvasHeight) // constants for window height and width? resize(){}
		w = sketch.width + 16
		dx = (sketch.TWO_PI / period) * xspacing
		yvalues = new Array(Math.floor(w / xspacing))
	}

	const renderWave = () => {
		sketch.noStroke()
		sketch.fill(150, 20, 200)
		// A simple way to draw the wave with an ellipse at each location
		for (let x = 0; x < yvalues.length; x++) {
			// ellipse(x * xspacing, height / 2 + yvalues[x], 2, 2)
			// stroke(10)
			sketch.ellipse(x * xspacing, sketch.height / 2 + yvalues[x], 5, 5)
		}
	}

	const calcWave = () => {
		// Increment theta (try different values for
		// 'angular velocity' here)
		theta += 0.1

		// For every x value, calculate a y value with sine function
		let x = theta
		for (let i = 0; i < yvalues.length; i++) {
			yvalues[i] = sketch.sin(x) * amplitude
			x += dx
		}
	}
	sketch.draw = () => {
		sketch.background(255)
		calcWave()
		renderWave()
	}
}

export default s
