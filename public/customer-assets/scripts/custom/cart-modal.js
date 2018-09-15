let t1, t2, productModal = $('#modal-product-to-cart'), packageModal = $('#package-modal'), limit;

function postToCart(modal, data, res, tog){
  let cartAlert = $('.cartAlert')

  clearTimeout(t1);
  clearTimeout(t2);

  cartAlert.on('click', ()=>{
    $('#cartSidebarCollapse').click();
  })

  tog == 1 ? modal.modal('toggle'): 0;
  cartAlert.css({
    "max-width": "100%",
    "padding": "20px 23px 20px 20px"
  });
  data[res.latest].curQty == res.limit ?
    cartAlert.css("border-left", "3px solid #FFC107"):
    cartAlert.css("border-left", "3px solid #00AF6E");
  cartAlert.children('div').css("opacity", "1");

  t1 = setTimeout(()=>{
    cartAlert.css({
      "max-width": "0",
      "padding": "20px 0px 20px 0px",
      "border-left": "none"
    });
  },5000);
  t2 = setTimeout(()=>{
    cartAlert.children('div').css("opacity", "0");
  },4700);

  data[res.latest].curQty == res.limit ?
    cartAlert.find('p:nth-of-type(3)').text(`Maximum quantity reached (${data[res.latest].curQty})`):
    cartAlert.find('p:nth-of-type(3)').text(`has been added (${data[res.latest].curQty} in cart)`);
  data[res.latest].type == 1 ?
    cartAlert.find('p:nth-of-type(2)').html(`<span class="text-brand">${data[res.latest].brand}</span> ${data[res.latest].name} ${data[res.latest].curSize}`):
    cartAlert.find('p:nth-of-type(2)').html(`<span class="text-package">${data[res.latest].name}</span>`);
  $('#getCart').click();
}
function stockDisplay(modal,inv){
  $.get(`/cart/modal-inv/${inv}`).then((res) => {
    let inv = res.inventory, qty = modal.find('.quantity-input');
    modal.find('.price').html(`${inv.productPrice}`);
    modal.find('#stock-display > span').text(inv.stock);

    if (inv.stock > 0){
      modal.find('#stock-display > span').text(inv.stock);
      modal.find('.add-button').removeAttr('disabled');
    }
    else{
      modal.find('#stock-display > span').text(0);
      modal.find('.add-button').attr('disabled','disabled');
    }

    if(inv.stock < 1){
      qty.val(1)
    }
    else if(qty.val() > inv.stock){
      qty.val(inv.stock)
    }

    qtyValidate(modal,qty.val(),inv.stock)

  }).catch((error) => {
    console.log(error);
  });
}
function qtyValidate(modal,qty,stock){
  modal.find(`.quantity-input`).val() <= 1 ?
    modal.find(`.minus-btn`).attr('disabled','disabled') :
    modal.find(`.minus-btn`).removeAttr('disabled')
  modal.find(`.quantity-input`).val() >= stock ?
    modal.find(`.plus-btn`).attr('disabled','disabled') :
    modal.find(`.plus-btn`).removeAttr('disabled')
}
function qtyControl(modal,type){
  let stock = parseInt(modal.find('#stock-display > span').text()),
  qtyInput = modal.find('.quantity-input'), qty = parseInt(qtyInput.val());

  stock > limit ? stock = limit : 0
  qty == 0 ? qtyInput.val(1) : 0

  if(type == 'change'){
    qty > stock ? qtyInput.val(stock) : 0
  }
  else if(type == 'plus'){
    qty < stock ? qtyInput.val(qty+1) : 0
  }
  else if(type == 'minus'){
    qty > 1 ? qtyInput.val(qty-1) : 0
  }
  qtyValidate(modal,qty,stock);
}

$(()=>{
  $.get(`/cart/limit`).then((res) => {
    console.log(res)
    limit = res.quantLimit
    $('i.limit-info').attr(`title`,`Maximum of ${limit} of the same product variation per order`)
    $('i.limit-info-package').attr(`title`,`Maximum of ${limit} of the same package per order`)

  })
})

