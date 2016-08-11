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

    h2: autoActivate: true
    div: {{ajax1.result}}
        height: 100px
        width: 100%

    h2: autoActivate: false
    div: {{ajax2.result}}
    input: Send
        type: button
        .click: () -> ajax2.send()