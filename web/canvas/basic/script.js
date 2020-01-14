const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// rectangle
ctx.fillStyle = 'blue'
ctx.fillRect(100, 100, 200, 200)

// triangle
ctx.beginPath()
ctx.moveTo(100, 100)
ctx.lineTo(300, 300)
ctx.lineTo(300, 100)
ctx.closePath()
ctx.strokeStyle = 'red'
ctx.lineWidth = 5
ctx.stroke()

// cubic bezier (two anchors)
ctx.beginPath()
ctx.moveTo(100, 100)
ctx.bezierCurveTo(100, 200, 200, 100, 300, 300)
ctx.strokeStyle = 'yellow'
ctx.lineWidth = 5
ctx.stroke()

// king slime
const slime = new Image()
slime.src = './slime.gif'
slime.addEventListener('load', () => {
	// slicing would be good for spritesheets
	ctx.drawImage(
		slime,
		0, 0, 231, 254,          // x, y, w, h (source)
		200, 0, 231 * 2, 254 * 2 // x, y, w, h (destination)
	)
})

// some text -- seems like text is aligned from its baseline because I can only
// see the descenders when I place the text at (0, 0)
ctx.fillStyle = 'black'
ctx.font = 'bold 16pt Consolas'
ctx.fillText('Canvas Deep Dive: Chapter 1', 20, 40)

// gradients
const gradient = ctx.createLinearGradient(0, 0, 800, 0)
gradient.addColorStop(0, 'white')
gradient.addColorStop(1, 'black')
ctx.fillStyle = gradient
ctx.fillRect(0, 507, 800, 50)
