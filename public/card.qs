def Page main
  VBox
    div
      CardForm cf
    div
      span: number: !{{cf.cardData.number}}

      br

      span: name: @{{cf.cardData.name}}

      br

      span: valid: #{{cf.cardData.date}}

