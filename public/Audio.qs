def Page main
	Audio a: "/1.mp3"
		autoplay: true
	Button pause: PAUSE
		.click: ()->
			a.pause()
			this.enabled = false
			play.enabled = true
	Button play: PLAY
		enabled: false
		.click: ()->
			a.play()
			pause.enabled = true
			this.enabled = false
	Button time: Switch time
		.click: ()->
			a.currentTime = time
	input time: 0
		type: number