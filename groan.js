function PHParse(str) {
  var result = {}, o = { str: str, pos: 0 };
  for (var k,v,i,last=o.str.length; o.pos<last;) {
    i = o.str.indexOf('|', o.pos);
    k = o.str.substring(o.pos, i);
    o.pos = i + 1;
    v = __PHParseValue(o);
    result[k] = v;
  }
  return result;
};
var __PHParseValue = function(o) {
  var v, type = o.str[o.pos].toLowerCase(), len, idelim;
  o.pos += 2;
  if (type === 's') {
    idelim = o.str.indexOf(':', o.pos);
    len = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 2;
    v = __PHParseString(o);
  } else if (type === 'i') {
    idelim = o.str.indexOf(';', o.pos);
    v = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 1;
  } else if (type === 'd') {
    idelim = o.str.indexOf(';', o.pos);
    v = parseFloat(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 1;
  } else if (type === 'b') {
    v = (o.str[o.pos] === '1');
    o.pos += 2;
  } else if (type === 'a' || type === 'o') {
    v = {};
    if (type === 'o') {
      // skip object class name
      o.pos = o.str.indexOf(':', o.pos) + 2;
      __PHParseString(o);
    }
    idelim = o.str.indexOf(':', o.pos);
    len = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 2;
    for (var i=0,key,val; i<len; ++i) {
      v[__PHParseValue(o)] = __PHParseValue(o);
      /*key = __PHParseValue(o);
      val = __PHParseValue(o);
      v[key] = val;*/
    }
    ++o.pos;
  } else if (type === 'r') {
    // TODO: support for recursion/references
    o.pos = o.str.indexOf(';', o.pos) + 1;
    v = undefined;
  } else if (type === 'n')
    v = null;
  return v;
};
var __PHParseString = function(o) {
  var s = "", orig = o.pos, escaped = false;
  while (true) {
    if (o.str[o.pos] === '"' && !escaped) {
      s = o.str.substring(orig, o.pos);
      break;
    } else if (o.str[o.pos] === '\\')
      escaped = !escaped;
    ++o.pos;
  }
  o.pos += 2;
  return s;
};

if (module)
  module.exports = PHParse;
else if (window)
  window.PHParse = PHParse;