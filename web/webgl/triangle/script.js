const vertexShaderSource = `#version 300 es

// attributes are *inputs* to vertex shaders
in vec4 vertPosition;

void main() {
	gl_Position = vertPosition;
}
`

const fragmentShaderSource = `#version 300 es

precision mediump float;

// *output* variable
out vec4 fragColor;

void main() {
	fragColor = vec4(0.0, 0.0, 1.0, 1.0);
}
`

function main () {
	const canvas = document.getElementById('canvas')
	const gl = canvas.getContext('webgl2')

	if (gl === undefined) {
		alert('Your browser does not support WebGL')
	}

	gl.clearColor(0, 0, 0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	// Create shaders.
	const vertexShader = gl.createShader(gl.VERTEX_SHADER)
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

	gl.shaderSource(vertexShader, vertexShaderSource)
	gl.shaderSource(fragmentShader, fragmentShaderSource)

	gl.compileShader(vertexShader)
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(vertexShader))
		return
	}

	gl.compileShader(fragmentShader)
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(fragmentShader))
		return
	}

	// Create GLSL program.
	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(program))
		return
	}

	// This will catch additional issues. What kind of issues? idk.
	// It's a good idea to keep this out of production builds.
	gl.validateProgram(program)
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error(gl.getProgramInfoLog(program))
	}

	// Create buffer.
	const triangleVertices = [
		+0.0, +0.5,
		-0.5, -0.5,
		+0.5, -0.5
	]

	const triangleVertexBufferObject = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

	const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
	gl.vertexAttribPointer(
		positionAttribLocation,             // attribute location
		2,                                  // number of elements per attribute
		gl.FLOAT,                           // element type
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
		0                                   // offset from beginning of vertex to this attribute
	)

	gl.enableVertexAttribArray(positionAttribLocation)

	// Main render loop.
	gl.useProgram(program)
	gl.drawArrays(gl.TRIANGLES, 0, 3)
}
