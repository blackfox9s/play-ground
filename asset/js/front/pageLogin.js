/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui'], function(){
  ui.init();
  login.init();
});

var login = (function () {
  return {init: init};

  function init() {
    customSelect();
    loginBtnAct();
    joinBtnAct();
    inputAutoFormat();
    ui.agreeCheck();
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

  /* 로그인 Btn 처리 */
  function loginBtnAct(){
    var $ele = $('.login-form');
    $ele.find('button.bt-login').off('click').on('click', function(){
      if(!checkFrm($ele)) {return false;}
      var sendData = $ele.serializeSend();
      utils.loading(true, 'login');
      setTimeout(function(){
        ajaxCall.get('/member/api/login.art', {data:sendData, callback:btnActResult});
      }, 100);
    });
  }

  /* 회원가입 Btn 처리 */
  function joinBtnAct(){
    var $ele = $('.signup-form');
    $ele.find('button.bt-join').off('click').on('click', function(){
      if(!checkFrm($ele)) {return false;}
      var sendData = $ele.serializeSend();
      if(sendData.password !== sendData.passwordConfirm) {
        alert('비밀번호를 다시 확인해주세요.');
        return false;
      }
      utils.loading(true, 'join');
      setTimeout(function(){
        ajaxCall.get('/member/api/signup.art', {data: sendData, callback:btnActResult});
      }, 100);
    });
  }

  /* 로그인/회원가입 버튼 클릭 후 Action */
  function btnActResult(response){
    if(response.code === '100') {
      ui.loginCookie(response.member);
    } else {
      alert(response.msg);
      utils.loading(false);
    }
  }

  /* 자동완성 */
  function inputAutoFormat(){
    $('[name="phone"]').on('keyup', function(){
      $(this).val(utils.autoPhone($(this).val().trim()));
    });
  }
})();
