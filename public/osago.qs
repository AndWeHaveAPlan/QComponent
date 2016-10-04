def Page page3
	width: 100%
	height: 100%
	background: #ccf
	h1: Page 3

	Button: back
	    .click: ()-> back()		
	Button: next
	    .click: ()-> next()		

def Page errPage
	width: 100%
	height: 100%
	background: #fff
	h1: Error

	Button: back
	    .click: ()-> back()

def Page page0
	width: 100%
	height: 100%

	background: #ccc
	h1: Page 0

	Button: back
	    .click: ()-> back()		
	Button: next	    
	    .click: ()->
		    self.dataContext.insuranceType=type;
		    next();
		      

	RadioButtonGroup type: {{dataContext.insuranceType}}
	   RadioButton: osago
	       caption: osago
	   RadioButton: casco
	       caption: casco

def Page page1
	width: 100%
	height: 100%

	background: #fcc
	h1: OSAGO

	Button: back
	    .click: ()-> back()		
	Button: next
	    .click: ()-> next()		

def Page page2
	width: 100%
	height: 100%
	background: #cfc
	h1: CASCO

	Button: back
	    .click: ()-> back()		
	Button: next
	    .click: ()-> next()		





def Scenario main
	public String phone: null
	public String insuranceType: 'casco'
	public String paymentData: null

	Sequence
		Selector
			scene: page0

		Selector: insuranceType=='osago'
			scene: page1

		Selector: insuranceType=='casco'
			scene: page2

		Selector: insuranceType!=='osago' && insuranceType!=='casco'
			scene: errPage

		Selector
			scene: page3

	Sequence
		Selector
			scene: page0

		Selector: insuranceType=='osago'
			scene: page1

		Selector: insuranceType=='casco'
			scene: page2

		Selector: insuranceType!=='osago' && insuranceType!=='casco'
			scene: errPage

		Selector
			scene: page3