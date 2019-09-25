/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui'], function(){
  ui.init();
  customer.init();
});

var customer = (function () {
  return {init: init};

  function init() {}
})();
