$(() => {

  // GET - Load cart
  $('#getCart').on('click', () => {
    let list = $('#cart-pad');
    list.html('');
    $.get('/cart/list').then((res) => {
      res.cart.forEach((data) => {
        list.append(`
          <div class="cart-product-container">
            <div class="product-card">
              <input class="inventory-id" value="${data.inv}" hidden/>
              <div class="product-pic"><a href="/item"><img src="${data.img}"/></a></div>
              <div class="product-desc">
                <p class="product-title">${data.name}</p>
                <small class="product-size text-muted">Size: ${data.curSize}</small>
                <small class="product-oldprice text-muted">
                  <span><s class="price-symbol">0</s></span><span> (-0%)</span><br>
                </small>
                <div class="input-group quantity">
                  <div class="input-group-prepend addon">
                    <button class="btn btn-primary quantity-buttons minus" type="button">
                    <small class="quantity-text quantity-text-minus">-</small>
                  </button>
                  </div>
                  <input class="form-control quantity-input" type="text" readonly="" value="${data.curQty}">
                  <div class="input-group-append addon">
                    <button class="btn btn-primary quantity-buttons plus" type="button">
                    <small class="quantity-text quantity-text-plus">+</small>
                  </button>
                  </div>
                </div>
                <p class="product-price price-symbol">${data.curPrice}</p>
              </div>
            </div>
            <div class="product-remove"><i class="fa fa-remove product-remove-icon"></i></div>
          </div>`)
      });
      res.cart.length ? 0 :
        list.append(`
          <div class="cart-product-container">
            <p> Cart currently empty </p>
          </div>`);
      $('#subtotal-btn').click();
    }).catch((error) => {
      list.append(`
        <div class="cart-product-container">
          <p> Cart currently empty </p>
        </div>`);
      $('#subtotal-btn').click();
    });
  });

  // DELETE - Remove product
  $('#cart-pad').on('click', '.product-remove', function() {
    let inv = $(this).prev().find('.inventory-id').val();
    $.ajax({
      url: `/cart/list`,
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv
      }),
      success: (res) => {
        $(this).parent().remove();
        $("#checkout-products > .product-div").each(function(index) {
          $(this).find('.inventory-id').val() == res.inv ?
            $(this).remove() : 0
        });
        if(!res.cart){
          $('#cart-pad').append(`
            <div class="cart-product-container">
              <p> Cart currently empty </p>
            </div>`);
          $('#checkout-products').append(`
            <div class="product-div pos-relative px-3">
              <p class="fs-09em"> Cart currently empty </p>
            </div>`);
        }
        $('#subtotal-btn').click();
      }
    });
  });

  // PUT - Plus Button, Get New Quantity
  $('#cart-pad').on('click', '.plus', function() {
    let inv = $(this).closest('.product-card').find('.inventory-id').val();

    $.ajax({
      url: `/cart/list`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv,
        action: 'plus'
      }),
      success: (res) => {
        $(this).closest('.product-card').find('.quantity-input').val(res.cart.curQty);
        $("#checkout-products > .product-div").each(function(index) {
          $(this).find('.inventory-id').val() == res.cart.inv ?
            $(this).find('.quantity').text(res.cart.curQty) : 0
        });
        $('#subtotal-btn').click();
      }
    });
  });

  // PUT - Minus Button, Get New Quantity
  $('#cart-pad').on('click', '.minus', function() {
    let inv = $(this).closest('.product-card').find('.inventory-id').val();

    $.ajax({
      url: `/cart/list`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv,
        action: 'minus'
      }),
      success: (res) => {
        $(this).closest('.product-card').find('.quantity-input').val(res.cart.curQty);
        $("#checkout-products > .product-div").each(function(index) {
          $(this).find('.inventory-id').val() == res.cart.inv ?
            $(this).find('.quantity').text(res.cart.curQty) : 0
        });
        $('#subtotal-btn').click();
      }
    });
  });

  // GET - Subtotal
  $('#subtotal-btn').on('click', () => {
    $.get('/cart/list/total/sub').then((res) => {
      $('.checkout').find('button+p').text(`${res.subtotal}`)
      $('#total-btn').click();
    }).catch((error) => {
      console.log(error)
    });
  });

  // Click Button on Load
  $('#getCart').click();

});
