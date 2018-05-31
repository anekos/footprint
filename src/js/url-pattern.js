
import prefix2 from 'string-commonprefix'
import suffix2 from 'string-commonsuffix'
import regexpEscape from 'escape-string-regexp'



function allFrom2(f) {
  return items => {
    let result = items[0];
    return items.slice(1).reduce((acc, it) => f(acc, it), result);
  };
}

let prefix = allFrom2(prefix2);
let suffix = allFrom2(suffix2);


function get(urls) {
  let p = prefix(urls);
  let s = suffix(urls);

  if (urls[0].length <= (p.length + s.length))
    return;

  let infixes = urls.map(url => url.slice(p.length).slice(0, -s.length));
  let numberInfix = infixes.every(infix => /^\d+$/.test(infix));

  if (numberInfix) {
    p = p.replace(/\d+$/, '');
    s = s.replace(/^\d+/, '');
  }

  return [p.length + s.length, p, s];
}

function search(urls) {
  let max = {length: 0, prefix, suffix};

  for (var i = 0; i < Math.max(0, Math.floor(urls.length / 5)); ++i) {
    let [length, prefix, suffix] = get(urls.slice(i + 1)) || [0, '', ''];
    if (max.length < length)
      max = {length, prefix, suffix};
  }

  return max.length && max;
}


export default urls => {
  let found = search(urls);
  if (found)
    return new RegExp('^' + regexpEscape(found.prefix) + '.+' + regexpEscape(found.suffix) + '$');
}
