def Page main
	HBox
		flexDefinition: * 300
		height: 100%

		VBox
		    height: 100%
		    flexDefinition: * 30px 30px
			Audio audio
				value: {{trackList.selectedItem.url}}
				time: {{progressSlider}}
                autoplay: true
			div
				Label: Time left {{audio.time|0}}
					float: left
				Label: Time to the end {{(audio.duration-audio.time)|0}}
					float: right
			Slider progressSlider: {{audio.time}}
				from: 0
				to: {{audio.duration}}

		ListBox trackList
			itemSource: [
				{name:'C2C - Delta', url:'https://cs1-33v4.vk-cdn.net/p24/501f8f17cb3cc8.mp3'},
				{name:'M.O.O.N – Dust', url:'https://psv4.vk.me/c521400/u108637942/audios/2dbb6fd9350e.mp3'},
				{name:'Sun Araw - Deep Cover', url:'https://cs1-37v4.vk-cdn.net/p8/95035e0089035c.mp3'},
				{name:'Cyriak – No more memory', url:'https://psv4.vk.me/c1703/u13507985/audios/e012abdfe14b.mp3'}
				]
			selectedIndex: 0
			itemTemplate:
				div: {{name}}
					padding: 12px

