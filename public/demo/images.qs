def Page main

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
