   var ajaxSuggestRequest = getAjaxRequestObject(); // NOTE: MUST be global..............
   var ajaxSearchSuggestRequest = getAjaxRequestObject(); // NOTE: MUST be global..............

   function suggest(type, tagUid )
   {
//   console.log( "suggest " + (ajaxSuggestRequest.readyState ));
        var inputField = document.getElementById(tagUid)
        inputField.valueId =''; // user is changing field... invalidate any suggestion selection

        if (ajaxSuggestRequest.readyState == 4 || ajaxSuggestRequest.readyState == 0) // this will throw away keystrokes until last req completes
        {
                // user typed in field... likely lost the valid suggestion... can't use it now

                var str = escape(document.getElementById(tagUid).value);

                var serverCall = "/cis/jsp/ajax/ajaxSuggest.jsp"
                                +"?user="+getUserName()
                                +"&type="+type
                                +"&str="+str
                ajaxSuggestRequest.open("GET", serverCall, true);
                ajaxSuggestRequest.onreadystatechange = function() { handleSuggest(tagUid); };
                ajaxSuggestRequest.send(null);
        }
   }

   function handleSuggest(tagUid)
   {
        if (ajaxSuggestRequest.readyState == 4)
        {
                var ss = document.getElementById('suggest'+tagUid)
                ss.innerHTML = '';
                var result = ajaxSuggestRequest .responseText.trim().split("~");
//              console.log( result + "<<<" );
                if ( result.length > 1 )
                {
                   var str = result[1].split("|");
                   for(i=1; i < str.length-1; i++)  // there is one last trailing separator to ensure we have the end of string (some trailing text may come with results)
                   {
                           var str1 = str[i].split("^");
//                         console.log( suggest + " +++" );
                           var suggest = '<div onmouseover="suggestOver(this);" ';
                           suggest += 'onmouseout="suggestOut(this);" ';
                           suggest += 'onclick="setSuggest(';
                           suggest += "'" + tagUid + "'";
                           suggest += ", '" + str1[0] + "'";
                           suggest += ", '" + str1[1] + "'";
                           suggest += ", '" + str1[2] + "' ); " + '"';
                           suggest += ' class="suggest_link"> (' + str1[1] + ') ' + str1[0] + '</div>';
                           ss.innerHTML += suggest;
                   }
                }
        }
   }

   function suggestOver(div_value)
   {
      div_value.className = 'suggest_link_over';
   }

   function suggestOut(div_value)
   {
      div_value.className = 'suggest_link';
   }

   function setSuggest(tagUid, text, numeric, sendValue )
   {
      console.log( text + " = " + numeric + " = " + sendValue );
      document.getElementById(tagUid).value = "("+numeric + ") " + text;
      document.getElementById(tagUid).valueId = sendValue;  // made up attribute to hold the value to send to the server for the selected item
      var event = new Event('submit'); // trigger an 'onSubmit'
      document.getElementById(tagUid).dispatchEvent(event);  // using the onSubmit event to cause suggest input field to do normal server input update call

      document.getElementById('suggest'+tagUid).innerHTML = ''; // clear selection box
   }

   function searchSuggest(type, tagUid, actionId)
   {
        if (ajaxSearchSuggestRequest.readyState == 4 || ajaxSearchSuggestRequest.readyState == 0) // this will throw away keystrokes until last req completes
        {
                // user typed in field... likely lost the valid suggestion... can't use it now
                enableIcon( actionId, false );
                document.getElementById('suggestSelected'+actionId).value = -1;

                var str = escape(document.getElementById(tagUid).value);

                var serverCall = "/cis/jsp/ajax/ajaxSuggest.jsp"
                                +"?user="+getUserName()
                                +"&type="+type
                                +"&str="+str
                ajaxSearchSuggestRequest.open("GET", serverCall, true);
                ajaxSearchSuggestRequest.onreadystatechange = function() { handleSearchSuggest(tagUid, actionId); };
                ajaxSearchSuggestRequest.send(null);
        }
   }

   function handleSearchSuggest(tagUid, actionId)
   {
        if (ajaxSearchSuggestRequest.readyState == 4)
        {
                var ss = document.getElementById('suggest'+tagUid)
                ss.innerHTML = '';
//              console.log( ajaxSearchSuggestRequest.responseText.trim() );
                var str = ajaxSearchSuggestRequest.responseText.trim().split("|");
                var ndxbgn = 0;
                if (str[0].indexOf("~") != -1)  ndxbgn = 1;
                for(i=ndxbgn; i < str.length-1; i++)  // there is one last trailing separator to ensure we have the end of string (some trailing text may come with results)
                {
//                console.log( i + " " + str[i] );
                        var str1 = str[i].split("^"); // id is also sent.
//                      console.log( str1[0] + " " + str1[1] + "<<" );
                        var suggest = '<div onmouseover="suggestOver(this);" ';
                        suggest += 'onmouseout="suggestOut(this);" ';
                        suggest += 'onclick="setSearch(';
                        suggest += "'" + tagUid + "'";
                        suggest += ", '" + actionId+ "'";
                        suggest += ", " + str1[1];
                        suggest += ', this.innerHTML);" ';
                        suggest += 'class="suggest_link">' + str1[0] + '</div>';
                        console.log( "["+suggest+"]" );
                        ss.innerHTML += suggest;
                }
        }
   }


   function setSearch(tagUid, actionId, selectedId, value)
   {
      document.getElementById(tagUid).value = value;
      document.getElementById('suggestSelected'+actionId).value = selectedId;
      document.getElementById('suggest'+tagUid).innerHTML = '';
      enableIcon( actionId, true );
   }

   function enableIcon(actionId, state )
   {
      actionIcon = document.getElementById('searchSuggestAction'+actionId);
      actionIcon.src = actionIcon.getAttribute("activeIcon");  // using my own add-on tag attribute
   }


