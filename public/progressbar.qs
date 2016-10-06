def Page main
	ProgressBar: 0
	ProgressBar: 14
	ProgressBar: 42
	ProgressBar: 71
	ProgressBar: 100
	ProgressBar:
		indeterminate: true
	br
	ProgressBar pb1
		rotation: {{-sl1/100*180}}
		progress: {{sl1}}
	Slider sl1: 50
		width: 150px
		from: 0
		to: 100
		step: 1
