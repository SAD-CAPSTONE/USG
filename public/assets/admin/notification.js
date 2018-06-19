
  $(document).ready(function(){

    // new order notification
    $('#notiforder').hide();

    $.ajax({
      url: '/customerOrder/checkNewOrders',
      method: 'POST',
      datatype: "json",
      data: {

            },
      success: function(response,status,http){
        if (response){
          if (response == "new"){
            $('#notiforder').show();

          }else{

          }
        }
      }
    });

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
