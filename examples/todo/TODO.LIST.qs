Store s1

TODO.LIST: s1

UIComponent TODO.LIST
    public String value

    public Store itemSource: {{value}}
    Store itemSource: {{value}}

    public Button itemSource: {{value}}

    public String title: {{value}}

    Button b1: {{value}}
    Input i1: {{value}}

    itemSource {Store}: {{value}}
    itemSource Store: {{value}}

    itemSource {Store}: {{value}}
    Store itemSource: {{value}}*/

    String internalValue = hui

    Input i1: val
    StackPanel: orientation="vertical"
        StackPanel: orientation="horizontal"
            ListBox listBox1: ItemSource
                ItemTemplate: Click=()->{done=!done}
                    StackPanel: orientation="horizontal"
                        CheckBox: value={done}; disabled="true"
                        Label:
                          value = {title} style = "CBStyle1" done = true; done = ItemSource . get(2) . done; a = b
                          style.textDecoration={MutatingPipe done; done->{ done?"line-through":"none"}};
            Grid:
                TextBox: value={listBox1.selectedItem.title; Direction:Both}
                TextArea: value={listBox1.selectedItem.description; Direction:Both}
        Grid:
            StackPanel: orientation="horizontal"
                Label: "Создать задачу"
                TextBox newItemNameTextBox: placeholder="cghgvh fgv"; flex=7;
                Button: Click=()->{ ItemSource.push({title: newItemNameTextBox, done: false, description: ''}) }; flex=3;
