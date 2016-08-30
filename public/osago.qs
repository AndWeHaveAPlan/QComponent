def Page page1
    width: 100%
    height: 100%
    background: #fcc
    h1: Page 1

def Page page2
    width: 100%
    height: 100%
    background: #cfc
    h1: Page 2

def Page page3
    width: 100%
    height: 100%
    background: #ccf
    h1: Page 3

def Scenario main
    public String phone: null
    public String insuranceType: null
    public String paymentData: null

    Sequence
        Selector
            page: page1
        Selector
            page: page1
        Selector
            page: page1

        /*Selector
           page: phoneNumber

        Selector
            condition: phone
            page: chooseInsuranceType

        Selector: insuranceType=='osago'
            page: osagoPage

        cascoPage: insuranceType=='casco'

        Selector: insuranceType=='casco'
            page: cascoPage

        Selector: paymentData
            page: payMoney

        Selector: insuranceType=='casco', paymentData
            page: deliveryAddress

        Selector
            page: Proceed*/

