
// for all confirm alert
function confirm_alert(){
  // changed font size .swal-popup because not compatible of bootstrap 3
  swal({
    type: 'success',
    title: 'Your changes has been saved'
  }).then(() => {
    location.reload();
  })
}
  $(document).ready(function(){

    // check expired
    $('.notifExpired').hide();
    $.post('/inventory/checkExpired','',function(data,status){
      if(data == 'no'){
        $('.notifExpired').hide();
      }else if(data[0].allExp == 0){
        $('.notifExpired').hide();
      }else{
        $('.notifExpired').show();
        $('.notifExpired').html(data[0].allExp);
      }
    });

    // check expired
    $('.notifCritical').hide();
    $.post('/inventory/checkCritical','',function(data,status){
      if(data == 'no'){
        $('.notifCritical').hide();
      }else if(data[0].allCrit == 0){
        $('.notifCritical').hide();
      }else{
        $('.notifCritical').show();
        $('.notifCritical').html(data[0].allCrit);
      }
    });

    // new order notification

    update();
    //  setInterval(update,2000);


    function update(){
      $.post('/customerOrder/checkNewOrders','',function(data,status){
        if(data == 0){

        }else{
          $('#notiforder').html(data)

        }
      })


    }





    // theme
    $('#dark_theme').on('click',function(){
      $('#bod').attr('class', 'hold-transition skin-green fixed sidebar-mini');
    });
    $('#light_theme').on('click',function(){
      $('#bod').attr('class', 'hold-transition skin-green-light fixed sidebar-mini');
    });



  })

  // animate css
  $.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);

        if (typeof callback === 'function') callback();
      });

      return this;
    },
  });
