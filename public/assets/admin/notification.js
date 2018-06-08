
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

    

  })
