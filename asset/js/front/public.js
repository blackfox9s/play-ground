/* 회원정보 */
var memberInfo = (function () {
  var $ele, $parent, $child;
  var viewType;

  return {init: init};

  function init(type){
    $ele = $('.custom-table.view');
    $parent =$ele.find('[data-info="parent"]');
    $child = $ele.find('[data-info="child"]');
    viewType = type;
    info();
  }

  function info(){
    var sendData = {
      memberSeq : parseInt(cookie.get('memberSeq'))
    };
    var response = ajaxCall.post('/member/api/getMember.art', {data: sendData, isReturn: true});

    $ele.find('dd').not('dd.no-list').remove();
    if(response.code === '100') {
      $parent.append(infoList(response.member));
      infoCheck($parent, response.member);
      infoCheck($child, response.children);
      cookie.set('childrenCount', response.children.length);
      $ele.find('.point').html(utils.numUnit(response.point));
      $('[name="point"]').val(response.point);
      for(var i=0; i<response.children.length; i++) {
        $child.append(infoList(response.children[i]));
      }
    } else {
      if(response.msg !== undefined) {
        alert(response.msg);
      }
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
    var source = '<dd><input type="hidden" value="{seq}" /><p>{name}</p><p>{info}</p></dd>';
    if (viewType === 'select') {
      source = '<dd><input type="hidden" value="{seq}" /><p>{name}</p><p>{info}</p><p class="sel"><span>선택</span></p></dd>';
    }
    return source.replace(/({seq}|{name}|{info})/g, function(v){
      switch(v){
        case '{seq}' : return val.childrenSeq;
        case '{name}' : return val.name;
        case '{info}' : return (val.phone ? utils.autoPhone(val.phone) : (val.month < 37 ? val.month + '개월' : val.age +'세'));
      }
    });
  }
})();

function messageSet($obj, type, customArr){
  if(type === 'remove') {
    $obj.find('.message-art').remove();
    return false;
  }
  var targetTxt = [], replaceSource;
  var source = '<div class="message-art">' +
    '<p class="txt1"><span>{txt1}</span></p>' +
    '{txt2}' +
    '{txt3}' +
    '</div>';
  var txtArray = {
    resPointTimeCheck: ['현재는 예약을<br />진행할 수 없습니다.'],
    resChildNoSelect: ['자녀를 선택해주세요.'],
    resSuccess : [' 예약이 완료되었습니다.<br />취소는 24시간 전까지 가능합니다'],
    charge: [
      '<strong>입금 안내 문자</strong>를 확인하시고<br>입금을 진행해 주시기 바랍니다.',
      '입금 신청 후, 1시간 내에 입금하셔야<br />예약 확정이 정상적으로 진행됩니다.'
    ],
    cancel : [],
    cancelBefore: [
      '예약취소는 <strong>놀이 시작 시간<br /> 24시간 전까지 가능</strong>합니다.'
    ],
    cancelContinue: [
      '예약금 환불이 가능합니다.'
    ],
    cancelComplete : [
      '예약 취소가 완료되었습니다.',
      '환불방법 : 010-9578-8278 연락처로<br />[취소날짜, 시간, 아이이름]<br />계좌번호(계좌명)를 남겨주세요.',
      '매일 저녁 일괄적으로 환불처리 도와드리겠습니다.'
    ]
  };

  switch(type) {
    case 'resPointTimeCheck' : targetTxt = txtArray.resPointTimeCheck; break;
    case 'resChildNoSelect' : targetTxt = txtArray.resChildNoSelect; break;
    case 'resSuccess' : targetTxt = txtArray.resSuccess; break;
    case 'charge' : targetTxt = txtArray.charge; break;
    case 'cancel' : targetTxt = txtArray.cancel; break;
    case 'cancelBefore' : targetTxt = txtArray.cancelBefore; break;
    case 'cancelNot' : targetTxt = txtArray.cancelNot; break;
    case 'cancelContinue' : targetTxt = txtArray.cancelContinue; break;
    case 'cancelComplete' : targetTxt = txtArray.cancelComplete; break;
    case 'custom' : targetTxt = customArr; break;
  }
  if(type === 'resSuccess') {
    targetTxt[0] =  customArr.date + '('+ customArr.day +') '+ customArr.time +'<br />' +
      customArr.title + ' ' + targetTxt[0]
  }

  replaceSource = source.replace(/({txt1}|{txt2}|{txt3})/g, function(v){
    switch(v){
      case '{txt1}' : return targetTxt[0];
      case '{txt2}' : return targetTxt[1] ? '<p class="txt2">'+ targetTxt[1] +'</p>' : '';
      case '{txt3}' : return targetTxt[2] ? '<p class="txt2">'+ targetTxt[2] +'</p>' : '';
    }
  });
  $('.message-art').remove();
  $obj.append(replaceSource);
  $obj.find('.message-art').show();
  scrollMove($obj.find('.message-art'));
}
