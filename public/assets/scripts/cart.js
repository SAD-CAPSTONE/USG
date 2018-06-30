$(() => {

  function chekoutBtnDisabled(){
    $('#cart-sidebar ul.checkout a').removeAttr('href');
    $('#cart-sidebar ul.checkout a').css({
      'background-color':'#B9B9B9',
      'cursor':'not-allowed'
    });
    $('#cart-sidebar ul.checkout a')
      .mouseenter(function (){
        $(this).css('background-color','#B9B9B9');
      })
      .mouseleave(function (){
        $(this).css('background-color','#B9B9B9');
      });
  }
  function chekoutBtnActive(){
    $('#cart-sidebar ul.checkout a').attr('href','/summary/checkout');
    $('#cart-sidebar ul.checkout a').css({
      'background-color':'var(--cart-button-color)',
      'cursor':'pointer'
    });
    $('#cart-sidebar ul.checkout a')
      .mouseenter(function (){
        $(this).css('background-color','var(--price-color)');
      })
      .mouseleave(function (){
        $(this).css('background-color','var(--cart-button-color)');
      });
  }

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
              <div class="product-pic"><a href="/item/${data.id}"><img src="${data.img}"/></a></div>
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
      if(!res.cart.length){
        list.append(`
          <div class="cart-product-container">
            <p> Cart currently empty </p>
          </div>`);
        chekoutBtnDisabled();
      }
      else{
        chekoutBtnActive();
      }
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
        if(!res.cart){
          $('#cart-pad').append(`
            <div class="cart-product-container">
              <p> Cart currently empty </p>
            </div>`);
          chekoutBtnDisabled();
        }
        else{
          chekoutBtnActive();
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
        $('#subtotal-btn').click();
      }
    });
  });

  // GET - Subtotal
  $('#subtotal-btn').on('click', () => {
    $.get('/cart/list/total/sub').then((res) => {
      $('.checkout').find('button+p').text(`${res.subtotal}`)
    }).catch((error) => {
      console.log(error)
    });
  });

  // Click Button on Load
  $('#getCart').click();

});
