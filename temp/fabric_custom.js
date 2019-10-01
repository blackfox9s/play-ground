var eventPhoto = (function () {
  var canvas;

  return {init: init};

  function init() {
    canvas = new fabric.Canvas('c');

    /* 사진선택 */
    $('#imgLoader').change(function() {
      fabricObjectSet('remove', 'photo');
      canvasReadURL(this);
      fabricObjectSet('backwards', 'photo');
    });

    /* 스티커 선택 */
    $('.sticker img').off('click').on('click', function(){
      fabricObjectSet('remove', 'sticker');
      fabric.Image.fromURL($(this).attr('src'), function(img){
        img.set({id:'sticker'});
        canvas.add(img);
      });
    });

    /* 다운로드 */
    $('#b').off('click').on('click', function(){
      download(canvas.toDataURL(),'test.png');
    });
  }

  function canvasReadURL(input){
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var imgObj = new Image();
        imgObj.src = e.target.result;
        imgObj.onload = function () {
          var image = new fabric.Image(imgObj);
          image.set({
            left: 0,
            top: 0,
            angle: 0,
            id:'photo',
            selectable: false
          });
          image.scaleToWidth(800).scaleToHeight(600);
          canvas.add(image);
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  function fabricObjectSet(act, id){
    canvas.getObjects().forEach(function(o) {
      if(act === 'remove') {
        if(o.id === id) {canvas.remove(o);}
      } else if('backwards') {
        if(o.id === id) {canvas.sendBackwards(o);}
      }
    });
  }

  function download(url, name){
    $('<a>').attr({href:url, download:name})[0].click();
  }
})();

eventPhoto.init();
