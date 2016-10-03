def Page q0
    width: 100%
	height: 100%


	background: #ccc
	h1: Quest 0


    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я не чувствую себя расстроенным, печальным.
        br
        RadioButton: 1
            caption: Я расстроен.
        br
        RadioButton: 2
            caption: Я все время расстроен и не могу от этого отключиться.
        br
        RadioButton: 3
            caption: Я настолько расстроен и несчастлив, что не могу это выдержать.

	Button: назад
        padding: 5px
        margin: 5px
	    .click: ()-> back()
	Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
	    .click: ()->
                    dataContext.count = dataContext.count + rbg;
		    next();
    br
    //span: count = {{dataContext.count}}


def Page q1
    width: 100%
	height: 100%

	background: #ccc
	h1: Quest 1

    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я не тревожусь о своем будущем.
        br
        RadioButton: 1
            caption: Я чувствую, что озадачен будущим.
        br
        RadioButton: 2
            caption: Я чувствую, что меня ничего не ждет в будущем.
        br
        RadioButton: 3
            caption: Мое будущее безнадежно, и ничто не может измениться к лучшему.

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()
    Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
        .click: ()->
            dataContext.count = dataContext.count + rbg;
            next();
    br
    //span: count = {{dataContext.count}}

def Page q2
    width: 100%
	height: 100%

	background: #ccc
	h1: Quest 2

    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я не чувствую себя неудачником.
        br
        RadioButton: 1
            caption: Я чувствую, что терпел больше неудач, чем другие люди.
        br
        RadioButton: 2
            caption: Когда я оглядываюсь на свою жизнь, я вижу в ней много неудач.
        br
        RadioButton: 3
            caption: Я чувствую, что как личность я - полный неудачник.

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()
    Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
        .click: ()->
            dataContext.count = dataContext.count + rbg;
            next();

    //span: count = {{dataContext.count}}

def Page q3
    width: 100%
	height: 100%

	background: #ccc
	h1: Quest 3

    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я получаю столько же удовлетворения от жизни, как раньше.
        br
        RadioButton: 1
            caption: Я не получаю столько же удовлетворения от жизни, как раньше.
        br
        RadioButton: 2
            caption: Я больше не получаю удовлетворения ни от чего.
        br
        RadioButton: 3
            caption: Я полностью не удовлетворен жизнью и мне все надоело.

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()
    Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
        .click: ()->
            dataContext.count = dataContext.count + rbg;
            next();

    //span: count = {{dataContext.count}}

def Page q4
    width: 100%
	height: 100%

	background: #ccc
	h1: Quest 4

    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я не чувствую себя в чем-нибудь виноватым.
        br
        RadioButton: 1
            caption: Достаточно часто я чувствую себя виноватым.
        br
        RadioButton: 2
            caption: Большую часть времени я чувствую себя виноватым.
        br
        RadioButton: 3
            caption: Я постоянно испытываю чувство вины.

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()
    Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
        .click: ()->
            dataContext.count = dataContext.count + rbg;
            next();

    //span: count = {{dataContext.count}}

def Page q5
    width: 100%
	height: 100%

	background: #ccc
	h1: Quest 5

    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я не чувствую, что могу быть наказанным за что-либо.
        br
        RadioButton: 1
            caption: Я чувствую, что могу быть наказан.
        br
        RadioButton: 2
            caption: Я ожидаю, что могу быть наказан.
        br
        RadioButton: 3
            caption: Я чувствую себя уже наказанным.

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()
    Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
        .click: ()->
            dataContext.count = dataContext.count + rbg;
            next();

    //span: count = {{dataContext.count}}

def Page q6
    width: 100%
	height: 100%

	background: #ccc
	h1: Quest 6

    RadioButtonGroup rbg
        RadioButton: 0
            caption: Я не разочаровался в себе.
        br
        RadioButton: 1
            caption: Я разочаровался в себе.
        br
        RadioButton: 2
            caption: Я себе противен.
        br
        RadioButton: 3
            caption: Я себя ненавижу.

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()
    Button: дальше
        padding: 5px
        margin: 5px
        background: '#44aa88'
        border: 2px solid green
        enabled: {{rbg.value != void 0}}
        .click: ()->
            dataContext.count = dataContext.count + rbg;
            next();

    span: count = {{dataContext.count}}

def Page r1
    width: 100%
	height: 100%

	background: #ccc
	h1: Result 1

    span: отсутствие депрессивных симптомов

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()

    //span: count = {{dataContext.count}}

def Page r2
    width: 100%
	height: 100%

	background: #ccc
	h1: Result 2

    span: легкая депрессия (субдепрессия)

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()

    //span: count = {{dataContext.count}}

def Page r3
    width: 100%
	height: 100%

	background: #ccc
	h1: Result 3

    span: умеренная депрессия

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()

    //span: count = {{dataContext.count}}

def Page r4
    width: 100%
	height: 100%

	background: #ccc
	h1: Result 4

    span: выраженная депрессия (средней тяжести)

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()

    //span: count = {{dataContext.count}}

def Page r5
    width: 100%
	height: 100%

	background: #ccc
	h1: Result 5

    span: тяжёлая депрессия

    Button: назад
        padding: 5px
        margin: 5px
        .click: ()-> back()

    //span: count = {{dataContext.count}}

def Scenario main

    public Number count: 0

	Sequence
		Selector
			page: q0
        Selector
            page: q1
        Selector
            page: q2
        Selector
            page: q3
        Selector
            page: q4
        Selector
            page: q5
        Selector
            page: q6
        Selector: count == 0
            page: r1
        Selector: count == 1
            page: r2
        Selector: count == 2
            page: r3
        Selector: count > 2 && count < 5
            page: r4
        Selector: count >= 5
            page: r5