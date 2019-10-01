/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui'], function(){
  ui.init();
  if($('.children-part').length > 0){children.init();}
  if($('.reservation-part').length > 0){reservation.init();}
});

var memberInfo = (function () {
  var $ele, $parent, $child;

  return {init: init};

  function init(){
    $ele = $('.custom-table.view');
    $parent =$ele.find('[data-info="parent"]');
    $child = $ele.find('[data-info="child"]');

    info();
  }

  function info(){
    var sendData = {
      memberSeq : parseInt(cookie.get('memberSeq'))
    };
    var response = ajaxCall.post('/member/getMember.art', {data: sendData, isReturn: true});

    $ele.find('dd').not('dd.no-list').remove();
    if(response.code === '100') {
      $parent.append(infoList(response.member));
      infoCheck($parent, response.member);
      infoCheck($child, response.children);
      for(var i=0; i<response.children.length; i++) {
        $child.append(infoList(response.children[i]));
      }
    } else {
      alert(response.msg);
    }
  }

  function infoCheck(obj, val){
    if(utils.empty(val)) {
      obj.find('.no-list').show();
    } else {
      obj.find('.no-list').hide();
    }
  }

  function infoList(val){
    var source = '<dd><p>{name}</p><p>{info}</p></dd>';
    return source.replace(/({name}|{info})/g, function(v){
      switch(v){
        case '{name}' : return val.name;
        case '{info}' : return (val.childrenCount ? utils.autoPhone(val.phone) : (val.month < 37 ? val.month + '개월' : val.age +'세'));
      }
    });
  }
})();

var reservation = (function () {
  return {init: init};

  function init() {
    if($('.children-part').length > 1){}
  }

  function childrenSet(){
    console.log('자년 등록')
  }
})();

var children = (function () {
  return {init: init};

  function init() {
    memberInfo.init();
    inputAutoFormat();
    listSet();
  }

  function listSet(){
    var $ele = $('.custom-table.write');
    $ele.find('button.bt-childRegister').off('click').on('click', function(){
      if(!checkFrm($ele)) {return false;}
      var sendData = $ele.serializeSend();
      utils.loading(true, '자녀 등록 중');
      sendData.memberSeq = cookie.get('memberSeq');
      setTimeout(function(){
        ajaxCall.post('/member/addChildren.art', {data: sendData, callback:listUpdateAfter});
      }, 100);
    });
  }

  function listUpdateAfter(response){
    if(response.code === '100') {
      memberInfo.init();
    } else {
      alert(response.msg);
    }
    utils.loading(false);
  }

  function inputAutoFormat(){
    $('[name="birthday"]').on('keyup', function(){
      $(this).val(utils.autoBirthDay($(this).val().trim()));
    });
  }
})();
