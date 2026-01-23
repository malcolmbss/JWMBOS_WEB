   function forceValue( inputId, aValue )
   {
      var theElement = document.getElementById(inputId);
      if ( theElement == null )
      {
         console.error( "Element with id = '" + inputId + "' does not exist." );
      }
      else
      {
         if (theElement.type == "radio")
         {
            theElement.checked = true;    // element is the hidden dummy rb with a value of -1... select it to deselect all visible radiobuttons
         }
         else
         {
            theElement.value = aValue;
         }
      }
   }

   function update( inputId, roData, rwData, editIcon, containerId, table, col, objType, objId, objSubId1, objSubId2, ownerType, ownerId, copyTo, copyText, refreshSectionId, tagUid, updateCallbackFn, dataValue, context, role, verifyMessage, popupTagUid, proxyFor, includeValuesForNames, editMode, callbackParameters, dataReq, recordType )
   {
      var reqJson  = {};

      if (document.getElementById(inputId) == null )
      {
         console.error( "Element with id = '" + inputId + "' does not exist." );
      }
      else
      {
//       console.log("update() - tagName: " + document.getElementById(inputId).tagName + "value: " + dataValue + " " + inputId );
      }

      if ((typeof verifyMessage != 'undefined' )
         && ( verifyMessage != "" ))
      {
         if ( !confirm( verifyMessage ) ) return(false);
      }

      if (typeof context == 'undefined' ) context = "cis";
      if (context == '' ) context = "cis";

      if (typeof role == 'undefined' ) role = "ajax";
      if (role == '' ) role = "ajax";

      if (typeof includeValuesForNames == 'undefined' ) includeValuesForNames = "";

      if ( includeValuesForNames != "" )
      {
         var names = includeValuesForNames.split( ";" );
         for ( var i = 0; i < names.length; i++ )
         {
            var nameParts = names[i].split("_");     // extract the tagUid off of the front of the name
            var theName = nameParts[(nameParts.length)-1] // get the last 'part'

            var elements = document.getElementsByName( names[i] );

//            console.log( theName + " = " + elements.length );

            if ( elements != null )
            {
               if (elements[0].type == "radio")
               {
                  for (var j = 0; j < elements.length; j++)
                  {
                     if ( elements[j].checked )
                     {
                        reqJson[ theName ] =  elements[j].value;
                     }
                  }
               }
               else
               {
                  reqJson[ theName ] =  elements[0].value;
               }
            }
         }
      }


      if ( popupTagUid == "clear" )
      {
         // take down any current popups
         var currPopupElement = document.getElementById( currPopupId ); // global var
         if ( currPopupElement != null )
         {
            currPopupElement.style.display = "none";
            document.getElementById( "lightBoxScreen" ).style.display = "none" ;
            currPopupId = "";
         }
      }

      var popupElement = document.getElementById( popupTagUid+"Popup" );

      if ( popupElement != null )
      {
         document.getElementById( "lightBoxScreen" ).style.display = "block" ;
         popupElement.style.display = "block";
         popupElement.style.position = "absolute";
         popupElement.style.left = "10%";
         popupElement.style.minWidth = "40%";
         popupElement.style.zIndex = "2";

         document.getElementById( popupTagUid+"popupCallerId" ).value = inputId ; // need to pass id of calling element to popup (proxy for)

         currPopupId = popupTagUid+"Popup";   // this stores the id of the popup that is currently displayed so we can pull it down later
         return( false );  // don't process input change while popup is active since it is likely collecting add'l infoe
      }

      if ( proxyFor != "" )
      {
         var proxyForElement = document.getElementById( proxyFor );
         if ( proxyForElement != null )
         {
            inputId = proxyForElement.value;  // from this point on, we are acting as the element that called the popup
         }
      }



      if (document.getElementById(inputId).type == "radio") // is it a radio button?
      {
//       console.log( "radio button..." );
         var dataValue = document.getElementById(inputId).value;
         var dataValueId = document.getElementById(inputId).valueId; // made-up attribute for input field...
         var textValue = document.getElementById(inputId).value;
      }

      else if (document.getElementById(inputId).tagName.toUpperCase() != "SELECT") // is it a select tag?
      {
         // not SELECT... basic input tag
         var dataValue = document.getElementById(inputId).value;
         var dataValueId = document.getElementById(inputId).valueId; // made-up attribute for input field...
         var textValue = document.getElementById(inputId).value;

         if ( document.getElementById(roData) != null )
         {
            document.getElementById(roData).innerHTML = textValue;
         }
         document.getElementById(inputId).value     = textValue;

         // if date/time handle utc conversion
         // but make sure utc-converted value does not appear to user (do this after setting html values above)
         if ( inputId.indexOf( "_DateTime" ) > -1)
         {
            dataValue  = localToUtc( dataValue );
            textValue = dataValue;
         }

      }
      else // is a select tag
      {
         var selectElement = document.getElementById(inputId);
         var dataValue = selectElement.options[ selectElement.selectedIndex ].value
         var dataValueId = selectElement.options[ selectElement.selectedIndex ].valueId // made-up attribute for input field...
         var textValue = selectElement.options[ selectElement.selectedIndex ].text

         // note that 'option' tags do not have a 'css' attribute architected in.  But I'm using it to pass a css class for each option
         var css       = selectElement.options[ selectElement.selectedIndex ].getAttribute( "css" );
//       console.log( "CSS " + css );
         document.getElementById(roData).innerHTML = textValue;
         document.getElementById(roData).className = css;

         // ditto for 'roIcon' attribute... not a 'valid' attribute.  But it works.  If roIcon attr is found, use it for the RO display instead of textValue
         var roIcon    = selectElement.options[ selectElement.selectedIndex ].getAttribute( "roIcon" );
         if ( roIcon != null )
         {
            document.getElementById(roData).innerHTML = "<img src=/images/system/"+roIcon+" style='width:20px;'>";
         }
      }
      if (table == "-" )
      {
         // no db update... but might still want to copy value to another field
         if ( document.getElementById(copyTo) != null )
         {
//          console.log( "CopyTo: " + copyTo + " = " +  dataValue );
            document.getElementById(copyTo).value = dataValue;
         }
         return; // no need to send a req to the back end when no table defined...
      }
      sendUpdateAPI( getTagParm( "apiVersion", tagUid ),
                     callbackParameters,
                     col,
                     containerId,
                     dataValue,
                     dataValueId,
                     objId,
                     objSubId1,
                     objSubId2,
                     objType,
                     ownerId,
                     ownerType,
                     refreshSectionId,
                     table,
                     tagUid,
                     updateCallbackFn,
                     dataReq,
                     recordType
                     );
  }

  function sendUpdateAPI( apiVersion,
                          callbackParameters,
                          col,
                          containerId,
                          dataValue,
                          dataValueId,
                          objId,
                          objSubId1,
                          objSubId2,
                          objType,
                          ownerId,
                          ownerType,
                          refreshSectionIds,
                          table,
                          tagUid,
                          updateCallbackFn,
                          dataReq,
                          recordType
                         )
  {
     if ( apiVersion  == 2 ) // api version 2 (10/29/21)
     {
        var xhrData = {};
        xhrData[ "containerId"        ] =  containerId;
        xhrData[ "refreshSectionIds"  ] =  refreshSectionIds;
        xhrData[ "callbackFn"         ] =  updateCallbackFn;
        xhrData[ "callbackParameters" ] =  callbackParameters;

        var reqJson = {};
        reqJson[ "objSubId1"          ] =  Number(objSubId1);
        reqJson[ "objSubId2"          ] =  Number(objSubId2);
        reqJson[ "ownerType"          ] =  Number(ownerType);
        reqJson[ "ownerId"            ] =  Number(ownerId);
        reqJson[ "valueId"            ] =  dataValueId;

        var restData = {};
        restData[ "method"             ] =  "POST";
        restData[ "dataObj"            ] =  table;
        restData[ "command"            ] =  "Update"
        restData[ "value1"             ] =  col;
        restData[ "identifier"         ] =  table+"/"+col+"="+dataValue;
        restData[ "locatorId"          ] =  Number(objId);
        restData[ "locatorType"        ] =  Number(objType);
        restData[ "locatorRelationship"] =  "id"
        restData[ "locatorRecordType"  ] =  ( recordType === undefined ? 0 : recordType );
        restData[ "value2"             ] =  dataValue;
        restData[ "tagUid"             ] =  tagUid;
        restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid,"+col+","+dataReq
        restData[ "reqJson"            ] =  reqJson;
        restData[ "xhrData"            ] =  xhrData;

        xhrREST( restData );
     }
     else // apiVersion = 1
     {
        var url = "/cis/JWMBOS";

        var reqJson = {};
        reqJson[ "table"      ] =  table;
        reqJson[ "col"        ] =  col;
        reqJson[ "identifier" ] =  table+" / "+col;
        reqJson[ "objType"    ] =  Number(objType);
        reqJson[ "objId"      ] =  Number(objId);
        reqJson[ "objSubId1"  ] =  Number(objSubId1);
        reqJson[ "objSubId2"  ] =  Number(objSubId2);
        reqJson[ "ownerType"  ] =  Number(ownerType);
        reqJson[ "ownerId"    ] =  Number(ownerId);
        reqJson[ "value"      ] =  dataValue;
        reqJson[ "valueId"    ] =  dataValueId;

        xhrUpdate( "POST",
                   url,
                   reqJson,
                   tagUid,
                   containerId,
                   refreshSectionIds,
                   updateCallbackFn,
                   callbackParameters
                 );
     }
  }

   function processCopyTo(respJson)
   {
      if ( document.getElementById(copyTo) != null )
      {
         if ( copyTo != "--" )
         {
            if ( copyText == "=" ) // meaning copy the current data
            {
               document.getElementById(copyTo).innerHTML = textValue;
            }
            else
            {
               document.getElementById(copyTo).innerHTML = copyText;
            }
         }
      }
  }

  function processReturnToRO(respJson)
  {
      if (( document.getElementById(inputId).tagName != "TEXTAREA" ) // HTML Editor messes up for some reason if display is toggled here
      && ( editMode == "true" )                                      // if editmode == "always" do not toggle back to read-only (if 'false' we never get here)
      && ( document.getElementById(inputId).type    != "radio" )     // never toggle back to RO for radiobuttons
      && ( document.getElementById(inputId).tagName != "IMG" ))    // ... or for image buttons
      {
         document.getElementById(roData).style.display = "inline-block";
         document.getElementById(rwData).style.display = "none";
      }
   }

   function processUpdateCallBack(respJson)
   {
      if (updateCallbackFn != "" )
      {
         try
         {
            window[ updateCallbackFn ](respJson);
         }
         catch(err)
         {
//          console.error( "callback: " + err );
         }
      }
   }


   function ajaxToggleEdit( inputId, roData, rwData, editIcon, busyIcon, table, col, objType, objId, ownerType, ownerId, copyTo, copyText )
   {
      roDataElement = document.getElementById( roData );
      rwDataElement = document.getElementById( rwData );

      if (roDataElement.style.display == "none")
      {
         roDataElement.style.display = "inline-block";
         rwDataElement.style.display = "none";
      }
      else
      {
         roDataElement.style.display = "none";
         rwDataElement.style.display = "inline-block";
         var rwLoadButton = document.getElementById( 'section_load'+inputId );
         if ( rwLoadButton != null ) // a load button exists...
         {
            rwLoadButton.click();
         }
      }
   }

   function validateCheckBox( tagUid, required )
   {
      if ( required == true )
      {
         if ( document.getElementById(tagUid).checked == false )
         {
            showError( tagUid, "Error: This box must be checked" );
            errCount += 1;
            return( false );
         }
      }
      return( true );
   }

   function checkBoxUpdate( inputId, roData, rwData, editIcon, containerId, table, col, objType, objId, ownerType, ownerId, copyTo, copyText, context, role, refreshSectionId, updateCallbackFn, callbackParameters, tagUid, dataReq )
   {
      if ( typeof tagUid == 'undefined' ) tagUid = inputId;
      if (table == "-" ) return(false);
      var dataValue = document.getElementById(inputId).checked;
      sendUpdateAPI( getTagParm( "apiVersion", tagUid ),
                     callbackParameters,
                     col,
                     containerId,
                     dataValue,
                     -1,
                     objId,
                     -1,
                     -1,
                     objType,
                     ownerId,
                     ownerType,
                     refreshSectionId,
                     table,
                     tagUid,
                     updateCallbackFn,
                     dataReq
                     );
   }

   function validateSelectInput( tagUid, required, minimumCharacters )
   {
      var dataValue = document.getElementById(tagUid).value;
//    console.log( "validate: [" + dataValue + "]" );
      if (( dataValue == -1 )  // this assumes a 'blank' selection option always has a value of -1
        || ( dataValue == "--" ))  // or "--"
      {
         if ( required == 'true' )
         {
            showError( tagUid, "Error: You must make a selection" );
            document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
            errCount += 1;
            return( false );
         }
      }
      return( true );
   }

   function validate( tagUid, required, minimumCharacters )
   {
      var dataValue = document.getElementById(tagUid).value;
//    console.log( "validate: [" + dataValue + "]" );
      if ( dataValue == "" )
      {
         if ( required == 'true' )
         {
            showError( tagUid, "Error: This field cannot be blank" );
            document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
            errCount += 1;
            return( false );
         }
         return( true );
      }
      if ( !isNaN( minimumCharacters ) )
      {
         if ( dataValue.length < minimumCharacters )
         {
            showError( tagUid, "Error: " + minimumCharacters + " or more characters are required." );
            document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
            errCount += 1;
            return( false );
         }
      }
      return( true );
   }

   function showError( tagUid, msg )
   {
//    console.error( "showError( " + tagUid + ", " + msg + ")" );
      try{
         document.getElementById( "dataLayers"+tagUid ).style.borderWidth = "4px";
         document.getElementById( "dataLayers"+tagUid ).style.borderStyle = "solid";
         document.getElementById( "dataLayers"+tagUid ).style.borderColor = "red";
      } catch( e ) {
      }
      msgElement       = document.getElementById( "inputMsg"+tagUid ).style.display = "inline-block";
      msgElement       = document.getElementById( "inputMsg"+tagUid ).innerHTML = msg;
   }

   function clearError( tagUid )
   {
      var theElement = document.getElementById( "dataLayers"+tagUid )
      if ( theElement != null )
      {
         theElement.style.borderWidth = "0px";
//       console.debug( "clear inputMsg" + tagUid );
         msgElement       = document.getElementById( "inputMsg"+tagUid ).style.display = "none";
      }
   }


   function validateURLInput( tagUid )
   {
//    console.log( tagUid );
      var dataValue = document.getElementById(tagUid).value;
//    console.log( "validateURLInput " + dataValue );
      if ( !is_URL( dataValue ) )
      {
         showError( tagUid, "Error: Invalid URL" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         return( false );
      }
      return( true );
   }

   function is_URL(url)
   {
      var urlWithProtocol = new RegExp('([A-Za-z]{3,9}:(?:\/\/)?) (?:[\-;:&=\+\$,\w]+@)? [A-Za-z0-9\.\-]+ | (?:www\.|[\-;:&=\+\$,\w]+@) [A-Za-z0-9\.\-]+');
      var urlNoProtocol   = new RegExp('(?:\/[\+~%\/\.\w\-]*) ?\??(?:[\-\+=&;%@\.\w]*) #?(?:[\.\!\/\\\w]*)');
      return( urlWithProtocol.test(url) | urlNoProtocol.test(url) )
   }

  function validateIntInput( tagUid, required )
  {
      if( !validate( tagUid, required ) ) return(false);
      var intval = document.getElementById( tagUid ).value.replace(/\s/g, "");
      document.getElementById( tagUid ).value = intval;

      var dataValue = document.getElementById(tagUid).value;
//    console.log( "validateIntInput " + dataValue );
      if ( isNaN( dataValue ) )
      {
         showError( tagUid, "Error: Invalid Numeric Value" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         return( false );
      }
      return( true );
   }

  function validateTaxIdInput( tagUid, required )
  {
      var dataValue = document.getElementById( tagUid ).value.replace(/[- .]/g, "");
      document.getElementById( tagUid ).value = dataValue;
      document.getElementById(tagUid+"RO").innerHTML = dataValue; //update the RO layer as well
      if ( isNaN( dataValue ) )
      {
         showError( tagUid, "Error: Non-numeric characters are not allowed" );
         errCount += 1;
         return( false );
      }
      if ( dataValue.length != 9 )
      {
         showError( tagUid, "Error: Tax ID Numbers (SSN or EIN) must be precisely 9 digits in length (no-dashes)" );
         errCount += 1;
         return( false );
      }
      return( true );
   }

   function autoSave( inputElement, uid )
   {
      var currContent = inputElement.value;
      if (typeof(Storage) !== "undefined")
      {
          localStorage.setItem(uid, currContent);
      }
//    consols.log( "autoSave( " + uid + " ) = " + currContent );
   }

   function copyValue( fromId, toId )
   {
      if ( document.getElementById( toId )  == null ) console.error( toId + " not found" );
      if ( document.getElementById( fromId ) == null ) console.error( fromId + " not found" );

      document.getElementById( toId ).value = document.getElementById( fromId ).value;
//    console.log( 'copyValue() ' + fromId + " " + toId + " " + document.getElementById( fromId ).value )
   }

   function captureEnterKey( e, inputElement, id )
   {
      var code = (e.keyCode ? e.keyCode : e.which);
//    console.log( "Code " + code );
      if(code == 13)
      {
//       console.log( "EnterKey" );
         e.preventDefault();
         return(false);
      }
      return( true );
   }

   function onEnterKey( e, inputElement, id, actionName )
   {
      if ( captureEnterKey( e, inputElement, id ) ) return( true );  // not an enter key

      var actionElement = getElementByName( actionName );
      try
      {
         actionElement.click();
      }
      catch( error )
      {
         console.error( error );
      }
      return( false );
   }

   function sliderUpdateListener( tagUid, sliderValue, specialHandling )
   {
//    console.log( "listener " + sliderValue );
      if ( specialHandling == "!1" ) // don't allow  value of 1
      {
         if ( sliderValue == 1 ) // can't have one hour for videographers
         {
            $('#'+tagUid ).slider( "option", "value", 2 );
            try
            {
               $('#'+tagUid ).slider( "refresh" );
            }
            catch( err )
            {
            }
            sliderValue = 2;
         }
      }

      var cacheElement = document.getElementById( tagUid+"Cache" );
      if ( cacheElement == null )
      {
//       console.log( "Slider cache element: " + tagUid + "Cache was not found." );
         return;
      }
//    console.log( "Slider value: " + sliderValue );
      cacheElement.value = sliderValue;
      return( sliderValue );
   }

   function refreshSwatch( tagUid, handletagUid, bgnColor, endColor )
   {
      if ( bgnColor == "Default" ) return;

      var coloredSlider = $( '#'+tagUid ).slider( 'value' );
      var maxValue      = $( '#'+tagUid ).slider( 'option', 'max' );
      var myColor = getTheColor( coloredSlider, maxValue );

//    console.log( "refreshSwatch " + coloredSlider + " " + handletagUid );

      if ( coloredSlider == -1 )
      {
         myColor = "rgb(255,255,255)";
      }

      $( "#"+tagUid + " .ui-slider-range" ).css( "background-color", myColor );
      $( "#"+handletagUid ).css( "background-color", myColor );
   }

   function forceSliderValue( tagUid, theValue )
   {

      var cacheElement = document.getElementById( tagUid+"Cache" );
      if ( cacheElement == null )
      {
//       console.log( "Slider cache element: " + tagUid + "Cache was not found." );
         return;
      }
      cacheElement.value = theValue;   // this has to precede the change to the slider value
//    console.log( "force " + tagUid + " " + theValue );

      $('#'+tagUid ).slider( "option", "value", theValue );
   }


   function getTheColor( colorVal, maxValue ) // for colored slider
   {
      var theColor = "";
      if ( colorVal < maxValue/2 )
      {
         myRed = 255;
         myGreen = parseInt( ( ( colorVal * 2 ) * 255 ) / maxValue );
      }
      else
      {
         myRed = parseInt( ( ( maxValue - colorVal ) * 2 ) * 255 / maxValue);
         myGreen = 255;
      }
      theColor = "rgb(" + myRed + "," + myGreen + ",0)";
      return( theColor );
   }

   function validateRadioButtonSelect( aName, required, tagUid )
   {
      var querySel = document.querySelector('input[name='+aName+']:checked');
      if ( required != 'true' ) return( true );

      if ( ( querySel == null )
         ||( querySel.value == -1 ) ) // this means the dummy hidden rb is selected due to 'undo' icon... same as no selection
      {
//       console.log( "--->" + tagUid );
         showError( tagUid, "Error: A value must be selected" );
         errCount += 1;
         return( false );
      }
      return( true );
   }

   function togglePasswordDisplay( tagUid )
   {
     var pwElement = document.getElementById(tagUid);
//   console.log( "toggle pw " + pwElement.type )
     if (pwElement.type === "password")
     {
       pwElement.type = "text";
     }
     else
     {
       pwElement.type = "password";
     }
   }

   function processInputInheritance( tagUid, aValue, inhValue, objId, table, col, dataReq )
   {
      checkBoxUpdate( "inherit"+tagUid,
                      tagUid+"RO",
                      tagUid+"RW",
                      tagUid+"Edit",
                      "dataLayers"+tagUid,
                      table,
                      col+"Inh",  // we are setting the Inh-suffix dataMember name
                      -1,
                      objId,
                      -1,
                      -1,
                      "",
                      "",
                      "",
                      "",
                      "",
                      "inputInheritanceCallBack",
                      "",
                      tagUid,
                      dataReq+",render,restData,value1,"+col+","+col+"InhFrom"
                      );
   }

   function inputInheritanceCallBack( respJson )
   {
      var tagUid          = respJson.render.tagUid;
      var inheritCheckBox = document.getElementById('inherit'+tagUid);
      var toggle          = document.getElementById('toggleBlock'+tagUid);
      var roElement       = document.getElementById(tagUid+'RO');
      var rwElement       = document.getElementById(tagUid+'RW');
      var inhFrom         = document.getElementById('inheritedFrom'+tagUid);

      var dataMember    = respJson.restData.value1;
      var inherited     = respJson[ dataMember ];
      var aValue        = respJson[ dataMember.substring( 0, dataMember.length-3 ) ]; // strip the 'Inh' suffix
      var inheritedFrom = respJson[ dataMember+"From" ];

      if ( tagUid.indexOf( "Currency" ) > 0 ) aValue = "$"+aValue;

      inhFrom.innerHTML = "Inherited from: " + inheritedFrom;

      if ( inherited )
      {
         toggle.className="inputToggle invisible"
         inhFrom.style.display="inline-block";
         roElement.innerHTML = aValue;
         roElement.className = "RODivClass inheritedData"
         roElement.style.display = "inline-block";
         rwElement.style.display = "none";
      }
      else
      {
         toggle.className = "inputToggle visible";
         inhFrom.style.display="none";
         roElement.innerHTML = aValue;
         roElement.className = "RODivClass"
      }
   }

   function getSelectedRadioButtonValue( name )
   {
      var rbElements = getElementsByName( name );
      if ( rbElements.length == 0 ) throw "No elements found for " + name;
      for ( var i = 0; i < rbElements.length; i++ )
      {
         if ( rbElements[i].checked == true ) return( rbElements[i].value );
      }
      return( null );
   }
