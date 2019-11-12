var utils = {
  numPad : function(n, width) {
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  },
  numUnit : function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  inputEmptyCheck: function(obj){
    if(obj.value === '') {
      $(obj).removeClass('notEmpty');
    } else {
      $(obj).addClass('notEmpty');
    }
  },
  autoBirthDay : function(str){
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if( str.length < 5){
      return str;
    }else if(str.length < 7){
      tmp += str.substr(0, 4);
      tmp += '-';
      tmp += str.substr(4);
      return tmp;
    }else{
      tmp += str.substr(0, 4);
      tmp += '-';
      tmp += str.substr(4, 2);
      tmp += '-';
      tmp += str.substr(6,2);
      return tmp;
    }
  },
  autoPhone : function(str){
    str = str.replace(/[^0-9]/g, '');
    var tmp = '';
    if( str.length < 4){
      return str;
    }else if(str.length < 7){
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3);
      return tmp;
    }else if(str.length < 11){
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 3);
      tmp += '-';
      tmp += str.substr(6);
      return tmp;
    }else{
      tmp += str.substr(0, 3);
      tmp += '-';
      tmp += str.substr(3, 4);
      tmp += '-';
      tmp += str.substr(7);
      return tmp;
    }
  },
  nameHidden : function(str) {
    if(str.length>=3) {
      var regExp = /([가-힣1-9]{1})([가-힣1-9]{1,})([가-힣1-9]{1})/g;
      var hiddenText = String('*').repeat(str.length-2);
      return str.replace(regExp, '$1'+ hiddenText +'$3');
    } else {
      return str.substring(0,1) + '*';
    }
  },
  loading: function(flag, txt){
    var $ele = $('.loading');
    if(flag){
      $ele.addClass('is-act');
      if(txt !== undefined){$ele.find('em').html(txt);}
    }else{
      $ele.removeClass('is-act');
    }
  },
  empty: function(value) {
    if (value === null) {
      return true;
    } else if (typeof value === 'undefined') {
      return true;
    } else if (typeof value === 'string' && value === '') {
      return true;
    } else if (Array.isArray(value) && value.length < 1) {
      return true;
    } else if (typeof value === 'object' &&
      value.constructor.name === 'Object' &&
      Object.keys(value).length < 1 &&
      Object.getOwnPropertyNames(value) < 1) {
      return true;
    } else if (typeof value === 'object' &&
      value.constructor.name === 'String' &&
      Object.keys(value).length < 1) {
      return true;
    }
    return false;
  }
};

/* cookie, session 관련 */
var cookie = {
  cookie_arr : null,
  set : function (name,value,options) {
    options = options || {};
    this.cookie_arr = [escape(name) + '=' + escape(value)];
    if(!options.path) {options.path = '/';}
    /* expires */
    if (options.expires){
      if( typeof options.expires === 'object' && options.expires instanceof Date ){
        var date = options.expires;
        var expires = "expires=" + date.toUTCString();
        this.cookie_arr.push (expires);
      }
    }else if (options.expires_day){
      this.set_expires_date (options.expires_day , 24*60*60);
    }else if (options.expires_hour){
      this.set_expires_date (options.expires_hour , 60*60);
    }

    /* domain */
    if (options.domain){
      var domain = "domain=" + options.domain;
      this.cookie_arr.push (domain);
    }

    /* path */
    if (options.path){
      var path = 'path=' + options.path;
      console.log(path);
      this.cookie_arr.push (path);
    }
    /* secure */
    if( options.secure === true ){
      var secure = 'secure';
      this.cookie_arr.push (secure);
    }
    document.cookie = this.cookie_arr.join('; ');
  },
  get : function (name){
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    var regex = /=.{1}()*/;
    for(var i=0;i < ca.length;i++){
      var c = ca[i];
      if(regex.test(c)){
        c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length,c.length));
      }
    }
    return null;
  },
  del : function (name , options){
    options = options || {};
    options.expires_day = -1;
    this.set ( name , '' , options );
  },
  set_expires_date : function (time, unit){
    var date = new Date();
    date.setTime(date.getTime()+(time*unit*1000));
    var expires = "expires=" + date.toUTCString();
    this.cookie_arr.push (expires);
  }
};
var session = {
  set : function(name,val){sessionStorage.setItem(name, val);},
  get : function(name){return sessionStorage.getItem(name);},
  del : function(name){sessionStorage.removeItem(name);},
};

/* popup */
var popup = {
  layerOpen : function(n){
    var $obj = $('[data-pop-name="'+ n +'"]');
    $obj.show();
    $obj.find('.pop-sec').css('max-height', $(window).height());

    $obj.find('[data-bt-act="pop-close"]').off('click').on('click', function(){
      popup.layerClose(n);
      return false;
    });
  },
  layerClose : function(n){
    $('[data-pop-name="'+ n +'"]').hide();
    return false;
  }
}
