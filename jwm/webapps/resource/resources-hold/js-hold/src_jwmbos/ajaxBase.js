   var  pendingRefreshFlagText = "{This section pending refresh}";
   var  pendingRefreshFlagHTML = "<div style='display:none'>"+pendingRefreshFlagText+"</div>";
   var  currPopupId            = "";
   var  jssor_slider1;
   var  uid = 1;
   var  parmData = {};
   var  timer = null;
   var  referer = "";

   var userName = "username not set ajaxBase";
   var currUserPersonId = "currUserPersonId not set ajaxBase";

   function getAjaxRequestObject()
   {
      var ajaxRequest;
      try
      {
         ajaxRequest = new XMLHttpRequest();
      }
      catch (e)
      {
         try
         {
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
         }
         catch (e)
         {
            try
            {
               ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e)
            {
               alert("Browser not supported for attribute updates");
               return false;
            }
         }
      }
      return( ajaxRequest );
   }

   function setBusy( busyIcon, state )
   {
      try
      {
         var busyElement = document.getElementById( busyIcon );
         if ( busyElement != null )
         {
            busyElement.style.display = state;
         }
      }
      catch( e )
      {
         // ignore busy icon problems for now
      }

   }

   function addLoadEvent(func)
   {
     var oldonload = window.onload;
     if (typeof window.onload != 'function') {
       window.onload = func;
     } else {
       window.onload = function() {
         if (oldonload) {
           oldonload();
         }
         func();
       }
     }
   }

   function createId()
   {
       var text = "";
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

       for( var i=0; i < 8; i++ )
           text += possible.charAt(Math.floor(Math.random() * possible.length));

       return text;
   }

   function getTagParm( parmName, tagUid )
   {
      var tr = getTagParmTableRow( parmName, tagUid );
      if ( tr == null )
      {
         console.error( "getTagParm() parameter not found: '" + parmName + "'; tagUid='" + tagUid +"'" );
         return( "" );
      }
      value = tr.cells[2].innerHTML;
      if (value == '' ) // chk override cell first
      {
         value = tr.cells[1].innerHTML; // no override, return original value
      }
//    try
//    {
//       console.log( "getTagParm() " + parmName + " " + tagUid + " " + value);
//       console.log( "0--> " + parmData[ tagUid ][parmName ] [ 0 ] );
//       console.log( "1--> " + parmData[ tagUid ][parmName ] [ 1 ] );
//    }
//    catch( e )
//    {
//       console.warn( tagUid + " " + parmName + " " + e );
//    }
      return( value );
   }

   function setPersistentTagParm( parmName, value, tagUid, primaryVal )
   {
      document.cookie = parmName+"="+value+"; expires=Wed, 31 Dec 2027 12:00:00 UTC; path=/";
      setTagParm( parmName, value, tagUid, primaryVal );
   }

   function getPersistentParameter( c_name, defaultValue )
   {
      if (document.cookie.length > 0)
      {
         c_start = document.cookie.indexOf(c_name + "=");
         if (c_start != -1)
         {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1)
            {
               c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
         }
      }
      return defaultValue;
   }

   function setTagParm( parmName, value, tagUid, primaryVal )
   {
//    console.log( "setTagParm( " + parmName + ", " + value + ", " + tagUid + " " + primaryVal + " )" );
//    // 10/1/21 -- moving to json structure from html table
//    try
//    {
//       parmData[ tagUid ][ parmName ][ primaryVal ? 0 : 1 ] = value;
//    }
//    catch( e )
//    {
//       // parm doesn't currently exist... adding parm array then the value
//       try
//       {
//          parmData[ tagUid ][ parmName ] = [];
//          parmData[ tagUid ][ parmName ][ primaryVal ? 0 : 1 ] = value;
//       }
//       catch( e2 )
//       {
//          console.error( e2 );
//       }
//       console.error( tagUid + " " + parmName + " " + e );
//    }

      var tr = getTagParmTableRow( parmName, tagUid );
      if ( tr != null )
      {
//       console.log( "RowId: " + tr.id );
         if ( primaryVal == true )
         {
            tr.cells[1].innerHTML = value;  // put value in primary cell (to avoid being lost when overrides are cleared on refresh)
//          console.log( "RowId: " + tr.id + " primary " + value );
         }
         else
         {
            tr.cells[2].innerHTML = value;  // put value in override cell
//          console.log( "RowId: " + tr.id + " override " + value );
         }
      }
      else
      {
         console.error( "setTagParm: tr is null -- ("+parmName+") (" +tagUid+")" );
      }
   }

   function setTagParmIfBlank( parmName, value, tagUid, primaryVal )
   {
      if ( getTagParm( parmName, tagUid ) == "" )
      {
         setTagParm( parmName, value, tagUid, primaryVal );
      }
   }

   function getFormData( tagUid )
   {
      var formData = new FormData;
      var table = document.getElementById("parms"+tagUid);
      for (var i = 0, row; row = table.rows[i]; i++)
      {
         var value = row.cells[1].innerHTML;
         var overrideValueForThisCall = row.cells[2].innerHTML;
         if ( overrideValueForThisCall != "" )
         {
            value = overrideValueForThisCall;
         }
         formData.append( row.cells[0].innerHTML, value );
      }
      return( formData );
   }

   function getParmsAsString( tagUid )
   {
//    console.log( "getParmsAsString( " + tagUid + ")");
      var parms = "";
      var table = document.getElementById("parms"+tagUid);
      if ( table != null )
      {
         for (var i = 0, row; row = table.rows[i]; i++)
         {
            if ( i != 0 ) parms+="&";
            var value = row.cells[1].innerHTML;
            var overrideValueForThisCall = row.cells[2].innerHTML;
            if ( overrideValueForThisCall != "" )
            {
               value = overrideValueForThisCall;
            }
//          console.log( i + " " + row.cells[0].innerHTML +"=" + encodeURIComponent(value));
            parms += row.cells[0].innerHTML +"=" + encodeURIComponent(value);
         }
      }
      else
      {
//       console.log( "getParmsAsString() - parm table not found: " + "parms" + tagUid ) ;
      }
      return( parms );
   }

   function getParmsAsJson( tagUid )
   {
      return( getParmsAsJson( tagUid, false ));
   }

   function getParmsAsJson( tagUid, omitBlanks )
   {
      var reqJson = {};
      var table = document.getElementById("parms"+tagUid);
      if ( table != null )
      {
         for (var i = 0, row; row = table.rows[i]; i++)
         {
            var value = row.cells[1].innerHTML;
            var overrideValueForThisCall = row.cells[2].innerHTML;
            if ( overrideValueForThisCall != "" )
            {
               value = overrideValueForThisCall;
            }
          // 2024-06-17 serious problem with requestHeader too large... this is a hack for now... but see if we can shrink it enough to pass
            if (( value != "" ) || ( !omitBlanks ))
            {
               if ( ( row.cells[0].innerHTML.indexOf( "incl" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "miscHeader" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "miscHeader" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "viewDisplay" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "styleVersion2" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "parametersToSend" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "debugUid" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "proxy" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "stypeVersion" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "showAuthorization" ) == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "config") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "beta") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "iViews") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "analytics") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "cols") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "sectionStyle") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "database") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "help") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "useDefaultData") == -1 )
                  &&( row.cells[0].innerHTML.indexOf( "deepSearch") == -1 ))
               {
                  reqJson[ row.cells[0].innerHTML ] = value;
               }
            }
         }
      }
      else
      {
         console.error( "getParmsAsString() - parm table not found: " + "parms" + tagUid ) ;
      }
      return( reqJson );
   }

   function showParms( tagUid )
   {
//    console.log( "Parameters: " + tagUid );
      var table = document.getElementById("parms"+tagUid);
      if ( table != null )
      {
         for (var i = 0, row; row = table.rows[i]; i++)
         {
            var logString = i + "- " +  row.id + " -- " + row.cells[0].innerHTML + " = " +  row.cells[1].innerHTML;
            var overrideValueForThisCall = row.cells[2].innerHTML.trim();
            if ( overrideValueForThisCall != "" )
            {
               logString += " - Override: " + overrideValueForThisCall;
            }
   //       console.log( logString );
         }
      }
   }


   // parms table has 3 columns - name, value, overrideValue
   //  never want to overwrite parm value given by tag parms
   //  write temp override to 3rd col; ParmsAsString and FormData fns will use override if exist

   function clearOverrideParms( tagUid )
   {
//    console.log( "clearOverrideParms( " + tagUid + " )");
      var table = document.getElementById("parms"+tagUid);
      if (( table != null ) &&  (table.rows != null ))
      {
         for (var i = 0, row; row = table.rows[i]; i++)
         {
            row.cells[2].innerHTML  = "";
         }
      }
      else
      {
         console.error( "clearOverrideParms() -- table 'parms"+tagUid+"' not found." );
      }
   }

   function getTagParmTableRow( parmName, tagUid )
   {
//    console.log( "getTagParmTableRow() " + parmName + " " + tagUid );
      var tableElement = document.getElementById( "parms"+tagUid );

      if (tableElement != null )
      {
         var id      = "tagParm_" + parmName + tagUid;
         var tagParmTableRow = document.getElementById( id );
         if ( tagParmTableRow == null )
         {
            var tagParmTableRow = tableElement.insertRow(-1);
            tagParmTableRow.id  = "tagParm_"+parmName + tagUid;

            var td1       = tagParmTableRow.insertCell(0);
            td1.innerHTML = parmName;

            var td2       = tagParmTableRow.insertCell(1);
            td2.innerHTML = "";

            var td3       = tagParmTableRow.insertCell(2);
            td3.innerHTML = "";
         }
         return( tagParmTableRow );
      }
      else
      {
//       console.log( "getTagParmTableRow() -- tableElement not found: parms" + tagUid + " for parm: " + parmName);
      }
      return( null );
   }

   function defaultTrue()
   {
//    console.log( "defaultTrue()" );
      return( true );
   }


   function validSearch( searchId )
   {
      var searchElement = document.getElementById( searchId );

      if ( searchElement == null )
      {
         alert( "Invalid searchId " + searchId );
         return( false );
      }

      var searchParm = searchElement.value;
      if ( searchParm = "*" ) return( true ); // special case meaning 'show all entries'
      if ( searchParm.length > 2 ) return( true );
      alert( "Search string must contain at least 3 characters -- '"+searchParm+"'." );
      return(false);
   }

   function simpleExpand( id )
   {
      element = document.getElementById( id );
      element.style.display = "block";
   }

   function copyText( id, type )
   {
      var textElement = document.getElementById(id);
      textElement.style.display="block";
      textElement.select();
      document.execCommand("Copy");
      textElement.style.display="none";
      alert(type + " value copied." );
   }

   function isEnterKey( evnt )
   {
      var key;
      if (window.event)
      {
         key = window.event.keyCode;
      }
      else
      {
         key = evnt.which;
      }
      if ( key == 13 ) return(true);
      return(false);
   }

   function getTagUidFromName( aName )
   {
      // note that the tagUid is attached to the parm <table> tag for each 'section'

      if ( aName == '' ) return("--");

      parmTableElements = document.getElementsByName( aName+"_Parms" );
      var tagUid = "???"

      if ( parmTableElements.length >0 )
      {
         tagUid = parmTableElements[0].getAttribute( "tagUid" );
      }
      else
      {
         console.error( "getTagUidFromName -- name="+aName + "_Parms; tagUid="+tagUid );
      }
      return( tagUid );
   }

   function getValueByName( aName )
   {
      var anElement = getElementByName( aName );
      if ( anElement == '' ) return( '' );
      if ( typeof anElement == "undefined" ) return( "" );
      return( anElement.value );
   }

   function getElementsByName( aName )       // multiple... return all
   {
      return( document.getElementsByName( aName) );
   }

   function getElementByName( aName )        // error if multiple
   {
      var elements = document.getElementsByName( aName);
      if ( elements == null )
      {
         console.error( "getElementByName( " + aName + ") - element not found" );
         return("");
      }
      if ( elements.length == 0 )
      {
         console.error( "getElementByName( " + aName + ") - element name " + aName + " not found" );
         return( "" );
      }
      if ( elements.length > 1 )
      {
         console.error( "getElementByName( " + aName + ") - element name " + aName + " has multiple instances (" + elements.length + ")" );
      }

      return( elements[0] );
   }

   function setValueByName( aName, value )
   {
      var elements = document.getElementsByName( aName);
      if ( elements == null )
      {
         console.error( "setValueByName( " + aName + ") - element not found" );
      }
      else
      {
         if ( elements.length == 0 )
         {
            console.error( "setValueByName( " + aName + ") - element name " + aName + " not found" );
         }
         else
         {
            elements[0].value = value;
         }
      }
   }

   function setValueById( anId, value )
   {
//    console.log( "setValueById( " + anId + " = " + value );
      var element = document.getElementById( anId );
      if ( element == null )
      {
         console.error( "setValueById( " + anId + ") - element not found" );
      }
      else
      {
         element.value = value;
      }
   }

   function getValueById( anId  )
   {
      var element = document.getElementById( anId );
      if ( element == null )
      {
         console.error( "getValueById( " + anId + ") - element not found" );
      }
      else
      {
         return( element.value );
      }
   }

   function setFormDataAsTagParms( form, tagUid ) // put all of the form parms into the tagParms table, merge with existing tag parms; model will sort them out
   {
      var elements = form.elements;
      var parms = "";
      for (i=0; i<elements.length; i++)
      {
//       console.log( "SetFormDataAsTagParms: " + elements[i].name + " = " + elements[i].value + " (tagUid: " + tagUid + " )");
         if ( elements[i].type != "checkbox" )
         {
            setTagParm( elements[i].name, elements[i].value, tagUid );
         }
         else // checkbox
         {
            setTagParm( elements[i].name, elements[i].checked, tagUid );
         }
      }
   }

   function processForm( formName, tagUid,  userContactId )
   {
      var aForm = document.forms[formName];
//    console.log( formName + " " + aForm.name );

      // each form name MUST be unique and have its own <formName>Validate(..) js method
      eval( aForm.name+"Validate( aForm )" );
      if ( errCount > 0 ) return(false);

      setFormDataAsTagParms( aForm, tagUid );
      setTagParm( "processForm", "true", tagUid );
      setTagParm( "userContactId", userContactId, tagUid );
      document.getElementById('section_altRefresh'+tagUid).click(); // note using altRefresh to prevent clearOverrideParms
      return( true );
   }

   function expandCollapseMenu()
   {
      twistyElement    = document.getElementById( "menuTwisty" );
      menuBlockElement = document.getElementById( "menuBlock6" );

      if( twistyElement.src.indexOf( "plus") > 0 )
      {
         menuBlockElement.style.display = "block";
         twistyElement.src = getSysImages()+"/minus.gif";
      }
      else
      {
         menuBlockElement.style.display = "none";
         twistyElement.src = getSysImages()+"/plus.gif";
      }
   }

   function makeVisible( anId )
   {
     var anElement = document.getElementById( anId );
     anElement.style.visibility  = "visible";
   }

   function displayOn( anId, type )
   {
     var anElement = document.getElementById( anId );
     anElement.style.display  = type;
   }

   function freeze( element )
   {
      var x = window.matchMedia("(max-width: 700px), only screen and (-webkit-min-device-pixel-ratio: 2) and (max-width: 1024px), only screen and (min--moz-device-pixel-ratio: 2) and (max-width: 1024px), only screen and (-o-min-device-pixel-ratio: 2/1) and (max-width: 1024px), only screen and (min-device-pixel-ratio: 2) and (max-width: 1024px), only screen and (min-resolution: 192dpi) and (max-width: 1024px), only screen and (min-resolution: 2dppx) and (max-width: 1024px) ");
      if ( !x.matches )
      {
//       console.log( 'wide.. do freeze');
         addClass( element, "freeze" );
         addClass( element.parentNode, "freeze" );
         addClass( element.parentNode.parentNode, "freeze" );
         var topElement = element.parentNode.parentNode.parentNode.parentNode;

         addClassToChildren( topElement, "freeze",  );
      }
      else
      {
//       console.log( 'narrow... dont freeze');
      }
   }

   function addClass( element, theClass )
   {
      if ( element.className.indexOf( "freeze" ) == -1 )
      {
         element.className += " freeze";
      }
   }

   function addClassToChildren( element, theClass )
   {
      var children = element.children;
      for (var i = 0; i < children.length; i++)
      {
        var child = children[i];
        if ( child.className.indexOf( "Level3" ) == -1 )   // don't freeze level3 menu items other than the one input item that called this
        {
           if ( child.className.indexOf( theClass ) == -1 )
           {
              child.className += " " + theClass;
           }
           addClassToChildren( child, theClass );
        }
      }
   }

   function unfreeze( anElement, id )
   {
      var topElement = document.getElementById( id );
      removeClassFromChildren( topElement, "freeze", "" );
   }

   function removeClassFromChildren( anElement, theClass, prefix )
   {
      var children = anElement.children;
      for (var i = 0; i < children.length; i++)
      {
        var child = children[i];
        if ( child.className.indexOf( theClass ) != -1 )
        {
           theClasses = child.className.split(" ");
           newClasses = "";
           for ( var j = 0; j < theClasses.length; j++ )
           {
              if ( theClasses[j].indexOf( theClass ) == -1 )
              {
                 newClasses = newClasses.trim() + " " + theClasses[j].trim();
              }
           }
           child.className = newClasses;
        }
        removeClassFromChildren( child, theClass, prefix + "|  "  );
      }
   }

   function getHelp( tagUid, helpId )
   {
      var popupElement = document.getElementById( "helpPopup" );

      if ( popupElement != null )
      {
         var url = "/cis/jsp/ajax/ajaxGetHelpPopup.jsp?id="+helpId;
         callServer( "", url, "helpPopup", "" );      // this will populate the popup with the popup page content

         document.getElementById( "lightBoxScreen" ).style.display = "block" ;
         popupElement.style.display = "block";
         popupElement.style.position = "fixed";
         popupElement.style.top = "20%";
         popupElement.style.left = "10%";
         popupElement.style.minWidth = "40%";
         popupElement.style.height = "75%";
         popupElement.style.zIndex = "3";

         currPopupId = "helpPopup";   // this stores the id of the popup that is currently displayed so we can pull it down later
      }
      else
      {
         console.error( "Error** element helpPopup not found." );
      }
   }

   function clearPopup()
   {
//    console.log( "clearPopup" );
      var currPopupElement = document.getElementById( currPopupId ); // global var
      if ( currPopupElement != null )
      {
         currPopupElement.style.display = "none";
         currPopupElement.innerHtml=""; // clear the content so it doesn't flash on screen when loading next help text
         document.getElementById( "lightBoxScreen" ).style.display = "none" ;
         currPopupId = "";
      }
   }

   function generateReqUid()
   {
      var text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
   }

   function removeRow( ajaxRequest, tr )
   {
      tr.remove();
   }

   function handleAjaxRC( anAjaxRequest )
   {
      var resp = anAjaxRequest.responseText.replace(/^\s+|\s+$/g,"");

      if ( resp.indexOf( "AjaxRC:Ok" ) != -1 ) return( true);

      if ( resp.indexOf( "AjaxMsg" ) != -1 )
      {
         var parts = resp.split("|")
         alert( " ["+parts[1]+"]");
      }
      else
      {
         alert( resp );
      }
      return( false );
   }

   function getSysImages()
   {
      return( getValueByName( "sysImages" ) );
   }

   function popupContent( anElement )
   {
      var aWindow = window.open("", "Content", "width=600,height=400,titlebar=no,status=no,menubar=no,toolbar=no"); // no whitespace in options (??)

      var theBody = aWindow.document.getElementById('theBody');
      if ( theBody != null ) theBody.innerHTML = '';
      else aWindow.document.write( "<body id='theBody'>");

      content = anElement.content; // made up attribute name specifically to pass content such as Stripe json
      if ( ( typeof content == "undefined" )
         ||( content == '' ))
      {
         content = anElement.innerHTML;  // original way of passing content
      }

      if ( content.indexOf( '{"' ) != -1 ) // this is JSON
      {
         try
         {
            aWindow.document.write( "<style>"
                                       +"pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }"
                                       +".string { color: green; }"
                                       +".number { color: darkorange; }"
                                       +".boolean { color: blue; }"
                                       +".null { color: magenta; }"
                                       +".key { color: red; }"
                                    +"</style>"
                                    +"<pre>"
                                    +syntaxHighlight(
                                                      JSON.stringify(
                                                                      JSON.parse(
                                                                                  content.substring(
                                                                                                     content.indexOf( '{"' )
                                                                                                   )
                                                                                ), null, 3
                                                                    )
                                                    )
                                   + "</pre>"
                                  );
         }
         catch( jsonParseError )
         {
            // so it might not be valid json after all...
            aWindow.document.write("<pre>"+content+"</pre>" );
         }
      }
      else
      {
         aWindow.document.write("<pre>"+content+"</pre>" );
      }
      aWindow.focus();
   }

   function syntaxHighlight(json) {
       json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
       return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
           var cls = 'number';
           if (/^"/.test(match)) {
               if (/:$/.test(match)) {
                   cls = 'key';
               } else {
                   cls = 'string';
               }
           } else if (/true|false/.test(match)) {
               cls = 'boolean';
           } else if (/null/.test(match)) {
               cls = 'null';
           }
           return '<span class="' + cls + '">' + match + '</span>';
       });
   }

   // XHR Callback function:
   function goToURL(respJson, url)
   {
      window.location.href = url;
   }

   function toggleSection( value, sectionId )
   {
      if ( value )
      {
         document.getElementById( sectionId ).style.display = 'block';
      }
      else
      {
         document.getElementById( sectionId ).style.display = 'none';
      }
   }

   function ascii(a)// hex
   {
      return( Math.abs(a.charCodeAt(0)).toString(16) );
   }

   function string2Ascii( str )
   {
      var ret = "";
      for (i = 0; i < str.length; i++)
      {
        ret += ascii(str[i]);
      }
      return( ret );
   }
 function getQueryVariable(variable)
 {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++)
    {
       var pair = vars[i].split('=');
       if (decodeURIComponent(pair[0]) == variable)
       {
          return decodeURIComponent(pair[1]);
       }
    }
    console.log('Query variable %s not found', variable);
 }
