// Sometimes, this will halt. Sometimes, this won't.
// Does (T | never) make sense for NP-complete problems? E.g. SAT?
function sometimesLoopForever (): void | never {
	if (Math.random() < 0.5) {
		console.log('looping forever')
		while (true) { /* never */ }
	}
	console.log('exit with void')
}

sometimesLoopForever()
