/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui', 'slick'], function(){
  ui.init();
  schedule.init();
});

var schedule = (function () {
  var $ele;
  return {init: init};

  function init() {
    $ele = $('.schedule-part');

    $ele.find('.slider').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true
    })
  }
})();
