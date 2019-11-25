/* 모듈 호출 */
startJs();

define(['public'], function(){
  ui.init();
  if($('.reservation-part').length > 0){reservation.init();}
  if($('.charge-part').length > 0){charge.init();}
});

/* 예약 */
var reservation = (function () {
  var $ele, $charge, sendData = {}, calenderSelected = {};
  var point = 0;
  var timeTableSource = {box: '', list:''};
  var timeTableData;

  return {init: init};

  function init() {
    if(parseInt(cookie.get('childrenCount')) === 0) {
      location.href = isLocal ? '/member/children.html' : '/member/children.art';
    } else {
      memberInfo.init('select');
      sendData.memberSeq = parseInt(cookie.get('memberSeq'));
      $ele = $('.reservation-part');
      $charge = $ele.find('.charge-list');
      point = parseInt($('[name="point"]').val());
      ui.datePicker($('.data-picker'), calenderSelectAction);
      childrenSelectAction();
      charge.init();
    }
  }

  /* 자녀선택 */
  function childrenSelectAction(){
    var $obj = $('[data-info="child"]');
    $obj.find('dd').not('.no-list').off('click').on('click', function(){
      sendData.childrenSeq = parseInt($(this).find('input').val());
      $(this).addClass('active').siblings().removeClass('active');
      timeTableSchCheck();
    });
  }

  /* 달력선택 */
  function calenderSelectAction(date, day){
    calenderSelected = {date:date, day: day};
    sendData.programDate = date;
    timeTableSchCheck();
  }

  /* 자녀/달력 선택값 체크 후 강좌 조회 */
  function timeTableSchCheck(){
    if(sendData.programDate && !sendData.childrenSeq) {
      $ele.find('.timetable').empty();
      messageSet($ele, 'resChildNoSelect');
      return false;
    } else if(!sendData.programDate) {
      messageSet($ele, 'remove');
      return false;
    } else {
      messageSet($ele, 'remove');
      setTimeout(getTimeTableList, 300);
    }
  }

  /* 요일별 강좌 조회*/
  function getTimeTableList(){
    var $obj = $ele.find('.timetable');
    var response = ajaxCall.post('/reservation/api/getTimetable.art', {data: sendData, isReturn: true});
    if(response.code === '100') {
      timeTableData = response.timetable;
      messageSet($ele, 'remove');
      if(timeTableData.length > 0) {
        $obj.empty().html(htmlTimeTableList('box'));
        for(var i=0; i<timeTableData.length; i++) {
          $obj.find('ul').append(htmlTimeTableList('list', timeTableData[i]));
        }
        $obj.show().siblings().hide();
        scrollMove($obj);
        btnTimeTableListAct();
      } else {
        $obj.empty().hide();
        messageSet($ele, 'custom', ['수업이 없습니다.']);
      }
    } else {
      alert(response.msg);
    }
  }
  function htmlTimeTableList(type, val){
    if(type==='box'){
      if(timeTableSource.box === '') {timeTableSource.box = ajaxCall.html('/reservationTimeTableBox.html');}
      return timeTableSource.box.replace(/({date}|{day})/g, function(v){
        switch(v){
          case '{date}' : return calenderSelected.date;
          case '{day}' : return calenderSelected.day;
        }
      });
    } else if(type==='list') {
      if(timeTableSource.list === '') {timeTableSource.list = ajaxCall.html('/reservationTimeTableList.html');}
      return timeTableSource.list.replace(/({seq}|{time}|{title}|{amount}|{disabled}|{joinCount}|{capacity})/g, function(v){
        switch(v){
          case '{seq}' : return val.timetableSeq;
          case '{time}' : return val.startTime;
          case '{title}' : return val.title;
          case '{amount}' : return utils.numUnit(val.amount);
          case '{disabled}' : return (parseInt(val.capacity) === parseInt(val.joinCount)) ? 'disabled' : '';
          case '{joinCount}' : return val.joinCount;
          case '{capacity}' : return val.capacity;
        }
      });
    }
  }
  function btnTimeTableListAct(){
    $ele.find('.bt-toggle').off('click').on('click', function(){
      var $this = $(this).closest('li');
      sendData.timetableInfo = timeTableData[$this.index()];
      sendData.timetableSeq = sendData.timetableInfo.timetableSeq;
      $charge.hide();
      messageSet($ele, 'remove');

      // 영업 시간인체 입금 체크 가능한 시간 체크 추가
      if(point < sendData.timetableInfo.amount && openTimeCheck().code !== '100') {
        messageSet($ele, 'resPointTimeCheck');
      } else {
        $this.addClass('active').siblings().removeClass('active');
        $this.find('.detail-child-list').html(getTimeTableMemberList());
      }
    });
    $ele.find('.bt-booking').off('click').on('click', function(){
      var $selectMsg = $ele.find('.timetable-select');
      var source = '<span>{date}({day}) {time}</span><em>{title}</em>를 선택하셨습니다.<br />' +
        '아래 버튼을 눌러 예약을 진행해 주세요.';
      source = source.replace(/({date}|{day}|{time}|{title})/g, function(v){
        switch(v){
          case '{date}' : return calenderSelected.date;
          case '{day}' : return calenderSelected.day;
          case '{time}' : return sendData.timetableInfo.startTime;
          case '{title}' : return sendData.timetableInfo.title;
        }
      });
      $selectMsg.empty().html(source).show();
      scrollMove($selectMsg);

      /* (포인트-결제금액)상태별 버튼 노출 상태 변경 */
      $charge.show();
      if(point >= sendData.timetableInfo.amount){
        $charge.find('li').show().filter('[data-depositType!="DT00"]').hide();
      } else {
        $charge.find('li').show().filter('[data-depositType="DT00"]').hide();
      }
    });
    $charge.find('li').off('click').on('click', function(){
      sendData.depositType = $(this).attr('data-depositType');
      booking();
    });
  }

  function openTimeCheck(){
    return ajaxCall.post('/reservation/api/isOpen.art', {data: sendData, isReturn: true})
  }

  /* 강좌별 수강생 목록 */
  function getTimeTableMemberList(){
    var response = ajaxCall.post('/reservation/api/getTimetableMember.art', {data: sendData, isReturn: true});
    var source = '예약한 자녀가 없습니다.';
    var list = response.timetableMember;
    if(response.code === '100' && list.length > 0) {
      source = '';
      for(var i=0; i< list.length; i++) {
        var info = list[i];
        source += '<span>'+ utils.nameHidden(info.name) + '</span>'
      }
    }
    return source;
  }

  /* 예약 진행 */
  function booking(){
    var response = ajaxCall.post('/reservation/api/reservation.art', {data: sendData, isReturn: true});
    if(response.code === '100') {
      point = response.point;
      bookingComplete();
      messageSet($ele, 'resSuccess', {
        date: calenderSelected.date,
        day: calenderSelected.day,
        time: sendData.timetableInfo.startTime,
        title: sendData.timetableInfo.title
      });
    } else if(response.code === '302' && sendData.depositType === 'DT01') {
      bookingComplete();
      messageSet($ele, 'charge');
    } else if(response.code === '302' && sendData.depositType === 'DT02') {
      setTimeout(function(){
        location.href = isLocal ? '/reservation/charge.html' : '/reservation/charge.art';
      }, 500);
    } else {
      messageSet($ele, 'custom', [response.msg]);
    }
  }
  function bookingComplete() {
    $ele.find('.custom-table .point').html(utils.numUnit(point));
    $ele.find('.timetable-group > div').hide();
  }
})();

