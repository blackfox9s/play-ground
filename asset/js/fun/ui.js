var ui = (function () {
  return {init: init};

  function init() {
    menuActive();
    tab();
    datePickerSetting();
  }

  function menuActive() {
    var $ele = $('#admin-wrap'), $menu = $ele.find('.menu'), $dep1, $dep2;
    var actDep1 = $ele.attr('data-dep1'), actDep2 = $ele.attr('data-dep2');

    $dep1 = $menu.find('.dep1').filter('[data-dep1="'+ actDep1 +'"]');
    $dep2 = $dep1.find('[data-dep2="'+ actDep2 +'"]');
    $dep1.addClass('active');
    $dep2.addClass('active');

    if($dep1.length > 0) {depsText($dep1.find('> a').text());}
    if($dep2.length > 0) {depsText($dep2.find('> a').text());}
  }
  function depsText(text) {
    var depHtml = '<i class="fas fa-chevron-right"></i><span>{deps}</span>';
    var source = depHtml.replace(/({deps})/g, text);
    $('.title-sec').append(source);
  }

  function tab(){
    var $obj = $('[data-action="tab"]');
    if($obj.length === 0) {return false;}
    var type = $obj.data('type');
    $obj.each(function(){tabAct($(this), type);});
  }
  function tabAct(obj, type){
    var $obj = obj, currentNum = 0, currentTarget;
    var tabToggle = function(){
      var curObj = $obj.find('[data-tab-target]').eq(currentNum);
      currentTarget = curObj.data('tab-target');
      curObj.addClass('active').siblings().removeClass('active');
      if(type === 'show') {
        $('[data-tab-seq="' + currentTarget + '"]').addClass('active').siblings().removeClass('active');
      }
    };
    tabToggle();
    $obj.find('[data-tab-target]').off('click').on('click', function(){
      if (currentNum !== $(this).index()) {
        currentNum = $(this).index();
        tabToggle();
      }
    });
  }

  function datePickerSetting(){
    var $obj = $('.data-picker');
    if ($obj.length === 0) {return false;}
    require(['moment'], function(moment) {
      $obj.each(function(){
        var $this = $(this);
        var $start = $this.find('.start'), $end = $this.find('.end');
        var format = 'YYYY.MM.DD';
        var config = {
          locale: 'ko',
          dateFormat: format,
          autodateOnStart: false,
          animation: false,
          closeOnSelected: true,
          dateOnly: true,
          todayButton: false,
          closeButton: false,
          onHide: function(handler){
            var startTime = moment($start.val());
            var endTime = moment($end.val());
            if(endTime-startTime < 0 ) {
              var type = handler.$inputObject.attr('class');
              if (type === 'start') {
                $end.val($start.val());
              } else {
                $start.val($end.val());
              }
            }
          }
        };
        if($this.data('time')) {
          format = 'YYYY.MM.DD hh:mm';
          config.dateFormat = format;
          config.dateOnly = false;
          config.minuteInterval = $this.data('time');
        }
        switch ($this.data('rang')) {
          case 'today-start':
            config.minDate = moment(new Date()).format(format);
            break;
          case 'today-end':
            config.maxDate = moment(new Date()).format(format);
            break;
          case 'tomorrow-start':
            config.minDate = moment(new Date()).add(1,'days').format(format);
            break;
          case 'tomorrow-end':
            config.maxDate = moment(new Date()).add(1,'days').format(format);
            break;
          case 'yesterday-start':
            config.minDate = moment(new Date()).add(-1,'days').format(format);
            break;
          case 'yesterday-end':
            config.maxDate = moment(new Date()).add(-1,'days').format(format);
            break;
        }
        $this.find('input').appendDtpicker(config);
      });
    })
  }
})();
