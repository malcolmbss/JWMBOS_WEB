function createAlert( type, title, htmlString )
{
  // if no htmlString is passed in, the title is the main content of the popup
  if ( typeof htmlString == "undefined")
  {
     htmlString = "";
  }

  var icon;
  var buttonText;

  /* type index:
    0: success
    1: info
    2: warning
    3: error
  */

  if ( type === 0 ) {
    icon = "success";
    buttonText = "OK";
  } else if ( type === 1 ) {
    icon = "info";
    buttonText = "OK";
  } else if ( type === 2 ) {
    icon = "warning";
    buttonText = "Please Try Again";
  } else if ( type === 3 ) {
    icon = "error";
    buttonText = "OK";
  }

  //if an htmlstring was passed in create the custom element
  var customHtml = document.createElement("div");

  // adding timestamp and reqUid values on popups so we can find them in the logs when a user sends a screen capture of the error msg
  // reqUid is 6-8 random letters.  The probability is slim.  But it's possible that the random string could be a politically incorrect
  // word which we defintely do NOT want popping up on a message text.  So I'm converting the letters to their 2-digit hexadecimal ASCII
  // code.  Take each two characters in the ref string and convert them to the ASCII character they represent.  The result will be the reqUid
  // (a.k.a. logUid)
  if ( typeof htmlString == 'undefined' ) htmlString = "";
  customHtml.innerHTML = htmlString
                         + "<p>&nbsp;<p>&nbsp;<p><font style='font-size:10px'>(Current time: "+now()+" Ref: [" + string2Ascii(reqUid) + "])";

  swal({
    title: title,
    content: customHtml,
    icon: icon,
    button: buttonText,
  });
}
