def Page main
    WrapPanel:
        itemTemplate:
            div: {{row}}
        itemSource: [{color:'red'},{color:'green'}]

    WrapPanel:[{color:'red'},{color:'green'}]
        itemTemplate:
            div: {{row}} {{color}} {{value}}
