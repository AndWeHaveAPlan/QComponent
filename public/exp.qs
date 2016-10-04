def Page salad
    div: 2
def Page scen
    div: 1
def Page main
    Boolean check: false
	TabControl tc
		height: 100%
		width: 100%

		Tab: txtPage
			span txt: some text here
            Button: push me pls
                padding: 5px
                margin: 5px
                background: orange
                .click: ()->{
                    if (check){
                        txt = "some text here"
                    }else{
                        txt = "you pushed it! you did!"
                    }
                    check = !check
                }
		Tab: all sorts of shit
			salad
		Tab: script
			scen