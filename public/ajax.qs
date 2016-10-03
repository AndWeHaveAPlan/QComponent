def Page main
    height:100%
    Title: ajax test

    AJAX ajax1
		autoActivate: true
        method: GET
        url: /qstyle.css

    AJAX ajax2
        method: GET
        url: /qstyle.css

    AJAX ajax3
        method: POST
        url: /qstyle.css
		sendData: {{postInput}}

    h1: GET

    h2: autoActivate: true
    div: {{ajax1}}
        height: 100px
        width: 100%

    h2: autoActivate: false
    div: {{ajax2}}
    input: Send
        type: button
        .click: () -> ajax2.send()

    h1: POST
	div: {{ajax3}}
    TextBox postInput: Test POST data        
    input: Send
        type: button
        .click: () ->
            ajax3.send(postInput)

