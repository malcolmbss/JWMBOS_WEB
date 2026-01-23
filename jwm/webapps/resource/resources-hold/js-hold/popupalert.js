function createAlert(type, title, htmlString, buttonText) {
  // if no htmlString is passed in the title is the main content of the popup
  htmlString = htmlString || null;

  var icon;
  // var buttonText;

  /* type index:
    0: success
    1: info
    2: warning
    3: error
  */

  if (type === 0) {
    icon = "success";
    buttonText ? buttonText : "OK";
  } else if (type === 1) {
    icon = "info";
    buttonText ? buttonText : "OK";
  } else if (type === 2) {
    icon = "warning";
    buttonText ? buttonText : "Please Try Again";
  } else if (type === 3) {
    icon = "error";
    buttonText ? buttonText : "OK";
  }

  //if an htmlstring was passed in create the custom element
  var customHtml = document.createElement("div");
  customHtml.innerHTML = htmlString;

  swal({
    title: title,
    content: customHtml,
    icon: icon,
    button: buttonText,
  });
}
