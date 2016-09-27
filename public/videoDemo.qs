def Page firstPage
	 center
		 h1: Video component demo
		 br
		 Button: next
			.click: ()-> next()	
			padding: 12px 24px

def Page videoPlayerPage
	HBox
		flexDefinition: * 300
		height: 100%

		
		VBox
		    height: 100%
		    flexDefinition: * 30px 30px
			Video video
				background: black
				width: 100%
				height: 100%
				value: {{videoList.selectedItem.url}}
				controls: false
				autoplay: true
				time: {{progressSlider}}
			div
				Label: Time left {{video.time|0}}
					float: left
				Label: Time to the end {{(video.duration-video.time)|0}}
					float: right
			Slider progressSlider: {{video.time}}
				from: 0
				to: {{video.duration}}

		ListBox videoList
			itemSource: [
				{name:'C2C - Delta', url:'https://cs1-33v4.vk-cdn.net/p24/501f8f17cb3cc8.mp3'},
				{name:'M.O.O.N – Dust', url:'https://psv4.vk.me/c521400/u108637942/audios/2dbb6fd9350e.mp3'},
				{name:'Sun Araw - Deep Cover', url:'https://cs1-37v4.vk-cdn.net/p8/95035e0089035c.mp3'},
				{name:'Cyriak – No more memory', url:'https://psv4.vk.me/c1703/u13507985/audios/e012abdfe14b.mp3'}
				]
			itemTemplate:
				div: {{name}}
					padding: 12px


def Scenario main

	Sequence
		Selector
			page: firstPage

		Selector: 
			page: videoPlayerPage