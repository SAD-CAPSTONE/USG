$(() => {

  // GET - Load cart
  $('#getSummary').on('click', () => {
    let list = $('#checkout-products');
    list.html('');
    $.get('/cart/list').then((res) => {
      res.cart.forEach((data) => {
        list.append(`
          <div class="product-div pos-relative px-3">
            <div class="inline-block va-t">
              <input class="inventory-id" value="${data.inv}" hidden/>
              <img src="${data.img}" height="100" width="100" alt="product">
              <div class="px-2">
                <p class="m-0 fs-08em fw-400 lh-p3em">${data.name}</p>
                <p class="fs-08em fw-400 text-muted">${data.curSize}</p>
                <a class="fw-400 remove"><i class="fa fa-trash"></i></a>
                <div class="price">
                  <p class="mb-0 fs-1em fw-400 lh-p3em price-symbol">${data.curPrice}</p>
                  <p class="mb-0 fs-09em lh-p3em text-muted price-symbol"><s>0</s> (-0%)</p>
                </div>
              </div>
            </div>
            <div class="inline-block va-t mt-2">
              <p class="mb-1 fs-1em fw-400 lh-p3em price-symbol">${data.curPrice}</p>
              <p class="mb-1 fs-09em lh-p3em text-muted price-symbol"><s>0</s></p>
              <p class="mb-1 fs-09em lh-p3em text-muted">0% off</p>
            </div>
            <div class="inline-block va-t mt-2">
              <p class="m-0 fs-09em fw-400 lh-p3em quantity">${data.curQty}</p>
              <a class="fw-400 no-decoration remove"><i class="fa fa-trash mt-2"></i></a>
            </div>
          </div>`)
      });
      res.cart.length ? 0 :
        list.append(`
          <div class="product-div pos-relative px-3">
            <p class="fs-09em"> Cart currently empty </p>
          </div>`);
      $('#total-btn').click();
    }).catch((error) => {
      list.append(`
        <div class="product-div pos-relative px-3">
          <p class="fs-09em"> Cart currently empty </p>
        </div>`);
    });
  });

  // DELETE - Remove Product
  $('#checkout-products').on('click', '.remove', function() {
    let inv = $(this).closest('.product-div').find('.inventory-id').val();
    console.log(inv)
    $.ajax({
      url: `/cart/list`,
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv
      }),
      success: (res) => {
        $(this).parents('.product-div').remove();
        $("#cart-pad > .cart-product-container").each(function(index) {
          $(this).find('div > .inventory-id').val() == res.inv ?
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

  // GET - Total , fee, Subtotal
  $('#total-btn').on('click', () => {
    $.get('/cart/list/total/total').then((res) => {
      $('#summary-details-pane').find('.subtotal').text(`${res.subtotal}`)
      $('#summary-details-pane').find('.fee').text(`${res.fee}`)
      $('#summary-details-pane').find('.total').text(`${res.total}`)
    }).catch((error) => {
      console.log(error);
    });
  });

  // Refresh List
  $('#refresh').on('click', () => {
    $('#getSummary').click();
  });

  // Click Button on Load
  $('#getSummary').click();

});
