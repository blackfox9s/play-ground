var utils = {
  scrollPos:0, lockNum:0,
  scrollLock:function(close){
    if(this.lockNum === 0){
      this.scrollPos = $(window).scrollTop();
    }
    if(close === true) {
      this.lockNum = this.lockNum + 1;
      $('html').addClass('scroll-lock');
      $('#admin-wrap').css('margin-top', -(this.scrollPos)+'px');
    }else if(close === false){
      this.lockNum = (this.lockNum - 1 < 0) ? 0 : this.lockNum - 1;
      if(this.lockNum === 0){
        $('#admin-wrap').removeAttr('style');
        $('html').removeClass('scroll-lock');
        $('html, body').scrollTop(this.scrollPos);
      }
    }
  },
  loading: function(flag, txt){
    var $ele = $('.loading');
    if(flag){
      $ele.addClass('is-act');
      if(txt !== undefined){$ele.find('em').html(txt);}
      utils.scrollLock(true);
    }else{
      $ele.removeClass('is-act');
      utils.scrollLock(false);
    }
  }
};

function numPad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
