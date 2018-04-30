module.exports= (num) => {
  var str = "" + num;
  var pad = "000000000";
  var ans = pad.substring(0, pad.length - str.length) + str;
  return ans;
}
