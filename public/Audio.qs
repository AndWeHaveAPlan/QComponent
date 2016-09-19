def Page main
    Audio a: "https://cs1-24v4.vk-cdn.net/p3/f2293ea5ae7827.mp3?extra=FC0aCwhbnBWbDpaLKGj_LJUWv1FzWSyrsXrnuSuX6a32IGAtj7AmHacEexXQNE5czUVkUnzyB6BqQs2WFLL-rhY6DZLCw6mJyuEThRUvOTwagSpHSgfvfitT-n12ehYYAvnqaW"

    Button pause: PAUSE
        .click: ()->
            a.pause()
            //play.show()
            //this.hide()

            this.enabled = false
            play.enabled = true
    Button play: PLAY
        enabled: false
        .click: ()->
            a.play()
            //pause.show()
            //this.hide()
            pause.enabled = true
            this.enabled = false

    Label time: 0