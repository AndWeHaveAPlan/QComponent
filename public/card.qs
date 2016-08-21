def Page main
  VBox
    div
      CardForm cf
    div
      span: number:
      span: {{' '+cf.cardData.number}}

      br

      span: name:
      span: {{' '+cf.cardData.name}}

      br

      span: valid:
      span: {{' '+cf.cardData.date}}

