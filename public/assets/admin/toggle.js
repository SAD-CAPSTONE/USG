
  $('.inactivate_voucher').on('click',function(){
    $(this).removeClass("ui toggle button active inactivate_voucher").addClass("ui toggle button activate_voucher").html("Inactive");

    $.ajax({
      url: '/maintenance/inactivateVoucher',
      method: 'post',
      datatype: 'json',
      data: {no: $(this).data('no')},
      success: function(response,status,http){
        if (response){
          swal("Success!",`You inactivated voucher no`+$(this).data('no'),"success");
          reload_js('/assets/admin/toggle.js');
        }
      }
    })
  })

  $('.activate_voucher').on('click',function(){
    $(this).removeClass("ui toggle button activate_voucher").addClass("ui toggle button active inactivate_voucher").html("Active");

    $.ajax({
      url: '/maintenance/activateVoucher',
      method: 'post',
      datatype: 'json',
      data: {no: $(this).data('no')},
      success: function(response,status,http){
        if (response){
          swal("Success!",`You activated voucher no`+$(this).data('no'),"success");
          reload_js('/assets/admin/toggle.js');
        }
      }
    })
  })

  
