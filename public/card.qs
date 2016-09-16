def Page main
  .loaded: ()->
    console.log('CARD FORM IS LOADED')
    //chuchu('da');
  //Function chuchu: (da)->
    //console.log(da,da,da);
  VBox
    flexDefinition: 2* 2*
    height: 600px
    CardForm cf
    div
      span: number {{' '+cf.number}}
      //span: {{' '+cf.cardData.number}}

      br

      span: name:
      span: {{' '+cf.cardData.cardholderName}}

      br

      span: valid:
      span: {{' '+cf.validDate}}

	  br

	  span: cvv:
      span: {{' '+cf.cvv}}

	  br

      span: {{JSON.stringify(cf.cardData)}}
