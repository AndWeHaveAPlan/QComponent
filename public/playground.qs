def Page main
  AJAX ajax
    method: POST
    url:
    sendData: {{code}}

  HBox
    width: 100%
    height: 100%
    VBox
        width: 100%
        height: 100%
        flexDefinition: * 30px
        textarea code: "
def Page main
  div: A
    input a: 1
      type: number
  div: B
    input b: 3
      type: number
  Label: Sum = {{a+b}}
  "
            width: 100%
            height: 100%
        Button: RUN
          .click: ()->
            ajax.send()

    iframe
        width: 100%
        height: 100%
        src: {{ajax.result}}