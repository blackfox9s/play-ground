/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui'], function(){
  ui.init();
  reservation.init();
});

var reservation = (function () {
  return {init: init};

  function init() {
    customSelect();
  }

  /* 지점선택 select */
  function customSelect(){
    var $obj = $('.custom-select');
    if ($obj.length === 0) {return false;}
    $obj.each(function(){
      var $this = $(this);
      $this.find('dt').off('click').on('click', function(){
        $this.toggleClass('is-open');
      });
      $this.find('dd > p').off('click').on('click', function(){
        var spot = 'main-spot' + $(this).data('spot');
        $(this).addClass('selected').siblings().removeClass('selected');
        $('main').removeAttr('class').addClass(spot);
        $this.find('dt > input').val($(this).text());
        $this.addClass('sel').removeClass('is-open');
        cookie.set('playGroundSpot', spot)
      });
    });
  }
})();
