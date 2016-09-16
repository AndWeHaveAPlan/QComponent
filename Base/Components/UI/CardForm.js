/**
 * Created by ravenor on 13.07.16.
 */

var Primitives = require('./Primitives');
var UIComponent = require('../UIComponent');
var Property = require('../../Property');
var MaskedInput = require('./MaskedInput');
var TextBox = require('./TextBox');
var MutatingPipe = require('../../Pipes/MutatingPipe');
var Image = require('./Image');

var Luhn = require('../../Common/Luhn');

module.exports = UIComponent.extend('CardForm', {
    masterCardImg: "data:image/png;base64,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",
    visaImg: "data:image/png;base64,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",
    _prop: {
        cardData: new Property('Variant', { description: 'Card data' }, {
            get: Property.defaultGetter,
            set: function (name, value) {
            }
        }, { cardholderName: '', validDate: '', number: '', cvv: '' }),
        number: new Property('String', { description: 'Card data' }, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this.set('cardData.number', value);
            }
        }),
        validDate: new Property('String', { description: 'Card data' }, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this.set('cardData.validDate', value);
            }
        }),
        cardholderName: new Property('String', { description: 'Card data' }, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this.set('cardData.cardholderName', value);
            }
        }),
        cvv: new Property('String', { description: 'Card data' }, {
            get: Property.defaultGetter,
            set: function (name, value) {
                this.set('cardData.cvv', value);
            }
        }),
        value: Property.generate.proxy('cardData')
    }
},
    function (cfg) {
        UIComponent.apply(this, arguments);
        //this._set('border', '2px solid #000');
        //this._set('border-radius', '11px');
        this._set('height', '202px');
        //this._set('width', '318px');
        this._set('width', '398px');

        var self = this;
        var tmp;

        var backForm = new Primitives.div({
            'height': '202px',
            'width': '90px',
            'border-top-right-radius': '11px',
            'border-bottom-right-radius': '11px',
            'border-top': '2px solid #000',
            'border-bottom': '2px solid #000',
            'border-right': '2px solid #000',
            'position': 'absolute',
            top: '0',
            right: '0'
        });
        this.addChild(backForm);

        var frontForm = new Primitives.div({
            'border-radius': '11px',
            'height': '202px',
            'width': '318px',
            'border': '2px solid #000',
            'position': 'absolute',
            top: '0',
            left: '0'
        });
        this.addChild(frontForm);

        var cvvInput = new MaskedInput({
            id: 'cvvInput',
            'mask': 'ddd',
            'border': '1px solid #ccc',
            'position': 'absolute',
            'top': '50px',
            'right': '18px',
            'width': '3.2ch',
            'font-family': 'monospace',
            'font-size': '21px'
        });
        backForm.addChild(cvvInput);
        this._eventManager.registerComponent(cvvInput);

        tmp = new Primitives.span({
            'value': 'CVV/CVC',
            'position': 'absolute',
            'top': '35px',
            'right': '17px',
            'width': '38px',
            'font-size': '9px'
        });
        backForm.addChild(tmp);

        var cardNumber = new MaskedInput({
            id: 'cardNumber',
            'mask': 'dddd dddd dddd dddd',
            'placeholder': 'XXXX XXXX XXXX XXXX',
            'border': '1px solid #ccc',
            'position': 'absolute',
            'top': '105px',
            'left': '33px',
            'width': '245px',
            'font-family': 'monospace',
            'font-size': '21px'
        });
        frontForm.addChild(cardNumber);
        this._eventManager.registerComponent(cardNumber);

        var validDate = new MaskedInput({
            id: 'validDate',
            'mask': 'dd/dd',
            'placeholder': 'MM/YY',
            'border': '1px solid #ccc',
            'position': 'absolute',
            'top': '135px',
            'left': '140px',
            'width': '53px',
            'font-family': 'monospace',
            'font-size': '16px'
        });
        frontForm.addChild(validDate);
        this._eventManager.registerComponent(validDate);

        tmp = new Primitives.span({
            'value': 'VALID THRU',
            'position': 'absolute',
            'top': '134px',
            'left': '111px',
            'width': '28px',
            'font-size': '9px'
        });
        frontForm.addChild(tmp);

        var cardholderName = new TextBox({
            id: 'cardholderName',
            'placeholder': 'CARDHOLDER NAME',
            'border': '1px solid #ccc',
            'position': 'absolute',
            'top': '162px',
            'left': '20px',
            'width': '200px',
            'font-family': 'monospace',
            'font-size': '14px'
        });
        frontForm.addChild(cardholderName);
        this._eventManager.registerComponent(cardholderName);

        var sysLogo = new Image({
            id: 'sysLogo',
            'position': 'absolute',
            'bottom': '15px',
            'right': '15px',
            'width': '50px',
            'height': '30px',
            stretch: 'uniform'
        });
        frontForm.addChild(sysLogo);
        this._eventManager.registerComponent(sysLogo);



        var mutatingPipe = new MutatingPipe(['cardNumber.pureText'], {
            component: 'cardNumber',
            property: 'background'
        });
        mutatingPipe.addMutator(function (number) {
            if (!Luhn.check(number) && number.length >= 16) {
                return '#f99';
            } else {
                return '';
            }
        });
        this._eventManager.registerPipe(mutatingPipe);

        mutatingPipe = new MutatingPipe(['cardNumber.value'], {
            component: 'sysLogo',
            property: 'source'
        });
        mutatingPipe.addMutator(function (number) {
            if (!number)
                return '';

            if (number.substring(0, 1) == 4) {
                return self.visaImg;
            }
            var n = parseInt(number.substring(0, 2));
            if (n >= 51 && n <= 55) {
                return self.masterCardImg;
            }
        });
        this._eventManager.registerPipe(mutatingPipe);

        this._eventManager.createSimplePipe(['cardNumber.pureText'], {
            component: this.id,
            property: 'number'
        });
        this._eventManager.createSimplePipe(['validDate.value'], {
            component: this.id,
            property: 'validDate'
        });
        this._eventManager.createSimplePipe(['cardholderName.value'], {
            component: this.id,
            property: 'cardholderName'
        });
        this._eventManager.createSimplePipe(['cvvInput.value'], {
            component: this.id,
            property: 'cvv'
        });
    }
);