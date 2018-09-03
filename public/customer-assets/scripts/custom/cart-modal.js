let t1, t2;

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
function stockDisplay(inv){
  $.get(`/cart/modal-inv/${inv}`).then((res) => {
    let inv = res.inventory, qty = $('#modal-product-to-cart .quantity-input');
    $('.price').html(`${inv.productPrice}`);
    $('#stock-display').text(`${inv.stock} Items Left`);

    if (inv.stock > 0){
      $('#stock-display').text(`${inv.stock} Items Left`);
      $('#modal-product-to-cart .add-button').removeAttr('disabled');
    }
    else{
      $('#stock-display').text(`0 Items Left`);
      $('#modal-product-to-cart .add-button').attr('disabled','disabled');
    }

    if(inv.stock < 1){
      qty.val(1)
    }
    else if(qty.val() > inv.stock){
      qty.val(inv.stock)
    }

    qtyValidate(qty.val(),inv.stock)

  }).catch((error) => {
    console.log(error);
  });
}
function qtyValidate(qty,stock){
  $('#modal-product-to-cart .quantity-input').val() <= 1 ?
    $(`#modal-product-to-cart .minus-btn`).attr('disabled','disabled') :
    $(`#modal-product-to-cart .minus-btn`).removeAttr('disabled')
  $('#modal-product-to-cart .quantity-input').val() >= stock ?
    $(`#modal-product-to-cart .plus-btn`).attr('disabled','disabled') :
    $(`#modal-product-to-cart .plus-btn`).removeAttr('disabled')
}

// GET - Cart Button, Get Modal
$('.products-container').on('click', '.cart-btn', function(){
  let pid = $(this).closest('.this-product').find('.product-id').val();
  console.log(pid);
  $.get(`/cart/modal/${pid}`).then((res) => {
    let data = res.product, modal = $('#modal-product-to-cart');
    modal.find('img').attr("src", data.img);
    modal.find('.title').html(`<span class="text-brand">${data.brand}</span> ${data.name}`);
    modal.find('.price').text(data.curPrice);
    modal.find('.quantity-input').val(data.curQty);
    modal.find('.select-size').html('');
    data.sizes.forEach((size)=>{
      modal.find('.select-size').append(`<option value="${size[0]}" class='sel'>${size[1]}</option>`);
    })
    modal.find('.select-size').val(data.curInv);

    stockDisplay(data.sizes[0][0])
  }).catch((error) => {
    console.log(error);
  });
});

// GET - Select Option onchange, Get Price
$('.select-size').on('change', function(){
  stockDisplay(this.value)
});

// GET - Plus Button, Get New Quantity
$('#modal-product-to-cart').on('click', '.plus-btn', ()=>{
  let stock = parseInt($('#stock-display').text()),
  qty = parseInt($('#modal-product-to-cart .quantity-input').val());
  qty < stock ? $('#modal-product-to-cart .quantity-input').val(qty+1) : 0
  qtyValidate(qty,stock);

});

// GET - Minus Button, Get New Quantity
$('#modal-product-to-cart').on('click', '.minus-btn', ()=>{
  let stock = parseInt($('#stock-display').text()),
  qty = parseInt($('#modal-product-to-cart .quantity-input').val());
  qty > 1 ? $('#modal-product-to-cart .quantity-input').val(qty-1) : 0
  qtyValidate(qty,stock);
});

// POST - Add to Cart
$('#modal-product-to-cart').on('click', '.add-button', ()=>{
  let inv = $('#modal-product-to-cart .select-size').val(),
  qty = parseInt($('#modal-product-to-cart input.quantity-input').val());
  $.post(`/cart/modal`, {
    inv: inv, qty: qty
  }).then((res) => {
    let modal = $('#modal-product-to-cart'), data = res.cart;
    postToCart(modal, data, res, 1);
  })
  .catch((error) => {
    console.log(error);
  });
});
