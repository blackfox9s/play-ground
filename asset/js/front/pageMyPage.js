/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui'], function(){
  ui.init();
  reservation.init();
});

var reservation = (function () {
  return {init: init};

  function init() {
    ui.datePicker($('.data-picker'), calenderAct);
    inputAutoFormat();
  }

  /* 달력 클릭 시 액션 */
  function calenderAct(date){}

  function inputAutoFormat(){
    $('[data-name="birthday"]').on('keyup', function(){
      $(this).val(utils.autoBirthDay($(this).val().trim()));
    });
    $('[data-name="phone"]').on('keyup', function(){
      $(this).val(utils.autoPhone($(this).val().trim()));
    });
  }

})();
