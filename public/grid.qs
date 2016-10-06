def Page main
	VBox
		height: 100%
		width: 100%
		flexDefinition: * 100

		Grid
			height: 100%
			width: 100%
			rows: 10
			columns: 20
			Grid
				rows: 4
				columns: 4
				width:4
				height:4
				top: {{top}}
				left: {{left}}

				div
					background: #f00
					height: 1
					width: 1
					left:2
					top:0
				div
					background: #f00
					height: 1
					width: 1
					left:2
					top:1
				div
					background: #f00
					height: 1
					width: 1
					left:2
					top:2
				div
					background: #f00
					height: 1
					width: 1
					left:1
					top:2
		div
			TextBox top: 1
			TextBox left: 1