var _known = QObject._knownComponents,
    cls,
    UIComponent = _known[UIComponent];

UIComponent.extend('checkbox', {}, function(){
    UIComponent.apply(this, arguments);
    var tmp, eventManager = this._eventManager, mutatingPipe;

    tmp = (function(parent){
        eventManager.registerComponent(this.id, this);
        parent._ownComponents.push(this);

        return this;
    }).call( new Boolean({id: 'checked'}), this );
    tmp = (function(parent){
        eventManager.registerComponent(this.id, this);
        this.set('type', 'checkbox')
        mutatingPipe = new Base.Pipes.MutatingPipe(
            [parent.id + '.checked'],
            {component: this.id, property: 'checked'}
        );
        mutatingPipe.addMutator(function (checked) {
            return checked?'checked':void 0+',';
        });
        eventManager.registerPipe(mutatingPipe);
        mutatingPipe = new Base.Pipes.MutatingPipe(
            [parent.id + '.checked'],
            {component: this.id, property: 'value'}
        );
        mutatingPipe.addMutator(function (checked) {
            return '1'+checked;
        });
        eventManager.registerPipe(mutatingPipe);
        parent._ownComponents.push(this);

        return this;
    }).call( new input({id: 'i1'}), this );

    mutatingPipe = new Base.Pipes.MutatingPipe(
        [this.id + '.value'],
        {component: this.id, property: 'checked'}
    );
    mutatingPipe.addMutator(function (value) {
        return value;
    });
    eventManager.registerPipe(mutatingPipe);

    this._init();
});