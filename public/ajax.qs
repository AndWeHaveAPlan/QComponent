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

    h1: GET

    h2: autoActivate: true
    div: {{ajax1}}
        height: 100px
        width: 100%

    h2: autoActivate: false
    div: {{ajax2.value}}
    input: Send
        type: button
        .click: () -> ajax2.send()

    h1: POST
    input postInput: Test POST data
        type: text
    input: Send
        type: button
        .click: () -> ajax3.send(postInput.get('value'))
