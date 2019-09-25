var ui = (function () {
  return {
    init: init,
    loginCheck:loginCheckRedirect,
    loginCookie: loginCookieSet,
    datePicker:datePickerSetting
  };

  function init() {
    loginCheckRedirect();
    resize();
    menuActive();
  }

  /* 로그인 체크 후 리다이렉트 & 쿠키갱신 */
  function loginCheckRedirect(){
    var loginPageCheck = ($('.login-form').length > 0);
    var isLocal = (location.href.indexOf('.html') > -1);
    if(!cookie.get('memberSeq')) {
      if(!loginPageCheck) {
        location.href = isLocal ? '/front/login.html' : '/';
      }
    } else {
      loginCookieSet();
      if(loginPageCheck) {
        location.href = isLocal ? '/front/schedule.html' : '/timetable/info.art';
      }
    }
  }
  function loginCookieSet(info) {
    var data = {}, option = {expires_hour : 0.5};
    if(!info) {
      data.memberSeq = cookie.get('memberSeq');
      data.phone = cookie.get('phone');
    } else {
      data = info
    }
    cookie.set('memberSeq', data.memberSeq, option);
    cookie.set('phone', data.phone, option);
    if(info) {loginCheckRedirect();}
  }

  /* 메뉴 */
  function menuActive() {
    var $ele = $('#wrap');
    if($ele.hasClass('page')) {
      var spot = cookie.get('playGroundSpot');
      if(spot){$('main').addClass(spot);}
    }
    $ele.find('footer [data-menu="'+ $ele.data('act-menu') +'"] a').addClass('act');
  }

  /* resize */
  function resize() {
    var standard = {width: 840, fontSize: 36};
    var docEl = document.documentElement;
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    var recalc = function(){
      var cWidth = docEl.clientWidth, size;
      if (!cWidth) return;
      if (cWidth < standard.width) {
        size = parseInt(standard.fontSize * (cWidth / standard.width), 10);
        if (size < 14) {
          size = 14;
        }
      } else {
        size = standard.fontSize;
      }
      docEl.style.fontSize = size + 'px';
    };

    recalc();
    if (!document.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false);
  }

  /* calender */
  function datePickerSetting($obj, call){
    require(['moment'], function(moment) {
      $obj.each(function(){
        var $this = $(this);
        var format = 'YYYY-MM-DD';
        var config = {
          locale: 'ko',
          dateFormat: format,
          autodateOnStart: false,
          animation: false,
          closeOnSelected: true,
          dateOnly: true,
          todayButton: false,
          closeButton: false,
          futureOnly: true,
          calendarMouseScroll: false,
          onSelect : function(handler, targetDate){
            call(moment(targetDate).format(format));
          }
        };
        $this.dtpicker(config);
      });
    })
  }
})();

var ajaxCall = (function(){
  var restURL = 'http://218.232.122.36:8080';
  return {
    post:postAct,
    get:getAct,
    put:putAct,
    delete:delAct,
  };

  function postAct(dataURL, option){
    var callback = (option.callback === undefined ? false : option.callback);
    var data = (option.data === undefined ? '' : option.data);
    $.ajax({
      async: true,
      crossDomain: true,
      url: restURL + dataURL,
      method: 'POST',
      headers: { 'cache-control': 'no-cache' },
      processData: false,
      contentType: false,
      mimeType: 'multipart/form-data',
      data: data,
    }).done(function (response) {
      if(callback) {callback(JSON.parse(response));}
    });
  }

  function getAct(dataURL, option){
    var returnValue = '';
    var isReturn = (option.isReturn === undefined ? false : option.isReturn);
    var callback = (option.callback === undefined ? false : option.callback);
    var data = (option.data === undefined ? '' : option.data);
    $.ajax({
      async: false,
      crossDomain: true,
      url: restURL + dataURL,
      type: 'get',
      headers: { 'cache-control': 'no-cache' },
      xhrFields: {withCredentials: true},
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: data,
    }).done(function (response) {
      if(isReturn) {returnValue = response;}
      if(callback) {callback(response);}
    });
    if(isReturn) {
      return returnValue;
    }
  }

  function putAct(){}

  function delAct(){}
})();
