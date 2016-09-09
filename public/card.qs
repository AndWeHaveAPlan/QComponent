def Page main
  .loaded: ()->
    console.log('CARD FORM IS LOADED')
    chuchu('da');
  Function chuchu: (da)->
    console.log(da,da,da);
  VBox
    div
      CardForm cf
    div
      span: number {{' '+cf.cardData.number}}
      //span: {{' '+cf.cardData.number}}

      br

      span: name:
      span: {{' '+cf.cardData.name}}

      br

      span: valid:
      span: {{' '+cf.cardData.date}}

    //span: {{JSON.stringify(cf.cardData)}}
