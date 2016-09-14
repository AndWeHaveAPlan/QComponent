/**
 * Created by nikita on 01.09.16.
 */

var deep = require('deep-property');

module.exports = function(options) {
  function haveNameInWindowScope() {
    return deep.get(window, options.globalName);
  }

  if(options.globalName && haveNameInWindowScope()) {
    setTimeout(options.onload, 0);
  } else {
    var script = document.createElement("script");
    script.async = true;
    script.defer = true;

    script.src = options.src;
    script.onload = options.onload;

    document.head.appendChild(script);
  }
}
