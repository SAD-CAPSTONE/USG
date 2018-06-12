let t1, t2;

// GET - Cart Button, Get Modal
$('.x-scrolling-div').on('click', '.cart-btn', function(){
  let pid = $(this).closest('.custom-card').find('.product-id').val();
  console.log(pid);
  $.get(`/cart/modal/${pid}`).then((res) => {
    let data = res.product, modal = $('#modal-product-to-cart');
    modal.find('img').attr("src", data.img);
    modal.find('.title').text(data.name);
    modal.find('.price').text(data.curPrice);
    modal.find('.quantity-input').val(data.curQty);
    modal.find('.select-size').html('');
    data.sizes.forEach((size, i)=>{
      modal.find('.select-size').append(`<option value="${size[0]}" class='sel'>${size[0]}</option>`);
    })
    modal.find('.select-size').val(data.curSize);
  }).catch((error) => {
    console.log(error);
  });
});

// GET - Select Option onchange, Get Price
$('.select-size').on('change', function(){
  $.get(`/cart/modal-price/${this.value}`).then((res) => {
    $('.price').html(`${res.price}`);
  }).catch((error) => {
    console.log(error);
  });
});

// GET - Plus Button, Get New Quantity
$('#modal-product-to-cart').on('click', '.plus-btn', ()=>{
  $.get(`/cart/modal-qty/plus`).then((res) => {
    $('#modal-product-to-cart').find('.quantity-input').val(`${res.qty}`);
  }).catch((error) => {
    console.log(error);
  });
});

// GET - Minus Button, Get New Quantity
$('#modal-product-to-cart').on('click', '.minus-btn', ()=>{
  $.get(`/cart/modal-qty/minus`).then((res) => {
    $('#modal-product-to-cart').find('.quantity-input').val(`${res.qty}`);
  }).catch((error) => {
    console.log(error);
  });
});

// POST - Add to Cart
$('#modal-product-to-cart').on('click', '.add-button', ()=>{
  let modal = $('#modal-product-to-cart');
  $.post(`/cart/modal`).then((res) => {
    let data = res.cart;

    clearTimeout(t1);
    clearTimeout(t2);
    modal.modal('toggle');
    modal.next().css({
      "max-width": "100%",
      "padding": "20px 23px 20px 20px"
    });
    data[res.latest].curQty == 10 ?
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

    data[res.latest].curQty == 10 ?
      modal.next().find('p:nth-of-type(2)').text(`Maximum quantity reached (${data[res.latest].curQty})`):
      modal.next().find('p:nth-of-type(2)').text(`has been added (${data[res.latest].curQty} in cart)`);
    modal.next().find('p:first-of-type').text(`${data[res.latest].name} ${data[res.latest].curSize}`);

    $('#getCart').click();
  }).catch((error) => {
    console.log(error);
  });
});
