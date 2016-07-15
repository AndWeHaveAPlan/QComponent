var _known = QObject._knownComponents,
    cls,
    UIComponent = _known[UIComponent];

UIComponent.extend('checkbox', {}, function(){
    UIComponent.apply(this, arguments);
    var tmp, eventManager = this._eventManager, mutatingPipe;

    tmp = (function(tmp, parent){
        eventManager.registerComponent(tmp.id, tmp);
        parent._ownComponents.push(tmp);

        return tmp;
    })( new Boolean({id: 'checked'}), this );
    tmp = (function(tmp, parent){
        eventManager.registerComponent(tmp.id, tmp);
        tmp.set('type', 'checkbox')
        mutatingPipe = new Base.Pipes.MutatingPipe(
            [this.id + '.checked'],
            {component: tmp.id, property: 'checked'}
        );
        mutatingPipe.addMutator(function (checked) {
            return checked?'checked':void 0+',';
        });
        eventManager.registerPipe(mutatingPipe);
        mutatingPipe = new Base.Pipes.MutatingPipe(
            [this.id + '.checked'],
            {component: tmp.id, property: 'value'}
        );
        mutatingPipe.addMutator(function (checked) {
            return '1'+checked;
        });
        eventManager.registerPipe(mutatingPipe);
        parent._ownComponents.push(tmp);

        return tmp;
    })( new input({id: 'i1'}), this );

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