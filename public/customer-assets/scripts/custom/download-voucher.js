function download_voucher(bankAccountNo, bankServiceFee){
  let orderNo = $('#orderNo').val();
  $.get(`/summary/voucher/${orderNo}`).then((res)=>{
    let doc = new jsPDF(), order = res.order

    doc.addFont('Poppins-Regular.ttf', 'Poppins-Regular', 'normal');
    doc.addFont('Poppins-Light.ttf', 'Poppins-Light', 'normal');
    doc.addFont('Poppins-ExtraLight.ttf', 'Poppins-ExtraLight', 'normal');

    // BANK
    // Borders
    doc.setDrawColor(112, 112, 112);
    doc.rect(18, 15, 174, 72.5); // main box
    doc.rect(110, 22, 77, 25); // summary box
    doc.line(22, 50, 187, 50); // horizontal line top
    doc.line(22, 74, 187, 74); // horizontal line bottom
    doc.setDrawColor(18, 187, 173);
    doc.setFillColor(18, 187, 173);
    doc.rect(18, 15, 174, 3, 'FD'); // topbar

    // Brand Title
    doc.setFont('Poppins-Regular');
    doc.setFontSize('18');
    doc.text(22, 27, `ULTRA SUPER GREEN`);
    // Brand Subtitle
    doc.setFont('Poppins-ExtraLight');
    doc.setFontSize('9');
    doc.text(22, 31.3, `Katipunan Ave. Quezon City`);
    doc.text(22, 35.8, `0955 9044744  |  (02)738 1202`);

    // Summary
    // Labels
    doc.setFont('Poppins-Light');
    doc.setFontSize('9');
    doc.text(112, 28.5, `Order Number:`);
    doc.text(112, 35.5, `Total Amount Due:`);
    doc.text(112, 42.5, `Bank Service Fee:`);
    // Values
    doc.setFont('Poppins-Regular');
    doc.setFontSize('12');
    doc.text(185, 28.8, `#${order.intOrderNo}`, 'right' );
    doc.text(185, 35.8, `PHP ${res.orderTotal}`, 'right' );
    doc.text(185, 42.8, `${bankServiceFee}`, 'right' );

    // Title
    doc.setFont('Poppins-Regular');
    doc.setFontSize('18');
    doc.text(22, 46, `BANK'S COPY`);

    // Content
    doc.setFont('Poppins-Light');
    doc.setFontSize('10');
    doc.text(22, 56, `Name:`);
    doc.text(22, 63, `Account Number:`);
    doc.text(22, 70, `Clearing Account No:`);

    doc.setFont('Poppins-Regular');
    doc.setFontSize('12');
    order.strMname ?
      doc.text(70, 56.2, `${order.strLname.toUpperCase()}, ${order.strFname.toUpperCase()} ${order.strMname.toUpperCase()}`):
      doc.text(70, 56.2, `${order.strLname.toUpperCase()}, ${order.strFname.toUpperCase()}`);
    doc.text(70, 63.2, `#${order.intUserID}`);
    doc.text(70, 70.2, `${bankAccountNo}`);

    // Foot Note
    doc.setFont('Poppins-ExtraLight');
    doc.setFontSize('9');
    doc.text(22, 79, `This is the Bank’s copy. Detach this part and present to the Bank Teller (together with the Bank’s fully-`);
    doc.text(22, 83, `accomplished Deposit Slip). This document is valid until`);
    doc.setFont('Poppins-Regular');
    doc.text(109, 83, `${order.paymentDue.toUpperCase()}`);

    // --------------------------------------------------
    doc.setDrawColor(0, 0, 0);
    let x=18, w=23
    for(i=0; i<=24; i++){ // broken lines
      doc.line(x, 92, w, 92);
      x+=7.04; w+=7.04;
    }
    doc.setTextColor(82, 86, 89);
    doc.setFont('Poppins-Light');
    doc.setFontSize('9');
    doc.text(18, 96.5, `Cut Here`);
    doc.setTextColor(0);

    // --------------------------------------------------

    // CUSTOMER
    let ext= 85;

    doc.setDrawColor(112, 112, 112);
    doc.rect(18, 15+ext, 174, 68.5); // main box
    doc.rect(110, 22+ext, 77, 25); // summary box
    doc.line(22, 50+ext, 187, 50+ext); // horizontal line top
    doc.line(22, 74+ext, 187, 74+ext); // horizontal line bottom
    doc.setDrawColor(18, 187, 173);
    doc.setFillColor(18, 187, 173);
    doc.rect(18, 15+ext, 174, 3, 'FD'); // topbar

    // Brand Title
    doc.setFont('Poppins-Regular');
    doc.setFontSize('18');
    doc.text(22, 27+ext, `ULTRA SUPER GREEN`);
    // Brand Subtitle
    doc.setFont('Poppins-ExtraLight');
    doc.setFontSize('9');
    doc.text(22, 31.3+ext, `Katipunan Ave. Quezon City`);
    doc.text(22, 35.8+ext, `0955 9044744  |  (02)738 1202`);

    // Summary
    // Labels
    doc.setFont('Poppins-Light');
    doc.setFontSize('9');
    doc.text(112, 28.5+ext, `Order Number:`);
    doc.text(112, 35.5+ext, `Total Amount Due:`);
    doc.text(112, 42.5+ext, `Bank Service Fee:`);
    // Values
    doc.setFont('Poppins-Regular');
    doc.setFontSize('12');
    doc.text(185, 28.8+ext, `#${order.intOrderNo}`, 'right' );
    doc.text(185, 35.8+ext, `PHP ${res.orderTotal}`, 'right' );
    doc.text(185, 42.8+ext, `${bankServiceFee}`, 'right' );

    // Title
    doc.setFont('Poppins-Regular');
    doc.setFontSize('18');
    doc.text(22, 46+ext, `CUSTOMER'S COPY`);

    // Content
    doc.setFont('Poppins-Light');
    doc.setFontSize('10');
    doc.text(22, 56+ext, `Name:`);
    doc.text(22, 63+ext, `Account Number:`);
    doc.text(22, 70+ext, `Date of Order:`);

    doc.setFont('Poppins-Regular');
    doc.setFontSize('12');
    order.strMname ?
      doc.text(70, 56.2+ext, `${order.strLname.toUpperCase()}, ${order.strFname.toUpperCase()} ${order.strMname.toUpperCase()}`):
      doc.text(70, 56.2+ext, `${order.strLname.toUpperCase()}, ${order.strFname.toUpperCase()}`);
    doc.text(70, 63.2+ext, `#${order.intUserID}`);
    doc.text(70, 70.2+ext, `${order.dateOrdered.toUpperCase()}`);

    // Foot Note
    doc.setFont('Poppins-ExtraLight');
    doc.setFontSize('9');
    doc.text(22, 79+ext, `This is your copy. Keep this part in a safe place. This document is valid until`);
    doc.setFont('Poppins-Regular');
    doc.text(138.5, 79+ext, `${order.paymentDue.toUpperCase()}`);

    doc.save('UltraSuperGreen Deposit Slip.pdf');
    console.log('PDF Downloaded!');
  }).catch((error)=>{
    console.log(error);
  });
}
