$(() => {

  function OrderDisabled(){
    $('#place-order').attr('disabled','disabled');
    $('#checkout-form').removeAttr('action');
    $('#checkout-form').removeAttr('method');
  }
  function OrderActive(){
    $('#place-order').removeAttr('disabled');
    $('#checkout-form').attr({
      'action':'/summary/checkout',
      'method':'POST'
    });
  }

  // GET - Load cart
  $('#getSummary').on('click', () => {
    let list = $('#checkout-products');
    $.get('/cart/list').then((res) => {
      list.html('');
      res.cart.forEach((data) => {
        list.append(`
          <div class="product-div pos-relative px-3">
            <div class="inline-block va-t">
              <input class="inventory-id" value="${data.inv}" hidden/>
              <a href="/item/${data.id}" class="img-link">
                <img src="${data.img}" height="100" width="100" alt="product">
              </a>
              <div class="px-2">
                <p class="m-0 fs-08em fw-400 lh-p3em"><span class="text-brand">${data.brand}</span> ${data.name}</p>
                <p class="fs-08em fw-400 text-muted">${data.curSize}</p>
                <a class="fw-400 remove cursor-pointer"><i class="fa fa-trash"></i></a>
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
              <a class="fw-400 no-decoration remove cursor-pointer"><i class="fa fa-trash mt-2"></i></a>
            </div>
          </div>`)
      });
      if (res.cart.length){
        $('#place-order').hasClass('sb-1') ?
          OrderActive() :
          OrderDisabled();
      }
      else{
        list.append(`
          <div class="product-div pos-relative px-3">
            <p class="fs-09em"> Cart currently empty </p>
          </div>`);
        OrderDisabled();
      }
      $('svg#SVG_refreshList').attr('hidden','hidden');
      $('#refresh').removeAttr('hidden');
      $('#total-btn').click();
    }).catch((error) => {
      list.html('');
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
        if (res.cart){
          $('#place-order').hasClass('sb-1') ?
            OrderActive() :
            OrderDisabled();
        }
        else{
          $('#checkout-products').append(`
            <div class="product-div pos-relative px-3">
              <p class="fs-09em"> Cart currently empty </p>
            </div>`);
          OrderDisabled();
        }
        $('#total-btn').click();
      }
    });
  });

  // GET - Total , fee, Subtotal
  $('#total-btn').on('click', () => {
    $.get('/cart/list/total/total').then((res) => {
      $('#summary-details-pane').find('.subtotal').prev().text(`Subtotal (${res.cartLength})`)
      $('#summary-details-pane').find('.subtotal').text(`${res.subtotal}`)
      $('#summary-details-pane').find('.fee').text(`${res.fee}`)
      $('#summary-details-pane').find('.total').text(`${res.total}`)
    }).catch((error) => {
      console.log(error);
    });
  });

  // Refresh List
  $('#refresh').on('click', () => {
    $('#refresh').attr('hidden','hidden');
    $('svg#SVG_refreshList').removeAttr('hidden');
    let tRefresh1 = setTimeout(()=>{
      $('#getSummary').click();
    },500);
  });

  // Click Button on Load
  $('#getSummary').click();

  // Notice
  let text = [
    "Remember to refresh list before placing order",
    "Only one discount voucher per order is allowed",
    "Products will be delivered within 7 working days"],
  notice = $('#notice'), counter = 0, iNotice1 = setInterval(change, 8000), tNotice1;
  function change() {
    notice.css('opacity','0');
    tNotice1 = setTimeout(()=>{
      notice.css('opacity','1');
      notice.text(text[counter])
      counter++;
      if (counter >= text.length) {
        counter = 0;
      }
    },350);
  }

  // Alert
  function postToCart(modal, data, res, tog){
    clearTimeout(t1);
    clearTimeout(t2);

    modal.next().on('click', ()=>{
      $('#cartSidebarCollapse').click();
    })

    tog == 1 ? modal.modal('toggle'): 0;
    modal.next().css({
      "max-width": "100%",
      "padding": "20px 23px 20px 20px"
    });
    data[res.latest].curQty == res.limit ?
      modal.next().css("border-left", "3px solid #FFC107"):
      modal.next().css("border-left", "3px solid #00AF6E");
    modal.next().children('div').css("opacity", "1");

    t1 = setTimeout(()=>{
      modal.next().css({
        "max-width": "0",
        "padding": "20px 0px 20px 0px",
        "border-left": "none"
      });
    },5000);
    t2 = setTimeout(()=>{
      modal.next().children('div').css("opacity", "0");
    },4700);

    data[res.latest].curQty == res.limit ?
      modal.next().find('p:nth-of-type(3)').text(`Maximum quantity reached (${data[res.latest].curQty})`):
      modal.next().find('p:nth-of-type(3)').text(`has been added (${data[res.latest].curQty} in cart)`);
    modal.next().find('p:nth-of-type(2)').html(`<span class="text-brand">${data[res.latest].brand}</span> ${data[res.latest].name} ${data[res.latest].curSize}`);

    $('#getCart').click();
  }



  // Nav Cart
  $('#nav-cart').css("cursor" , "not-allowed");
  $('#nav-cart *').css("color", "rgba(255,255,255,.75)");
  $('.overlay').remove();
  $('#cartSidebarCollapse').on('click', function() {
    $('#cart-sidebar').removeClass('active');
  });

});
