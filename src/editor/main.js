import Quill from "quill";
// var toolbarOptions = {
//     container: [[{"size": [ 'small', false, 'large']}],["bold", "italic", "link"], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ["image", "video"] ],
//     handlers: {
//       // handlers object will be merged with default handlers object
//       'link': function(value) {
//         if (value) {
//           var href = prompt('Enter the URL');
//           this.quill.format('link', href);
//         } else {
//           this.quill.format('link', false);
//         }
//       },
//       "image": function() {
//         const { Page } = window;
//         if (Page) {
//           Page.postMessage(
//             JSON.stringify(
//               {"event": "pickImage"}  
//             )
//           );
//         }
//       }
//     }
//   }
// var toolbarOptions = [['bold', 'italic'], ['link', 'image']];

var options = {
    // debug: 'info',
    modules: {
        toolbar: false,
    },
    placeholder: '请输入内容',
    readOnly: false,
    theme: 'snow'
};

window.quill = new Quill(
    "#editor", 
    options,
)

window.addEventListener("load", () => {
  const { Page } = window;
  if (Page) {
    Page.postMessage(
      JSON.stringify(
        {"event": "pageMounted"}  
      )
    );
  }

  window.addEventListener('focus', () => {
    if (Page) {
      Page.postMessage(
        JSON.stringify(
          {"event": "focused"}  
        )
      );
    } 
  })
})

window.getContent = function () {
  return window.quill.root.innerHTML;
}

