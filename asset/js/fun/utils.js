var utils = {
  numPad : function(n, width) {
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
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
      tmp += '.';
      tmp += str.substr(4);
      return tmp;
    }else{
      tmp += str.substr(0, 4);
      tmp += '.';
      tmp += str.substr(4, 2);
      tmp += '.';
      tmp += str.substr(6,2);
      return tmp;
    }
  },
  autoPhone(str){
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
  loading: function(flag, txt){
    var $ele = $('.loading');
    if(flag){
      $ele.addClass('is-act');
      if(txt !== undefined){$ele.find('em').html(txt);}
    }else{
      setTimeout(function(){
        $ele.removeClass('is-act');
      }, isMobile ? 800 : 800);
    }
  }
};

/* cookie, session 관련 */
var cookie = {
  cookie_arr : null,
  set : function (name,value,options) {
    options = options || {};
    this.cookie_arr = [escape(name) + '=' + escape(value)];
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