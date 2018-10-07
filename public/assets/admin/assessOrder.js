$(function () {
  $('#example2').DataTable({
    'paging'      : true,
    'lengthChange': true,
    'searching'   : true,
    'ordering'    : true,
    'info'        : true,
    'autoWidth'   : true,
  'select'		: true,
  'scroll'		: true
  })
})

$(function () {
  $('#history_table').DataTable({
    'paging'      : false,
    'lengthChange': false,
    'searching'   : false,
    'ordering'    : false,
    'info'        : false,
    'autoWidth'   : true,
  'select'		: true,
  'scroll'		: true
  })
})

$('#title').html("USG | All Orders");
$(".treeview a:contains('Transactions')").parent().addClass("active");
$(".treeview a:contains('Customer Orders')").parent().addClass("active");
$(".navi a:contains('All Orders')").parent().addClass("active");

//Flat red color scheme for iCheck
$('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
  checkboxClass: 'icheckbox_flat-green',
  radioClass   : 'iradio_flat-green'
})

$('#message').attr('disabled', false);
$('#notify').on('ifChecked',function(){
  $('#message').attr('disabled', false);
})
$('#notify').on('ifUnchecked',function(){
  $('#message').attr('disabled', true);
})
