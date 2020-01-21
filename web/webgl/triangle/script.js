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
}
