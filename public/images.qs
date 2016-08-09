def Page main

    input imgSrc: http://www.planwallpaper.com/static/images/butterfly-wallpaper.jpeg
        width: 100%

    //THead
    HBox:
        height: 50px;
        h2: img
        h2: Image.stretch: none
        h2: Image.stretch: uniform
        h2: Image.stretch: fill
        h2: Image.stretch: uniformToFill


    HBox
        height: 400px

        img
            src: {{imgSrc.value}}

        Image:
            width: 100%
            height:100%
            stretch: none
            source: {{imgSrc.value}}
            transform: {{'rotate('+sl1.value+'deg)'}}
        Image:
            width: 100%
            height:100%
            stretch: uniform
            source: {{imgSrc.value}}
            transform: {{'rotate('+sl1.value+'deg)'}}
        Image:
            width: 100%
            height:100%
            stretch: fill
            source: {{imgSrc.value}}
            transform: {{'rotate('+sl1.value+'deg)'}}
        Image:
            width: 100%
            height:100%
            stretch: uniformToFill
            source: {{imgSrc.value}}
            transform: {{'rotate('+sl1.value+'deg)'}}

    Slider sl1: 0
        from: 0
        to: 360
