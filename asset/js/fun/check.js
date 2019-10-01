function checkFrm(f){
  var values = f.serializeCheck();
  for(var i=0; i<values.length; i++){
    var arr = values[i];
    if(arr.val===''){
      alert(arr.msg.replace(/\\n/g,'\n'));
      return false;
    }
  }
  return true;
}

function trim(val){
  if( typeof(val) === 'undefined' ) return "";
  val = val.replace(/^\s+/g,'').replace(/\s+$/g,'');
  return val;
}

$.fn.getType = function(){return this[0].tagName === "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase();};
$.fn.serializeCheck = function(){
  var formData = [];
  this.find('[data-valid]').map(function(){
    var formObj = {}, $this = $(this);
    formObj['msg'] = $this.attr('data-valid');
    formObj['obj'] = $(this);
    if($this.find('input:radio').length>0){
      var selVal = $this.find('input:radio:checked').val();
      formObj['val'] = (selVal===undefined ? '' : selVal);
      formObj['type'] = 'radio';
    }else if($this.getType()==='checkbox'){
      formObj['val'] = ($this.is(':checked') ? $this.val() : '');
      formObj['type'] = 'checkbox';
    }else if($this.getType()==='select'){
      var v =$this.find('option:selected').val();
      formObj['val'] = (v.indexOf('선택')>-1 ? '' : v);
      formObj['type'] = 'select';
    }else{
      formObj['val'] = trim($this.val());
    }
    formData.push(formObj);
  }).get();
  return formData;
};
$.fn.serializeSend = function(){
  var $target, formData = {};
  $target = this.find('[name]:not(.except)');
  $target.map(function(){
    var name = $(this).attr('name');
    var type = $(this).getType();
    if(type==='checkbox'){
      if($(this).is(':checked')){
        formData[name] = $(this).val();
      }else{
        formData[name] = ((typeof $(this).val())==='string' ? 'n' : '');
      }
    }else if(type==='radio'){
      if($(this).is(':checked')){formData[name] = $(this).val();}
    }else if(type==='select'){
      formData[name] = $(this).find('option:selected').val();
    }else{
      formData[name] = $(this).val().trim();
    }
  }).get();
  return formData;
};
$.fn.serializeForm = function(){
  var $target, form = new FormData();
  $target = this.find('[name]:not(.except)');
  $target.map(function(){
    var $this = $(this), name = $this.attr('name'), type = $this.getType(), value = '';
    if(type === 'radio') {
      if($this.is(':checked')) {
        value = $this.val();
        form.append(name, value);
      }
    } else {
      if(type==='checkbox'){
        if($this.is(':checked')){
          value = $this.val();
        }else{
          value = ((typeof $(this).val())==='string' ? 'n' : '');
        }
      }else if(type==='select'){
        value = $this.find('option:selected').val();
      }else{
        value = $this.val();
      }
      form.append(name, value.trim());
    }
  }).get();
  return form;
};
