var isLocal = (location.href.indexOf('.html') > -1);

var ui = (function () {
  var autoLogout;
  return {
    init: init,
    loginCheck:loginCheckRedirect,
    loginCookie: loginCookieSet,
    agreeCheck: agreeCheck,
    datePicker:datePickerSetting,
    logout:logout,
    termsPopupOpen: termsPopupOpen,
  };

  function init() {
    loginCheckRedirect();
    menuActive();
  }

  /* 로그인 체크 후 리다이렉트 & 쿠키갱신 */
  function loginCheckRedirect(){
    var loginPageCheck = ($('.login-form').length > 0);
    var signupPageCheck = ($('.signup-form').length > 0);
    if(!cookie.get('memberSeq')) {
      if(!loginPageCheck && !signupPageCheck) {
        location.href = isLocal ? '/member/login.html' : '/index.art';
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

    autoLogout = setInterval(function(){
      logout();
      clearInterval(autoLogout);
    }, 1000*60*30);

    if(info) {loginCheckRedirect();}
  }
  function logout(){
    cookie.del('childrenCount');
    cookie.del('phone');
    cookie.del('memberSeq');
    location.reload();
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
      moment.lang('ko', {
        weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
        weekdaysShort: ["일","월","화","수","목","금","토"],
      });

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
            var targetMoment = moment(targetDate);
            call(targetMoment.format(format), targetMoment.format('dddd'));
          }
        };
        $this.dtpicker(config);
        if(!$this.data('today')) {
          $this.find('td.active.today').removeAttr('class');
        }
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

  /* 약관 */
  function termsPopupOpen(type) {
    var $terms = $('[data-pop-name="terms"]');
    var response = ajaxCall.post('member/api/terms.art', {
      isReturn: true,
      data: {termsCode: type}
    });
    $terms.find('h1').html(response.terms.termsTitle);
    $terms.find('.pop-terms-contents').html(response.terms.termsDescription);
    popup.layerOpen('terms')
  }
})();

var ajaxCall = (function(){
  var protocol = location.protocol;
  var host = location.host;
  var port = location.port;
  var serverURL = protocol + '//' + host + '/';
  var restURL = port ? 'http://gold.artichildren.com/' : serverURL;

  return {
    post:postAct,
    get:getAct,
    html: htmlAct
  };

  function postAct(dataURL, option){
    var returnValue = '';
    var isReturn = (option.isReturn === undefined ? false : option.isReturn);
    var callback = (option.callback === undefined ? false : option.callback);
    var data = (option.data === undefined ? '' : option.data);

    $.ajax({
      cache : false,
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
      data: data
    }).done(function (response) {
      if(isReturn) {returnValue = response;}
      if(callback) {callback(response);}
    }).fail(function(xhr, status, errorThrown) {
      console.log(xhr);
      console.log(status);
      console.log(errorThrown);
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
      cache : false,
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
    }).fail(function(xhr, status, errorThrown) {
      console.log(xhr);
      console.log(status);
      console.log(errorThrown);
    });

    if(isReturn) {
      return returnValue;
    }
  }

  function htmlAct(dataUrl){
    var returnValue = '';
    $.ajax({
      cache : false,
      async: false,
      url: '../asset/js/front/html/' + dataUrl,
      dataType : 'html',
      xhrFields: {withCredentials: true},
      success: function (data) {
        returnValue = data;
      }
    });
    return returnValue;
  }
})();

function scrollMove(obj){
  $('html, body').animate({scrollTop: obj.offset().top}, 200);
}
