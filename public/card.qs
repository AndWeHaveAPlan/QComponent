def Page main

  VBox
    div
	   TextBox tb: werfwefsdfsd
	       placeholder: rrrrrr
		   validator: (value) ->
		      var a=234;
		      debugger;
			 
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
