/*shortens string*/

module.exports= (string,x,y) => {
  return string.substring(x,y).concat('...');
}
