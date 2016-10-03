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
	public Scenario scenario

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
	public String insuranceType: 'osago'
	public String paymentData: null

	Sequence
		Selector
			page: page0

		Selector: insuranceType=='osago'
			page: page1

		Selector: insuranceType=='casco'
			page: page2

		Selector: !insuranceType
			page: errPage

		Selector
			page: page3