// GET - Cart Button, Get Modal
$('.products-container').on('click', '.cart-btn:not(.package-btn)', function(){
  let pid = $(this).closest('.this-product').find('.product-id').val();
  console.log(pid);
  $.get(`/cart/modal/${pid}`).then((res) => {
    let data = res.product, modal = productModal;
    modal.find('img').attr("src", data.img);
    modal.find('img').parent().attr("href", `/item/${data.id}`);
    modal.find('.title').html(`<span class="text-brand">${data.brand}</span> ${data.name}`);
    modal.find('.title').attr(`title`,`${data.brand} ${data.name}`);
    modal.find('.price').text(data.curPrice);
    modal.find('.quantity-input').val(data.curQty);
    modal.find('.select-size').html('');
    data.sizes.forEach((size)=>{
      modal.find('.select-size').append(`<option value="${size[0]}" class='sel'>${size[1]}</option>`);
    })
    modal.find('.select-size').val(data.curInv);

    stockDisplay(modal,data.sizes[0][0])
  }).catch((error) => {
    console.log(error);
  });
});

// Select Option onchange, Get Price
$('.select-size').on('change', function(){
  stockDisplay(productModal,this.value)
});

// Change Quantity
productModal.find('.quantity-input').keyup(function() {
  qtyControl(productModal,'change')
});

// Plus Button, Get New Quantity
productModal.on('click', '.plus-btn', ()=>{
  qtyControl(productModal,'plus')
});

// Minus Button, Get New Quantity
productModal.on('click', '.minus-btn', ()=>{
  qtyControl(productModal,'minus')
});

// POST - Add to Cart
productModal.on('click', '.add-button', ()=>{
  let modal = productModal, inv = modal.find('.select-size').val(),
  qty = parseInt(modal.find('input.quantity-input').val());
  qty ? 0 : qty = 1
  $.post(`/cart/modal`, {
    inv: inv, qty: qty
  }).then((res) => {
    let data = res.cart;
    postToCart(modal, data, res, 1);
  })
  .catch((error) => {
    console.log(error);
  });
});

// PACKAGE

// GET - Cart Button, Get Modal
$('.products-container, #checkout-products, #order-products-pane')
.on('click', '.cart-btn.package-btn, .package-img, .package-details-modal', function(){
  let pid = $(this).closest('.this-package, .product-div').find('.package-id, .inventory-id').val();
  console.log(pid);
  $.get(`/cart/package/${pid}`).then((res) => {
    let data = res.package, modal = packageModal;
    modal.find('#package-id').val(data[0].intPackageNo);
    modal.find('.package-title').text(data[0].strPackageName);
    modal.find('.package-description').text(data[0].strPackageDescription);

    modal.find('#products-list').html('')
    data.forEach((prod)=>{
      modal.find('#products-list').append(`
        <p class="fs-1em fw-300">
          ${prod.intProductQuantity} x
          <span class="text-brand">${prod.strBrand}</span>
          ${prod.strProductName}
          <span class="text-variant">${prod.intSize}</span>
        </p>`)
    })

    modal.find('#stock-display > span').text(data[0].stock);
    modal.find('.expire-date > span').text(data[0].dateDue);
    modal.find('.quantity-input').val(res.options.curQty);
    modal.find('p.discount > span').text(res.options.discount);
    modal.find('p.price-symbol').text(data[0].packagePrice);

    qtyValidate(modal,1,data[0].stock);

  }).catch((error) => {
    console.log(error);
  });
});

$('#checkout-products').on('click', '.package-img, .package-details-modal', function(){
  packageModal.find('.item-options').css('display','none')
});


// Change Quantity
packageModal.find('.quantity-input').keyup(function() {
  qtyControl(packageModal,'change')
});

// Plus Button, Get New Quantity
packageModal.on('click', '.plus-btn', ()=>{
  qtyControl(packageModal,'plus')
});

// Minus Button, Get New Quantity
packageModal.on('click', '.minus-btn', ()=>{
  qtyControl(packageModal,'minus')
});

// POST - Add to Cart
packageModal.on('click', '.add-button', ()=>{
  let modal = packageModal, packageNo = modal.find('#package-id').val(),
  qty = parseInt(modal.find('input.quantity-input').val());
  qty ? 0 : qty = 1
  $.post(`/cart/package`, {
    package: packageNo, qty: qty
  }).then((res) => {
    let data = res.cart;
    postToCart(modal, data, res, 1);
  })
  .catch((error) => {
    console.log(error);
  });
});
