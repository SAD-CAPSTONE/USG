
  $(document).ready(function(){
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

    $('#dark_theme').on('click',function(){
      $('#bod').attr('class', 'hold-transition skin-green fixed sidebar-mini');
    });
    $('#light_theme').on('click',function(){
      $('#bod').attr('class', 'hold-transition skin-green-light fixed sidebar-mini');
    });



  })
