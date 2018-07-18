$(document).ready(function() {
  $("#cart-sidebar").mCustomScrollbar({
    theme: "minimal"
  });
  $(".components").mCustomScrollbar({
    theme: "my-theme",
    autoHideScrollbar: true
  });

  $('#dismiss, .overlay').on('click', function() {
    $('#cart-sidebar').removeClass('active');
    $('.overlay').fadeOut();
  });

  $('#cartSidebarCollapse').on('click', function() {
    $('#cart-sidebar').addClass('active');
    $('.overlay').fadeIn();
  });
  $('body').on('click', function() {
    if ($('#cart-sidebar').hasClass('active')){
      $('body').css({overflow: 'hidden'});
    }
    else{
      $('body').css({overflow: 'auto'});
    }
  });


});
