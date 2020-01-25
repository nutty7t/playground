'use strict'

function main () {
	const canvas = document.querySelector('canvas')
	const gl = canvas.getContext('webgl2')

	const image = new Image()
	image.src = '/ship.png'
	image.onload = () => render(gl, image)
}

function createShader (gl, type, source) {
	const shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const shaderTypeName = {
			[gl.VERTEX_SHADER]: 'vertex',
			[gl.FRAGMENT_SHADER]: 'fragment'
		}[type]

		console.error(`The ${shaderTypeName} shader failed to compile.`)
		throw gl.getShaderInfoLog(shader)
	}

	return shader
}

function createProgram (gl, vertexSource, fragmentSource) {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)

	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.log('Failed to link WebGL program.')
		throw gl.getProgramInfoLog(program)
	}

	return program
}

function resize (canvas) {
	// Account for HiDPI displays.
	const devicePixelRatio = window.devicePixelRatio || 1

	// Lookup the dimensions of the canvas displayed by the browser.
	const displayWidth = Math.floor(canvas.clientWidth * devicePixelRatio)
	const displayHeight = Math.floor(canvas.clientHeight * devicePixelRatio)

	if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
		canvas.width = displayWidth
		canvas.height = displayHeight
	}
}

function render (gl, image) {
	const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
	gl.useProgram(program)

	// Create vertex array object to store vertices.
	const vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

	const positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

	// Enable the position attribute.
	const positionLocation = gl.getAttribLocation(program, 'a_position')
	gl.enableVertexAttribArray(positionLocation)
	gl.vertexAttribPointer(
		positionLocation,
		2,        // size
		gl.FLOAT, // type
		false,    // normalize
		0,        // stride
		0,        // offset
	)

	// Draw the entire texture rectangle with two triangles.
	// Texture coordinates are in [0.0, 1.0].
	//
	// x-------x
	// |\      |
	// | \     |
	// |  \    |
	// |   \   |
	// |    \  |
	// |     \ |
	// |      \|
	// x-------x
	//
	const texCoordBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
		0.0, 1.0,
		1.0, 0.0,
		1.0, 1.0,
	]), gl.STATIC_DRAW)

	// Vertex attributes are disabled by default; in order to use them,
	// we must first enable the individual attributes. After that, we can
	// bind the buffer at the binding point to the attribute and specify
	// its memory layout.
	const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
	gl.enableVertexAttribArray(texCoordLocation)
	gl.vertexAttribPointer(
		texCoordLocation,
		2,        // size
		gl.FLOAT, // type
		false,    // normalized
		0,        // stride
		0,        // offset
	)

	// Select which texture unit to make active. Texture units are hardware
	// components in a GPU that performs sampling, which is the process of
	// computing a color from an image texture and texture coordinates.
	gl.activeTexture(gl.TEXTURE0)

	// Create a texture and bind it to texture unit 0's 2D bind point.
	const texture = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texture)

	// I have no idea what this is.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

	// Upload the image to the texture.
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,                // level of detail (highest)
		gl.RGBA,          // internal format
		gl.RGBA,          // format of texel data
		gl.UNSIGNED_BYTE, // data type of texel data
		image,
	)

	// Inform the shader to get the texture from texture unit 0.
	const imageLocation = gl.getUniformLocation(program, 'u_image')
	gl.uniform1i(imageLocation, 0)

	// Resize the canvas.
	resize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

	// Inform the shader of the canvas dimensions.
	const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)

	// Clear the canvas.
	gl.clearColor(0, 0, 0, 0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	// Draw!
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function setRectangle (gl, x, y, width, height) {
	const x1 = x
	const x2 = x + width
	const y1 = y
	const y2 = y + height

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2,
	]), gl.STATIC_DRAW)
}
