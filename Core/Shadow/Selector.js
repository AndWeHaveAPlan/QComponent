/**
 * Created by zibx on 08.07.16.
 */
module.exports = (function () {
    'use strict';
    var tools = require('../Compile/tools');

    return {
        argumentParser: function (text, item) {
            var splitted = tools.split(item.items, ':', 2);
            var condition = '';//splitted[1].join('');

            for (var i = 0; i < splitted[1].length; i++) {
                condition += splitted[1][i].type === 'quote' ? splitted[1][i].data : splitted[1][i].pureData;
            }

            var fakePipe = [
                {
                    'row': 28,
                    'col': 13,
                    'type': 'brace',
                    'info': '{',
                    '_info': '}',
                    'data': '{{' + condition + '}}',
                    'pureData': '{{' + condition + '}}',
                    'items': [
                        {
                            'row': 28,
                            'col': 14,
                            'type': 'brace',
                            'info': '{',
                            '_info': '}',
                            'data': '{' + condition + '}',
                            'pureData': '{' + condition + '}',
                            'items': splitted[1]
                            /*{
                                'row': 28,
                                'col': 15,
                                'type': 'text',
                                'data': 'insuranceType==',
                                'pureData': 'insuranceType=='
                            },
                            {
                                'row': 28,
                                'col': 30,
                                'type': 'quote',
                                'data': ''osago'',
                                'pureData': 'osago'
                            }*/

                        }
                    ]
                }
            ];

            return { name: '', value: fakePipe };
        }
    };
})();

