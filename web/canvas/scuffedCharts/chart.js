const canvas = document.getElementById('chart')
const data = [16, 72, 20, 30, 54]
const labels = ['A', 'B', 'C', 'D', 'E', 'F']
drawScuffedGraph(canvas, data, labels)

function drawScuffedGraph (canvas, data, labels) {
	const ctx = canvas.getContext('2d')

	// draw background
	ctx.fillStyle = '#EEE'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	// draw bars
	ctx.fillStyle = 'blue'
	const xAxisBorder = 75
	const yAxisBorder = 50
	const barWidth = (canvas.width - yAxisBorder) / data.length / 2
	const maxHeight = Math.max(...data)
	for (let i = 0; i < data.length; i++) {
		const barHeight = (canvas.height - xAxisBorder - 25) * data[i] / maxHeight
		ctx.fillRect(
			yAxisBorder - 10 + barWidth / 2 + i * barWidth * 2,
			canvas.height - xAxisBorder - barHeight,
			barWidth,
			barHeight
		)
	}

	// draw axes
	ctx.fillStyle = 'black'
	ctx.beginPath()
	ctx.moveTo(40, 40)
	ctx.lineTo(40, canvas.height - xAxisBorder)
	ctx.lineTo(canvas.width - barWidth / 2, canvas.height - xAxisBorder)
	ctx.stroke()

	// draw ticks and labels
	for (let i = 1; i < 7; i++) {
		ctx.fillText(
			`${maxHeight - i * maxHeight / 6}`,
			10, i * (canvas.height - xAxisBorder) / 6
		)
		ctx.beginPath()
		ctx.moveTo(35, i * (canvas.height - xAxisBorder) / 6)
		ctx.lineTo(40, i * (canvas.height - xAxisBorder) / 6)
		ctx.stroke()
	}

	for (let i = 0; i < labels.length; i++) {
		ctx.fillText(
			labels[i],
			yAxisBorder + i * barWidth * 2 + 10,
			canvas.height - xAxisBorder + 20
		)
	}
}
