/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui'], function(){
  ui.init();
  login.init();
});

var login = (function () {
  var $ele;

  return {init: init};

  function init() {
    $ele = $('.login-form');
    customSelect();
    loginBtnAct();
  }

  /* 지점선택 select */
  function customSelect(){
    var $obj = $('.custom-select');
    if ($obj.length === 0) {return false;}
    $obj.each(function(){
      var $this = $(this);
      var active = function(o){
        var spot = 'main-spot' + o.data('spot');
        o.addClass('selected').siblings().removeClass('selected');
        $('main').removeAttr('class').addClass(spot);
        $this.find('dt > input').val(o.text());
        $this.addClass('sel').removeClass('is-open');
        cookie.set('playGroundSpot', spot)
      };
      active($this.find('dd > p.selected'));
      $this.find('dt').off('click').on('click', function(){$this.toggleClass('is-open');});
      $this.find('dd > p').off('click').on('click', function(){active($(this));});
    });
  }

  function loginBtnAct(){
    $ele.find('button.bt-login').off('click').on('click', function(){
      if(!checkFrm($ele)) {return false;}
      utils.loading(true, 'login')
      ajaxCall.get('/member/login.art', {data:$ele.serializeSend(), callback:loginBtnActResult});
    });
  }

  function loginBtnActResult(response){
    if(response.code === '100') {
      ui.loginCookie(response.member);
    } else {
      alert(response.msg);
    }
  }
})();
