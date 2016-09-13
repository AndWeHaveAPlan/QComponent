var x = {
    "type": "MemberExpression",
    "computed": false,
    "object": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {"type": "Identifier", "name": "gm"},
                "property": {"type": "Identifier", "name": "get"}
            },
            "arguments": [{
                "type": "ArrayExpression",
                "elements": [{"type": "Literal", "value": "pins", "raw": "'pins'"}]
            }]
        },
        "property": {"type": "Literal", "value": 0, "raw": "0", "computed": true}
    },
    "property": {"type": "Identifier", "name": "coords", "computed": false}
};
