"use strict";

var bustDate = new Date();
var bustTime = bustDate.getFullYear() + '' +  (bustDate.getMonth() + 1) + bustDate.getDate() + '' + + bustDate.getHours() + '' + 20/*bustDate.getTime()*/;

var module = {
  waitSeconds: 0,
  urlArgs : function(url){
    var args = '?bust=' + bustTime;
    if(url === 'post'){args += '&autoload=false';}
    return args;
  },
  paths: {
    /* libs */
    'jquery' : '/asset/js/libs/jquery',
    'form' : '/asset/js/libs/form.min',
    'underscore' : '/asset/js/libs/underscore',
    'moment' : '/asset/js/libs/moment.min',
    'picker' : '/asset/js/libs/datetimepicker',

    /* common */
    'utils' : '/asset/js/fun/utils',
    'check' : '/asset/js/fun/check',

    /* admin */
    'adminUi' : '/asset/js/admin/ui',
    'adminDevelop' : '/asset/js/admin/develop',

    /* front */
    'ui' : '/asset/js/front/ui',
  },
  //의존성 관리 라이브러리 플러그인 별 의존성 추가
  shim:{
    underscore : {exports: '_'},
    picker : {deps: ['jquery', 'moment']},
    check : {deps: ['jquery', 'underscore']},
    utils : {deps: ['jquery']},
    adminDevelop : {deps: ['jquery', 'form', 'underscore']},
    adminUi : {deps: ['jquery', 'underscore', 'picker']},
    ui : {deps: ['jquery', 'underscore', 'picker']},
  }
};

//설정 호출 함수
function startJs () {requirejs.config(module);};
