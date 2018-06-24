$(window).resize(function(){
if ($(window).width() > 768){
  if (!$('#products-div').is(':visible')){
    $('#products-div').css("display", "block");
    $('#filters-div').css("display", "none");
    $('#filters-btn').html('<i class="fa fa-filter mr-1"></i>Filters and Categories');
  }
}
});
$('#filters-btn').click(()=>{
  if ($('#products-div').is(':visible')){
    $('#products-div').css("display", "none");
    $('#filters-div').css("display", "block");
    $('#filters-btn').html('<i class="fa fa-leaf mr-1"></i>Products');
  }
  else {
    $('#products-div').css("display", "block");
    $('#filters-div').css("display", "none");
    $('#filters-btn').html('<i class="fa fa-filter mr-1"></i>Filters and Categories');
  }
});
