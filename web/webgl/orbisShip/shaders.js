'use strict'

const vertexShaderSource = `#version 300 es

uniform vec2 u_resolution;

in vec2 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main() {
	// pixels -> [0.0, 1.0]
	vec2 zeroToOne = a_position / u_resolution;

	// [0.0, 1.0] -> [0.0, 2.0]
	vec2 zeroToTwo = zeroToOne * 2.0;

	// [0.0, 2.0] -> [-1.0, 1.0]
	vec2 clipSpace = zeroToTwo - 1.0;

	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
	v_texCoord = a_texCoord;
}
`

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outColor;

void main() {
	outColor = texture(u_image, v_texCoord);
}
`
