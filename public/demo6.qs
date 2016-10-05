def Page DebugPage
	span: {{JSON.stringify(dataContext)}}

def Page StartPage
	Button: back
	    .click: ()-> back()
	Button: next
	    .click: ()-> next()

	h1: StartPage

def Page OpSelectPage	
	String opsos: {{wp.selectedItem.opsos}}
	padding: 16px

	h1: Выберите оператора

	WrapPanel wp: 
		itemSource: [{
						opsos: 'MTS',
						logo: 'http://termoshuba.com/wp-content/uploads/2013/05/mts-1024x1024.gif'
					},{					
						opsos: 'Megafon',
						logo: 'https://startpack.ru/repository/application/1211/logo.png'
					},{					
						opsos: 'Beeline',
						logo: 'http://freesoft.ru/screenshots/Android/725463/logo-orig.png'
					}]
		itemTemplate:
			div
				width: 200px				
				Image: {{logo}}
					stretch: uniform
					height: 200px
					width: 100%
				center: {{opsos}}
					
		height: 500px
		.selectionChanged: ()->
			self.dataContext.opsos = opsos
			next()

def Page NumberPage
	String str: {{tb.value}}
	padding: 16px

	h1: Введите номер

	div
		margin: 12px
		width: 200px
		height: 280px
		span: +7
		TestInput tb: {{dataContext.number}}
			width: 167px
			margin: 0 0 0 10px
			border: 1px solid #000
		NumberKeyboard
		center
			Button: Продолжить
				margin: 0 auto
				enabled: {{ tb.value.length == 10 }}
				.click: ()->
					self.dataContext.number = tb.value
					next()	


def Page TopUpPage
	Number total: {{dataContext.money}}
	Number forTopUp: {{total*(1-dataContext.tax/100)}}

	padding: 16px

	Function add: (c)->
		total=total+c

	h1: Бабло

	p
		span: На номер +7{{dataContext.number}}
		span: , {{dataContext.opsos}}

	p: Минимальная сумма: {{dataContext.minMoney}}р
	p: Комиссия: {{dataContext.tax}}%

	p
		font-size: 22px
		margin: 24px 0 24px

		span: "Внесено: "
		span l: {{total}}р
		br
		span: "Будет зачисленно: "
		span: {{forTopUp}}р

	Button: 50
		margin: 5px
		.click: ()-> add(50)
	Button: 100
		margin: 5px
		.click: ()-> add(100)
	Button: 500
		margin: 5px
		.click: ()-> add(500)
	Button: 1000
		margin: 5px
		.click: ()-> add(1000)

	div
		Button: Назад
			margin: 5px
			.click: ()->	
				self.dataContext.money = total	
				back()
		Button: Зачислить
			margin: 5px
			enabled: {{ forTopUp > dataContext.minMoney }}
			.click: ()->
				self.dataContext.money = total
				next()	


def Scenario main
	public String opsos: ''
	public String number: ''
	public Number money: 0
	public Number tax: 5
	public Number minMoney: 100

	Sequence

		Selector: 
			scene: OpSelectPage

		Selector: 
			scene: NumberPage

		Selector: 
			scene: TopUpPage

		Selector: 
			scene: DebugPage

		