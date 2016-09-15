def Page page0
	width: 100%
	height: 100%
	public Scenario scenario

	background: #ccc
	h1: Page 0

	//TextBox type: {{scenario.insuranceType}}
	//    placeholder: 'osago/casco'

def Page page1
	width: 100%
	height: 100%
	public Scenario scenario

	background: #fcc
	h1: OSAGO

def Page page2
	width: 100%
	height: 100%
	background: #cfc
	h1: CASCO



def Scenario main
	public String phone: null
	public String insuranceType: 'osago'
	public String paymentData: null

	Sequence
		Selector:
			page: page0
		Selector: insuranceType=='osago'
			page: page1
		Selector: insuranceType=='casco'
			page: page2
		Selector
			page: page3

		/*Selector
		   page: phoneNumber

		Selector
			condition: phone
			page: chooseInsuranceType

		Selector: insuranceType=='osago'
			page: osagoPage

		cascoPage: insuranceType=='casco'
		if insuranceType=='casco'
			cascoPage
		else
		Selector: insuranceType=='casco'
			page: cascoPage

		Selector: paymentData
			page: payMoney

		Selector: insuranceType=='casco', paymentData
			page: deliveryAddress

		Selector
			page: Proceed*/


def Page page3
	width: 100%
	height: 100%
	background: #ccf
	h1: Page 3