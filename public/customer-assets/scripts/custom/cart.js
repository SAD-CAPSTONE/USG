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
  function allQtyValidate(qty,stock,i){
    $('#cart-pad .cart-product-container').each(function(index){
      if (index == i){
        $(this).find(`.quantity-input`).val() <= 1 ?
          $(this).find(`.minus`).attr('disabled','disabled') :
          $(this).find(`.minus`).removeAttr('disabled')
        $(this).find(`.quantity-input`).val() >= stock ?
          $(this).find(`.plus`).attr('disabled','disabled') :
          $(this).find(`.plus`).removeAttr('disabled')
      }
    })
  }
  function thisQtyValidate(qty,stock,thisDiv){
    $(thisDiv).find(`.quantity-input`).val() <= 1 ?
      $(thisDiv).find(`.minus`).attr('disabled','disabled') :
      $(thisDiv).find(`.minus`).removeAttr('disabled')
    $(thisDiv).find(`.quantity-input`).val() >= stock ?
      $(thisDiv).find(`.plus`).attr('disabled','disabled') :
      $(thisDiv).find(`.plus`).removeAttr('disabled')
  }
  function packageDetailsFix(card,size){
    if( size > 500 && !card.find('.product-pic').attr('hidden')) {
      card.css('height', '125px')
      card.find('.product-pic').css('width', '125px')
      card.find('.product-desc').css({
        'height': '100%',
        'position': 'absolute',
        'margin-left': '125px',
        'width': 'calc(var(--container-width) - 145px)'
      })
      card.find('.quantity').css({
        'position': 'static',
        'left': '0',
        'bottom': '0'
      })
    }
    else if( size <= 500 && !card.find('.product-pic').attr('hidden')){
      card.css('height', '145px')
      card.find('.product-pic').css('width', '100px')
      card.find('.product-desc').css({
        'height': '100%',
        'position': 'absolute',
        'margin-left': '100px',
        'width': '140px'
      })
      card.find('.quantity').css({
        'position': 'absolute',
        'left': '-90',
        'bottom': '7'
      })
    }
  }

  // GET - Load cart
  $('#getCart').on('click', () => {
    let list = $('#cart-pad');
    $.get('/cart/list').then((res) => {
      list.html('');
      res.thisUser ? 0 :
        list.append(`
          <div style="padding: 0px 10px 0px 10px">
            <em class="fs-08em text-muted">
              You must be logged in to proceed to Checkout
            </em>
          </div>
          `)
      res.cart.forEach((data,i) => {
        if (data.type == 1){
          list.append(`
            <div class="cart-product-container">
              <div class="product-card">
                <input class="inventory-id" value="${data.inv}" hidden/>
                <input class="cart-type" value="${data.type}" hidden/>
                <div class="product-pic"><a href="/item/${data.id}"><img src="${data.img}"/></a></div>
                <div class="product-desc">
                  <p class="product-title" title="${data.brand} ${data.name}"><span class="text-brand">${data.brand}</span> ${data.name}</p>
                  <small class="product-size text-muted">${data.curSize}</small>
                  <div class="input-group quantity">
                    <div class="input-group-prepend addon">
                      <button class="btn btn-primary quantity-buttons minus" type="button">
                      <small class="quantity-text quantity-text-minus">-</small>
                    </button>
                    </div>
                    <input class="form-control quantity-input" type="text" value="${data.curQty}">
                    <div class="input-group-append addon">
                      <button class="btn btn-primary quantity-buttons plus" type="button">
                      <small class="quantity-text quantity-text-plus">+</small>
                    </button>
                    </div>
                  </div>
                  <small class="product-oldprice text-muted">
                    <span>${data.limit} max</span><br>
                  </small>
                  <p class="product-price price-symbol">${data.curPrice}</p>
                </div>
              </div>
              <div class="product-remove"><i class="fa fa-remove product-remove-icon"></i></div>
            </div>`);
        }
        else{
          list.append(`
            <div class="cart-product-container">
              <div class="product-card">
                <input class="inventory-id" value="${data.package}" hidden/>
                <input class="cart-type" value="${data.type}" hidden/>
                <div class="product-pic"><img src="${data.img}" class="cursor-pointer"/></div>
                <div class="product-desc">
                  <p class="product-title" title="${data.name}"><span class="text-package">${data.name}</span></p>
                  <div class="package-product-list">

                  </div>
                  <small class="product-size text-muted package-details">View Details</small>
                  <div class="input-group quantity">
                    <div class="input-group-prepend addon">
                      <button class="btn btn-primary quantity-buttons minus" type="button">
                      <small class="quantity-text quantity-text-minus">-</small>
                    </button>
                    </div>
                    <input class="form-control quantity-input" type="text" value="${data.curQty}">
                    <div class="input-group-append addon">
                      <button class="btn btn-primary quantity-buttons plus" type="button">
                      <small class="quantity-text quantity-text-plus">+</small>
                    </button>
                    </div>
                  </div>
                  <small class="product-oldprice text-muted">
                    <span>${data.limit} max</span><br>
                  </small>
                  <p class="product-price price-symbol">${data.curPrice}</p>
                </div>
              </div>
              <div class="product-remove"><i class="fa fa-remove product-remove-icon"></i></div>
            </div>`);
        }
        allQtyValidate(data.curQty,data.limit,i)
        // <small class="product-oldprice text-muted">
        //   <span><s class="price-symbol">0</s></span><span> (-0%)</span><br>
        // </small>
      });

      $('.quantity .quantity-input').bind("cut copy paste",function(e) { e.preventDefault(); });
      $('.quantity-input').keypress(function(key) {
        if(key.charCode < 48 || key.charCode > 57) return false;
      });
      $('#cart-pad .quantity-input').keyup(function() {
        let inv = $(this).closest('.product-card').find('.inventory-id').val(),
        type = $(this).closest('.product-card').find('.cart-type').val(),
        val = parseInt($(this).val()) == 0 ? 1 : $(this).val();

        $.ajax({
          url: `/cart/list`,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({
            inv: inv,
            type: type,
            action: 'change',
            value: val
          }),
          success: (res) => {
            res.cart != null ?
              res.blank ? 0 :
                $(this).closest('.product-card').find('.quantity-input').val(res.cart.curQty)
              : $(this).closest('.product-card').remove()
            thisQtyValidate(res.cart.curQty,res.cart.limit,$(this).closest('.product-card'))
            $('#subtotal-btn').click();
          }
        });
      });

      if(!res.cart.length){
        res.thisUser ?
          list.append(`
            <div class="cart-product-container">
              <p> Cart currently empty </p>
            </div>`):
          list.append(`
            <div class="cart-product-container">
              <p style="line-height: .8em"> Cart currently empty </p>
            </div>`);
        chekoutBtnDisabled();
      }
      else{
        chekoutBtnActive();
      }
      $('svg#SVG_refreshCart').attr('hidden','hidden');
      $('#reload > i').removeAttr('hidden');
      $('#subtotal-btn').click();
    }).catch((error) => {
      list.html('');
      list.append(`
        <div class="cart-product-container">
          <p> Cart currently empty </p>
        </div>`);
      $('#subtotal-btn').click();
    });
  });

  // DELETE - Remove product
  $('#cart-pad').on('click', '.product-remove', function() {
    let inv = $(this).prev().find('.inventory-id').val(),
    type = $(this).prev().find('.cart-type').val();
    console.log(type)
    $.ajax({
      url: `/cart/list`,
      method: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv,
        type: type
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
    let inv = $(this).closest('.product-card').find('.inventory-id').val(),
    type = $(this).closest('.product-card').find('.cart-type').val();

    $.ajax({
      url: `/cart/list`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv,
        type: type,
        action: 'plus'
      }),
      success: (res) => {
        res.cart != null ?
          $(this).closest('.product-card').find('.quantity-input').val(res.cart.curQty) :
          $(this).closest('.product-card').remove()
        thisQtyValidate(res.cart.curQty,res.cart.limit,$(this).closest('.product-card'))
        $('#subtotal-btn').click();
      }
    });
  });

  // PUT - Minus Button, Get New Quantity
  $('#cart-pad').on('click', '.minus', function() {
    let inv = $(this).closest('.product-card').find('.inventory-id').val(),
    type = $(this).closest('.product-card').find('.cart-type').val();

    $.ajax({
      url: `/cart/list`,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        inv: inv,
        type: type,
        action: 'minus'
      }),
      success: (res) => {
        res.cart != null ?
          $(this).closest('.product-card').find('.quantity-input').val(res.cart.curQty) :
          $(this).closest('.product-card').remove()
        thisQtyValidate(res.cart.curQty,res.cart.limit,$(this).closest('.product-card'))
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

  // Package Details
  $('#cart-pad').on('click', '.package-details, .product-pic img', function() {
    let card = $(this).closest('.product-card'),
    inv = card.find('.inventory-id').val(),
    list = card.find('.package-product-list');

    if (card.find('.package-details').text() == 'View Details'){
      card.find('.product-pic').css('width', '0px')
      card.find('.product-desc').css({
        'margin-left': '0px',
        'width': '100%'
      })
      card.find('.quantity').css({
        'position': 'static',
        'left': '0',
        'bottom': '0'
      })

      $.get(`/cart/package/${inv}`).then((res) => {
        let data = res.package

        pc1 = setTimeout(()=>{
          list.html('');
          data.forEach((prod)=>{
            list.append(`
              <p class="mb-0">
                ${prod.intProductQuantity} x
                <span class="text-brand">${prod.strBrand}</span>
                ${prod.strProductName}
                <span class="text-variant">${prod.intSize}</span>
              </p>`)
          })
          pc2 = setTimeout(()=>{
            list.find('p').css('opacity','1')
          },1);

          card.css('height', 'auto')
          card.find('.product-pic').attr('hidden','hidden')
          card.find('.product-desc').css({
            'height': 'auto',
            'position': 'static'
          })
          card.find('.product-title').css({
            'height': 'auto',
            'margin-bottom': '5px'
          })
          card.find('.package-details').text('Hide Details')
        },500);

      }).catch((error) => {
        console.log(error)
      });

    }
    else{
      list.find('p').css('opacity','0')
      pc3 = setTimeout(()=>{
        list.html('');
        card.find('.product-pic').removeAttr('hidden')
        card.find('.product-title').css({
          'height': '68px',
          'margin-bottom': '0px'
        })
        packageDetailsFix(card,$(window).width())

        card.find('.package-details').text('View Details')
      },400);

    }

  });

  // Package Details Fix on Resize
  $( window ).resize(function() {
    let card = $('.product-card');
    card.each(function(){
      packageDetailsFix($(this),$(window).width())
    })
  });

  // Reload
  $('#reload').on('click', () => {
    $('#reload > i').attr('hidden','hidden');
    $('svg#SVG_refreshCart').removeAttr('hidden');
    let tRefresh1 = setTimeout(()=>{
      $('#getCart').click();
    },500);
  });

  // Click Button on Load
  $('#getCart').click();

});
