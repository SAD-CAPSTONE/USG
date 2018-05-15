$(() => {

  // GET
  $('#getdata').on('click', () => {
    $.get('/extras/response').then((res) => {
      console.log(res.data[res.data.length - 1].name);
      var list = $('#dataList');
      list.html('');
      res.data.forEach((data) => {
        list.append('<span><h4 class="id" style="display: inline">' + data.id + '</h4>\
        <input type="text" class="name" value="' + data.name + '"/>\
        <button class="putdata"> Put Data </button>\
        <button class="deldata"> Delete Data </button>\
        </span><br>');
      })
    }).catch((error) => {
      var list = $('#dataList');
      list.html('');
      list.append('<i> Empty </i>');
    })
  });

  // POST
  $('#addData').on('click', (event) => {
    event.preventDefault();

    var addInput = $('#add-input');

    $.post('/extras/response', {
      name: addInput.val()
    }).then((res) => {
      addInput.val('');
      $('#getdata').click();
    }).catch((error) => {
      console.log(error);
    })
  });

  // PUT
  $('#dataList').on('click', '.putdata', function() {
    var rowEl = $(this).closest('span');
    var id = rowEl.find('.id').text();
    var newName = rowEl.find('.name').val();

    $.ajax({
      url: '/extras/response/' + id,
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        newName: newName
      }),
      success: (res) => {
        console.log(res);
        $('#get-button').click();
      }
    });
  });

  // DELETE
  $('#dataList').on('click', '.deldata', function() {
    var rowEl = $(this).closest('span');
    var id = rowEl.find('.id').text();

    $.ajax({
      url: '/extras/response/' + id,
      method: 'DELETE',
      contentType: 'application/json',
      success: (res) => {
        console.log(res);
        $('#getdata').click();
      }
    });
  });

  // CLEAR
  $('#cleardata').on('click', (event) => {
    event.preventDefault();

    $.get('/extras/clear').then((res) => {
      console.log(res.data[0].name);
    }).catch((error) => {
      $('#getdata').click();
    });
  });

  // GET onload
  $('#getdata').click();

  // Pressing Enter
  $(document).keypress((e) => {
    if (e.which == 13) {
      $('#addData').click();
    }
  });

});
