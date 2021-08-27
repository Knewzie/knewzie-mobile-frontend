import Quill from "quill";


var toolbarOptions = {
    container: [[{"size": [ 'small', false, 'large']}],["bold", "italic", "link"], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ["image", "video"] ],
    handlers: {
      // handlers object will be merged with default handlers object
      'link': function(value) {
        if (value) {
          var href = prompt('Enter the URL');
          this.quill.format('link', href);
        } else {
          this.quill.format('link', false);
        }
      },
      "image": function() {
      }
    }
  }
// var toolbarOptions = [['bold', 'italic'], ['link', 'image']];

var options = {
    debug: 'info',
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Compose an epic...',
    readOnly: false,
    theme: 'snow'
};

new Quill(
    "#editor", 
    options,
)

document.addEventListener("load", () => {
  const { Page } = window;
  if (!Page) { return; }
  Page.postMessage(
    JSON.stringify(
      {"event": "pageMounted"}  
    )
  );
})