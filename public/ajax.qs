def Page main
    height:100%
    Title: ajax test

    HTTPRequest ajax1
        method: GET
        url: /qstyle.css

    HTTPRequest ajax2
        autoActivate: false
        method: GET
        url: /qstyle.css

    HTTPRequest ajax3
        autoActivate: false
        method: POST
        url: /qstyle.css

    h1: GET

    h2: autoActivate: true
    div: {{ajax1.result}}
        height: 100px
        width: 100%

    h2: autoActivate: false
    div: {{ajax2.result}}
    input: Send
        type: button
        .click: () -> ajax2.send()

    h1: POST
    input postInput: Test POST data
        type: text
    input: Send
        type: button
        .click: () -> ajax3.send(postInput.get('value'))