/* 회원권 충전 */
var charge = (function () {
  var $ele, $obj, $itemDT02;
  var list = [];
  return {init: init};

  function init() {
    $ele = $('.charge-part');
    $obj = $('.charge-list');
    $obj.prepend(ajaxCall.html('/reservationCharge.html'));
    if($ele.length === 1) {
      $obj.find('li').filter(function(){
        if($(this).attr('data-depositType') === 'DT02') {
          return $(this);
        } else {
          $(this).remove();
        }
      }).addClass('active');
      getList();
    }
  }

  function getList(){
    var response = ajaxCall.post('/reservation/api/getPointType.art', {isReturn: true});
    if(response.code === '100') {
      $obj.find('.season-ticket').empty();
      list = response.pointTypeList;
      for(var i=0; i< list.length; i++) {
        $obj.find('.season-ticket').append(htmlList(list[i]))
      }
      btnListAct();
    }
  }

  function htmlList(val){
    var source = '<div class="st-item" data-seq="{seq}">' +
      '  <input type="hidden" value="{deposit}">' +
      '  <span class="deposit"><i>구매</i><em>{depositAmount}</em></span>' +
      '  <span class="arrow"><i class="fas fa-play"></i></span>' +
      '  <span class="point"><i>적립</i><em>{pointAmount}</em></span>' +
      '  <span class="sel"><button>선택</button></span>' +
      '</div>';
    return source.replace(/({seq}|{deposit}|{depositAmount}|{pointAmount})/g, function(v){
      switch(v){
        case '{seq}' : return val.seq;
        case '{deposit}' : return val.depositAmount;
        case '{depositAmount}' : return utils.numUnit(val.depositAmount);
        case '{pointAmount}' : return utils.numUnit(val.pointAmount);
      }
    });
  }

  function btnListAct() {
    $itemDT02 =  $obj.find('.st-item');
    var sendData = {
      memberSeq : parseInt(cookie.get('memberSeq')),
      depositType : 'DT02'
    };
    if($ele.length > 0){
      $itemDT02.find('button').off('click').on('click', function(){
        var $parent = $(this).closest('.st-item');
        var point = $parent.find('.point em').text();
        sendData.depositAmount = parseInt($parent.find('input').val());
        if(confirm('회원권 [적립 '+ point +'원]을 신청하시겠습니까?')) {
          setDeposit(sendData);
          $parent.addClass('act').siblings().removeClass('act');
          $itemDT02.find('button').prop('disabled', true);
          $ele.find('.charge-complete span').html(point);
        } else {
          $parent.removeClass('act');
        }
      });
    }
  }

  function setDeposit(sendData){
    var response = ajaxCall.post('reservation/api/deposit.art', {data: sendData, isReturn: true});
    if (response.code === '100') {
      $ele.find('.guide').text('회원권 신청이 완료되었습니다.');
      $ele.find('.charge-complete').show();
      messageSet($ele, 'charge');
    } else {
      if (response.code === '305') {
        $ele.find('.guide').hide();
      } else {
        $ele.find('.guide').show().text('선택 버튼을 누르면 회원권 신청이 완료됩니다.');
      }
      $ele.find('.charge-complete').hide();
      $itemDT02.find('button').prop('disabled', false);
      messageSet($ele, 'custom', [response.msg]);
    }
  }
})();
