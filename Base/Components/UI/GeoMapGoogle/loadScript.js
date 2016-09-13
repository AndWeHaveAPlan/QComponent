/**
 * Created by nikita on 01.09.16.
 */

module.exports = function(options) {
  // if(options.globalName && window[options.globalName]) {
  //   options.onload();
  // } else {
    var script = document.createElement("script");
    script.async = true;
    script.defer = true;

    script.src = options.src;
    script.onload = options.onload;

    document.head.appendChild(script);
  // }
}
