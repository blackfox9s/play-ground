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

    var response = ajaxCall.post('member/api/terms.art', {isReturn: true, data: {termsCode: 'private'}});

    console.log(response);

    var source = '<div class="item"><img src="../asset/images/schedule/1.jpg" /></div>';

    $ele.find('.slider').slick({
      dots: false,
      infinite: true,
      speed: 300,
      swipe: false,
      slidesToShow: 1,
      adaptiveHeight: true
    })
  }
})();
