'use strict'

const vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
	// convert position from pixels to [0.0, 1.0]
	vec2 zeroToOne = a_position / u_resolution;

	// convert from [0.0, 1.0] -> [0.0, 2.0]
	vec2 zeroToTwo = zeroToOne * 2.0;

	// convert from [0.0, 2.0] -> [-1.0, 1.0]
	vec2 clipSpace = zeroToTwo - 1.0;

	// this gives us a coordinate space that is a lot like the Cartesian plane
	// (where +y is up and -y is down) -- if we want something that's more like
	// the SVG plane, we can multiply clipSpace by vec2(1, -1)
	gl_Position = vec4(clipSpace, 0, 1);
}
`

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
	outColor = u_color;
}
`

function createShader (gl, type, source) {
	const shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (success) {
		return shader
	}

	console.log(gl.getShaderInfoLog(shader))
	gl.deleteShader(shader)
}

function createProgram (gl, vertexShader, fragmentShader) {
	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const success = gl.getProgramParameter(program, gl.LINK_STATUS)
	if (success) {
		return program
	}

	console.log(gl.getProgramInfoLog(program))
	gl.deleteProgram(program)
}

function resize (canvas) {
	const devicePixelRatio = window.devicePixelRatio || 1

	// Lookup the dimensions of the canvas displayed by the browser.
	const displayWidth = Math.floor(canvas.clientWidth * devicePixelRatio)
	const displayHeight = Math.floor(canvas.clientHeight * devicePixelRatio)

	if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
		canvas.width = displayWidth
		canvas.height = displayHeight
	}
}

function setRectangle (gl, x, y, width, height) {
	const x1 = x
	const x2 = x + width
	const y1 = y
	const y2 = y + height

	// Normally, you would bind a new buffer to ARRAY_BUFFER before invoking
	// bufferData to copy the rectangle vertices to the GPU, but since we're
	// only using a single buffer, that doesn't matter.

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2
	]), gl.STATIC_DRAW)
}

function randInt (range) {
	return Math.floor(Math.random() * range)
}

function main () {
	const canvas = document.querySelector('#canvas')
	const gl = canvas.getContext('webgl2')

	if (gl === null) {
		alert('Unable to initialize WebGL.')
		return
	}

	// Create WebGL program.
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
	const program = createProgram(gl, vertexShader, fragmentShader)

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

	const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
	const vao = gl.createVertexArray()
	gl.bindVertexArray(vao)
	gl.enableVertexAttribArray(positionAttributeLocation)

	const size = 2           // 2 components per iteration
	const type = gl.FLOAT    // 32-bit float
	const normalize = false  // don't normalize the data
	const stride = 0         // size * sizeof(type) to get to next position
	const offset = 0         // beginning of buffer

	gl.vertexAttribPointer(
		positionAttributeLocation,
		size,
		type,
		normalize,
		stride,
		offset
	)

	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
	const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

	// Resize the canvas (if needed).
	resize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	// Clear the canvas.
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	gl.useProgram(program)

	// Send canvas dimensions over to the GPU.
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

	for (let i = 0; i < 100; i++) {
		// Setup a random rectangle.
		setRectangle(gl,
			randInt(gl.canvas.width) - 100,
			randInt(gl.canvas.height),
			randInt(300),
			randInt(300)
		)

		console.log(randInt(gl.canvas.width))

		// Pick a random color.
		gl.uniform4f(
			colorUniformLocation,
			Math.random(), // R
			Math.random(), // G
			Math.random(), // B
			1.0            // alpha
		)

		// Draw the rectangle.
		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}
}

window.onload = main
