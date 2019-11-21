var eventPhoto = (function () {
  var canvas;
  var $sticker;
  var stickerCount = 0;

  return {init: init};

  function init() {
    canvas = new fabric.Canvas('c');
    $sticker = $('.sticker span');

    /* 사진선택 */
    $('#imgLoader').change(function() {
      fabricObjectSet('remove', 'photo');
      canvasReadURL(this);
      fabricObjectSet('backwards', 'photo');
      console.log(this)
    });

    /* 스티커 선택 */
    $sticker.off('click').on('click', function(){
      var $this = $(this);
      if(!$this.hasClass('active')) {
        $this.addClass('active');
        var stickerNum = $this.index();
        fabric.Image.fromURL($this.find('img').attr('src'), function(img){
          img.set({id:'sticker' + stickerNum});
          canvas.add(img);
        });
      }
    });

    /* 다운로드 */
    $('#b').off('click').on('click', function(){
      download(canvas.toDataURL(),'test.png');
    });

    /* 스티커 삭제 */
    $('#remove').off('click').on('click', stickerRemove);
    window.addEventListener('keydown', function(event){
      if(event.defaultPrevented) {return;}
      var handled = false;
      if(event.keyCode === 8 || event.keyCode === 46) {handled = true;}
      if(handled) {stickerRemove(); event.preventDefault();}
    });
  }

  function stickerRemove(){
    var activeObjects = canvas.getActiveObjects();
    canvas.discardActiveObject();
    if (activeObjects.length) {
      var stickerNum = activeObjects[0].id.replace(/[^0-9]/g,'');
      $sticker.eq(stickerNum).removeClass('active');
      canvas.remove.apply(canvas, activeObjects);
    }
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
