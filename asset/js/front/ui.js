var ui = (function () {
  return {
    init: init,
    loginCheck:loginCheckRedirect,
    loginCookie: loginCookieSet,
    agreeCheck: agreeCheck,
    datePicker:datePickerSetting
  };

  function init() {
    loginCheckRedirect();
    menuActive();
  }

  /* 로그인 체크 후 리다이렉트 & 쿠키갱신 */
  function loginCheckRedirect(){
    var loginPageCheck = ($('.login-form').length > 0);
    var signupPageCheck = ($('.signup-form').length > 0);
    var isLocal = (location.href.indexOf('.html') > -1);
    if(!cookie.get('memberSeq')) {
      if(!loginPageCheck && !signupPageCheck) {
        location.href = isLocal ? '/member/login.html' : '/';
      }
    } else {
      loginCookieSet();
      if(loginPageCheck || signupPageCheck) {
        if(parseInt(cookie.get('childrenCount')) === 0) {
          location.href = isLocal ? '/member/children.html' : '/member/children.art';
        } else {
          location.href = isLocal ? '/front/schedule.html' : '/timetable/info.art';
        }
      }
    }
  }
  function loginCookieSet(info) {
    var data = {}, options = {expires_hour : 0.5};
    if(!info) {
      data.memberSeq = cookie.get('memberSeq');
      data.phone = cookie.get('phone');
      data.childrenCount = cookie.get('childrenCount');
    } else {
      data = info
    }
    cookie.set('memberSeq', data.memberSeq, options);
    cookie.set('phone', data.phone, options);
    cookie.set('childrenCount', data.childrenCount, options);
    if(info) {loginCheckRedirect();}
  }

  /* 메뉴 */
  function menuActive() {
    var $ele = $('#wrap');
    var spot = cookie.get('playGroundSpot');
    if(spot) {$('main').addClass(spot);}
    $ele.find('footer [data-menu="'+ $ele.data('act-menu') +'"] a').addClass('act');
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

  /* agree */
  function agreeCheck(){
    $('.agree-field-list').each(function(){
      var $target = $(this);
      var $dt = $target.find('dt input');
      var $dd = $target.find('dd input');
      $dt.off('click').on('click', function(){
        if($dt.is(':checked')){
          $dd.prop('checked', true);
        }else{
          $dd.prop('checked', false);
        }
      });
      $dd.off('click').on('click', function(){
        if($dd.length === $(this).parents('dl').find('dd input:checked').length){
          $dt.prop('checked', true);
        }else{
          $dt.prop('checked', false);
        }
      });
    });
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
    var returnValue = '';
    var isReturn = (option.isReturn === undefined ? false : option.isReturn);
    var callback = (option.callback === undefined ? false : option.callback);
    var data = (option.data === undefined ? '' : option.data);

    $.ajax({
      async: false,
      crossDomain: true,
      url: restURL + dataURL,
      type: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
      },
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

  function multypart(){
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
})();
