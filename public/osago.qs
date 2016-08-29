def Scenario insurance
    private Phone phone: null
    private String insuranceType: null
    private String paymentData: null

    Sequence
        Selector
            Page: phoneNumber

        Selector
            Condition: phone
            Page: chooseInsuranceType

        Selector: insuranceType=='osago'
            Page: osagoPage

        Selector: insuranceType=='casco'
            Page: cascoPage

        Selector: paymentData
            Page: payMoney

        Selector: insuranceType=='casco', paymentData
            Page: deliveryAddress

        Selector
            Page: Proceed

