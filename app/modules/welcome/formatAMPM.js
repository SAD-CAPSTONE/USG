/*timeformat from time*/

module.exports= (time) => {
  var str = time.toString();
  var hours = str.charAt(0).concat(str.charAt(1));
  var minutes = str.charAt(3).concat(str.charAt(4));
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
