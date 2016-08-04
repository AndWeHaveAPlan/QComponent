def UIComponent Indicator
    public Number min: 0
    public Number max: 10
    public String description
    background: #ccc
    border: 5px solid black

    height: 140
    width: 200

    div
        position: absolute
        top: 0
        width: 100%
        height: 80%

        div
            position: absolute
            bottom: 0
            background: red
            height: 10
            width: 50%
            transform-origin: right center
            transform: {{'rotate('+180/(max/value)+'deg)'}}
            transition: 'all 0.2s ease'
        div: {{min}}
            position: absolute
            left: 0
            bottom: 0
        div: {{max}}
            position: absolute
            right: 0
            bottom: 0
    div: {{description}}
        position: absolute
        bottom: 0



def LogicalComponent Reactor
    Timer timer:
        enabled: true
        interval: 100
        .tick: ()=>{
            var cTemp=this.get('temperature');
            var cRodPos=this.get('controlRodsPosition');
            cTemp+=Math.round(200*(cRodPos-4.5))/100;
            this.set('temperature', cTemp);

            if(this.get('meltdown')){
                this.get('timer').stop();
            }
        }

    public Number temperature: 600
    public Number power: 5000
    public Number controlRodsPosition: 5

    public Boolean danger: {{temperature>1000}}
    public Boolean meltdown: {{temperature>2000}}

def Page main
    title: {{ r1.danger?  'Reactor is fine. Just need to be 20% more cooler' : 'Reactor is fine' }}

    Reactor r1:

 HBox
     div
         HBox
             Indicator i1: {{r1.temperature}}
                 min: 1
                 max: 2000
                 description: Temperature, ℃

             div
                 span: Control rods position: {{r1.controlRodsPosition}}
                     width: 200
                     padding: 12

                 span: {{r1.meltdown? 'Meltdown :(' : r1.danger ? 'Danger!' :'' }}
                     color: white
                     width: 200
                     padding: 12
                     background: red
                     display: {{r1.meltdown||r1.danger?'block':'none'}}

     div
         div: Reactor control
         input: ↑ Rods up
             width: 110
             type: button
             .click: ()->{
                 var cPos=r1.get('controlRodsPosition');
                 if(cPos<9)
                     cPos+=1;
                 r1.set('controlRodsPosition',cPos);
             }
         br
         input: ↓ Rods down
             width: 110
             type: button
             .click: ()->{
                 var cPos=r1.get('controlRodsPosition');
                 if(cPos>0)
                     cPos-=1;
                 r1.set('controlRodsPosition',cPos);
             }