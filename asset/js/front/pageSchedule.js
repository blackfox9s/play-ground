/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'check', 'utils', 'ui', 'slick'], function(){
  ui.init();
  schedule.init();
});

var schedule = (function () {
  var $ele;
  return {init: init};

  function init() {
    $ele = $('.schedule-part');
    getTimetableImage();
  }

  function getTimetableImage(){
    var $slide = $ele.find('.slider');
    var response = ajaxCall.get('timetable/api/getTimetableImage.art', {isReturn: true});
    if(response.code === '100') {
      var resData = response.timetableImage;
      if(resData.length > 0) {
        for(var i=0; i<resData.length; i++) {
          $slide.append(htmlTimetableImage(resData[i]));
        }
        $slide.slick({
          dots: false,
          infinite: true,
          speed: 300,
          swipe: false,
          slidesToShow: 1,
          adaptiveHeight: true
        });
      }
    } else {
      alert(response.msg);
    }
  }
  function htmlTimetableImage(val){
    var source = '<div class="item"><img src="{src}" /></div>';
    return source.replace(/({src})/g, function(v){
      switch(v){
        case '{src}' : return val.url;
      }
    });
  }
})();
