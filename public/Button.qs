def Page main
    Number clickCount:1
    Button b: Button1
        .click: ()-> {
            this.value = "Button"+(clickCount++);
        }