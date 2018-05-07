
import axios from 'axios'
import urlPattern from './url-pattern'



async function check(urls) {
  let pattern = urlPattern(urls)
  let url = urls.slice(-1)[0];

  let existence = {};
  urls.forEach(it => existence[it] = true);

  let response = await axios({method: 'get', url, responseType: 'document'});
  let parser = new DOMParser();
  let contentType = (response.headers['content-type'] || 'text/html').replace(/;.*/, '');
  let body = response.data.body;

  return Array.from(body.querySelectorAll('a')) .
    filter(it => it.getAttribute('href')) .
    map(it => it.href) .
    filter(it => !existence[it]) .
    filter(it => /^https?:\/\//.test(it)) .
    filter(it => pattern.test(it));
}


export default check;
