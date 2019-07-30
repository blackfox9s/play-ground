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
    'jquery' : 'libs/jquery',
    'underscore' : 'libs/underscore',
    'moment' : 'libs/moment.min',

    /* fun */
    'utils' : 'fun/utils',
    'check' : 'fun/check',
    'develop' : 'develop',
  },
  //의존성 관리 라이브러리 플러그인 별 의존성 추가
  shim:{
    underscore : {exports: '_'},
    check : {deps: ['jquery']},
    develop : {deps: ['jquery', 'underscore']},
  }
};

//설정 호출 함수
function startJs () {requirejs.config(module);};
