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
		    flexDefinition: * 50px
			Video video
				background: black
				width: 100%
				height: 100%
				value: {{videoList.selectedItem.url}}
				controls: false
				autoplay: true
			div
				Label: Time left {{video.time|0}}
					float: left
				Label: Time to the end {{(video.duration-video.time)|0}}
					float: right

		ListBox videoList
			itemSource: [
				{name:'webm', url:'http://clips.vorwaerts-gmbh.de/VfE.webm'},
				{name:'mp4', url:'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4'},
				{name:'ogg/ogv', url:'http://clips.vorwaerts-gmbh.de/VfE.ogv'}
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