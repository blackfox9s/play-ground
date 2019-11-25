/* 모듈 호출 */
startJs();

define(['public'], function(){
  ui.init();
  memberInfo.init();
  if($('.children-part').length > 0){childrenReg.init();}
  if($('.my-reservation-part').length > 0){myReservation.init();}
});

/* 자녀등록 */
var childrenReg = (function () {
  var $ele;

  return {init: init};

  function init() {
    inputAutoFormat();
    listSet();
  }

  function listSet(){
    $ele = $('.custom-table.write');
    $ele.find('button.bt-childRegister').off('click').on('click', function(){
      if(!checkFrm($ele)) {return false;}
      var sendData = $ele.serializeSend();
      utils.loading(true, '자녀 등록 중');
      sendData.memberSeq = parseInt(cookie.get('memberSeq'));
      setTimeout(function(){
        ajaxCall.post('/member/api/addChildren.art', {data: sendData, callback:listUpdateAfter});
      }, 100);
    });
  }

  function listUpdateAfter(response){
    if(response.code === '100') {
      memberInfo.init();
      $ele.find('input').val('');
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

/* 조회 */
var myReservation = (function () {
  var $ele, $obj;
  var sendData = {};
  var moment, weekArr = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
  var timeTableSource = {box: '', list:''};
  var timeTableData, timeTableSelectedInfo = null;
  var listState = '', cancleAmount=0;

  return {init: init};

  function init() {
    $ele = $('.my-reservation-part');
    $obj = $ele.find('.my-reservation-list ul');
    moment = require('moment');
    sendData.memberSeq = parseInt(cookie.get('memberSeq'));
    $ele.find('.my-reservation-sch button').off('click').on('click', getReservationList)
  }

  function getReservationList(){
    messageSet($ele.parent(), 'cancelBefore');
    $obj.empty();
    $obj.parent().hide();
    var response = ajaxCall.post('/reservation/api/getReservationDate.art', {data: sendData, isReturn: true});
    if(response.code === '100') {
      var list = response.reservationDateList;
      if(list.length > 0) {
        $obj.parent().show();
        var arr = [parseInt(list.length / 5), list.length % 5];
        var division =  5 * (arr[0] + (arr[1] > 0 ? 1 : 0));
        for(var i=0; i < division; i++) {
          if (i < list.length) {
            $obj.append(htmlReservationList(list[i]));
          } else {
            $obj.append(htmlReservationList(i));
          }
        }
        btnReservationAct();
      } else {
        messageSet($ele, 'custom', ['예약현황이 없습니다.'])
      }
    } else {
      alert(response.msg);
    }
  }
  function htmlReservationList(val){
    if(typeof val === 'number') {
      return '<li class="disabled"><div></div></li>';
    } else {
      var source = '<li><input type="hidden" value="{fullDate}"><div><span>{date}</span></div></li>';
      return source.replace(/({fullDate}|{date})/g, function(v){
        switch(v){
          case '{fullDate}' : return val.programDate;
          case '{date}' : return '' + moment(val.programDate).format('MM/DD') + '</span>';
        }
      });
    }
  }
  function btnReservationAct(){
    $obj.find('li').not('.disabled').off('click').on('click', function(){
      $(this).addClass('active').siblings().removeClass('active');
      sendData.programDate = $(this).find('input').val();
      cancelConfirm(false);
      getTimeTableList();
    });
  }

  function getTimeTableList(){
    var $obj = $ele.find('.timetable');
    var response = ajaxCall.post('/reservation/api/getReservationInfo.art', {data: sendData, isReturn: true});
    if(response.code === '100') {
      timeTableData = response.reservationDateList;
      if(timeTableData.length > 0) {
        $obj.empty().html(htmlTimeTableList('box'));
        $obj.show().siblings().hide();
        for(var i=0; i<timeTableData.length; i++) {
          $obj.find('ul').append(htmlTimeTableList('list', timeTableData[i]));
        }
        scrollMove($obj);
        btnTimeTableListAct();
      } else {
        $obj.empty().hide();
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
          case '{date}' : return sendData.programDate;
          case '{day}' : return weekArr[moment(sendData.programDate).day()];
        }
      });
    } else if(type==='list') {
      if(timeTableSource.list === '') {timeTableSource.list = ajaxCall.html('/mypageTimeTableList.html');}
      return timeTableSource.list.replace(/({idx}|{seq}|{time}|{title}|{amountUnit}|{stateCode}|{state}|{childrenName}|{cancelBtn})/g, function(v){
        switch(v){
          case '{seq}' : return val.reservationSeq;
          case '{time}' : return val.startTime;
          case '{title}' : return val.title;
          case '{amountUnit}' : return utils.numUnit(val.amount);
          case '{stateCode}' : return val.reservationStatus;
          case '{state}' : return val.reservationStatusName;
          case '{childrenName}' : return val.childrenName;
          case '{cancelBtn}' : return val.cancelStatus === 'y' ? '<button class="btn bt-cancel">예약<br />취소</button>' : '';
        }
      });
    }
  }
  function btnTimeTableListAct(){
    $ele.find('.timetable .bt-state').off('click').on('click', function(){
      var $this = $(this).closest('li');
      var idx = $this.index();
      cancelConfirm(false);
      if($this.hasClass('.RS09')) {
        sendData.reservationSeq = '';
        timeTableSelectedInfo = null;
      } else {
        sendData.reservationSeq = parseInt(timeTableData[idx].reservationSeq);
        timeTableSelectedInfo = timeTableData[idx];
      }
      $ele.find('.timetable li').removeClass('active');
      $this.addClass('active');
      cancelConfirm(false);
    });
    $ele.find('.timetable .bt-cancel').off('click').on('click', function() {
      listState = $(this).parents('li').attr('data-state');
      cancleAmount = $(this).parents('li').find('.program-amount').html();
      getTimeTableCancelCheck();
    });
    $ele.find('.bt-cancel-no').off('click').on('click', function(){
      cancelConfirm(false);
      timeTableSelectedInfo = null;
      $ele.find('.timetable li').removeClass('active');
    });
    $ele.find('.bt-cancel-yes').off('click').on('click', function(){
      if(getTimeTableCancelCheck('whether') && timeTableSelectedInfo !== null) {
        utils.loading(true, '예약취소중');
        setTimeout(getCancelComplete, 500);
      }
    });
  }

  function getTimeTableCancelCheck(val){
    var $obj = $ele.find('.my-reservation-detail');
    var response = ajaxCall.post('/reservation/api/reservationCancelCheck.art', {data: sendData, isReturn: true});
    if(val === 'whether') {
      return !(response.code !== '100' && response.code !== '308')
    } else {
      if(response.code === '100') {
        cancelConfirm(true);
        scrollMove($ele.find('.my-reservation-cancel-confirm'));
      } else if(response.code === '308'){
        cancelConfirm(true);
        messageSet($obj, 'custom', [response.msg])
      } else {
        cancelConfirm(false);
        timeTableSelectedInfo = null;
        messageSet($obj, 'custom', [response.msg])
      }
    }
  }

  function getCancelComplete(){
    utils.loading(false);
    var response = ajaxCall.post('/reservation/api/reservationCancel.art', {data: sendData, isReturn: true});
    cancelConfirm(false);
    if(response.code === '100') {
      $ele.find('.custom-table .point').html(utils.numUnit(response.point));
      getTimeTableList();
      messageSet($ele, 'cancelComplete' + listState, [cancleAmount]);
      listState = '';
      cancleAmount = 0;
    } else {
      messageSet($ele, 'custom', [response.msg]);
    }
  }

  function cancelConfirm(is) {
    var $obj = $ele.find('.my-reservation-cancel-confirm');
    if(is) {
      $obj.show();
    } else {
      messageSet($ele.parent(), 'cancelBefore');
      $obj.hide();
    }
  }
})();
