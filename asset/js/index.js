/* 모듈 호출 */
startJs();

define(['jquery', 'underscore', 'moment', 'check', 'utils', 'develop'], function(){
  adminSet.init();
});

var adminSet = (function(){
  return {init:init};

  function init(){
  }

})();

function ajaxCall(dataUrl, opt){
  var returnValue = {status: false};
  var is_return = (opt.is_return === undefined ? false : opt.is_return);
  var callFun = (opt.call === undefined ? '' : opt.call);
  var async_chk = (opt.async === undefined ? false : opt.async);
  var type = (opt.type === undefined ? 'get' : opt.type);

  var defaultOption = {
    type: type,
    url: dataUrl,
    async: async_chk,
    cache: false,
    xhrFields: {withCredentials: true},
    success: function(result){
      if(is_return){
        returnValue.status = true;
        returnValue.result = result;
      }
      if(!is_return && callFun!==''){callFun(result, opt.data);}
    },
    error: function(error){
      console.log(error);
    },
    complete: function(){}
  };

  if(opt.data !== undefined){defaultOption.data = (opt.stringify===undefined || !opt.stringify ? opt.data : JSON.stringify(opt.data));}
  if(opt.dataType !== undefined){defaultOption.dataType = opt.dataType;}
  if(opt.contentType !== undefined){defaultOption.contentType = opt.contentType;}

  $.ajax(defaultOption);
  if(is_return){return returnValue;}
}
