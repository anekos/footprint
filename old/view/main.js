
let app = new Vue({
  el: '#app',
  data: {
    categories: []
  }
});

Footprint.targets().then(function (targets) {
  targets.forEach((target) => {
    app.categories.push({
      name: target.title
    })
  })
});

// Footprint.targets().then(function (targets) {
//   let root = document.querySelector('#targets');
// 
//   function removeItem (e) {
//     let li = e.target.parentNode;
//     let link = li.querySelector('a');
//     let url = link.href;
//     let name = link.textContent;
//     let itemType = li.getAttribute('data-item-type');
// 
//     if (!window.confirm('Remove: ' + name)) {
//       return;
//     }
// 
//     ({
//       page: async () => {
//         await Footprint.removePage(url);
//         li.parentNode.removeChild(li);
//       },
//       target: async () => {
//         let root = document.querySelector('#targets');
//         root.removeChild(li);
//         await Footprint.removeTarget(url);
//       }
//     }[itemType] || (() => false))();
// 
//   }
// 
//   function addActionButtons (li) {
//     let remove = document.createElement('a');
//     remove.textContent = '\u00a0\u274E';
//     remove.setAttribute('class', 'item-action-button');
//     remove.setAttribute('href', '#');
//     remove.addEventListener('click', removeItem, false);
//     li.appendChild(remove);
//   }
// 
//   for (let target of targets) {
//     let li = document.createElement('li');
//     li.setAttribute('data-target-url', target.url);
//     li.setAttribute('class', 'target close');
//     li.setAttribute('data-item-type', 'target');
// 
//     let a = document.createElement('a');
//     a.setAttribute('href', target.url);
//     a.textContent = target.title || 'NO TITLE';
// 
//     li.appendChild(a);
//     addActionButtons(li);
// 
//     a.addEventListener(
//       'click',
//       function (e) {
//         e.preventDefault();
// 
//         let pagesContainer = li.querySelector('.pages-container');
//         if (pagesContainer) {
//           DOM.toggleDisplay(pagesContainer);
//           DOM.toggleClass(li, 'open', 'close');
//           return;
//         }
// 
//         DOM.toggleClass(li, 'open', 'close');
// 
//         pagesContainer = document.createElement('ol');
//         pagesContainer.setAttribute('class', 'pages-container');
//         pagesContainer.setAttribute('reversed', 'reversed');
// 
//         async function addLinks () {
//           let pages = target.pages.reverse();
//           for (let pageUrl of pages) {
//             let page = await Footprint.getPage(pageUrl);
// 
//             let pageElement = document.createElement('li');
//             pageElement.setAttribute('data-item-type', 'page');
// 
//             let pageLink = document.createElement('a');
//             pageLink.setAttribute('href', pageUrl);
//             pageLink.textContent = page.title || pageUrl;
// 
//             pageElement.appendChild(pageLink);
//             addActionButtons(pageElement);
// 
//             pageLink.addEventListener(
//               'click',
//               () => Footprint.refreshTarget(target.url, 'lastClickedAt'),
//               false
//             );
//             pagesContainer.appendChild(pageElement);
//           }
// 
//           li.appendChild(pagesContainer);
//         };
// 
//         addLinks();
//       },
//       false
//     );
// 
//     root.appendChild(li);
//   }
// });


browser.runtime.onMessage.addListener((message) => {
  ({
    'footprint-refresh': () => {
      document.location.href = document.location.href;
    }
  }[message.command] || (() => false))();
});
