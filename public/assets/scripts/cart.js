$(() => {

  // GET
  $('#getCart').on('click', () => {
    $.get('/extras/res-cart').then((res) => {
      console.log(res.cart[res.cart.length - 1]);
      let list = $('#cartList');
      list.html('');
      res.cart.forEach((data) => {
        list.append('\
        <div class="quantGroup mb-3">\
          <input type="hidden" class="id" value="'+data.id+'">\
          <input type="hidden" class="stock" value="'+data.stock+'">\
          <p class="name mb-0">Name: '+data.name+'</p>\
          <p class="price mb-0">Price: Php '+data.price+'</p>\
          <p class="total mb-0">Total: Php '+data.total+'</p>\
          <small><i>'+data.stock+' Item/s Left</i></small><br>\
          <button type="button" class="minus" style="padding: 1px 9px;"> - </button>\
          <input type="number" class="quantity" value="'+data.quantity+'" style="width: 100px;" readonly/>\
          <button type="button" class="plus"> + </button>\
          <button type="button" class="delitem btn-danger"> X </button>\
        </div>');
      });
    }).catch((error) => {
      let list = $('#cartList');
      list.html('');
      list.append('<i> Empty </i>');
    });
  });

  // POST
  $('#newItem').on('click', (event) => {
    event.preventDefault();

    let itemName = $('#itemName');
    let itemPrice = $('#itemPrice');
    let itemStock = $('#itemStock');
    let itemQuantity = $('#itemQuantity');

    $.post('/extras/res-cart', {
      name: itemName.val(),
      price: itemPrice.val(),
      stock: itemStock.val(),
      quantity: itemQuantity.val()
    }).then((res) => {
      itemName.val('');
      itemPrice.val('');
      itemStock.val('');
      itemQuantity.val('');
      $('#getCart').click();
    }).catch((error) => {
      console.log(error);
    });
  });

  // PUT PLUS
  $('#cartList').on('click', '.plus', function() {
    let thisDiv = $(this).closest('.quantGroup');
    let id = thisDiv.find('.id').val();
    let stock = thisDiv.find('.stock').val();
    let newQuantity = thisDiv.find('.quantity').val();
    newQuantity = parseInt(newQuantity)+1;
    if (newQuantity > stock){
      newQuantity = stock;
    }

    $.ajax({
      url: '/extras/res-cart/' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        newQuantity: newQuantity
      }),
      success: (res) => {
        console.log(res);
        $('#getCart').click();
      }
    });
  });

  // PUT MINUS
  $('#cartList').on('click', '.minus', function() {
    let thisDiv = $(this).closest('.quantGroup');
    let id = thisDiv.find('.id').val();
    let newQuantity = thisDiv.find('.quantity').val();
    newQuantity = parseInt(newQuantity)-1;
    if (newQuantity < 2){
      newQuantity = 1;
    }

    $.ajax({
      url: '/extras/res-cart/' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        newQuantity: newQuantity
      }),
      success: (res) => {
        console.log(res);
        $('#getCart').click();
      }
    });
  });

  // DELETE
  $('#cartList').on('click', '.delitem', function() {
    let thisDiv = $(this).closest('.quantGroup');
    let id = thisDiv.find('.id').val();

    $.ajax({
      url: '/extras/res-cart/' + id,
      method: 'DELETE',
      contentType: 'application/json',
      success: (res) => {
        console.log(res);
        $('#getCart').click();
      }
    });
  });

  // CLEAR
  $('#clearCart').on('click', (event) => {
    event.preventDefault();

    $.get('/extras/clear-cart').then((res) => {
      console.log(res.cart[0]);
    }).catch((error) => {
      $('#getCart').click();
    });
  });

  // GET onload
  $('#getCart').click();

  // Pressing Enter
  $(document).keypress((e) => {
    if (e.which == 13) {
      $('#newItem').click();
    }
  });

});
