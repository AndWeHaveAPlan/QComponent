def Page imagesPage

	input imgSrc: http://www.planwallpaper.com/static/images/butterfly-wallpaper.jpeg
		width: 100%

	//THead
	HBox:
		flexDefinition: 25* 25* 25* 25* 25*
		height: 50px;
		h2: img
		h2: Image.stretch: none
		h2: Image.stretch: uniform
		h2: Image.stretch: fill
		h2: Image.stretch: uniformToFill


	HBox
		height: 400px
		flexDefinition: 25* 25* 25* 25* 25*

		img
			src: {{imgSrc.value}}

		Image:
			width: 100%
			height:100%
			stretch: none
			source: {{imgSrc.value}}
			rotation: {{sl1.value}}
		Image image:
			width: 100%
			height:100%
			stretch: uniform
			source: {{imgSrc.value}}
			rotation: {{sl1.value}}
		Image:
			width: 100%
			height:100%
			stretch: fill
			source: {{imgSrc.value}}
			rotation: {{sl1.value}}
		Image:
			width: 100%
			height:100%
			stretch: uniformToFill
			source: {{imgSrc.value}}
			rotation: {{sl1.value}}

	Slider sl1: 0
		from: 0
		to: 360

def Page page1
	width:100%
	height: 100%
	background: red		

def Page videoPlayerPage1
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
				{name:'Rabbit webm', url:'http://clips.vorwaerts-gmbh.de/VfE.webm'},
				{name:'Rabbit mp4', url:'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4'},
				{name:'Rabbit ogg/ogv', url:'http://clips.vorwaerts-gmbh.de/VfE.ogv'},
				{name:'Toy story', url:'http://www.html5videoplayer.net/videos/toystory.mp4'}
				]
			itemTemplate:
				div: {{name}}
					padding: 12px

def Page main
	TabControl tc
		height: 100%
		width: 100%

		Tab t1: Tab1
			videoPlayerPage1
		Tab: Tab2
			imagesPage
		Tab: Tab3
			h1: t2
		Tab: Tab4
			page1