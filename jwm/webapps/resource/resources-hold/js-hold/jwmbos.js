
   function ajaxLedgerCategoryList( containerId, busyIcon, tagUid, filterId )
   {
      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/gl/jsp/ajax/ajaxGetLedgerCategoryList.jsp"
                      +"?user="+getUserName()
                      +"&viewName=selectList"
                      +"&objectClassID=95"
                      +"&filterId="+filterId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxInsertInvoiceTemplate( templateId )
   {
//    console.log( "ajaxInsertInvoiceTemplate( " + templateId + " )");
      // this is called when insertFromTemplate icon is clicked.... it sets up and clicks a second button on the target list

      // we have two independent StatementItemList tags.  One has the template and templateId.  The other one is
      // where we need to insert it.  The main list's container is best suited to add to itself.
      // But need to get the selected templateId to the code that does the add

      // target tagUid needs to be determined from hardcoded hidden "tag registration" field containing tagUid (see tagRoot.java)
      var tagUid = document.getElementById( "statementItems_tagUid" ).value;

      // use a hidden 'dropbox' input field for passing selected templateId to other control
      document.getElementById( "dropbox" + tagUid ).value = templateId;

      // now 'click' the hidden "add invoice from template" icon in main statementItemList section
      // it will call ajaxAddInvoiceFromTemplate(....)
      document.getElementById( "StatementItemList_addInvoiceFromTemplate_"+tagUid ).click();
   }

   function ajaxAddInvoiceFromTemplate( ownerType, ownerId, containerRootId, viewId, busyIcon, viewName, edit, tableId, type )
   {
      // this is called by the hidden button on the target list

      // target tagUid needs to be determined from hardcoded hidden "tag registration" field containing tagUid (see tagRoot.java)
      var tagUid = document.getElementById( "statementItems_tagUid" ).value;
      var templateId = document.getElementById( "dropbox" + tagUid ).value;

//      console.log( "ajaxAddInvoiceTemplate() templateId " + templateId );
      setTagParm( "addUrl", "/gl/jsp/ajax/ajaxGetInvoice.jsp", tagUid );
      addSectionListItem( tagUid, templateId, "" );
   }

   function invoiceDetailsExpandCollapse( tagUid, invoiceId, referenceAccountId )
   {
      var trElement  = document.getElementById( "tr_invoice_details"+tagUid+"_"+invoiceId+"_"+referenceAccountId );
      if (trElement == null ) return;

      if (trElement.style.display == "none")
      {
         trElement.style.display = "";

         // details view of invoice is not initially loaded.
         // need to locate the open icon for the details view and click it to do initial loading
         var detailsViewSection  = getElementByName( "invoice_details"+tagUid+"_"+invoiceId+"_"+referenceAccountId  );
         id = detailsViewSection.id;
         var viewIconId = "viewIcon" + id + "_1";
//       console.log( viewIconId );
         var viewIcon = document.getElementById( viewIconId );
         viewIcon.click();
      }
      else
      {
         trElement.style.display = "none";
      }
   }


   function invoiceHistoryExpandCollapse( id, iconElement )
   {
      divElement  = document.getElementById( id );
      if (divElement == null ) return;

      if (divElement.style.display == "none")
      {
         divElement.style.display = "block";
      }
      else
      {
         divElement.style.display = "none";
      }
   }

   function extractSelectedCardHolderId( tagUid )
   {
      var cardHolderId = getCurrUserId(); // default to currUserId
      if ( document.getElementById( "cardHolder"+tagUid ) != null )
      {
         var cardHolderSelect = document.getElementById( "cardHolder"+tagUid );
         cardHolderId = cardHolderSelect.options[cardHolderSelect.selectedIndex].value;
//       console.log( "cardHolderId: " + cardHolderId );
      }
      else
      {
//       console.log( "cardHolder"+tagUid + "-was not found" );
      }
      setTagParm( "cardHolderId", cardHolderId, tagUid );
   }

   function closeAuthorizeNetPopup(tagUid)
   {
      document.getElementById("divAuthorizeNetPopupScreen").style.display = "none";
      document.getElementById("divAuthorizeNetPopup").style.display = "none";
      document.getElementById("iframeAuthorizeNet").src = "../user/AuthNetEmpty.jsp";
//    console.log( "Refreshing: " + tagUid );
      document.getElementById( 'section_refresh'+tagUid ).click();
   }
   function setFormParmsForPay() // same form used to popup authnet pages and to pay... scripts below set it up for popup, if pay, need to set it to what pay needs
   {
      document.getElementById("payment_started").style.display = "inline-block";
      var form = document.forms["formAuthorizeNetPopup"];
      form.action = "/pay";
      form.target = "";
   }

   function validateInvoice(aFormId)
   {
      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count

      if ( document.getElementById( "delivery_flag" ) != null ) // should be on a <th> tag in the ledger item list
      {
         for ( var i=0; ; i++ ) // loop all ledgerItems until non-existent element
         {
            if ( doValidate( aForm, "delivery_"+i ) == 1 ) break;   // make sure all order items have specified store pickup or delivery
         }
      }

      if (errCount > 0 )
      {
         alert( "Please select delivery type for all items... " + errCount + " error(s) in the form." );
         return( false );
      }
      return( true );
   }

   function searchInvoices( tagUid )
   {
      forcePage1(tagUid);

      var dateField = getElementByName( "lastActivityDateBgn" );
      setTagParm( "beginTimestamp", dateField.value, tagUid, true );

      var dateField = getElementByName( "lastActivityDateEnd" );
      setTagParm( "endTimestamp", dateField.value, tagUid, true );

      var searchInvoiceStatusField = getElementByName( "searchInvoiceStatus" );
      var searchInvoiceStatus = searchInvoiceStatusField.value;
      if ( isNaN( searchInvoiceStatus ) ) searchInvoiceStatus = -1;
      setTagParm( "status", searchInvoiceStatus, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function replacePrimaryInvoice( invoiceId, chargeBasis, chargeBasisText, refreshSectionTagUid )
   {
      if ( confirm( "This invoice will be removed and replaced with an invoice based on the " + chargeBasisText + " charges for this trip.  Confirm?" ))
      {
         var restData = {};

         var xhrData = {};
         xhrData[ "containerId"         ] =  "";
         xhrData[ "refreshSectionIds"   ] =  refreshSectionTagUid;
         xhrData[ "callbackFn"          ] =  "";
         xhrData[ "callbackParameters"  ] =  "";

         restData[ "method"             ] =  "POST";
         restData[ "dataObj"            ] =  "trip";
         restData[ "command"            ] =  "ReplacePrimaryInvoice";
         restData[ "identifier"         ] =  "ReplacePrimaryInvoice with " + chargeBasisText + " (" + invoiceId +")";
         restData[ "locatorId"          ] =  invoiceId
         restData[ "locatorType"        ] =  "20";  // invoice
         restData[ "locatorRelationship"] =  "17"; // relationship = invoice for trip
         restData[  "locatorRecordType" ] =  chargeBasis
         restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
         restData[ "reqJson"            ] =  {}
         restData[ "xhrData"            ] =  xhrData;

         xhrREST( restData );
      }
      return(true);
   }

   function createPrimaryInvoice( tripId, chargeBasis, chargeBasisText )
   {
      if ( confirm( "A new invoice based on the " + chargeBasisText + " charges for this trip?  Confirm?" ))
      {
         var restData = {};

         var xhrData = {};
         xhrData[ "containerId"         ] =  "";
         xhrData[ "refreshSectionIds"   ] =  "";
         xhrData[ "callbackFn"          ] =  "";
         xhrData[ "callbackParameters"  ] =  "";

         restData[ "method"             ] =  "POST";
         restData[ "dataObj"            ] =  "trip";
         restData[ "command"            ] =  "createPrimaryInvoice";
         restData[ "identifier"         ] =  "createPrimaryInvoice/trip with " + chargeBasisText + " (" + tripId +")";
         restData[ "locatorId"          ] =  tripId
         restData[ "locatorType"        ] =  "61";  // trip
         restData[ "locatorRelationship"] =  "0"; // relationship = id
         restData[  "locatorRecordType" ] =  chargeBasis
         restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
         restData[ "reqJson"            ] =  {}
         restData[ "xhrData"            ] =  xhrData;

         xhrREST( restData );
      }
      return(true);
   }

   function searchAccountInvoices()
   {
      var restData = {};

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "GET";
      restData[ "dataObj"            ] =  "invoicelist";
      restData[ "identifier"         ] =  "Search Account Invoices/Account " + accountId;
      restData[ "locatorId"          ] =  invoiceId
      restData[ "locatorType"        ] =  "20";  // invoice
      restData[ "locatorRelationship"] =  "17"; // relationship = invoice for trip
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function tripInvoicesActions( selectedValue, tripId, refreshSectionId )
   {
      var restData = {};
      var command;
      if (selectedValue == 1 )      command = "addEstimateBasisInvoice";
      else if (selectedValue == 2 ) command = "addActualBasisInvoice";
      else if (selectedValue == 3 ) command = "addTipInvoice";
      else return( false );

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "trip";
      restData[ "command"            ] =  command;
      restData[ "identifier"         ] =  command + "/" + tripId;
      restData[ "locatorId"          ] =  tripId
      restData[ "locatorType"        ] =  "61";  // trip
      restData[ "locatorRelationship"] =  "1"; // owner
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function invoiceCalculate( invoiceId, refreshSectionId )
   {
      var restData = {};
      var command = "calculate";

      var xhrData = {};
      xhrData[ "containerId"         ] =  refreshSectionId;
      xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "invoice";
      restData[ "command"            ] =  command;
      restData[ "identifier"         ] =  command + "/" + invoiceId;
      restData[ "locatorId"          ] =  invoiceId
      restData[ "locatorType"        ] =  "20";
      restData[ "locatorRelationship"] =  "0";
      restData[  "locatorRecordType" ] =  "0";
      restData[ "dataReq"            ] =  "*PageBasic,list,id,date,lastUpdate,nextProcessingCSS,lastUpdateCSS,statusText,statusReason,typeText,invoiceDescription,merchantAccountId,creatorPersonId,totalCharges,balanceDue,amountDue,statusOptions,typeOptions,originType,originId,nextProcessing,prevProcessing,debug,stepStatusHTML,totalPayments,estimateAmount,preAuthAmount,payment1,payment2,transferId,transferJson,lock,captureStatusReason,distributionStatusReason,debug"
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function invoiceRebuild( invoiceId, refreshSectionId )
   {
      var restData = {};
      var command = "rebuild";

      var xhrData = {};
      xhrData[ "containerId"         ] =  refreshSectionId;
      xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "invoice";
      restData[ "command"            ] =  command;
      restData[ "identifier"         ] =  command + "/" + invoiceId;
      restData[ "locatorId"          ] =  invoiceId
      restData[ "locatorType"        ] =  "20";
      restData[ "locatorRelationship"] =  "0";
      restData[  "locatorRecordType" ] =  "0";
      restData[ "dataReq"            ] =  "*PageBasic,list,id,date,lastUpdate,nextProcessingCSS,lastUpdateCSS,statusText,statusReason,typeText,invoiceDescription,merchantAccountId,creatorPersonId,totalCharges,balanceDue,amountDue,statusOptions,typeOptions,originType,originId,nextProcessing,prevProcessing,debug,stepStatusHTML,totalPayments,estimateAmount,preAuthAmount,payment1,payment2,transferId,transferJson,lock,captureStatusReason,distributionStatusReason,debug"
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function invoiceRepair( invoiceId, refreshSectionId )
   {
      var restData = {};
      var command = "repair";

      var xhrData = {};
      xhrData[ "containerId"         ] =  refreshSectionId;
      xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "invoice";
      restData[ "command"            ] =  command;
      restData[ "identifier"         ] =  command + "/" + invoiceId;
      restData[ "locatorId"          ] =  invoiceId
      restData[ "locatorType"        ] =  "20";
      restData[ "locatorRelationship"] =  "0";
      restData[  "locatorRecordType" ] =  "0";
      restData[ "dataReq"            ] =  "*PageBasic,list,id,date,lastUpdate,nextProcessingCSS,lastUpdateCSS,statusText,statusReason,typeText,invoiceDescription,merchantAccountId,creatorPersonId,totalCharges,balanceDue,amountDue,statusOptions,typeOptions,originType,originId,nextProcessing,prevProcessing,debug,stepStatusHTML,totalPayments,estimateAmount,preAuthAmount,payment1,payment2,transferId,transferJson,lock,captureStatusReason,distributionStatusReason,debug"
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function populateAttrDataEntry( tagUid, url, containerId, aViewName, aTagName )
   {
      // This populates a 'suffix' section based on the selected value of the input dropdown
//    console.log( "populateAttrSuffix" );

      var selectElement = document.getElementById(tagUid);
      var containerElement = document.getElementById(containerId);

      if ( selectElement != null )
      {
         if ( containerElement != null )
         {
            containerElement.innerHTML = pendingRefreshFlagHTML+containerElement.innerHTML;
         }
         else
         {
            console.error( containerId + " is null");
         }

         var dataValue = selectElement.options[ selectElement.selectedIndex ].value
         if ( dataValue != -1 )
         {
            setTagParm( "id", dataValue, tagUid );
            setTagParm( "subId", 0, tagUid );
            populate( tagUid, url, containerId, aViewName, aTagName );
         }
         else
         {
            console.error( "data value is null" );
         }
      }
      else
      {
         console.error( tagUid + " is null");
      }
   }

   function attrDefForceRefresh( typeId, tagUid )
   {
      var typeElement  = document.getElementById( typeId );
      if ( typeElement == null )
      {
         console.error( "attrDefForceRefresh 'type' element is null. " + typeId + " " + tagUid );
         return;
      }
      type = typeElement.value;
//    console.log( typeId + " " + type + " " + tagUid );
      if ( ( type==8 || type==12 || type==16 ))
      {
         forceRefresh( tagUid );
      }
   }
   function OpenCrimCheck( jsonResponse, containerTagUid )
   {
      document.getElementById( 'section_refresh'+containerTagUid ).click();

      if ( jsonResponse.Success != true )
      {
         errorMsg = "";
         try
         {
            errorMsg = jsonResponse.Errors[0];
         }
         catch(err)
         {
            // no usable error text
         }
         createAlert( 3, "", "An error has occurred while communicating with Crimcheck.\n" + errorMsg + "\nPlease try again later." );
         // todo: create ticket to dev
      }
      else
      {
         window.location.href = jsonResponse.applicationLinkUrl;
      }
   }

   function submitCreateNewCheckrInvitation( theButton, tagUid, objId )
   {
      theButton.disabled = true; // don't want multiple submissions
      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"         ] =  "BACKGROUNDCHECK2"
      reqJson[ "col"           ] =  "CHECKR_CREATE_CANDIDATE"
      reqJson[ "identifier"    ] =  "CheckrCreateCandidate"
      reqJson[ "objId"         ] =  Number( objId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 theButton.id,  // reference element for busy icon location
                 tagUid,        // refresh sectionId
                 "",
                 ""
               );
   }
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
   function processCartEmailAddress(aFormId)
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "cartEmailAddress" );

      if (errCount > 0 )
      {
         alert( "Please correct error in email address" );
         return( false );
      }
      var cartEmailAddress = getValueByName( "cartEmailAddress" );



      setBusy( "cartBusy", "block" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { checkContactExists( ajaxRequest, cartEmailAddress );} ;

      var serverCall = "/cis/jsp/ajax/ajaxGetContact.jsp"
                      +"?user="+getUserName()
                      +"&viewName=getContactId"
                      +"&emailAddress="+cartEmailAddress

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return(false);
   }

   function validateWebUrl(aFormId)
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "url" );

      if (errCount > 0 )
      {
         alert( "Please correct error in web site url." );
         return( false );
      }
      return(true);
   }


   function checkContactExists( ajaxRequest, cartEmailAddress )
   {
      if (ajaxRequest.readyState == 4)
      {
         setBusy( "cartBusy", "none" );

         var responseParts = ajaxRequest.responseText.trim().split('|'); // in case other stuff appended to response like xml model link, etc.
         var contactId = responseParts[0];
         var firstMemberId = responseParts[1];
         var firstPersonLogin = responseParts[2];


         var existingContactInfoDiv = document.getElementById( "emailAddressFound" );
         var newContactInfoDiv      = document.getElementById( "emailAddressNotFound" );

         if ( contactId > 0 )
         {
            existingContactInfoDiv.style.display = "block";
            newContactInfoDiv.style.display = "none";

            setValueById( "paymentLoginUsername", cartEmailAddress ); // prime the login input field

            setValueById( "cartContactId", contactId ); // the contactId is passed in form to 'createInvoiceFromCart'
            setValueById( "cartPersonId", firstMemberId );

            // now refresh the 'existing contact' section using the contactId set in the 'getContactId' viewName request above
            // note that next page will use the email address to again locate the contact to get the id (nothing other than email addr is passed in form)

            var tagUid = getTagUidFromName( "cartContact" );
            setTagParm( "id", contactId, tagUid, true ); //force the new id into the contact tag
            forceRefresh( tagUid );

            var loginIdDoesNotExistDiv = document.getElementById( "loginIdDoesNotExist" );
            var loginIdExistsDiv       = document.getElementById( "loginIdExists" );

            if ( firstPersonLogin == "true" )
            {
               loginIdDoesNotExistDiv.style.display = "none";
               loginIdExistsDiv.style.display = "block";
            }
            else
            {
               loginIdDoesNotExistDiv.style.display = "block";
               loginIdExistsDiv.style.display = "none";
            }
         }
         else
         {
            newContactInfoDiv.style.display = "block";
            existingContactInfoDiv.style.display = "none";
         }
      }
   }

   function cartCreateAccount( aFormId, clientType, emailFieldName, tagUid )
   {

      // this is triggered from a button in the 'create new contact' section that was enabled above if email address not found
      // this will create the new contact
      // the response handler will now 'retry' the check at the top above to see if a contact matches the email addr.  Since we created it here, we should now get a contact id back

      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count

      doValidate( aForm, "reqLastName" );
      doValidate( aForm, "addressLine1" );
      doValidate( aForm, "city" );
      doValidate( aForm, "state" );
      doValidate( aForm, "zip" );
      doValidate( aForm, "companyName" );
      doValidate( aForm, "phone" );

      if (errCount > 0 )
      {
         alert( "Please correct the " + errCount + " error(s) in account form." );
         return( false );
      }

      setBusy( "cartBusy", "block" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { getCreatedAccount( ajaxRequest, aFormId, emailFieldName, tagUid );} ;

      var serverCall = "/cis/jsp/ajax/ajaxCreate"+clientType+"Lead.jsp"
                      +"?user="+getUserName()
                      +"&primaryEmail="+getValueByName(    "searchEmailAddress" )
                      +"&reqLastName="+getValueByName(     "reqLastName" )
                      +"&reqFirstName="+getValueByName(    "reqFirstName" )
                      +"&addressLine1="+getValueByName(    "addressLine1" )
                      +"&addressLine2="+getValueByName(    "addressLine2" )
                      +"&city="+getValueByName(            "city" )
                      +"&state="+getValueByName(           "state" )
                      +"&zip="+getValueByName(             "zip" )
                      +"&phone="+getValueByName(           "phone" )
                      +"&companyName="+getValueByName(     "companyName" )

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return( false );
   }

   function cartCreateLoginId( aFormId )
   {

      // this is triggered from a button in the 'create login id' section that was enabled above if login id not found
      // this will create the new login id
      // the response handler will now 'retry' Since we created it here, we should now get a login id back

      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count

      doValidate( aForm, "password" );
      doValidate( aForm, "passwordConfirm" );

      if (errCount > 0 )
      {
         alert( "Please correct the " + errCount + " error(s) in account form." );
         return( false );
      }

      setBusy( "cartBusy", "block" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { getCreatedLoginId( ajaxRequest );} ;

      var serverCall = "/idmanager/jsp/ajax/ajaxGetLoginId.jsp"
                      +"?user="+getUserName()
                      +"&id="+getValueByName(    "cartEmailAddress" )
                      +"&password="+getValueByName(        "password" )
                      +"&fn=createNew"
                      +"&ownerType=5"
                      +"&ownerId="+getValueById( "cartPersonId" )


      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return( false );
   }

   function getCreatedLoginId( ajaxRequest )
   {
      if (ajaxRequest.readyState == 4)
      {
         setBusy( "cartBusy", "none" );

         document.getElementById( "doSearch" ).click(); // do the search again.  This time the account should be found
      }
   }

   function getCreatedAccount( ajaxRequest, aFormId, emailFieldName, tagUid )
   {
      if (ajaxRequest.readyState == 4)
      {
         locateContactByEmailAddress( aFormId, emailFieldName, tagUid )
      }
   }

   function validateOrder( aFormId, count, tagUid )
   {
      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count


      doValidate( aForm, "orderDate" ); // make sure an order date has been entered

      for ( var i=0; i<count; i++ )
      {
         doValidate( aForm, "delivery_"+i );   // make sure all order items have specified store pickup or delivery
      }

      if (errCount > 0 )
      {
         alert( "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }
      return( true );
   }


   function clearFollowUp( contactId )
   {
      addHistoryWithIcon( "clearFollowUp", 17, 8, contactId, getSysImages()+"/broom.png", "/images/broom-bw.png" )
   }

   function setResponseDue( contactId )
   {
      addHistoryWithIcon( "setResponseDue", 18, 8, contactId, getSysImages()+"/reddot.png", "/images/graydot.png" )
   }

   function ajaxSetContactDataField( id, viewName, containerId, busyIcon, tagUid, onChangeFn, value, name, context )
   {
      setBusy( busyIcon, "inline");

      var onChangeFnStr = document.getElementById( onChangeFn ).value;

      var ajaxRequest = getAjaxRequestObject();

//      console.log( "contact: context - " + context );

      var serverCall = "/"+context+"/jsp/ajax/ajaxGetContact.jsp"
                      +"?id="+id
                      +"&viewName="+viewName
                      +"&tagUid="+tagUid
                      +"&onChangeFn="+onChangeFnStr
                      +"&user="+getUserName()
                      +"&name="+name
                      +"&value="+value

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxSetContactStatusFields( id, roContainerId, dropdownContainerId, busyIcon, tagUid, onChangeFn, value, name, nextStatesForState, context )
   {
      ajaxSetContactDataField( id, "status",         roContainerId,       busyIcon, tagUid, onChangeFn, value, name, context );

      if ( nextStatesForState != "" ) value = nextStatesForState; // override and get nextStates for specified state rather than current state
//      console.log( nextStatesForState + " " + value );
      ajaxSetContactDataField( id, "statusDropdown", dropdownContainerId, busyIcon, tagUid, onChangeFn, value, name, context );
   }


   function verifyDeleteContact( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This contact (Client/Vendor/Business) cannot be deleted because it contains projects and/or is a member of one or more groups.";
         alert( msg );
         return( false );
      }
      return(true);
   }

   function locateContactByEmailAddress( aFormId, emailFieldName, tagUid )
   {
//    console.log( tagUid + " <== locateContactByEmailAddress" );
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "searchEmailAddress" );

      if (errCount > 0 )
      {
         alert( "Please correct error in email address" );
         return( false );
      }

      emailAddress = document.getElementById( getTagUidFromName( emailFieldName ) ).value;
      setTagParm( 'emailAddress', emailAddress, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function WridzBankAccountPreReqCheck( tagUid, containerTagUid )
   {
      errCount = 0;
      var form = document.getElementById( "form"+containerTagUid );
      doValidate( form, "BusinessDescription"+containerTagUid );
      doValidate( form, "DBA"+containerTagUid );
      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }
      var addressCount = getElementByName( "addressCount"+containerTagUid );
      if ( addressCount.value == 0 )
      {
         createAlert( 3, "", "You must define at least one business address." );
         return( false );
      }
      return( true );
   }

   function updateCouponDiscountType( tagUid )
   {
      var discountType = document.getElementById(tagUid);
      console.log( "Discount Type: " + discountType.value );

      percentDiscountElement = document.getElementsByName( "DiscountPercent" )[0];
      amountDiscountElement  = document.getElementsByName( "DiscountAmount" )[0];

      if ( discountType.value == 1 )
      {
         percentDiscountElement.style.display = "block";
         amountDiscountElement.style.display = "none";
      }
      else
      {
         percentDiscountElement.style.display = "none";
         amountDiscountElement.style.display = "block";
      }
   }
   function initDataTable( tableId, dbTable, dbCol )
   {
     $(document).ready(function()
     {
        var tableElement = document.getElementById( tableId );
        if ( tableElement != null )
        {
           var table = $('#'+tableId ).DataTable(
                                                {
                                                  "paging"   :  false,
                                                  "info"     :  false,
                                                  "autoWidth":  false,
                                                  "searching":  false
                                                });

           new $.fn.dataTable.RowReorder( table, {
                                                   selector: 'tr'
                                                 } );

           table.on( 'row-reorder', function ( e, diff, edit )
           {
               var movesArray = [];
               for ( var i=0, ien=diff.length ; i<ien ; i++ )
               {
                  movesArray.push({
                     "fromPosition"        : diff[i].oldPosition,
                     "toPosition"          : diff[i].newPosition,
                     "instanceId"          : diff[i].node.attributes["instanceId"].value
                  });
               }
               var json = {};
               json.moves = movesArray;
               var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp"
                               +"?table="+dbTable
                               +"&col="+dbCol
                               +"&moves="+encodeURIComponent(JSON.stringify(json))
                               +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                               +"&reqUid="+generateReqUid();

               var ajaxRequest = getAjaxRequestObject();

               ajaxRequest.onreadystatechange = function()
                                                {
                                                   if(ajaxRequest.readyState == 4)
                                                   {
                                                      handleAjaxRC( ajaxRequest );
                                                   }
                                                }
               ajaxRequest.open("GET", serverCall, true);
               ajaxRequest.send(null);
            });
        }
     });
   }
   function validateDateInput( tagUid, required )
   {
//    console.log( "validateDataInput()" );
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      // 2/13/23 - added due to somebody entering 09191983 for birthday
      // but realized we can't restrict all date entries to mm/dd/yyyy format
      // need to add an 'expected format' parm to the validation
//    var parts = dataValue.split("/");
//    if (( parts.length != 3 )
//       ||( parts[0].length != 2 )
//       ||( parts[1].length != 2 )
//       ||( parts[2].length !=4 ) )
//    {
//       showError( tagUid, "Error: The date format must be mm/dd/yyyy." );
//       errCount++;
//       return( false );
//    }

      var restrictions     = getTagParm( "restrictions", tagUid );
//    console.log( "validateDateInput() restrictions: " + restrictions );

      var now = new Date();
      var theDate = Date.parse( dataValue );
      if ( restrictions == 'futureOnly' )
      {
         if ( theDate <= now )
         {
            showError( tagUid, "Error: The value entered must be a future date." );
            errCount++;
            return( false );
         }
      }
      if ( restrictions == 'pastOnly' )
      {
         if ( theDate >= now )
         {
            showError( tagUid, "Error: The value entered must be a past date." );
            errCount++;
            return( false );
         }
      }
      return( true );
   }

   function initDateTime( hourMin, hourMax )
   {
//   console.log( "initDateTime() " + getSysImages()+'/calendar.png');
     $(document).ready(function()
     {
        $(".datetimepicker").datetimepicker(
           {
              showOn: 'both',
              buttonImage: getSysImages()+'/calendar.png',
              buttonImageOnly: true,
              buttonText: 'Open Calendar',
              changeMonth: true,
              changeYear: true,
              hourMin: hourMin,
              hourMax: hourMax,

              dateFormat: 'D, M d, yy',
              timeFormat: 'hh:mm TT',

              onSelect: function(d,i)
              {
                    var date = new Date(d);
                    var lastVal = new Date(i.lastVal);
                    if (!isNaN(lastVal.getHours()) )  // this is a complete kludge... only way I can find to tell if time was changed...
                    {                                 // if time slider changed, it messes up and doesn't set 'i' correctly resulting in NaN
                       date.setHours( 0 );
                       date.setMinutes( 0 );
                       $(this).datetimepicker('setDate', date );
                    }
              }
           }
        );

        $(".datepicker").datepicker(
           {
              showOn: 'both',
              buttonImage: getSysImages()+'/calendar.png',
              buttonImageOnly: true,
              buttonText: 'Open Calendar',
              changeMonth: true,
              changeYear: true,
              yearRange: '-100:+15',
              dateFormat: 'mm/dd/yy'
           }
        );

        $(".datepicker2").datepicker(
           {
              showOn: 'both',
              buttonImage: getSysImages()+'/calendar.png',
              buttonImageOnly: true,
              buttonText: 'Open Calendar',
              changeMonth: true,
              changeYear: true,
              yearRange: '-100:+15',
              dateFormat: 'M d, yy',
           }
        );

        $(".timepicker").timepicker(
           {
              showOn: 'both',
              timeFormat: 'hh:mm TT',
              hourMin: hourMin,
              hourMax: hourMax,
              onSelect: function(d,i)
              {
                    var date = new Date(d);
                    var lastVal = new Date(i.lastVal);
                    if (!isNaN(lastVal.getHours()) )  // this is a complete kludge... only way I can find to tell if time was changed...
                    {                                 // if time slider changed, it messes up and doesn't set 'i' correctly resulting in NaN
                       date.setHours( 0 );
                       date.setMinutes( 0 );
                       $(this).datetimepicker('setDate', date );
//                     console.log("Time changed: " + date);
                    }
              }
           }
        );
     });
   }

   function dateInputTagUtcToLocal( utcTime, tagUid, format )
   {
//    console.log( utcTime + " " + tagUid + " " + format );
      localTime = utcToLocal( utcTime, format );
      var roContainer = document.getElementById( tagUid+"RO" );
      roContainer.innerHTML = localTime;
      var inputElement = document.getElementById( tagUid );
      inputElement.value = localTime;
   }

  function getElementFromForm( aForm, aName )
  {
     var elements = aForm.elements;
     for (i=0; i<elements.length; i++)
     {
//      console.log( "Name: " + aName + " " + elements[i].name );
        if ( elements[i].name == aName ) return( elements[i] );
     }
     console.warn( "Element with name: " + aName + " was not found in form: " + aForm.name );
     return(null);
  }

  function doValidateIfVisible( aForm, aName, aWrapper )
  {
//   console.log( 'doValidateIfVisible( '+ aForm + ' ' + aName + ' ' + aWrapper + ')' );
     var aWrapperElement        = document.getElementById( aWrapper );
     if ( aWrapperElement == null )
     {
//      console.log( "doValidateIfVisible() - wrapper id: " + aWrapper + " was not found" );
        return(1);
     }
     if (aWrapperElement.style.display == 'none' )
     {
//      console.log( "      " + aWrapper + " is not visible" );
        return(0);
     }
//   console.log(  "      " + aWrapper + " is visible" );
     return( doValidate( aForm, aName ));
  }

  function doValidateIfExist( aName )
  {
     anElement = getElementByName( aName );
     if ( anElement == "" ) return( 0 );  // not an error if element doesn't exist
     return( doValidate( null, aName ));
  }

  function doValidate( aForm, aName )
  {
//   console.log( 'doValidate( '+ aForm + ' ' + aName + ' )' );
     var anElement = null;
     if ( aForm == null )
     {
       try
       {
          anElement = getElementByName( aName );
          if ( anElement == "" )
          {
             console.warn( "Element with name: " + aName + " was not found (form not specified)." );
          errCount++;
             return( 1 );
          }
       }
       catch( e )
       {
          console.warn( "Element with name: " + aName + " was not found (form not specified)." );
          errCount++;
          return( 1 );
       }
     }
     else
     {
        anElement    = getElementFromForm( aForm, aName );
     }
     if ( anElement == null ) return( 1 );

//   console.log( anElement.id );
     var event = new Event('change'); // trigger an 'onChange' to force validation call
//   console.log( " --- Error Count: " + errCount);
     if ( anElement.dispatchEvent(event) == true) return( 0 );
     return( 1 );
  }

  function updateDocumentElement( aForm, aName, aValue )
  {
//   console.log( 'updateDocumentElement( '+ aForm + ' ' + aName + " = " + aValue + ' )' );
     var anElement    = getElementFromForm( aForm, aName );
     if ( anElement == null ) return(false);

//   console.log( anElement.id );
     anElement.value = aValue;

     var event = new Event('change'); // trigger an 'onChange'
     if ( anElement.dispatchEvent(event) == true)
     {
        return( true );
     }
     console.error( "updateDocumentElement error." );
     return( false );
  }

  function getValue( aForm, aName )
  {
     var anElement    = getElementFromForm( aForm, aName );
     if ( anElement == null ) return( 0 );

     var aValue = "0";

     if ( anElement.type == "checkbox" )
     {
        if ( anElement.checked )  aValue = anElement.value;
//      console.log( aName + " = " + aValue );
        return( aValue );
     }
     if ( anElement.type == "radio" )
     {
        var elements = document.getElementsByName( aName );
        for ( var i = 0; i < elements.length; i++ )
        {
//         console.log( elements[i].id + " " + elements[i].value + " " + elements[i].checked );
           if ( elements[i].checked )
           {
//            console.log( "true" );
              return( elements[i].value );
           }
        }
        return( 0 );
     }
//   console.log( aName + " = [" + anElement.value + "] " + anElement.id + " " + anElement.name );
     return( anElement.value );
  }

  function setCurrencyValue( aForm, aName, aValue )
  {
     setValue( aForm, aName, parseFloat(Math.round(aValue * 100) / 100).toFixed(2) );
  }

  function setValue( aForm, aName, aValue )
  {
//   console.log( 'setValue( ' + aName + ': ' + aValue +' )' );

     var anElement    = getElementFromForm( aForm, aName );
     if ( anElement == null ) return( null );
     if ( anElement.tagName == "SPAN" )
     {
        anElement.innerHTML = aValue;
     }
     else
     {
        anElement.value = aValue;
     }
     return( true );
  }

  function setROValue( aForm, aName, aValue )
  {
//   console.log( 'setROValue( ' + aName + ': ' + aValue +' )' );

     var anElement    = getElementFromForm( aForm, aName );   // this is the RW element
     if ( anElement == null ) return( null );

     // can't use names on span tags... got to locate using the id of the input tag
     roElement = document.getElementById( "RO_Content"+anElement.id );  // input tag id is the base tagUid
     if ( roElement != null )
     {
        roElement.innerHTML = aValue;
     }
     else
     {
        console.error( "** Element with id: " + "RO_Content"+anElement.id + " not found." );
     }
     return( true );
  }
   function restartSubscriptionPayInvoice( jsonResponse )
   {
      window.location.href = '/wridz/jsp/user/home.jsp?tile=singleInvoice&id='+jsonResponse.payableInvoiceId;
   }

   function rebuildDriverPasses( primaryKey, tagUid )
   {
      var initialLevel = getElementByName( tagUid );

      var restData = {};
      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  tagUid;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "DRIVERPASSLIST";
      restData[ "command"            ] =  "Rebuild";
      restData[ "identifier"         ] =  "Rebuild";
      restData[ "locatorId"          ] =  primaryKey;
      restData[ "locatorType"        ] =  "322";  // User
      restData[ "locatorRelationship"] =  "owner";
//      alert( "selectedIndex " + initialLevel.selectedIndex + initialLevel.options[ initialLevel.selectedIndex ].value + " " + initialLevel.options[ initialLevel.selectedIndex ].text )
      restData[  "locatorRecordType"         ] =  initialLevel.options[ initialLevel.selectedIndex ].value
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
   }
   // Dual list move function

   function ajaxMoveDualList( type, srcList, destList, fn, table, ownerType, ownerId, listItemType, containerId, tagUid )
   {
      var destListElement = document.getElementById( destList );
      var srcListElement  = document.getElementById( srcList );

      if ( srcListElement.selectedIndex == -1 ) return;

      // start new dest list
      newDestList = new Array( destListElement.options.length );
      var len = 0;

      // put curr dest items in dest list
      for( len = 0; len < destListElement.options.length; len++ )
      {
        if ( destListElement.options[ len ] != null )
        {
          newDestList[ len ] = new Option( destListElement.options[ len ].text, destListElement.options[ len ].value, destListElement.options[ len ].defaultSelected, destListElement.options[ len ].selected );
        }
      }

      var listItemIds = [];

      // put selected source items in dest list and complete serverCall string
      for( var i = 0; i < srcListElement.options.length; i++ )
      {
        if ( ( srcListElement.options[i] != null )
           &&(srcListElement.options[i].selected == true ) )
        {
           listItemIds.push( srcListElement.options[i].value );
           newDestList[ len ] = new Option( srcListElement.options[i].text, srcListElement.options[i].value, srcListElement.options[i].defaultSelected, srcListElement.options[i].selected );
           len++;
        }
      }

      // sort dest list
      newDestList.sort( compareOptionText );   // BY TEXT

      // re-populate dest list box
      for ( var j = 0; j < newDestList.length; j++ )
      {
        if ( newDestList[ j ] != null )
        {
          destListElement.options[ j ] = newDestList[ j ];
        }
      }

      // Remove selected items from source list box
      for( var i = srcListElement.options.length - 1; i >= 0; i-- )
      {
        if ( ( srcListElement.options[i] != null )
          && ( srcListElement.options[i].selected == true ) )
        {
           srcListElement.options[i]       = null;
        }
      }

      var url = "/cis/JWMBOS";
      var reqJson    = {
                          "table"       : table,
                          "user"        : getUserName(),
                          "type"        : type,
                          "fn"          : fn,
                          "ownerType"   : ownerType,
                          "ownerId"     : ownerId,
                          "listItemType": listItemType,
                          "listItemId"  : listItemIds
                       };

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 containerId,
                 "",
                 "" );
   } // End of moveDualList()

   function compareOptionText(a, b)
   {
     if (a.text.toUpperCase() < b.text.toUpperCase() ) return( -1 );
     if (a.text.toUpperCase() > b.text.toUpperCase() ) return(  1 );
     return 0;
   }
   function verifyDeleteEduClassDivision( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This division contains classes.  It cannot be deleted.";
         alert( msg );
         return( false );
      }
      return(true);
   }

   function verifyDeleteEduClass( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This class contains members.  It cannot be deleted.";
         alert( msg );
         return( false );
      }
      return(true);
   }
   function validateEmailAddressInput( tagUid, required )
   {
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      if ( !is_email( dataValue ) )
      {
         showError( tagUid, "** Invalid Email Address" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         errCount += 1;
         return( false );
      }
      return( true );
   }

   function is_email(email)
   {
      var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
      return emailReg.test(email);
   }

   function processTemplateInsertButton( buttonElement, idRoot, type, id, mailItemType, tagUid )
   {
      var templatesTagUid = buttonElement.getAttribute( "tagUid" );
      var busyIcon = "templatebusy"+tagUid;

      var selectionListElement = document.getElementById( "templates"+templatesTagUid );
      var optionElement = selectionListElement.options[selectionListElement.selectedIndex];

      var templateId         = optionElement.value;
      var templateName       = optionElement.text;

      // I have added user-defined attributes to the <options> tag:
      var toFollowUp         = optionElement.getAttribute( "toFollowup" );
      var toStatus           = optionElement.getAttribute( "toStatus" );
      var onlyToDue          = optionElement.getAttribute( "onlyToDue" )
      var preventDuplicates  = optionElement.getAttribute( "preventDuplicates" );

      var subjUid         = "Mail_Subject"+idRoot;
      var bodyUid         = "Body_"+idRoot;
      var statusUid       = "MailChangeStatus"+idRoot;
      var followupUid     = "MailChangeFollowUp"+idRoot;
      var onlyToDueUid    = "OnlyToFollowupDue"+idRoot;
      var duplicatesIdUid = "DuplicatesId"+idRoot;

//    console.log( "subjUid " + subjUid );
      var subjectElements = document.getElementsByName(            subjUid         );
      var nextStatusElements = document.getElementsByName(         statusUid       );

      var nextFollowUpElements      = document.getElementsByName(  followupUid     );
      var onlyToFollowUpDueElements = document.getElementsByName(  onlyToDueUid    );
      var duplicatesIdElements      = document.getElementsByName(  duplicatesIdUid );

      if ( templateId == -999 ) // this is the autosaved draft, NOT a template
      {
         var autoSavedBody = "";
         var autoSavedSubj = "";

         if (typeof Storage != "undefined")
         {
             autoSavedBody = localStorage.getItem(bodyUid);
             autoSavedSubj = localStorage.getItem(subjUid);
         }
//       console.log( "autoSavedSubj( " + subjUid + " ) = " + autoSavedSubj );

         if ( autoSavedSubj != "" ) subjectElements[0].value = autoSavedSubj;

         if ( autoSavedBody != "" ) insertIntoJQTE("Body_"+idRoot, autoSavedBody );
         else console.error( "autoSavedBody is blank" );

      }
      else // template
      {
         ajaxPopulateEmailBodyFromTemplate(    templateId, idRoot,       busyIcon, bodyUid,           type, id, mailItemType, tagUid );
         ajaxPopulateEmailSubjectFromTemplate( templateId, subjUid,      subjectElements[0],          type, id, mailItemType, tagUid  );

//                  if ( toStatus != "--No Status Change--" ) selectOptionByText(  nextStatusElements[0],        toStatus     );
// fn moved to HML  if ( toFollowUp != -1 )                   selectOptionByValue( nextFollowUpElements[0],      toFollowUp   );
//                  if ( onlyToDue  ==  1 )                   setCheckBox(         onlyToFollowUpDueElements[0], 1            );
//                  if ( preventDuplicates ==  1 )            selectOptionByText(  duplicatesIdElements[0],      templateName );
      }
   }

   function ajaxPopulateEmailBodyFromTemplate( templateId, idRoot, busyIcon, bodyUid, type, id, mailItemType, tagUid  )
   {
      setBusy( busyIcon,"inline" );

      var context          = getTagParm( "context", tagUid );
      if (context == '' ) context = "cis";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertTemplateBody( ajaxRequest, idRoot, busyIcon, bodyUid );} ;
      var serverCall = "/"+context+"/jsp/ajax/ajaxGetMailTemplate.jsp"
                      +"?user="+getUserName()
                      +"&viewName=bodyContent"
                      +"&customizeType="+type
                      +"&customizeId="+id
                      +"&mailItemType="+mailItemType
                      +"&id="+templateId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxPopulateEmailSubjectFromTemplate( templateId, uid, container, type, id, mailItemType, tagUid  )
   {
      var ajaxRequest = getAjaxRequestObject();

      var context          = getTagParm( "context", tagUid );
      if (context == '' ) context = "cis";

      ajaxRequest.onreadystatechange = function() { insertTemplateSubject( ajaxRequest, uid, container );} ;

      var serverCall = "/"+context+"/jsp/ajax/ajaxGetMailTemplate.jsp"
                      +"?user="+getUserName()
                      +"&viewName=subjectContent"
                      +"&customizeType="+type
                      +"&customizeId="+id
                      +"&mailItemType="+mailItemType
                      +"&id="+templateId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function insertTemplateBody( ajaxRequest, idRoot, busyIcon, bodyUid )
   {
      if (ajaxRequest.readyState == 4)
      {
         var templateBody = ajaxRequest.responseText.trim();

         setBusy( busyIcon, "none" );

         insertIntoJQTE( "Body_"+idRoot, templateBody );

         if (typeof Storage != "undefined")
         {
             localStorage.setItem(bodyUid, templateBody);
         }
      }
   }

   function insertIntoJQTE( idRoot, templateBody )
   {
//    console.log( "insertIntoJQTE idRoot " + idRoot );
      var textElement = document.getElementById( idRoot );
      var cursorPos = getCursorPos( textElement );

      var text = $( "#"+idRoot ).jqteVal();
      var before = text.substring(0, cursorPos )
      var after  = text.substring(cursorPos, text.length)

      $( "#"+idRoot ).jqteVal(before + templateBody.trim() + after);
   }

   function insertTemplateSubject( ajaxRequest, uid, container )
   {
      if (ajaxRequest.readyState == 4)
      {
         var subject = ajaxRequest.responseText.trim();
         var parts = subject.split("|")
         if ( parts.length > 1 ) subject = parts[1].trim();
//         console.log( "subj: " + subject );
         container.value = subject;
         autoSave( container, uid ); // need to make sure current subj is now the autosaved subj
      }
   }

   function selectOptionByText( selectElement, aText)
   {
      for(var i=0; i < selectElement.options.length; i++)
      {
        if(selectElement.options[i].text == aText)
        {
          selectElement.selectedIndex = i;
          break;
        }
      }
   }

   function selectOptionByValue( selectElement, aValue)
   {
      for(var i=0; i < selectElement.options.length; i++)
      {
        if(selectElement.options[i].value == aValue)
        {
          selectElement.selectedIndex = i;
          break;
        }
      }
   }

   function setCheckBox( checkBoxElement, value )
   {
      if ( value == '1' )
      {
         checkBoxElement.checked = "true";
      }
      else
      {
         checkBoxElement.checked = "false";
      }
   }

   function getCursorPos(element)
   {
       var caretOffset = 0;
       var doc = element.ownerDocument || element.document;
       var win = doc.defaultView || doc.parentWindow;
       var sel;
       if (typeof win.getSelection != "undefined")
       {
           sel = win.getSelection();
           if (sel.rangeCount > 0)
           {
               var range = win.getSelection().getRangeAt(0);
               var preCaretRange = range.cloneRange();
               preCaretRange.selectNodeContents(element);
               preCaretRange.setEnd(range.endContainer, range.endOffset);
               caretOffset = preCaretRange.toString().length;
           }
       }
       else if ( (sel = doc.selection) && sel.type != "Control")
       {
           var textRange = sel.createRange();
           var preCaretTextRange = doc.body.createTextRange();
           preCaretTextRange.moveToElementText(element);
           preCaretTextRange.setEndPoint("EndToEnd", textRange);
           caretOffset = preCaretTextRange.text.length;
       }
       return caretOffset;
   }

   function sendMail( idRoot, type, id, mailItemType, tagUid )
   {
      var busyIcon = "busy"+tagUid;
      var busyElement = document.getElementById( busyIcon );
      if ( busyElement != null )
      {
         if ( busyElement.style.display != "none" ) return;  // if busy... return... prevent double send from double clicks
      }
      setBusy( busyIcon, "inline" );

      setTagParm( "contactId", id, tagUid );

      var processAsLeadFlag = document.getElementsByName( "processLeadToNextState"+tagUid );
      if ( processAsLeadFlag != null )
      {
         if ( processAsLeadFlag[0] != null )
         {
            setTagParm( "processLeadToNextState", processAsLeadFlag[0].options[processAsLeadFlag[0].selectedIndex].value, tagUid );
         }
      }

      var parms = getParmsAsString(tagUid);

      var subjUid         = "Mail_Subject"+idRoot;
      var bodyUid         = "Body_"+idRoot;
      var footerUid       = "Footer_"+idRoot;


      var subjectElements = document.getElementsByName(            subjUid         );

      var subject = subjectElements[0].value;
      if ( subject.trim() == "" )
      {
         alert( "Subject cannot be blank" );
         setBusy( busyIcon, "none" );
         return( false );
      }

      var fromNameUid     = "FromName_"+idRoot;
      var fromAddrUid     = "FromAddr_"+idRoot;
      var toNameUid       = "ToName_"+idRoot;
      var toAddrUid       = "ToAddr_"+idRoot;

      var fromNameElements          = document.getElementsByName(  fromNameUid     );
      var fromAddrElements          = document.getElementsByName(  fromAddrUid     );
      var toNameElements            = document.getElementsByName(  toNameUid       );
      var toAddrElements            = document.getElementsByName(  toAddrUid       );

      var targetURL = "";

      if ( typeof fromNameElements[0]  != 'undefined' )
      {
         targetURL = "/cis/jsp/ajax/ajaxSendMail.jsp";
         parms += "&fromName="     + encodeURIComponent( fromNameElements[0].value );
         parms += "&fromAddr="     + encodeURIComponent( fromAddrElements[0].value );

         for ( var i = 0; i < toAddrElements.length; i++ )
         {
            parms += "&toName="       + encodeURIComponent( toNameElements[i].value );
            parms += "&toAddr="       + encodeURIComponent( toAddrElements[i].value );
         }
      }

      var leadStateSelect           = document.getElementById( "stateSelect" + tagUid );
      if ( leadStateSelect == null )      // this is a normal single email send
      {
         if ( typeof toNameElements[0]  == 'undefined' )
         {
            alert( "No Recipients Specified" );
            return( false );
         }
      }
      else // this is an HML batch where contact states are selected as recipients
      {
         var targetURL = "/hmlClient/jsp/ajax/ajaxQueueBatchMail.jsp";
         if ( mailItemType == "HMLSendTest" )
         {
            parms += "&HMLSendTest=true";
         }
         else
         {
            for (var i = 0; i < leadStateSelect.options.length; i++)
            {
               if(leadStateSelect.options[i].selected ==true)
               {
                  parms += "&leadState=" + encodeURIComponent( leadStateSelect.options[i].value );
               }
            }
         }
      }

      parms += "&mailItemType=" + encodeURIComponent( mailItemType );
      parms += "&type="         + encodeURIComponent( type );
      parms += "&id="           + encodeURIComponent( id );
      parms += "&subject="      + encodeURIComponent( subject);
      parms += "&body="         + encodeURIComponent( $( "#"+bodyUid ).jqteVal() );
      parms += "&footer="       + encodeURIComponent( $( "#"+footerUid ).jqteVal() );

      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { emailSendResults( ajaxRequest, subjectElements[0], bodyUid, idRoot, busyIcon );} ;

      ajaxRequest.open("POST", targetURL, true);
      ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");

      ajaxRequest.send( parms );
   }

   function emailSendResults( ajaxRequest, subjectElement, bodyUid, idRoot, busyIcon )
   {
      if (ajaxRequest.readyState == 4)
      {
         setBusy( busyIcon, "none" );

         result = ajaxRequest.responseText.trim()
         var parts = result.split("|")
         if ( parts.length > 1 ) result = parts[1].trim();

         alert( result );

         if ( result.indexOf( "success" ) != -1 )
         {
            subjectElement.value = ""; // clear the subject and body to prevent a resend...
            $( "#Body_"+idRoot ).jqteVal( "" );
//          console.log( "#Body_"+idRoot );
         }
      }
   }

   function insertSelected( targetId, galleryTagUid )
   {
      var currSelectedTagUid = document.getElementById( "selected"+galleryTagUid ).value;

      var url = document.getElementById( "url"+currSelectedTagUid );
      var imgTag = "<img src='"+url.value+"' style='width:200px'>";

      insertIntoJQTE( targetId, imgTag )
   }

   function sendBatchEmail( tagUid )
   {
//                 local.wridz.com/personlist/BatchMail/23             locatorId (WF)
//                                                     /64             locatorType (region)
//                                                     /11             locatorRelationship
//                                                     /0              RecordType
//                                                     /InSignUpState  data            1
//                                                     /3              filter value    2
//                                                     /19             templateId      3
//                                                     /1              allow dups      4
//                                                     /simulate                       5
//                                                     /fromEmailAddress               6

      var fromElement               = getElementByName( "from" + tagUid );
      if ( fromElement.value == "" )
      {
         alert( "'From' Must Be Specified" );
         return(false);
      }
      var templateIdElement         = getElementByName( "templateId" + tagUid );
      var locatorElement            = getElementByName( "locator" + tagUid );
      var qualifierElement          = getElementByName( "qualifier" + tagUid );
      if (qualifierElement.value == -1 )
      {
         alert( "Recipient Qualifier Must Be Specified" );
         return(false);
      }
      var allowResendElement        = getElementByName( "allowResend" + tagUid );
      var subjectElement            = getElementByName( "subject" + tagUid );
      var bodyElement               = getElementByName( "body" + tagUid );

      var locatorParts              = locatorElement.value.split( "/" );
      var qualifierParts            = qualifierElement.value.split( "/" );

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      var reqJson = {};
      reqJson[ "subject"             ] =  subjectElement.value;
      reqJson[ "body"                ] =  bodyElement.value;

      var restData = {};
      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "personlist";
      restData[ "command"            ] =  "BatchMail";
      restData[ "identifier"         ] =  "BatchMail/"+locatorElement.value+"/"+qualifierElement.value;
      restData[ "locatorId"          ] =  locatorParts[0];
      restData[ "locatorType"        ] =  locatorParts[1];
      restData[ "locatorRelationship"] =  locatorParts[2];
      restData[ "locatorRecordType"  ] =  "0";
      restData[ "value1"             ] =  qualifierParts[0];
      restData[ "value2"             ] =  ( qualifierParts.length > 1 ? qualifierParts[1] : "-" );
      restData[ "value3"             ] =  templateIdElement.value;
      restData[ "value4"             ] =  ( allowResendElement.checked ? "allowResend" : "-" );
      restData[ "value5"             ] =  "simulate"
      restData[ "value6"             ] =  fromElement.value;
      restData[ "tagUid"             ] =  tagUid;
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  reqJson;
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      alert( "Your batch email has NOT yet been sent to the recipients.  A PROOF email has been sent to your email inbox.  When you have proofed the content and the proposed recipient log at the bottom of the email, click the link below the log to actually send the email.  The link will expire in 15 minutes.");
   }
   function ajaxAddEntityItemSuggested( tagUid )
   {
//    console.log( "ajaxAddEntityItemSuggested() " + tagUid );
      var addId = document.getElementById( 'suggestSelected'+tagUid ).value;
//    console.log( "addId " + addId );

      addSectionListItem( tagUid, addId );
   }

   function searchPerson( tagUid )
   {
      forcePage1(tagUid);

      var dateField = getElementByName( "createDateBgn"+tagUid );
      setTagParm( "searchBgnDate", dateField.value, tagUid, true );

      var dateField = getElementByName( "createDateEnd"+tagUid );
      setTagParm( "searchEndDate", dateField.value, tagUid, true );

      var driverField = getElementByName( "driverSignup"+tagUid );
      setTagParm( "driverSignup", driverField.checked, tagUid, true );

      var driverUidField = getElementByName( "driverUid"+tagUid );
      var driverUid = driverUidField.value;
      if ( isNaN( driverUid ) ) driverUid = -1;
      setTagParm( "searchDriverUid", driverUid, tagUid, true );

      var licensePlateField = getElementByName( "licensePlate"+tagUid );
      var licensePlate = licensePlateField.value;
      setTagParm( "searchLicensePlate", licensePlate, tagUid, true );

      var ccLast4Field = getElementByName( "ccLast4"+tagUid );
      var ccLast4 = ccLast4Field.value;
      setTagParm( "searchCcLast4", ccLast4, tagUid, true );

      var searchPersonField = getElementByName( "searchPerson" );
      var searchPerson = searchPersonField.valueId; // made up attribute; see ajaxSuggest.js
      if ( isNaN( searchPerson ) ) searchPerson = -1;
      setTagParm( "searchPerson", searchPerson, tagUid, true );

      var searchLoginField = getElementByName( "searchByLogin" );
      var searchByLogin = searchLoginField.valueId; // made up attribute; see ajaxSuggest.js
      if ( typeof searchLoginField.valueId == 'undefined' ) searchByLogin = "";
      setTagParm( "searchByLogin", searchByLogin, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function searchSignupsByRegion( tagUid )
   {
      var dateField = getElementByName( "signupDateBgn"+tagUid );
      setTagParm( "searchBgnDate", dateField.value, tagUid, true );

      var dateField = getElementByName( "signupDateEnd"+tagUid );
      setTagParm( "searchEndDate", dateField.value, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function searchDriverWaitingRoute( tagUid )
   {
      var bgnTimestampField = getElementByName( "routeListBgnTimestamp" );
      setTagParm( "searchBgnTimestamp", localToUtc( bgnTimestampField.value ), tagUid, true );

      var endTimestampField = getElementByName( "routeListEndTimestamp" );
      setTagParm( "searchEndTimestamp", localToUtc( endTimestampField.value ), tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();

   }

   function searchRegionDrivers( tagUid )
   {
      forcePage1(tagUid);

     if ( getElementByName( "inclDriverStatus"          ).checked) setPersistentTagParm( "inclDriverStatus"          , true , tagUid, true );
     if ( getElementByName( "inclNotRequested"          ).checked) setPersistentTagParm( "inclNotRequested"          , true , tagUid, true );
     if ( getElementByName( "inclPendingApproval"       ).checked) setPersistentTagParm( "inclPendingApproval"       , true , tagUid, true );
     if ( getElementByName( "inclActive"                ).checked) setPersistentTagParm( "inclActive"                , true , tagUid, true );
     if ( getElementByName( "inclDisabledByUser"        ).checked) setPersistentTagParm( "inclDisabledByUser"        , true , tagUid, true );
     if ( getElementByName( "inclDisabledForCause"      ).checked) setPersistentTagParm( "inclDisabledForCause"      , true , tagUid, true );
     if ( getElementByName( "inclSignup"                ).checked) setPersistentTagParm( "inclSignup"                , true , tagUid, true );
     if ( getElementByName( "inclBackgroundCheckStatus" ).checked) setPersistentTagParm( "inclBackgroundCheckStatus" , true , tagUid, true );
     if ( getElementByName( "inclNotStarted"            ).checked) setPersistentTagParm( "inclNotStarted"            , true , tagUid, true );
     if ( getElementByName( "inclPending"               ).checked) setPersistentTagParm( "inclPending"               , true , tagUid, true );
     if ( getElementByName( "inclAwaitingResults"       ).checked) setPersistentTagParm( "inclAwaitingResults"       , true , tagUid, true );
     if ( getElementByName( "inclCleared"               ).checked) setPersistentTagParm( "inclCleared"               , true , tagUid, true );
     if ( getElementByName( "inclQuestionable"          ).checked) setPersistentTagParm( "inclQuestionable"          , true , tagUid, true );
     if ( getElementByName( "inclOnboardingStatus"      ).checked) setPersistentTagParm( "inclOnboardingStatus"      , true , tagUid, true );
     if ( getElementByName( "inclNotScheduled"          ).checked) setPersistentTagParm( "inclNotScheduled"          , true , tagUid, true );
     if ( getElementByName( "inclScheduled"             ).checked) setPersistentTagParm( "inclScheduled"             , true , tagUid, true );
     if ( getElementByName( "inclMisc"                  ).checked) setPersistentTagParm( "inclMisc"                  , true , tagUid, true );
     if ( getElementByName( "inclPausedSubscriptions"   ).checked) setPersistentTagParm( "inclPausedSubscriptions"   , true , tagUid, true );
     if ( getElementByName( "exclWridzInternal"         ).checked) setPersistentTagParm( "exclWridzInternal"         , true , tagUid, true );
     if ( getElementByName( "inclInactive60"            ).checked) setPersistentTagParm( "inclInactive60"            , true , tagUid, true );
     if ( getElementByName( "inclSignedUpBefore"        ).checked) setPersistentTagParm( "inclSignedUpBefore"        , true , tagUid, true );
     if ( getElementByName( "inclSignedUpAfter"         ).checked) setPersistentTagParm( "inclSignedUpAfter"         , true , tagUid, true );

      setPersistentTagParm( "signedUpBefore"            , getElementByName( "signedUpBefore"            ).value,   tagUid, true );
      setPersistentTagParm( "signedUpAfter"             , getElementByName( "signedUpAfter"             ).value,   tagUid, true );
      setPersistentTagParm( "onboardingDateBgn"         , getElementByName( "onboardingDateBgn"         ).value,   tagUid, true );
      setPersistentTagParm( "onboardingDateEnd"         , getElementByName( "onboardingDateEnd"         ).value,   tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }
   function ajaxEventList( ownerType, ownerId, page, count, containerRootId, viewId, busyIcon, viewName, tableId )
   {
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      document.getElementById( busyIcon ).style.display = "inline";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetEventList.jsp"
                      +"?ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&viewName="+viewName
                      +"&tableId="+tableId
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }



   function ajaxAddEvent( ownerType, ownerId, containerRootId, viewId, busyIcon, viewName, tableId )
   {
      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      var tableElement = document.getElementById( tableId );
      if ( tableElement != null )
      {
         var trElement = tableElement.insertRow( 0 );
         var containerId = createId();
         trElement.id = containerId;
      }

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetEvent.jsp"
                      +"?addEvent=true"
                      +"&ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&viewName="+viewName
                      +"&user="+getUserName()


      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function ajaxEvent( id, viewName, containerRootId, viewId, titleId, busyIcon )
   {
      var containerId = "";
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetEvent.jsp"
                      +"?id="+id
                      +"&viewName="+viewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function clearFollowUp( contactId )
   {
      addHistoryWithIcon( "clearFollowUp", 17, 8, contactId, getSysImages()+"/broom.png", "/images/broom-bw.png" )
   }

   function setResponseDue( contactId )
   {
      addHistoryWithIcon( "setResponseDue", 18, 8, contactId, getSysImages()+"/reddot.png", "/images/graydot.png" )
   }

   function verifyDeleteEvent( icon, eventId )
   {
      var origBG = $(icon).closest( "tr" ).css( "background-color" );
      $(icon).closest( "tr" ).css( "background-color", "yellow" );

      if ( confirm( "Confirm delete event" ))
      {
//       setBusy( busyIcon,"inline" );
         $(icon).closest( "tr" ).css( "background-color", "red" );
         var tr = $(icon).closest( "tr" );

         var ajaxRequest = getAjaxRequestObject();

         ajaxRequest.onreadystatechange = function() { removeEventRow( ajaxRequest, tr );} ;

         var serverCall = "/projectmanager/jsp/ajax/ajaxGetEvent.jsp"
                         +"?id="+eventId
                         +"&deleteEvent=true"
                         +"&user="+getUserName()

         ajaxRequest.open("GET", serverCall, true);
         ajaxRequest.send(null);
      }
      else
      {
         $(icon).closest( "tr" ).css( "background-color", origBG );
      }
   }

   function removeEventRow( ajaxRequest, tr )
   {
      tr.remove();
//    setBusy( busyIcon, "none" );
   }

   function searchEvents( tagUid )
   {
      forcePage1(tagUid);

      var dateTimeField = getElementByName( "searchEventDateBgn" );
      setTagParm( "beginTimestamp", dateTimeField.value, tagUid, true );

      var dateTimeField = getElementByName( "searchEventDateEnd" );
      setTagParm( "endTimestamp", dateTimeField.value, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function uploadFile( inputId, roData, rwData, editIcon, busyIcon, ownerType, ownerId, refreshSectionId, folderPath, copyTo, action, actionParm, context )
   {
//    console.log("uploadFile()");
//    console.log( "Context: " + context );
      if (typeof context == 'undefined' ) context = "cis";
      if (context == '' ) context = "cis";

      document.getElementById( busyIcon ).style.display = "inline-block";

      var ajaxRequest = getAjaxRequestObject();

      var files = document.getElementById(inputId).files;

      var formData = new FormData();
      for (var i = 0; i < files.length; i++)
      {
        var file = files[i];
        formData.append('file', file, file.name);

        if ( document.getElementById(copyTo) != null ) // if more than one file, just use the last one in the loop
        {
           document.getElementById(copyTo).value = file.name;
//         console.log( "uploadFile() copyTo: " + copyTo + " " + file.name );
        }
      }

      var replace = 'true';

//    if (document.getElementById( "repl"+inputId ).checked) replace = "true";



      formData.append("user",      ""+getUserName() );
      formData.append("ownerType", ownerType );
      formData.append("ownerId",   ownerId );
      formData.append("replace",   replace );
      formData.append("folderPath",folderPath );
      formData.append("action",    action );
      formData.append("objectClassID", "242" );  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
      formData.append("actionParm", actionParm );

      ajaxRequest.onreadystatechange = function()
                                       {
                                          if(ajaxRequest.readyState == 4)
                                          {
                                             handleAjaxRC( ajaxRequest );

                                             document.getElementById( busyIcon ).style.display = "none";

                                             // force a 'refresh' of containing section (initially used for payment section)
                                             if ( document.getElementById('section_refresh'+refreshSectionId ) != null )
                                             {
//                                              console.log( "section_refresh" + refreshSectionId );
                                                document.getElementById('section_refresh'+refreshSectionId).click();
                                             }
                                          }
                                       }

      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";


      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.send(formData);
   }

   function selectGalleryItem( tagUid, containerTagUid, value, itemId, tagName )
   {
//    console.log( "select: " + tagUid + " " + containerTagUid );

      var currSelectedTagUidElement = document.getElementById( "selected"+containerTagUid )
      if ( currSelectedTagUidElement != null )
      {
         currSelectedTagUid = currSelectedTagUidElement.value;
//       console.log( "curr " + currSelectedTagUid );
         var currSelectedItem = document.getElementById( "section_outer"+currSelectedTagUid );
      }

      if ( currSelectedItem != null )
      {
         currSelectedItem.className = "galleryItem";
      }

      // select new
      if ( tagUid != '' )
      {
         document.getElementById( "section_outer"+tagUid ).className = "galleryItemSelected";
      }
      document.getElementById( "selected"+containerTagUid ).value = tagUid;

      // set RW Input field and trigger onChange()
      var rwElement   = document.getElementById( containerTagUid );
      if ( rwElement != null )
      {
         rwElement.value = value;
         rwElement.valueId = itemId; // need to send the galleryItemId as well as name; create a new attribute on input field to hold it

         var event       = new Event('change');
         rwElement.dispatchEvent(event);
      }
   }

   function addToAlbum( tagUid, albumId, itemType, itemId, containerTagUid )
   {
      document.getElementById( 'section_busy'+containerTagUid ).style.display = "inline";
      var imageElement = getElementByName( "galleryItem_"+itemId+"_outer" );

//    console.log( "AddtoAlbum " + tagUid + " " + albumId + " " + itemType + " " + itemId + " " + containerTagUid );

      var borderClass = imageElement.className;

      var fn;
      if ( borderClass.indexOf( 'Selected' ) == -1 ) // classname doesn't contain "Selected". So not currently selected
      {
         imageElement.className = "galleryItemSelected";
         fn = "add";
      }
      else // currently selected -- deselect it
      {
         imageElement.className = "galleryItem"
         fn = "remove";
      }

      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp"
                      +"?table=GROUPMEMBERMAP"
                      +"&user="+getUserName()
                      +"&type=memberlist"
                      +"&fn="+fn
                      +"&ownerId="+albumId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&listItemType="+itemType
                      +"&listItemId="+itemId;

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function()
                                       {
                                          if(ajaxRequest.readyState == 4)
                                          {
                                             handleAjaxRC( ajaxRequest );
                                          }
                                       }
//      alert( serverCall );

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);

      setTimeout(function(){document.getElementById( 'section_busy'+containerTagUid ).style.display = "none";}, 500);
   }

   function magnifyView( aGalleryItemId )
   {
      tagUid = getTagUidFromName( "galleryItem_"+aGalleryItemId );
      document.getElementById('viewIcon'+tagUid+'_2').click();
      return(false);
   }

   function popUpImage( url )
   {
      var aWindow = window.open("", "Content", "width=600,height=400,titlebar=no,status=no,menubar=no,toolbar=no"); // no whitespace in options (??)

      var theBody = aWindow.document.getElementById('theBody');
      if ( theBody != null ) theBody.innerHTML = '';
      aWindow.document.write( "<body id='theBody'>");
      aWindow.document.write("<img style='width:100%' src='"+url+"' >" );
      aWindow.focus();
   }


   function deleteGalleryItem( aDeleteItemName )
   {
      var tagUid = getTagUidFromName( aDeleteItemName );
//    console.log( ">>>"+aDeleteItemName + " -- " + tagUid );
      document.getElementById(tagUid).click();
      return(false);
   }


   function ajaxGroupSelect( containerId, busyIcon, tagUid, ownerType, ownerId, type, value, query )
   {
      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/cis/jsp/ajax/ajaxGetGroupList.jsp"
                      +"?ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&user="+getUserName()
                      +"&type="+type
                      +"&value="+value
                      +"&query="+query
                      +"&sortOrder="+getTagParm( "sortOrder", tagUid )
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&viewName=select";

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function verifyDeleteGroupCategory( active, inactive )
   {
      if ( active + inactive > 0 )
      {
         var msg = "This category is referenced by: \n";
         if ( active   > 0 ) msg += "\n" + active + " active group(s); ";
         if ( inactive > 0 ) msg += "\n" + inactive + " inactive group(s); ";
         msg += "\n\nThe category cannot be removed while groups are referencing it.";
         alert( msg );
         return( false);
      }
      return(true);
   }

   function verifyDeleteGroup( members )
   {
      if ( members > 0 )
      {
         var msg = "This group contains: \n";
         msg += "\n" + members + " member(s); ";
         msg += "\n\nThe group cannot be deleted while it contains members.";
         alert( msg );
         return( false);
      }
      return(true);
   }

   function populateAvailableList( searchSelectElement, targetId )
   {
      var name  = searchSelectElement.value;
      name = name.substring( name.indexOf(")") + 1 );

      var personId = searchSelectElement.value;
      personId = personId.substring( 1, personId.indexOf(")") );

      var listElement = document.getElementById( targetId );
      listElement.innerHTML = "<option value="+personId+">"+name+"</option>";
      listElement.options.selectedIndex=0;
   }


   function addHistoryWithIcon( idPrefix, eventType, ownerType, ownerId, enabledImage, disabledImage )
   {
      actionElement = document.getElementById( idPrefix + ownerId );
      if( actionElement.src.indexOf( enabledImage ) > 0 )
      {
         addHistory( ownerType, ownerId, eventType, "---", "---", "---" )
         actionElement.src = disabledImage;
      }
   }

   function addHistoryFromForm( ownerType, ownerId, eventTypeId, noteTextId, tableId, busyIcon )
   {
      eventTypeElement = document.getElementById( eventTypeId );
      noteTextElement  = document.getElementById( noteTextId );

      addHistory( ownerType, ownerId, eventTypeElement.value , noteTextElement.value , tableId, busyIcon )

      noteTextElement.value = "";
   }

   function addHistory( ownerType, ownerId, eventType, noteText, tableId, busyIcon )
   {
      setBusy( busyIcon, "inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertHistoryRow( ajaxRequest, tableId, busyIcon );} ;

      var serverCall = "/cis/jsp/operator/ajaxUpdateContactInfo.jsp"
                      +"?action=addHistory"
                      +"&ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&eventType="+eventType
                      +"&notetext="+noteText
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function insertHistoryRow( ajaxRequest, tableId, busyIcon )
   {
      if(ajaxRequest.readyState == 4)
      {
         var tableElement = document.getElementById( tableId );
         if ( tableElement != null )
         {
            var trElement = tableElement.insertRow( 1 );
            trElement.innerHTML = ajaxRequest.responseText;
         }
         setBusy( busyIcon, "none" );
      }
   }

   function getEmailExpandCollapse( elementId, image, indexKey, id )
   {
      expandIt( elementId, image );

      var ajaxRequest = getAjaxRequestObject();

      var mailContainer = document.getElementById( elementId );
      ajaxRequest.onreadystatechange = function() { displayMailContents( ajaxRequest, mailContainer );} ;

      ajaxRequest.open("GET", "/cis/jsp/ajax/ajaxGetMailMessage.jsp?indexKey="+indexKey+"&id="+id, true);
      ajaxRequest.send(null);
   }

   function displayMailContents( ajaxRequest, mailContainer )
   {
      if(ajaxRequest.readyState == 4)
      {
         mailContainer.innerHTML = ajaxRequest.responseText;
      }
   }

   function expandIt( El, whichIm )
   {
      whichEl = document.getElementById( El );
      if (whichEl.style.display == "none")
      {
         whichEl.style.display = "block";
         whichIm.src = getSysImages()+"/minus.gif";
      }
      else
      {
         whichEl.style.display = "none";
         whichIm.src = getSysImages()+"/plus.gif";
      }
   }

   function searchHistory( tagUid )
   {
      forcePage1(tagUid);

      var dateTimeField = getElementByName( "searchHistoryDateTime" );
      setTagParm( "beginTimestamp", localToUtc( dateTimeField.value ), tagUid, true );

      var searchBgnField = getElementByName( "searchHistoryBgn" );
      var searchBgn = searchBgnField.value;
      if ( isNaN( searchBgn ) ) searchBgn = -2;
      setTagParm( "searchBgn", searchBgn, tagUid, true );

      var spanningField = getElementByName( "searchHistorySpan" );
      var spanning = spanningField.value;
      if ( isNaN( spanning ) ) spanning = 30;
      setTagParm( "value", spanning, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function searchHistoryBgnEnd( tagUid )
   {
      forcePage1(tagUid);

      var bgnDateField = getElementByName( "searchHistoryBgnDate" );
      setTagParm( "beginTimestamp", localToUtc( bgnDateField.value ), tagUid, true );

      var endDateField = getElementByName( "searchHistoryEndDate" );
      setTagParm( "endTimestamp", localToUtc( endDateField.value ), tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function clickThru( url, ownerType, ownerId, eventType, description )
   {
      // create a new history entry, then go to url on callback
      sendUpdateAPI( 1,             //  apiVersion,
                     url,           //  callbackParameters,
                     "",            //  col,
                     -1,            //  containerId,
                     description,   //  dataValue,
                     -1,            //  dataValueId,
                     -1,            //  objId,     (-1 == 'create new entry' )
                     -1,            //  objSubId1,
                     -1,            //  objSubId2,
                     eventType,     //  objType,
                     ownerId,       //  ownerId,
                     ownerType,     //  ownerType,
                     "",            //  refreshSectionIds,
                     "HISTORY",     //  table,
                     "",            //  tagUid,
                     "goToURL",     //  updateCallbackFn,
                     ""             //  dataReq
                    )
   }

   function selectAllOptionsHistory( tagUid )
   {
      getElementByName( "inclAlerts"      ).checked = true;
      getElementByName( "inclEmail"       ).checked = true;
      getElementByName( "inclEvents"      ).checked = true;
      getElementByName( "inclFinancial"   ).checked = true;
      getElementByName( "inclGeneral"     ).checked = true;
      getElementByName( "inclJSON"        ).checked = true;
      getElementByName( "inclMessages"    ).checked = true;
      getElementByName( "inclPageAccess"  ).checked = true;
      getElementByName( "inclProfile"     ).checked = true;
      getElementByName( "inclStatus"      ).checked = true;
      getElementByName( "inclTrip"        ).checked = true;
      getElementByName( "inclUpdate"      ).checked = true;
      getElementByName( "inclDebug"       ).checked = true;
   }

   function clearAllOptionsHistory()
   {
      getElementByName( "inclAlerts"      ).checked = false;
      getElementByName( "inclEmail"       ).checked = false;
      getElementByName( "inclEvents"      ).checked = false;
      getElementByName( "inclFinancial"   ).checked = false;
      getElementByName( "inclGeneral"     ).checked = false;
      getElementByName( "inclJSON"        ).checked = false;
      getElementByName( "inclMessages"    ).checked = false;
      getElementByName( "inclPageAccess"  ).checked = false;
      getElementByName( "inclProfile"     ).checked = false;
      getElementByName( "inclStatus"      ).checked = false;
      getElementByName( "inclTrip"        ).checked = false;
      getElementByName( "inclUpdate"      ).checked = false;
      getElementByName( "inclDebug"       ).checked = false;
   }

   function searchWridzHistory( tagUid )
   {
      forcePage1(tagUid);

      setTagParm( "inclAlerts"             , getElementByName( "inclAlerts"                ).checked, tagUid, true );
      setTagParm( "inclEmail"              , getElementByName( "inclEmail"                 ).checked, tagUid, true );
      setTagParm( "inclEvents"             , getElementByName( "inclEvents"                ).checked, tagUid, true );
      setTagParm( "inclFinancial"          , getElementByName( "inclFinancial"             ).checked, tagUid, true );
      setTagParm( "inclGeneral"            , getElementByName( "inclGeneral"               ).checked, tagUid, true );
      setTagParm( "inclJSON"               , getElementByName( "inclJSON"                  ).checked, tagUid, true );
      setTagParm( "inclMessages"           , getElementByName( "inclMessages"              ).checked, tagUid, true );
      setTagParm( "inclPageAccess"         , getElementByName( "inclPageAccess"            ).checked, tagUid, true );
      setTagParm( "inclProfile"            , getElementByName( "inclProfile"               ).checked, tagUid, true );
      setTagParm( "inclStatus"             , getElementByName( "inclStatus"                ).checked, tagUid, true );
      setTagParm( "inclTrip"               , getElementByName( "inclTrip"                  ).checked, tagUid, true );
      setTagParm( "inclUpdate"             , getElementByName( "inclUpdate"                ).checked, tagUid, true );
      setTagParm( "inclDebug"              , getElementByName( "inclDebug"                 ).checked, tagUid, true );

      setTagParm( "sortAscending"          , getElementByName( "sortAscending"             ).checked, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function addHistory2( anElement, ownerType, ownerId, eventType, noteText )
   {
     var tagUid = anElement.id;
     var busyIcon = anElement.id+"Busy";
     setBusy( busyIcon, "inline" );

     var ajaxRequest = getAjaxRequestObject();
     var dataObj =  "HistoryItem";
     var locatorId = ownerId;
     var locatorType = ownerType;
     var locatorRelationship = "owner";
     var locatorRecordType = eventType;
     var restValue1 = getUserName();
     var restValue2 = noteText;
     var restValue3 = "Landing Page Registration";

     url = "/"+dataObj+"/"+locatorId+"/"+locatorType+"/"+locatorRelationship+"/"+locatorRecordType+"/"+restValue1+"/"+restValue2+"/"+restValue3;

     var dataReq = "[";
     dataReq += '"*PageBasic"'
     dataReq += "]";

     ajaxRequest.open("PUT", url, true);
     ajaxRequest.setRequestHeader( "Content-type",    "application/x-www-form-urlencoded" );
     ajaxRequest.setRequestHeader( "authorization",   "Session"                   );
     ajaxRequest.setRequestHeader( "x_identifier",    "HistoryREST"                  );
     ajaxRequest.setRequestHeader( "x_reqUid",        createId()                  );
     ajaxRequest.setRequestHeader( "x_timeStamp",     localToUtc( new Date(), "YYYY-MM-DD-hh:mm:ss.sss" ));
     ajaxRequest.setRequestHeader( "x_logLevel",      "1200"                      );
     ajaxRequest.setRequestHeader( "x_ipAddress",     "192.168.1.1"               );
     ajaxRequest.setRequestHeader( "x_appInstanceId", "28005"                     );
     ajaxRequest.setRequestHeader( "x_dataReq",       dataReq                     );
     ajaxRequest.setRequestHeader( "x_tagUid",        tagUid                      );
     ajaxRequest.setRequestHeader( "x_requestJson",   JSON.stringify(getParmsAsJson(tagUid)) );
     ajaxRequest.setRequestHeader( "x_timezone",      Intl.DateTimeFormat().resolvedOptions().timeZone );
     ajaxRequest.send();
     setBusy( busyIcon, "none" );
     createAlert( 1, "Your email address has been registered." );
  }
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
var latitude = "";
var longitude = "";

function waitForLocation()
{
}

function setLocation()
{
}

   function getLogExpandCollapse( elementId, image, ds )
   {
      expandTableRow( elementId, image, ds );
   }

   function expandTableRow( El, whichIm, ds )
   {
      whichEl = document.getElementById( El );
      if (whichEl.style.display == "none")
      {
         whichEl.style.display = "";
         whichIm.src = getSysImages()+"/minus.gif";

         // list is not initially loaded.
         // need to locate the listView icon for the list section and click it to do initial loading
         var logEntryListSection  = getElementByName( El );
         id = logEntryListSection.id;
         setTagParm( "ds", ds, id, true );
         var listViewIconName = "viewIcon" + id + "_1";
         console.log( "id " + id + " ds " + ds + " El " + El + "listViewIconName " + listViewIconName );

         var listViewIcon = document.getElementById( listViewIconName );
         listViewIcon.click();
      }
      else
      {
         whichEl.style.display = "none";
         whichIm.src = getSysImages()+"/plus.gif";
      }
   }

   function searchLogs( tagUid )
   {
      forcePage1(tagUid);

      var dateTimeField = getElementByName( "searchLogDateTime" );
      setTagParm( "beginTimestamp", localToUtc( dateTimeField.value ), tagUid, true );

      var searchBgnField = getElementByName( "searchBgn" );
      var searchBgn = searchBgnField.value;
      if ( isNaN( searchBgn ) ) searchBgn = -2;
      setTagParm( "searchBgn", searchBgn, tagUid, true );

      var spanningField = getElementByName( "searchSpan" );
      var spanning = spanningField.value;
      if ( isNaN( spanning ) ) spanning = 30;
      setTagParm( "value", spanning, tagUid, true );

      var searchTripIdField = getElementByName( "searchTripId" );
      var searchTripId = searchTripIdField.value;
      if ( isNaN( searchTripId ) ) searchTripId = -1;
      setTagParm( "searchTripId", searchTripId, tagUid, true );

      var searchPassengerIdField = getElementByName( "searchPassengerId" );
      var searchPassengerId = searchPassengerIdField.valueId;        //if suggest result
      if ( isNaN( searchPassengerId ) ) searchPassengerId = searchPassengerIdField.value; // if direct numeric entry
      setTagParm( "searchPassengerId", searchPassengerId, tagUid, true );

      var searchDriverIdField = getElementByName( "searchDriverId" );
      var searchDriverId = searchDriverIdField.valueId;        //if suggest result
      if ( isNaN( searchDriverId ) ) searchDriverId = searchDriverIdField.value; // if direct numeric entry
      setTagParm( "searchDriverId", searchDriverId, tagUid, true );

      var searchUserPersonIdField = getElementByName( "searchUserPersonId" );
      var searchUserPersonId = searchUserPersonIdField.valueId;        //if suggest result
      if ( isNaN( searchUserPersonId ) ) searchUserPersonId = searchUserPersonIdField.value; // if direct numeric entry
      setTagParm( "searchUserPersonId", searchUserPersonId, tagUid, true );

      var searchAppInstanceIdField = getElementByName( "searchAppInstanceId" );
      var searchAppInstanceId = searchAppInstanceIdField.value;
      if ( isNaN( searchAppInstanceId ) ) searchAppInstanceId = -1;
      setTagParm( "searchAppInstanceId", searchAppInstanceId, tagUid, true );

      var containsTypeField = getElementByName( "containsType" );
      var containsType = containsTypeField.value;
      setTagParm( "containsType", containsType, tagUid, true );

      var searchContentField = getElementByName( "searchContent" );
      var searchContent = searchContentField.value;
      setTagParm( "searchContent", searchContent, tagUid, true );

      var searchLoginIdField = getElementByName( "searchLoginId" );
      if ( typeof searchLoginIdField.valueId == 'undefined' ) searchLoginIdField.valueId = "";
      var searchLoginId = searchLoginIdField.valueId;
      setTagParm( "searchLoginId", searchLoginId, tagUid, true );

      var searchServerField = getElementByName( "searchServer" );
      var searchServer = searchServerField.value;
      setTagParm( "searchServer", searchServer, tagUid, true );

      var omitPinsField = getElementByName( "omitPins" );
      var omitPins = omitPinsField.checked;
      setTagParm( "omitPins", omitPins, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function searchSingleUIDLog( tagUid )
   {
      forcePage1(tagUid);
      var logLevelHighThresholdField = getElementByName( "logLevelHighThreshold" + tagUid );
      var logLevelHighThreshold = logLevelHighThresholdField.value;
      setTagParm( "logLevelHighThreshold", logLevelHighThreshold, tagUid, true );

      var logLevelLowThresholdField = getElementByName( "logLevelLowThreshold" + tagUid );
      var logLevelLowThreshold = logLevelLowThresholdField.value;
      setTagParm( "logLevelLowThreshold", logLevelLowThreshold, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }


   function popupLogEntryStackTrace( anId, anElement, dynJdbc, day)
   {
      xhrPopup( "/stacktrace/"+anId+"/0/0/0/"+day,
                 anElement,
                 "StackTrace",
                 '["stackTrace"]',
                 "stackTrace",
                 dynJdbc
               );
   }

   function popupLogEntryContent( anId, anElement, dynJdbc)
   {
      xhrPopup( "/largedata/"+anId,
                anElement,
                "Content",
                '["content"]',
                "content",
                dynJdbc
              );
   }


   function ajaxRoleListSet( ownerId, containerRootId, viewId, busyIcon, viewName, viewDisplay )
   {
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view
      var thisViewName = getThisViewName( viewName, viewId, containerRootId, viewDisplay );

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      document.getElementById( busyIcon ).style.display = "inline";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/idmanager/jsp/ajax/ajaxGetRoleListSet.jsp"
                      +"?ownerId="+ownerId
                      +"&viewName="+thisViewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   var maps = new Object();
   var mapBounds = new Object();
   var dragInProgress = false;

   function saveCoordinates( objType, objId, polygonCoordinates )
   {
      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { coordinatesUpdateResponse( ajaxRequest );} ;
      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      var coordinates = "";
      for (var i =0; i < polygonCoordinates.getLength(); i++)
      {
        var xy = polygonCoordinates.getAt(i);
        coordinates += "{"+ xy.lat() + ',' + xy.lng() +"};";
      }
      var params     = "table=GeoLoc"
                      +"&user="+getUserName()
                      +"&col=Coordinates"
                      +"&objType="+objType
                      +"&objId="+objId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&value="+coordinates;

      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function coordinatesUpdateResponse(ajaxRequest )
   {
      if(ajaxRequest.readyState == 4)
      {
         handleAjaxRC( ajaxRequest );
      }
   }

   function createNewRegionPolygon( objType, objId, point, refreshSectionId )
   {
//    console.log( "createNewRegionPolygon " + point.lat() + " " + point.lng() );
      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { createNewRegionResponse( ajaxRequest, refreshSectionId );} ;
      var coordinate = "{"+ point.lat() + ',' + point.lng() +"};";
      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      var params     = "table=Region"
                      +"&user="+getUserName()
                      +"&col=CREATEPOLYGON"
                      +"&objType="+objType
                      +"&objId="+objId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&value="+coordinate;

      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function createNewRegionResponse(ajaxRequest, refreshSectionId )
   {
      if(ajaxRequest.readyState == 4)
      {
         handleAjaxRC( ajaxRequest );
//       console.log( 'refreshSectionId ' + refreshSectionId );
         document.getElementById( 'section_refresh'+refreshSectionId ).click();
      }
   }

   function setLabelPosition( objType, objId, point, refreshSectionId )
   {
//    console.log( "setLabelPositionPolygon " + point.lat() + " " + point.lng() );
      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { setLabelPositionResponse( ajaxRequest, refreshSectionId );} ;
      var coordinate = "{"+ point.lat() + ',' + point.lng() +"};";
      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      var params     = "table=Region"
                      +"&user="+getUserName()
                      +"&col=SETLABELPOSITION"
                      +"&objType="+objType
                      +"&objId="+objId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&value="+coordinate;

      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function setLabelPositionResponse(ajaxRequest, refreshSectionId )
   {
      if(ajaxRequest.readyState == 4)
      {
         handleAjaxRC( ajaxRequest );
//       console.log( 'refreshSectionId ' + refreshSectionId );
         document.getElementById( 'section_refresh'+refreshSectionId ).click();
      }
   }

   function setCountyOwner( point, objType, objId, mapTagUid  )
   {
      var marker = new google.maps.Marker(
      {
        position: {
          lat: point.lat(),
          lng: point.lng()
        },
        map: maps[mapTagUid],
        icon:
        {
           labelOrigin: new google.maps.Point(0, 0),
           scaledSize: new google.maps.Size(30, 30),
//         url: "http://maps.google.com/mapfiles/ms/icons/red.png"
        }
      });
      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"      ] =  "Region";
      reqJson[ "objType"    ] =  objType;
      reqJson[ "objId"      ] =  objId;
      reqJson[ "col"        ] =  "SETCOUNTYOWNER";
      reqJson[ "latitude"   ] =  ""+ point.lat();
      reqJson[ "longitude"  ] =  ""+ point.lng();

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 "",
                 "",
                 "",
                 "processCopyTo,processReturnToRO,processUpdateCallBack"
               );
   }
function toggleSubMenu(parentId) {
  tagUid = getTagUidFromName("menu_" + parentId);
  document.getElementById("nextViewIcon" + tagUid).click();
  return false;
}

/* TODO IMPLIMENT A SOLID MOUSEOVER MOUSELEAVE EVENT */

// function openSubMenu(parentId) {
//    const tagUid = getTagUidFromName( "menu_" + parentId );
//    document.getElementById( "viewIcon" + tagUid + "_1").click();
// }

// function closeSubMenu(parentId) {
//    const tagUid = getTagUidFromName( "menu_" + parentId );
//    document.getElementById( "viewIcon" + tagUid + "_0").click();
// }

// document.getElementByClassName('menu_1').addEventListener('mouseEnter', () => {
//    openSubMenu(parentId);
// });

// Drop down closer on menu item click
function createCloser() {
  var check1 = document.getElementById("officeCheck 4").checked;
  var check2 = document.getElementById("officeCheck 6").checked;

  if (check2 && check1) {
    document.getElementById("officeCheck 2").checked = false;
    document.getElementById("officeCheck 4").checked = false;
  } else if (check1) {
    document.getElementById("officeCheck 2").checked = false;
  } else if (check2) {
    document.getElementById("officeCheck 4").checked = false;
  } else {
    return;
  }
}
  function merchantAcctCreatorFormValidate( aFormId, ownerType, tagUid )
  {
     errCount = 0;  // reset count

     var aForm = document.getElementById( aFormId );
     doValidate( aForm, tagUid + "_nameOnAccount"       );
     doValidate( aForm, tagUid + "_accountNumber"       );
     doValidate( aForm, tagUid + "_accountType"         );
     doValidate( aForm, tagUid + "_accountOwnershipType");
     doValidate( aForm, tagUid + "_bankName"            );
     doValidate( aForm, tagUid + "_routingNumber"       );
     doValidate( aForm, tagUid + "_taxIdentifier"       );
     doValidate( aForm, tagUid + "_propayTsCs"          );
     if ( ownerType == 8 )
     {
        doValidate( aForm, tagUid + "_ssn"              );
        doValidate( aForm, tagUid + "_uniqueEmailAddress" );
        doValidate( aForm, tagUid + "_accountUsage" );
        doValidate( aForm, tagUid + "_dba"                 );
        doValidate( aForm, tagUid + "_primaryPerson"       );
        doValidate( aForm, tagUid + "_birthDate"           );
     }

     if ( errCount > 0 )
     {
        createAlert(3, "Please correct the " + errCount + " error(s) in the form to continue" );
        return(false);
     }
     return(true);
  }

  function createMerchantProfile(tagUid, bankAccountId, ownerType, ownerId)
  {
      var url = "/cis/JWMBOS";

      // neither ssn or taxIdentifier is saved in the db... get them from the form and pass them in
      // all other data required for gateway to create a merchant is stored in db, accessed by bankAccount record id value

      var reqJson  = {};
      if ( ownerType == 8 )
      {
         reqJson[ "table"              ] =  "CONTACT";
         reqJson[ "ssn"                ] =  getValueByName( tagUid + "_ssn" );
         reqJson[ "uniqueEmailAddress" ] =  getValueByName( tagUid + "_uniqueEmailAddress" );
         reqJson[ "primaryPersonId"    ] =  getValueByName( tagUid + "_primaryPerson" );
      }
      else
      {
         reqJson[ "table"         ] =  "WRIDZPERSONEXT";
      }
      reqJson[ "col"           ] =  "CREATEMERCHANTACCOUNT";
      reqJson[ "identifier"    ] =  "CreateSubMerchant";
      reqJson[ "taxIndentifier"] =  getValueByName( tagUid + "_taxIdentifier" );
      reqJson[ "bankAccountId" ] =  Number( bankAccountId );
      reqJson[ "objType"       ] =  Number( ownerType );
      reqJson[ "objId"         ] =  Number( ownerId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 tagUid,
                 tagUid,
                 "",
                 ""
               );
   }

  function payeeAccountFormValidate( aFormId, acctGatewayMapId, tagUid )
  {
     return( true ); //################################################################################

     errCount = 0;  // reset count

     var aForm = document.getElementById( aFormId );
     doValidate( aForm, tagUid + "_nameOnAccount"       );
     doValidate( aForm, tagUid + "_accountNumber"       );
     doValidate( aForm, tagUid + "_accountType"         );
     doValidate( aForm, tagUid + "_accountOwnershipType");
     doValidate( aForm, tagUid + "_bankName"            );
     doValidate( aForm, tagUid + "_routingNumber"       );
     doValidate( aForm, tagUid + "_taxIdentifier"       );
     doValidate( aForm, tagUid + "_propayTsCs"          );
     if ( ownerType == 8 )
     {
        doValidate( aForm, tagUid + "_ssn"              );
        doValidate( aForm, tagUid + "_uniqueEmailAddress" );
        doValidate( aForm, tagUid + "_accountUsage" );
        doValidate( aForm, tagUid + "_dba"                 );
        doValidate( aForm, tagUid + "_primaryPerson"       );
        doValidate( aForm, tagUid + "_birthDate"           );
     }

     if ( errCount > 0 )
     {
        createAlert(3, "Please correct the " + errCount + " error(s) in the form to continue" );
        return(false);
     }
     return(true);
  }

  function validateMerchantForm( aForm, accountType )
  {
     errCount = 0;  // reset count

     if ( accountType == 1 )
     {
        doValidate( aForm, "lastName"       );
        doValidate( aForm, "firstName"       );
        doValidate( aForm, "dateOfBirth"       );
     }
     else // business account (types 3 and 4)
     {
        doValidate( aForm, "llcName"       );
        doValidate( aForm, "primaryPerson" );
     }
     doValidate( aForm, "addressLine1"       );
     doValidate( aForm, "city"       );
     doValidate( aForm, "state"       );
     doValidate( aForm, "postalcode"       );
     doValidate( aForm, "emailAddress"       );
     doValidate( aForm, "phoneNumber"       );
     doValidate( aForm, "taxIdentifier"       );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     return(true);
  }

  function createPayeeAccount( aForm, accountType, acctGatewayMapId, buttonTagUid, refreshSectionId, ownerId )
  {
     // most parameters are active save to db... these two are not stored in db
     var reqJson = {};
     reqJson[ "taxIdentifier" ] = getElementFromForm( aForm, "taxIdentifier" ).value;
     if ( accountType != 1 ) reqJson[ "primaryPerson" ] = getElementFromForm( aForm, "primaryPerson" ).value;

     var xhrData = {};
     xhrData[ "containerId"         ] =  buttonTagUid;
     xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "createPayeeAccount";
     restData[ "identifier"         ] =  "createPayeeAccount";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[  "locatorRecordType"         ] =  "0";
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function createWalletAccount( acctGatewayMapId, buttonTagUid, refreshSectionId )
  {
     var reqJson = {};
     var xhrData = {};
     xhrData[ "containerId"         ] =  buttonTagUid;
     xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "createWalletAccount";
     restData[ "identifier"         ] =  "createWalletAccount";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[  "locatorRecordType"         ] =  "0";
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function verifyBankAccount( popupUrl, tagUid )
  {
     var respJson = {};  // dummy up a respJson shell for the popup method
     respJson[ "popupUrl" ] = popupUrl;
     xhrDisplayPopupUrl( respJson, tagUid )
  }

  function linkBankAccount( acctGatewayMapId, refreshSectionId )
  {
     var reqJson = {};

     var xhrData = {};
     xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "linkBankAccount";
     restData[ "identifier"         ] =  "linkBankAccount";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[  "locatorRecordType"         ] =  "0";
     restData[ "tagUid"             ] =  refreshSectionId;
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function enableCashOutButton( inputElement, id, tagUid, walletBalance )
  {
     var availableWalletBalance = walletBalance - 1.0;

     var buttonElement = getElementByName( "cashOutButton_"+id );
     var buttonRWDivElement = document.getElementById( buttonElement.id+"RW" );
     var regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

     buttonRWDivElement.style.opacity = 0.4;
     buttonElement.disabled = true;

     if ( inputElement.value == '' ) return;

     if ( !regex.test(inputElement.value) )
     {
        alert( "$"+inputElement.value + " is not a valid currency value" );
        return;
     }
     if ( Number(inputElement.value ) > availableWalletBalance )
     {
        alert( "$"+inputElement.value + " is greater than your current available wallet balance of $"+availableWalletBalance+", which is $1.00 less than your total wallet balance of $"+walletBalance+". Wridz is working to remedy this situation.  Please enter a value equal to or less than $" +availableWalletBalance+".");
        return;
     }
     buttonRWDivElement.style.opacity = 1.0;
     buttonElement.disabled = false;
  }

  function cashOut( acctGatewayMapId, id, tagUid )
  {
     var cashOutAmount = getElementByName( "cashOutAmount_"+id )
     var reqJson = {};

     var xhrData = {};
     xhrData[ "refreshSectionIds"   ] =  tagUid;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "cashOut";
     restData[ "identifier"         ] =  "cashOut";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[ "locatorRecordType"  ] =  "0";
     restData[ "value1"             ] =  id;
     restData[ "value2"             ] =  cashOutAmount.value;
     restData[ "tagUid"             ] =  tagUid;
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }
   function sendBatchPushNotifications( tagUid )
   {
//                 local.wridz.com/personlist/BatchMail/23             locatorId (WF)
//                                                     /64             locatorType (region)
//                                                     /11             locatorRelationship
//                                                     /0              RecordType
//                                                     /InSignUpState  data            1
//                                                     /3              filter value    2
//                                                     /19                             3
//                                                     /1                              4
//                                                     /simulate                       5
//                                                     /fromUser                       6

      var locatorElement            = getElementByName( "locator" + tagUid );
      var qualifierElement          = getElementByName( "qualifier" + tagUid );
      if (locatorElement.value == -1 )
      {
         alert( "Region Must Be Specified" );
         return(false);
      }
      if (qualifierElement.value == -1 )
      {
         alert( "Recipient Qualifier Must Be Specified" );
         return(false);
      }
      var titleElement              = getElementByName( "title" + tagUid );
      var bodyElement               = getElementByName( "body" + tagUid );
      var randomTemplateIdElement   = getElementByName( "randomTemplateId" + tagUid );

      var locatorParts              = locatorElement.value.split( "/" );
      var qualifierParts            = qualifierElement.value.split( "/" );

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      var reqJson = {};
      reqJson[ "title"               ] =  titleElement.value;
      reqJson[ "body"                ] =  bodyElement.value;
      if ( reqJson[ "title" ] == "" )
      {
         alert( "Title cannot be blank" );
         return(false);
      }
      if ( reqJson[ "title" ].length > 50 )
      {
         alert( "Maximum of 50 characters allowed in title" );
         return(false);
      }
      if ( reqJson[ "body" ] == "" )
      {
         alert( "Body cannot be blank" );
         return(false);
      }
      if ( reqJson[ "body" ].length > 350 )
      {
         alert( "Maximum of 350 characters allowed in body" );
         return(false);
      }

      var restData = {};
      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "personlist";
      restData[ "command"            ] =  "BatchPushNotification";
      restData[ "identifier"         ] =  "BatchPushNotification/"+locatorElement.value+"/"+qualifierElement.value;
      restData[ "locatorId"          ] =  locatorParts[0];
      restData[ "locatorRecordType"  ] =  locatorParts[1];
      restData[ "locatorRelationship"] =  locatorParts[2];
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "value1"             ] =  qualifierParts[0];
      restData[ "value2"             ] =  ( qualifierParts.length > 1 ? qualifierParts[1] : "-" );
      restData[ "value3"             ] =  randomTemplateIdElement.value;
      restData[ "value4"             ] =  "0"
      restData[ "value5"             ] =  "simulate"
      restData[ "value6"             ] =  "0";
      restData[ "tagUid"             ] =  tagUid;
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  reqJson;
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      alert( "Your batch push notification has NOT yet been sent to the recipients.  A PROOF email has been sent to Wridz administration for verification and approval. The admin will complete the sending process or contact you for changes." );
   }
   function pageSetPrev( selectPrev, tagUid )
   {
      document.getElementById('page'+tagUid).value=selectPrev;
      document.getElementById('section_refresh'+tagUid).click();
   }

   function pageSetNext( selectNext, tagUid )
   {
      var aForm = document.getElementById( "form"+tagUid );
      if ( aForm != null )
      {
         setTagParm( 'override', "false", tagUid, true );     // onboarding admins can override missing requirements to move to next page in wizard

         if (( document.getElementById("override") != null )
           && ( document.getElementById("override").checked == true ) )
         {
            setTagParm( 'override', "true", tagUid, true );
         }
         else
         {
            errCount = 0;  // reset count
            validatePageSetPage(aForm);
            if (errCount > 0 ) return( false );
         }
      }
      document.getElementById('page'+tagUid).value=selectNext;
      document.getElementById('section_refresh'+tagUid).click();
   }

   function selectPage( pageNum, tagUid )
   {
      document.getElementById('page'+tagUid).value=pageNum;
      document.getElementById('section_refresh'+tagUid).click();
   }

   function confirmOnly( aName )
   {
      doValidate( null, aName );
      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
      }
   }


   function validatePageSetPage( aForm )
   {

      errCount = 0;  // reset count
      console.log( "aForm.name: " + aForm.name );

      // Signup Wizard ==============================================================================================

      if ( aForm.name == "SubscribeToRegion" )
      {
         var region = $("input[type='radio'][name='regionSelection']:checked").val();
         var theRegion = $("input[type='radio'][name='regionSelection']:checked").attr( "reference");
         if ( !isNaN( region ) )
         {

            if ( confirm( "You have selected to drive in the " + theRegion + " region.  By confirming below you are confirming that are able to drive and accept trips in the " + theRegion + " region as defined on the map.  Selecting " + theRegion + " does  NOT permit you to accept trips in any other region other than " + theRegion + ".  Background check fees and onboarding fees will not be refunded if you are unable or unwilling to drive in " + theRegion + ".\n\nI confirm and acknowledge that I am able and willing to drive for Wridz in " + theRegion + ":"))
            {
               return; // numeric region id... ok
            }
            else
            {
               errCount = 1;
               createAlert( 3, "", "You must confirm that you are willing and able to drive in " + theRegion + " to continue" );
            }
         }
         else
         {
            errCount = 1;
            createAlert( 3, "", "You must select a primary region to continue ["+region+"] ["+theRegion+"]" );
         }
      }

      if ( aForm.name == "BackgroundCheck" )
      {
         if ( getValueByName( "backgroundCheckStatus" ) == "Clear" ) return;

         errCount = 1;
         if ( getValueByName( "backgroundCheckStatus" ) == "Not Started" )
         {
            createAlert( 3, "", "Please click the button below to begin your background check process." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Pending" )
         {
            createAlert( 3, "", "Your background check application is not complete. You should have received an email from our background check company when you began the background check process.  That email contains a link that may be used to complete the application." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Application Completed, Awaiting Results" )
         {
            createAlert( 3, "", "Your background check is currently in progress.  You will receive an email from our background check company and an email from Wridz notifying you that you may return to the driver signup process and proceed." );
         }
         else
         {
            createAlert( 3, "", "There seems to be an issue with your background check results.  Please review emails from our background check company. But DO NOT contact our background check company.  You may open a ticket with Wridz using the Contact Us form on the menu above to discuss the results." );
         }
      }

      if ( aForm.name == "BackgroundCheckCheckr" )
      {
         if ( getValueByName( "backgroundCheckStatus" ) == "Clear" ) return;
         if ( getValueByName( "backgroundCheckStatus" ) == "Clear (With Documentation)" ) return;

         errCount = 1;
         if ( getValueByName( "backgroundCheckStatus" ) == "Not Started" )
         {
            createAlert( 3, "", "Please click the button below to begin your background check process." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Pending" )
         {
            createAlert( 3, "", "Your background check application is not complete. You should have received an email from Checkr when you began the background check process.  That email contains a link that may be used to complete the application." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Application Completed, Awaiting Results" )
         {
            createAlert( 3, "", "Your background check is currently in progress.  You will receive an email from Checkr and an email from Wridz notifying you that you may return to the driver signup process and proceed." );
         }
         else
         {
            createAlert( 3, "", "There seems to be an issue with your background check results.  Please review emails from Checkr. You may discuss the results with Checkr."   );
         }
      }

      if ( aForm.name == "PersonalInfo" )
      {
         doValidate( aForm, "firstName"       );
         doValidate( aForm, "lastName"     );
         doValidate( aForm, "phone"     );
         doValidate( aForm, "birthDate"     );
         doValidate( aForm, "addressLine1"     );
         doValidate( aForm, "city"     );
         doValidate( aForm, "state"     );
         doValidate( aForm, "zip"     );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "UploadProfilePicture" )
      {
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "UploadDriversLicensePhoto" )
      {
         doValidate( aForm, "driverLicenseExpDate" );
         doValidate( aForm, "driversLicenseState" );
         doValidate( aForm, "driversLicenseNum" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
            return;
         }

         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "VehicleInfo" )
      {
         doValidateIfExist( "year"                  );
         doValidateIfExist( "make"                  );
         doValidateIfExist( "model"                 );
         doValidateIfExist( "vin"                   );
         doValidateIfExist( "color"                 );
         doValidateIfExist( "licenseplate"          );
         doValidateIfExist( "registrationExp");
         doValidateIfExist( "licenseplatestate"     );
         doValidateIfExist( "inspectionExp"  );

         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
            return;
         }

         aGalleryCountElement = getElementByName( "inspectionDocuments_galleryContainerCount" );
         if ( aGalleryCountElement != "" ) // doesn't exist... not required
         {
            if ( aGalleryCountElement.value == 0 )
            {
               errCount = 1;
               createAlert( 3, "", "You must upload at least one inspection report into the gallery to continue.  Click to upload files from the preview area to the gallery." );
               return;
            }
         }

         aGalleryCountElement = getElementByName( "registrationDocuments_galleryContainerCount" );
         if ( aGalleryCountElement != "" ) // doesn't exist... not required
         {
            if ( aGalleryCountElement.value == 0 )
            {
               errCount = 1;
               createAlert( 3, "", "You must upload at least one registration report into the gallery to continue.  Click to upload files from the preview area to the gallery." );
               return;
            }
         }
      }

      if ( aForm.name == "VehiclePreScreen" )
      {
         doValidate( aForm, "vehiclePreScreen0"     );
         doValidate( aForm, "vehiclePreScreen1"     );
         doValidate( aForm, "vehiclePreScreen2"     );
         doValidate( aForm, "vehiclePreScreen3"     );

         doValidateIfExist( "luxurySelection"       );
         doValidateIfExist( "evSelection"           );
         doValidateIfExist( "extraCargo"            );

         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "UploadVehiclePhoto" )
      {
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "UploadVehicleInsurancePhoto" )
      {
         doValidate( aForm, "vehicleInsuranceExpDate" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please enter a future expiration date to continue." );
            return;
         }

         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "PaymentProfiles" ) // must use this precise form name... required for other parts of the code for adding-credit-card validation
      {
         if ( getValueByName( aForm.name+"_"+"paymentProfileCount" ) > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must define at least one payment method (Credit Card or Debit Card) to continue" );
      }

      if ( aForm.name == "MerchantAccount" )
      {
         if ( getValueByName( "merchantAccountId" ).indexOf( "--" ) == -1 ) return;    // it will say something like "--not yet created--"
         if ( getValueByName( "canByPass" ) == "true" ) return;    // beta-testers

         errCount = 1;
         createAlert( 3, "", "You must create a deposit profile id using the button at the bottom of the page in order to continue." );
      }

      if ( aForm.name == "BESTPayee" )
      {
         console.log( getValueByName( "walletId" ) );
         if ( getValueByName( "walletId" ) != "" ) return;

         errCount = 1;
         createAlert( 3, "", "You must create a customer profile and create a wallet to continue" )
      }

      // TODO: Add form check for Stripe Driver Account Signup Status
      if ( aForm.name == "StripePayee" )
      {
         if ( getValueByName( aForm.name+"_"+"connectedAccountDetailsSubmitted" ) == "true" ) return;
         errCount = 1;
         createAlert( 3, "", "You must complete the Stripe Connect process to continue. Open the Stripe Link and finish onboarding before continuing." );
      }

      if ( aForm.name == "ScheduleOnboarding" )
      {
         if ( document.getElementById('appt').value < 1 )
         {
            errCount = 1;
            createAlert( 3, "", "Please click an onboarding event to continue.  Scroll down if events are not visible." );
            return( false );
         }
         else
         {
            createAlert( 1, "Your onboarding event has been scheduled.","Please review the information on the next page, and click the button to complete your signup process. When you have completed the signup process, you will receive an email confirming your appointment time and location." );
            return( true );
         }
      }

      // Driver Onboarding Wizard ==============================================================================================


      if ( aForm.name == "OnboardingDrugTest" ) confirmOnly( "confirmDrugTestStarted" );
      if ( aForm.name == "formVerifyRegion" )       confirmOnly( "verifyRegion" );

      if ( aForm.name == "onboardingProfilePhoto" )
      {
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a photo to continue" );
      }

      if ( aForm.name == "verifyPersonalInfo" )
      {
         doValidate( aForm, "personalInfoVerified" );
         doValidate( aForm, "firstName"       );
         doValidate( aForm, "lastName"     );
         doValidate( aForm, "phone"     );
         doValidate( aForm, "birthDate"     );
         doValidate( aForm, "addressLine1"     );
         doValidate( aForm, "city"     );
         doValidate( aForm, "state"     );
         doValidate( aForm, "zip"     );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "SelectDriversLicensePhoto" )
      {
         doValidate( null, "driverLicenseExpDate" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please enter a future expiration date to continue." );
            return;
         }
         doValidate( null, "passMinimumAge" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please verify that the driver is of minimum required age." );
            return;
         }
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a drivers license photo to continue" );
      }

      if ( aForm.name == "UploadDrugTestResultsPhoto" )
      {
         doValidate( null, "DrugTest1" );
         doValidate( null, "DrugTest2" );
         doValidate( null, "DrugTest3" );
         doValidate( null, "DrugTest4" );
         doValidate( null, "DrugTest5" );
         if (errCount > 0 )
         {
            return;
         }
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo of the drug test into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "UploadDashPlacardPhoto" )
      {
         console.log( aForm.name+"_"+"galleryContainerCount" );
         console.log( getValueByName( aForm.name+"_"+"galleryContainerCount" ) );
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" ) < 1 )
         {
            errCount = 1;
            createAlert( 3, "", "You must upload at least one photo of the placard and/or the placard box clearly showing the QR code and the unique placard id number." );
            return;
         }

         doValidate( null, "driverUID" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please ensure the driver placard id is entered." );
            return;
         }
      }

      if ( aForm.name == "onboardingKitCharge" )
      {
         var chargePaid = getElementByName( "onboardingFeePaid" );
         var primaryRegionOnboardingCharge = getElementByName( "primaryRegionOnboardingCharge" );

         if ( primaryRegionOnboardingCharge.value > 0 )
         {
            if ( chargePaid.value == "false" )
            {
               errCount = 1;
               createAlert( 3, "", "Payment must be successfully processed in order to continue." );
            }
         }
      }


      // Vehicle Onboarding Wizard ==============================================================================================

      if ( aForm.name == "VerifyVehicle" )
      {
         doValidate( null, "vehicleVerified" );
         if (errCount > 0 )
         {
            errCount = 1;
            createAlert( 3, "", "Please confirm that the vehicle information has been verified." );
         }
      }

      if ( aForm.name == "VerifyVehicleDetails" )
      {
		 doValidate( aForm, "vehicleDetailsVerified" );
         doValidate( aForm, "vehiclePreScreen0"     );
         doValidate( aForm, "vehiclePreScreen1"     );
         doValidate( aForm, "vehiclePreScreen2"     );
         doValidate( aForm, "vehiclePreScreen3"     );

         doValidateIfExist( "luxurySelection"       );
         doValidateIfExist( "evSelection"           );
         doValidateIfExist( "extraCargo"            );

         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "SelectVehiclePhoto" )
      {
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a photo to continue" );
      }

      if ( aForm.name == "SelectVehicleInsurancePhoto" )
      {
         doValidate( null, "vehicleInsuranceExpDate" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please enter a future expiration date to continue." );
            return;
         }
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a vehicle insurance photo to continue" );
      }
   }

   function validatePreScreenQuestions()
   {
      for ( var i = 0; i < 20; i++ )
      {
         try
         {
            var preScreen = getSelectedRadioButtonValue( "PreScreen"+i );

            if ( preScreen == "1" ) // "yes" answer
            {
//             createAlert( 3, "", "Unfortunately, you do not qualify to become a Wridz driver." );
               return( confirm( "Your answer to one or more of these questions indicate that your background check results likely will not qualify you to drive for Wridz.\n\nContinue with the background check?" ));
            }
            else if ( preScreen == "2" ) // "no" answer
            {
            }
            else
            {
               createAlert( 3, "", "Please ensure all questions have been answered" );
               return( false );
            }
         }
         catch( err )
         {
            if ( i > 5 ) return( true ); // no guarantee how many... but we want to be sure we have processed a few as opposed to an error with no questions processed
            else
            {
               createAlert( 3, "", "System Error: No questions processed");
               return( false );
            }
         }
      }
      createAlert( 3, "", "prescreen pass");
      return( true );
   }
   function processAddCard(aForm, accountId, containerTagUid1, containerTagUid2, tagUid )
   {
     setBusy( 'section_busy2'+tagUid, "block" );

//    var aForm = document.getElementById( aFormId );
//    // callers might have called with the form name in the name parameter instead of id...
//    if ( aForm == null )
//    {
//       aForm = getElementByName( aFormId );
//    }

//    console.log( aFormId + " " + aForm );
      errCount = 0;  // reset count

      doValidateIfExist( "ccNumber"       );
      doValidateIfExist( "ccExpMonth"     );
      doValidateIfExist( "ccExpYear"      );
      doValidateIfExist( "cvv"            );
      doValidateIfExist( "firstName"      );
      doValidateIfExist( "lastName"       );
      doValidateIfExist( "emailAddress"   );
      doValidateIfExist( "phoneNumber"    );
      doValidateIfExist( "zipCode"        );
      doValidateIfExist( "addressLine1"   );
      doValidateIfExist( "city"           );
      doValidateIfExist( "state"          );
      doValidateIfExist( "zipCode"        );

//    doValidate( aForm, "ccNumber"       );
//    doValidate( aForm, "ccExpMonth"     );
//    doValidate( aForm, "ccExpYear"      );
//    doValidate( aForm, "cvv"            );
//    doValidate( aForm, "firstName"      );
//    doValidate( aForm, "lastName"       );
//    doValidate( aForm, "emailAddress"   );
//    doValidate( aForm, "phoneNumber"    );
//    doValidate( aForm, "zipCode"        );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         setBusy( 'section_busy2'+tagUid, "none" );
         return( false );
      }

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { cardAddResponse( ajaxRequest, containerTagUid1, containerTagUid2, tagUid );} ;

      try
      {
         var serverCall = "/payment/jsp/ajax/ajaxGetPaymentProfile.jsp"
                         +"?action=addNew"
                         +"&viewName=api"
                         +"&objectClassID=143"
                         +"&accountId="     +    accountId
                         +"&ccNumber="      +    getElementByName( 'ccNumber'     ).value
                         +"&ccType="        +    getElementByName( 'ccType'       ).value
                         +"&ccExpMonth="    +    getElementByName( 'ccExpMonth'   ).value
                         +"&ccExpYear="     +    getElementByName( 'ccExpYear'    ).value
                         +"&cvv="           +    getElementByName( 'cvv'          ).value
                         +"&firstName="     +    getElementByName( 'firstName'    ).value
                         +"&lastName="      +    getElementByName( 'lastName'     ).value
                         +"&emailAddress="  +    getElementByName( 'emailAddress' ).value
                         +"&phoneNumber="   +    getElementByName( 'phoneNumber'  ).value
                         +"&addressLine1="  +    getElementByName( 'addressLine1' ).value
                         +"&addressLine2="  +    getElementByName( 'addressLine2' ).value
                         +"&city="          +    getElementByName( 'city'         ).value
                         +"&state="         +    getElementByName( 'state'        ).value
                         +"&zipCode="       +    getElementByName( 'zipCode'      ).value
      }
      catch( err )
      {
         alert( "Error creating payment profile.  Please copy/paste or screen shot this error and use the contact form to report this. " + err );
      }

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return(false);
   }

   function cardAddResponse( ajaxRequest, parentContainerTagUid, grandParentContainerTagUid, tagUid )
   {
      if (ajaxRequest.readyState == 4)
      {
          setBusy( 'section_busy2'+tagUid, "none" );
          if ( handleAjaxRC( ajaxRequest ) )
          {
             document.getElementById('section_refresh' + grandParentContainerTagUid ).click();// need to refresh the whole payment block to ensure 'pay' button enabled
             document.getElementById('viewIcon'+parentContainerTagUid+'_1').click();  // now re-open list view if closed on container refresh above
          }
      }
   }


   function validateCreditCardInput( tagUid, required )
  {
      if( !validate( tagUid, required ) ) return(false);

      $('#'+tagUid).validateCreditCard(function(result) {
          document.getElementById('ccType'  + tagUid ).value = (result.card_type == null ? '-' : result.card_type.name);
          document.getElementById('ccValid' + tagUid ).value = result.valid;
      });

      if ( document.getElementById('ccValid' + tagUid ).value == 'false' )
      {
         showError( tagUid, "** Invalid Credit Card Number" );
         return( false );
      }
      return( true );
   }

  function submitOnboardingKitCharge( theButton, tagUid, objId, amount )
  {
     theButton.disabled = true; // don't want multiple charges
     var url = "/cis/JWMBOS";
     var cardCode = getElementByName( "cardCode" );
     var testMode = getElementByName( "testMode" );

     var colCommand;
     if ( amount > 0 ) colCommand = "SUBMITONBOARDINGKITCHARGE";
     else              colCommand = "SUBMITPREAUTHTHENVOIDFORONBOARDING"

     var reqJson  = {};
     reqJson[ "table"         ] =  "WRIDZPERSONEXT";
     reqJson[ "col"           ] =  colCommand
     reqJson[ "identifier"    ] =  "SubmitOnboardingKitCharge";
     reqJson[ "cardCode"      ] =  cardCode.value;
     reqJson[ "objId"         ] =  Number( objId );
     reqJson[ "value"         ] =  Number( amount );
     reqJson[ "testMode"      ] =  testMode.checked;

     xhrUpdate( "POST",
                url,
                reqJson,
                tagUid,
                theButton.id,  // reference element for busy icon location
                tagUid,        // refresh sectionId
                "",
                ""
              );
  }

  function submitBackgroundCheckPayment( theButton, tagUid, objId, amount )
  {
     theButton.disabled = true; // don't want multiple charges
     var url = "/cis/JWMBOS";
     var cardCode = getElementByName( "cardCode" );

     var reqJson  = {};
     reqJson[ "table"         ] =  "WRIDZPERSONEXT";
     reqJson[ "col"           ] =  "SUBMITBACKGROUNDCHECKFEEPAYMENT";
     reqJson[ "identifier"    ] =  "SubmitBackgroundCheckFeePayment";
     reqJson[ "cardCode"      ] =  cardCode.value;
     reqJson[ "objId"         ] =  Number( objId );
     reqJson[ "value"         ] =  Number( amount );

     xhrUpdate( "POST",
                url,
                reqJson,
                tagUid,
                theButton.id,  // reference element for busy icon location
                tagUid,        // refresh sectionId
                "",
                ""
              );
  }

  function submitWridzPaymentCharge( theButton, tagUid, objId, amount )
  {
     theButton.disabled = true; // don't want multiple charges
     var url = "/cis/JWMBOS";
     var cardCode = getElementByName( "cardCode" );
     var testMode = getElementByName( "testMode" );

     var reqJson  = {};
     reqJson[ "table"         ] =  "INVOICE3";
     reqJson[ "col"           ] =  "SUBMITWRIDZPAYMENTCHARGE";
     reqJson[ "identifier"    ] =  "SubmitWridzPaymentCharge";
     reqJson[ "cardCode"      ] =  cardCode.value;
     reqJson[ "objId"         ] =  Number( objId );
     reqJson[ "value"         ] =  Number( amount );
     reqJson[ "testMode"      ] =  testMode.checked;

     xhrUpdate( "POST",
                url,
                reqJson,
                tagUid,
                theButton.id,  // reference element for busy icon location
                tagUid,        // refresh sectionId
                "",
                ""
              );
  }

  function submitWridzV3PaymentCharge( theButton, tagUid, invoiceId, amount, containerTagUid )  // V3 Submit
  {
     setBusy( theButton.id+"busy", "block" );
     theButton.disabled = true; // don't want multiple charges
     var restData = {};
     var xhrData = {};
     xhrData[ "containerId"         ] =  "";
     xhrData[ "refreshSectionIds"   ] =  containerTagUid;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";

     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "Invoice";
     restData[ "command"            ] =  "PayProvision";
     restData[ "identifier"         ] =  "PayProvision";
     restData[ "locatorId"          ] =  invoiceId;
     restData[ "locatorType"        ] =  "20";  // Invoice
     restData[ "locatorRelationship"] =  "id";
     restData[ "locatorRecordType"  ] =  "0"
     restData[ "value1"             ] =  amount
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  {}
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );
  }

   function paymentPayProvision( paymentId, refreshSectionId )
   {
      var restData = {};
      var command = "payProvision";

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "payment_";
      restData[ "command"            ] =  command;
      restData[ "identifier"         ] =  command + "/" + paymentId;
      restData[ "locatorId"          ] =  paymentId
      restData[ "locatorType"        ] =  "142";
      restData[ "locatorRelationship"] =  "0"; // id
      restData[  "locatorRecordType" ] =  "0";
      restData[ "dataReq"            ] =  ""
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function wridzPaymentFormValidate( aForm, id, tagUid )
   {
      errCount = 0;
      doValidate( aForm, "cardCode"       );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to submit the payment." );
         return( false );
      }
      return( true );
   }

   function onboardingKitChargeFormValidate( aForm, id, tagUid )
   {
      errCount = 0;
      doValidate( aForm, "cardCode"       );
      doValidate( null, "approveCharge"  ); // this element is not in the form due to form nesting issues on the page... null means getElementByName()

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to submit the payment." );
         return( false );
      }
      return( true );
   }

   function backgroundCheckPaymentFormValidate( aForm, id, tagUid )
   {
      errCount = 0;
      doValidate( aForm, "cardCode"       );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to submit the payment." );
         return( false );
      }
      return( true );
   }

   function processActivateCoupon( aForm, tagUid )
   {
      var couponID = getElementByName( 'couponID').value.replace(/\s/g, "");
      getElementByName( 'couponID'     ).value = couponID;

      errCount = 0;
      doValidate( aForm, "couponID"     );
      doValidate( aForm, "maxCouponValue"      );
      doValidate( aForm, "couponMonth"     );
      doValidate( aForm, "couponExpYear"      );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s)." );
         return( false );
      }

      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"                         ] =  "PAYMENTPROFILE";
      reqJson[ "col"                           ] =  "ACTIVATECOUPON";
      reqJson[ "identifier"                    ] =  "ActivateCoupon";
      reqJson[ "couponID"                      ] =  getElementByName( 'couponID'     ).value;
      reqJson[ "maxCouponValue"                ] =  Number( getElementByName( 'maxCouponValue').value );
      reqJson[ "couponExpMonth"                ] =  Number( getElementByName( 'couponExpMonth'   ).value );
      reqJson[ "couponExpYear"                 ] =  Number( getElementByName( 'couponExpYear'    ).value );


      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 tagUid,
                 tagUid,
                 "",
                 ""
               );
   }

  function submitNonPreAuthInvoicePayment( theButton, tagUid, objId )
  {
      theButton.disabled = true; // don't want multiple charges

      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"         ] =  "INVOICE3";
      reqJson[ "col"           ] =  "SUBMITNONPREAUTHINVOICEPAYMENT"
      reqJson[ "identifier"    ] =  "SubmitNonPreAuthInvoicePayment";
      reqJson[ "objId"         ] =  Number( objId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 theButton.id,  // reference element for busy icon location
                 tagUid,        // refresh sectionId
                 "",
                 ""
               );
   }

   function testPDF( tagUid ){
      var couponID = getElementByName( 'couponID').value.replace(/\s/g, "");
      getElementByName( 'couponID'     ).value = couponID;


      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"                         ] =  "PAYMENTPROFILE";
      reqJson[ "col"                           ] =  "testPDF";
      reqJson[ "identifier"                    ] =  "TestPDF";
      reqJson[ "couponID"                      ] =  getElementByName( 'couponID'     ).value;
      reqJson[ "maxCouponValue"                ] =  Number( getElementByName( 'maxCouponValue').value );
      reqJson[ "couponExpMonth"                ] =  Number( getElementByName( 'couponExpMonth'   ).value );
      reqJson[ "couponExpYear"                 ] =  Number( getElementByName( 'couponExpYear'    ).value );


      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 tagUid,
                 tagUid,
                 "",
                 ""
               );
   }

  function submitReverseCharges( theButton, tagUid, objId )
  {
      theButton.disabled = true; // don't want multiples calls

      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"         ] =  "INVOICE3";
      reqJson[ "col"           ] =  "SUBMITREVERSEPAYMENT"
      reqJson[ "identifier"    ] =  "SubmitReverseCharges";
      reqJson[ "objId"         ] =  Number( objId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 theButton.id,  // reference element for busy icon location
                 tagUid,        // refresh sectionId
                 "",
                 ""
               );
   }

  function createPaymentProfileBEST( acctGatewayMapId, tagUid )
  {
     var restData = {};

     var xhrData = {};
     xhrData[ "containerId"         ] =  "";
     xhrData[ "refreshSectionIds"   ] =  "";
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";

     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "PaymentProfileList";
     restData[ "command"            ] =  "linkCreditCard";
     restData[ "identifier"         ] =  "linkCreditCard";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "owner";
     restData[  "locatorRecordType"         ] =  "0",
     restData[ "tagUid"             ] =  tagUid,
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  {}
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function closePopup( tagUid )
  {
     // link credit card / link bank account popup is closing... need to refresh the tagUid to update the list
     // see if it is an id
     if ( document.getElementById('section_refresh'+tagUid ) != null )
     {
        console.log( "refreshing by tagUid: " + tagUid );
        document.getElementById('section_refresh'+ tagUid ).click();
     }
  }
   function validatePhoneNumberInput( tagUid, required )
   {
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      if ( !is_phone( dataValue ) )
      {
         showError( tagUid, "** Invalid Phone Number (xxx) xxx-xxxx" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         errCount += 1;
         return( false );
      }
      return( true );
   }

   function is_phone(phone)
   {
      var raw_number = phone.replace(/[^0-9]/g,'');
      var regex1 = /^[0-9]{10}$/;
      return regex1.test(raw_number);
   }

  function newProductListingValidate(form)
  {
     errCount = 0;  // reset count

     doValidate( form, "manufacturer" );
     doValidate( form, "serialNumber" );
     doValidate( form, "model"        );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     return(true);
  }

  function productFormValidate(form)
  {
     errCount = 0;  // reset count

     doValidate( form, "productDescription" );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     updateDocumentElement( form, "productStatus", 3 ); // chg status to "Pending Approval"
     return(true);
  }

  function searchByProductCategory( categoryId, name, resultsSectionName )
  {
     var resultsTagUid = getTagUidFromName( resultsSectionName );
     setTagParm( "categoryId", categoryId, resultsTagUid, true );

     forcePage1( resultsTagUid );

     document.getElementById( 'section_title'+resultsTagUid ).innerHTML = "<h3>"+name+"</h3>";
     document.getElementById( 'search'+resultsTagUid ).value = ""; // need to clear out search; otherwise it will override category selection
     document.getElementById( 'section_refresh'+resultsTagUid ).click();
  }

  function selectNewProductItem( pItemId )
  {
     console.log( "select new ProductItem: " + pItemId );
     var storeFrontProductItemBlock = getTagUidFromName( "storeFrontProductItem" );
     setTagParm( "id", pItemId, storeFrontProductItemBlock, true );
     document.getElementById( 'section_refresh'+storeFrontProductItemBlock ).click();
  }

  function selectNewProductItemFromSecondary()
  {
     var secondaryVarSelectBlock = getTagUidFromName( "secondaryVarSelect" );
     var selectElement = document.getElementById(secondaryVarSelectBlock);
     selectNewProductItem( selectElement.options[ selectElement.selectedIndex ].value);
  }
   function ajaxProjectDates(id, containerRootId, viewId, busyIcon )
   {
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

//    console.log( "containerId " + containerId );
      var currContent = document.getElementById( containerId).innerHTML;
      if ((currContent.length >  5 )
              && ( currContent.indexOf( pendingRefreshFlagText ) == -1 ) )  return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetProject.jsp"
                      +"?id="+id
                      +"&viewName=projectDates"
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function verifyDeleteProject( icon, projectId )
   {
      var origBG = $(icon).closest( "tr" ).css( "background-color" );
      $(icon).closest( "tr" ).css( "background-color", "yellow" );

      if ( confirm( "Confirm delete project" ))
      {
         $(icon).closest( "tr" ).css( "background-color", "red" );
         var tr = $(icon).closest( "tr" );

         var ajaxRequest = getAjaxRequestObject();

         ajaxRequest.onreadystatechange = function() { removeRow( ajaxRequest, tr );} ;

         var serverCall = "/projectmanager/jsp/ajax/ajaxGetProject.jsp"
                         +"?id="+projectId
                         +"&fn=delete"
                         +"&user="+getUserName()

         ajaxRequest.open("GET", serverCall, true);
         ajaxRequest.send(null);
      }
      else
      {
         $(icon).closest( "tr" ).css( "background-color", origBG );
      }
   }


   function ajaxSetProjectDataField( id, viewName, containerId, busyIcon, tagUid, onChangeFn )
   {
      setBusy( busyIcon, "inline");

      var onChangeFnStr = document.getElementById( onChangeFn ).value;

      var ajaxRequest = getAjaxRequestObject();

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetProject.jsp"
                      +"?id="+id
                      +"&viewName="+viewName
                      +"&tagUid="+tagUid
                      +"&onChangeFn="+onChangeFnStr
                      +"&user="+getUserName()

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxSetProjectStatusFields( id, roContainerId, dropdownContainerId, busyIcon, tagUid, onChangeFn )
   {
      ajaxSetProjectDataField( id, "status",         roContainerId,       busyIcon, tagUid, onChangeFn );
      ajaxSetProjectDataField( id, "statusDropdown", dropdownContainerId, busyIcon, tagUid, onChangeFn );
   }

   function ajaxProjectList( containerId, busyIcon, tagUid, filterId )
   {
      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetProjectList.jsp"
                      +"?user="+getUserName()
                      +"&viewName=selectList"
                      +"&filterId="+filterId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function adminSearchRegions( tagUid )
   {
      forcePage1(tagUid);

      setTagParm( "regionName"             , getElementByName( "regionName"                ).value,   tagUid, true );
      setTagParm( "inclActive"             , getElementByName( "inclActive"                ).checked, tagUid, true );
      setTagParm( "inclPending"            , getElementByName( "inclPending"               ).checked, tagUid, true );
      setTagParm( "inclSignUp"             , getElementByName( "inclSignUp"                ).checked, tagUid, true );
      setTagParm( "inclOnboarding"         , getElementByName( "inclOnboarding"            ).checked, tagUid, true );
      setTagParm( "inclInactive"           , getElementByName( "inclInactive"              ).checked, tagUid, true );
      setTagParm( "inclDeleted"            , getElementByName( "inclDeleted"               ).checked, tagUid, true );
      setTagParm( "inclPrimary"            , getElementByName( "inclPrimary"               ).checked, tagUid, true );
      setTagParm( "inclSubRegion"          , getElementByName( "inclSubRegion"             ).checked, tagUid, true );
      setTagParm( "inclMultiStatePrimary"  , getElementByName( "inclMultiStatePrimary"     ).checked, tagUid, true );
      setTagParm( "inclMultiStateSubRegion", getElementByName( "inclMultiStateSubRegion"   ).checked, tagUid, true );
      setTagParm( "inclBlockOut"           , getElementByName( "inclBlockOut"              ).checked, tagUid, true );
      setTagParm( "inclBlockOutAccept"     , getElementByName( "inclBlockOutAccept"        ).checked, tagUid, true );
      setTagParm( "inclCollection"         , getElementByName( "inclCollection"            ).checked, tagUid, true );
      setTagParm( "inclCounty"             , getElementByName( "inclCounty"                ).checked, tagUid, true );
      setTagParm( "inclCityLimits"         , getElementByName( "inclCityLimits"            ).checked, tagUid, true );
      setTagParm( "inclTestRegions"        , getElementByName( "inclTestRegions"           ).checked, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function ajaxRegionList( containerId, busyIcon, tagUid, filterId )
   {
//      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/wridz/jsp/ajax/ajaxGetRegionList.jsp"
                      +"?user="+getUserName()
                      +"&viewName=selectList"
                      +"&objectClassID=158"
                      +"&filterId="+filterId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }
function ajaxSetViewToggle(icon, tagUid) {
  var minusIcon = getSysImages() + "/minus.gif";
  var plusIcon = getSysImages() + "/plus.gif";
  iconElement = document.getElementById(icon);
  if (iconElement.src.indexOf(plusIcon) > -1) {
    ajaxSetView(1, tagUid);
    iconElement.src = minusIcon;
  } else {
    ajaxSetView(0, tagUid);
    iconElement.src = plusIcon;
  }
}

function ajaxExpand(
  id,
  icon,
  nextViewId,
  refreshId,
  views,
  edit,
  tagUid,
  viewId,
  viewDisplay,
  containerRootId,
  lightBoxOption
) {
  //    console.trace();
  //    console.log( "Expand " + id );
  divElement = document.getElementById(id);
  ctrlContainerElement = document.getElementById("section_ctrl" + tagUid);
  miscContainerElement = document.getElementById(
    "section_MiscHeaderContent" + tagUid
  );

  if (divElement == null) return; // this is not an error.... tableRow='true' will not have expansion stuff

  iconElement = document.getElementById(icon);
  nextViewElement = document.getElementById(nextViewId);
  refreshElement = document.getElementById(refreshId);
  var currFooterLayerElement = document.getElementById(
    "section_footer" + tagUid
  );

  if (divElement.style.display == "none") {
    divElement.style.display = getDisplayStyleForThisView(viewDisplay, viewId);
    divElement.style.float = getFloatStyleForThisView(viewDisplay, viewId);
    if (nextViewElement != null) {
      if (views > 1) nextViewElement.style.display = "inline";
    }

    if (refreshElement.className != "hidden")
      refreshElement.style.display = "inline";

    iconElement.src = getSysImages() + "/minus.gif";
    //       ctrlContainerElement.style.visibility = "visible";
    ctrlContainerElement.style.display = "inline-block";
    if (miscContainerElement != null)
      miscContainerElement.style.display = "block";

    currFooterLayerElement.style.display = "block";
  } else {
    //       ajaxNextView( views, viewId, containerRootId, tagUid, viewDisplay, lightBoxOption )

    divElement.style.display = "none";
    if (nextViewElement != null) nextViewElement.style.display = "none";
    refreshElement.style.display = "none";
    iconElement.src = getSysImages() + "/plus.gif";
    //       ctrlContainerElement.style.visibility = "hidden";
    ctrlContainerElement.style.display = "none";
    if (miscContainerElement != null)
      miscContainerElement.style.display = "none";
    currFooterLayerElement.style.display = "none";
  }
  //    console.log( "Exit Expand" );
}

function ajaxRefresh(viewId, containerRootId, footerId, atAGlanceId)
{
  if ( viewId != '' )  // probably an 'atAGlance-only' refresh if ''
  {
     // clear contents to force populate to reload....
     var view = document.getElementById(viewId).value;

     //    console.log( "pendingRefreshFlagHTML " + pendingRefreshFlagHTML );

     var currViewLayerElement = document.getElementById(
       containerRootId + "_" + view
     );

     if (currViewLayerElement == null) {
       //        console.log( "ajaxRefresh: currViewElement not found: " + containerRootId+"_"+view  + " " + viewId );
       currViewLayerElement = document.getElementById(containerRootId + "_1"); // force first view if view not found
       document.getElementById(viewId).value = 1;
     }
     //    console.log( "pendingRefreshFlag_"+containerRootId+"_"+view );
     try
     {
       document.getElementById(
         "pendingRefreshFlag_" + containerRootId + "_" + view
       ).checked = true;
     }
     catch( exception1 )
     {
     }

     var currFooterLayerElement = document.getElementById(footerId);
     document.getElementById("pendingRefreshFlag_" + footerId).checked = true;
  }
  ajaxRefreshAtAGlanceSection( atAGlanceId );
}

function ajaxRefreshAtAGlanceSection( atAGlanceId )
{
  var atAGlanceLayerElement = document.getElementById(atAGlanceId);
  document.getElementById("pendingRefreshFlag_" + atAGlanceId).checked = true;
}

function clearContents(containerId) {
  //    console.log( "clear contents: " + containerId );
  var container = document.getElementById(containerId);
  container.innerHTML = "";
}

function getThisViewName(
  viewNames,
  viewId,
  containerRootId,
  viewDisplay,
  tagUid
) {
  var viewIdElement = document.getElementById(viewId);
  if (viewIdElement == null) return "";

  var view = viewIdElement.value;
//  console.log( view );

  var viewNameArray = viewNames.split(";");

  if (viewDisplay != "") {
    forceView(viewNameArray.length, view, containerRootId, viewId, viewDisplay); // make sure we are in sync
  }

  var thisViewName = viewNameArray[view - 1];

  // 6/28/16 -- turn off addItems if inline-block
  var addItemsIcon = document.getElementById("sectionList_addItems" + tagUid);
  if (addItemsIcon != null) {
    //       console.log("viewDisplay: " + getDisplayStyleForThisView( viewDisplay, viewId) );
    if (getDisplayStyleForThisView(viewDisplay, viewId) == "inline-block") {
      addItemsIcon.style.display = "none";
    } else {
      addItemsIcon.style.display = "inline";
    }
  }
  //    console.log( "addItemsIcon|" + addItemsIcon + "|" + tagUid + "|" + thisViewName + "|" + viewNames + "|" + view + "|" + viewDisplay);
//  console.log( "thisViewName: " + thisViewName );
  return thisViewName;
}

function getDisplayStyleForThisView(viewDisplay, viewId) {
  var view = document.getElementById(viewId).value;
  if (view == 0) return "block"; // actually, this is the 'closed' view... just default

  if (viewDisplay == "") return "block";

  //    console.log( "getDisplayStyleForThisView " + view );
  var viewDisplayStyleArray = viewDisplay.split(";");
  var displayStyle = viewDisplayStyleArray[view - 1].split("^");
  return displayStyle[0];
}

function getAutoRefreshForThisView(autoRefresh, viewId) {
  var view = document.getElementById(viewId).value;
  if (view == 0) return "false";

  if (autoRefresh == "") return "false";

  var autoRefreshArray = autoRefresh.split(";");
  return autoRefreshArray[view - 1];
}

function getLightBoxOptionForThisView(lightBoxOption, viewId) {
  //    console.log( "getLightBoxOptionForThisView(" + lightBoxOption + ", " + viewId );
  if (typeof lightBoxOption == "undefined") return "none";

  var view = document.getElementById(viewId).value;

  if (view == 0) {
    // actually, this is the 'closed' view... just default
    if (lightBoxOption.indexOf("none") > 0) return "none"; // section doesn't use lightBoxOption... don't do anything
    return "false"; // section uses lightBoxOption... need to close it;
  }

  if (lightBoxOption == "") return "none";

  var lightBoxOptionArray = lightBoxOption.split(";");
  //    console.log( "LightBoxOption: " + viewId + " " + view + " " + lightBoxOptionArray[view-1] );
  return lightBoxOptionArray[view - 1];
}

function getFloatStyleForThisView(viewDisplay, viewId) {
  var view = document.getElementById(viewId).value;
  if (view == 0) return "none"; // actually, this is the 'closed' view... just default

  //    console.log( "getFloatStyleForThisView " + view );
  var viewDisplayStyleArray = viewDisplay.split(";");
  var displayStyle = viewDisplayStyleArray[view - 1].split("^");
  var float = "none";
  if (displayStyle.length > 1) float = displayStyle[1];
  return float;
}

function forceView(views, view, containerRootId, viewId, viewDisplay) {
  // make sure the correct view layer is visible
  if (view > 0) {
    // view=0 is now 'closed'... so don't expect a view layer for it
    for (var i = 0; i < views; i++) {
      var viewLayerElement = document.getElementById(
        containerRootId + "_" + (i + 1)
      );
      viewLayerElement.style.display = "none";
    }

    var mapLayer = document.getElementById(containerRootId + "_map");
    if (mapLayer == null) {
      // no google map layer exists
      var currViewLayerElement = document.getElementById(
        containerRootId + "_" + view
      );
      currViewLayerElement.style.display = getDisplayStyleForThisView(
        viewDisplay,
        viewId
      );
      currViewLayerElement.style.float = getFloatStyleForThisView(
        viewDisplay,
        viewId
      );
    } // force map layer to be visible
    else {
      mapLayer.style.display = "block";
    }
  }
}

function ajaxIncrementView(views, tagUid) {
  //    console.log( "ajaxIncrementView( " + views + ", " + tagUid + " ) " );
  views += 1; // need to add 'closed' view
  var viewsDropDownElement = document.getElementById("viewList" + tagUid);

  var selNdx = viewsDropDownElement.selectedIndex;
  //    console.log( "Selected Ndx: " + selNdx );
  selNdx++;
  if (selNdx >= views) selNdx = 0;
  //    console.log( "Selected Ndx: " + selNdx );
  viewsDropDownElement.selectedIndex = selNdx;

  selNdx = viewsDropDownElement.selectedIndex;

  //    console.log( "new selected Ndx in dropdown: " + selNdx );
}

function ajaxSetView(view, tagUid) {
  //    console.log( "SetView: " + view );
  var viewsDropDownElement = document.getElementById("viewList" + tagUid);
  viewsDropDownElement.selectedIndex = view;
}

function setThumbnailMode(mode, tagUid) {
  var outerId = "section_outer" + tagUid;
  var thumbNailId = "section_thumbnail" + tagUid;
  var thumbNailDiv = document.getElementById(thumbNailId);
  var outerDiv = document.getElementById(outerId);

  if (mode == 1) {
    thumbNailDiv.style.display = "block";
    outerDiv.style.display = "none";
    //       console.log( "setting thumbnail mode: " + tagUid );
  } else {
    thumbNailDiv.style.display = "none";
    outerDiv.style.display = "block";
    //       console.log( "clearing thumbnail mode: " + tagUid );
  }
}

function toggleThumbnail(tagUid) {
  var outerId = "section_outer" + tagUid;
  var thumbNailId = "section_thumbnail" + tagUid;
  var thumbNailDiv = document.getElementById(thumbNailId);
  var outerDiv = document.getElementById(outerId);

  if (thumbNailDiv.style.display == "none") {
    thumbNailDiv.style.display = "block";
    outerDiv.style.display = "none";
  } else {
    thumbNailDiv.style.display = "none";
    outerDiv.style.display = "block";
  }
}

function ajaxNextView(
  views,
  viewId,
  containerRootId,
  tagUid,
  viewDisplay,
  tagName,
  lightBoxOption,
  edit,
  innerId,
  expIconId,
  nextViewId,
  refreshId
) {
  //    console.log( "ajaxNextView( " + views + ", " + viewId + ", " + containerRootId + ", " + tagUid + ", " + viewDisplay + " ) " );
  var view = document.getElementById(viewId).value;

  var currViewLayerElement = document.getElementById(
    containerRootId + "_" + view
  );
  //    console.log( "currViewLayerElementId = " + containerRootId+"_"+view );
  if (currViewLayerElement != null) currViewLayerElement.style.display = "none";

  // tag option to use 'nextview' icon or view-select dropdown

  if (document.getElementById("viewList" + tagUid) != null) {
    // using list dropdown
    view = document.getElementById("viewList" + tagUid).selectedIndex; // indexes will be 1-based due to 'closed' always at 0 index

    // 5.25.16 -- replacing +/- icon with auto open/close based on view selection (closed is a 'view')
    var expElement = document.getElementById("section_expIcon" + tagUid);
    var sectionInnerElement = document.getElementById("section_inner" + tagUid);
    //       console.log( "view = " + view );

    // 10/20/16
    if (view == 0) {
      // this always means 'closed' (5/25/16)
      if (getTagParm("headerClass", tagUid) == "hidden") view = 1; // don't minimize/close if no header (everything disappears)

      if (sectionInnerElement.style.display != "none") {
        // if open, then close it
        ajaxExpand(
          innerId,
          expIconId,
          nextViewId,
          refreshId,
          views,
          edit,
          tagUid,
          viewId,
          viewDisplay,
          containerRootId,
          lightBoxOption
        );
      }
    } // view non-zero
    else {
      if (sectionInnerElement.style.display == "none") {
        // if closed, then open it
        ajaxExpand(
          innerId,
          expIconId,
          nextViewId,
          refreshId,
          views,
          edit,
          tagUid,
          viewId,
          viewDisplay,
          containerRootId,
          lightBoxOption
        );
      }
    }
  } // using 'nextView' icon
  else {
    view = view * 1 + 1; // need to prevent it from doing string concat instead of math
    if (view > views) view = 1;
  }
  document.getElementById(viewId).value = view;

  var nextViewLayerElement = document.getElementById(
    containerRootId + "_" + view
  );
  if (nextViewLayerElement != null) {
    // null will occur when 'closed' view is selected
    nextViewLayerElement.style.display = getDisplayStyleForThisView(
      viewDisplay,
      viewId
    );
    nextViewLayerElement.style.float = getFloatStyleForThisView(
      viewDisplay,
      viewId
    );

    var innerDiv = document.getElementById("section_inner" + tagUid);
    innerDiv.style.display = getDisplayStyleForThisView(viewDisplay, viewId); //parent 'inner div' can be block on inline depending on view layer pref
    //       console.log( "innerDiv: " + innerDiv.style.display );
    innerDiv.style.float = getFloatStyleForThisView(viewDisplay, viewId);

    //       var viewNameDisplay = document.getElementById( "viewNameDisplay"+tagUid );
    //       if ( viewNameDisplay != null )
    //       {
    //          var viewNameArray = getTagParm( "viewNames", tagUid ).split(";");
    //          viewNameDisplay.innerHTML = "["+viewNameArray[view-1]+"]";
    //       }
    //       else
    //       {
    //          console.error( "viewNameDisplay"+tagUid + " element not found." );
    //       }

    // 11/17/15 - need to force page 1 when swapping views
    var pageElement = document.getElementById("page" + tagUid);
    if (pageElement != null) pageElement.value = 1;
    setTagParm("page", 1, tagUid);
    //       console.log( "set page = 1" );

    // 12-19-15
    var currFooterLayerElement = document.getElementById(
      "section_footer" + tagUid
    );
    document.getElementById(
      "pendingRefreshFlag_section_footer" + tagUid
    ).checked = true;
  }

  var outerDiv = document.getElementById("section_outer" + tagUid);
  var innerDiv = document.getElementById("section_inner" + tagUid);
  var ctrlDiv = document.getElementById("section_ctrl" + tagUid);

  var doLightBox = getLightBoxOptionForThisView(lightBoxOption, viewId);
  if (doLightBox == "true") {
    innerDiv.style.position = "fixed";
    innerDiv.style.overflow = "auto";
//    innerDiv.style.border = "1px solid red";
    innerDiv.style.left = "5%";
    innerDiv.style.top = "15%";
    innerDiv.style.width = "90%";
    innerDiv.style.height = "80%";
    innerDiv.style.backgroundColor = "transparent !important";
    innerDiv.style.zIndex = "2";
    document.getElementById("lightBoxScreen").style.display = "block";
    document.getElementById("closeButton" + tagUid).style.display = "";
  } else if (doLightBox == "false") {
    // can't do 'else'... don't want to work the screen on subSections inside a lightBox'd section
    innerDiv.style.position = "static";
    innerDiv.style.zIndex = "0";
    innerDiv.style.width = ""; // remove
    innerDiv.style.height = ""; // remove

    if (view == 0) {
      innerDiv.style.display = "none";
    } else {
      innerDiv.style.display = "block";
    }

    //       ctrlDiv.style.visibility = "hidden";
    document.getElementById("lightBoxScreen").style.display = "none";
    //       document.getElementById( "viewIcons" + tagUid ).style.display = "inline-block";
    document.getElementById("closeButton" + tagUid).style.display = "none";
  } else if (doLightBox == "none") {
    // lightBox not used
  }

  // 10/1/16 add 'viewIcon' with borders to indicate selected view
  for (var i = 0; i <= views; i++) {
    var viewIconElement = document.getElementById(
      "viewIcon" + tagUid + "_" + i
    );
    if (viewIconElement != null) {
      if (view == i) {
        viewIconElement.style.opacity = 0.3;
        //             viewIconElement.className = "viewiconactive";
      } else {
        //             viewIconElement.className = "viewiconinactive";
        viewIconElement.style.opacity = 1;
      }
    }
  }

  //    console.log( "AutoRefresh: " + getAutoRefreshForThisView( getTagParm( "autoRefresh", tagUid ), viewId ) );
  if (
    getAutoRefreshForThisView(getTagParm("autoRefresh", tagUid), viewId) ==
    "true"
  ) {
    forceRefresh(tagUid);
  }
}

// function updateParentContainer( containerTagUid, tagUid, lightBoxOption, viewId ) // currently used by HML flow view to cause all cells to go to thumbnail view except active cell
// {
//    var tableElement = document.getElementById( containerTagUid );
//
//    var currRow = getTagParm( "ypos", tagUid );
//    var currCol = getTagParm( "xpos", tagUid );
//
//    if (tableElement != null )
//    {
//       var doLightBoxOption = getLightBoxOptionForThisView( lightBoxOption, viewId );
//       for (var i = 0, row; row = tableElement.rows[i]; i++)
//       {
//          for (var j = 0, cell; cell = row.cells[j]; j++)
//          {
//             var cellTagParmsElement = cell.getElementsByTagName( "table" )[0];
//             if ( cellTagParmsElement != null )
//             {
//                var cellTagUid = cellTagParmsElement.getAttribute( "tagUid" );
//
//                if ( doLightBoxOption == "true" )
//                {
//                   if (( i != currRow-1 )
//                      ||( j != currCol-1 ))
//                   {
//                      setThumbnailMode( 1, cellTagUid ); // all surrounding cells go to thumbnail mode
//                   }
//                   else // cell being magnified
//                   {
//                      setThumbnailMode( 0, cellTagUid ); // make main cell full size (non-thumbnail)
//                   }
//                }
//                else // no magnification.... make all cells non-thumbnail
//                {
//                   setThumbnailMode( 0, cellTagUid ); // make main cell full size
//                }
//             }
//          }
//       }
//    }
// }

function deleteSectionListItem(
  icon,
  id,
  tagUid,
  fn,
  message,
  ownerType,
  ownerId,
  containerTag,
  aDataObj
) {
  if ( getTagParm( "dataObj", tagUid ) == '' ) setTagParm("dataObj", aDataObj, tagUid);

  if (containerTag == "") containerTag = "tr";
  //    console.log( "tagUid '" + tagUid + "'" );
  //    this uses the parm list from the tag of the object being deleted since the delete tag itself does not have a parm list

  var origBG = $(icon).closest(containerTag).css("background-color");
  //    console.log( "origBG " + origBG );
  //    console.log( "id " + $(icon).closest( containerTag ).id );

  var closestTag = $(icon).closest(containerTag);
  $(icon).closest(containerTag).css("background-color", "yellow");

  setTimeout(function ()
  {
    if (confirm(message))
    {
      $(icon).closest(containerTag).css("background-color", "red"); // if delete is successful, red background will go away since element goes away
      var tr = $(icon).closest(containerTag);

      var deleteUrl = getTagParm("deleteUrl", tagUid);
      setTagParm("objectId", id, tagUid);
      setTagParm("fn", fn, tagUid);
      setTagParm("user", getUserName(), tagUid);
      setTagParm("reqUid", generateReqUid(), tagUid);
      setTagParm("objectClassID", getTagParm("memberClassID", tagUid), tagUid); // swap the 'list' model handler class to the 'member' model handler class


      if (ownerId != -1) setTagParm("ownerType", ownerType, tagUid);
      if (ownerId != -1) setTagParm("ownerId", ownerId, tagUid);

      var parms = getParmsAsString(tagUid);

        if ( getTagParm( "apiVersion", tagUid ) == 1 )
        {
         var ajaxRequest = getAjaxRequestObject();
         ajaxRequest.onreadystatechange = function () {
                                                        tr.remove();
                                                      };

         ajaxRequest.open("POST", deleteUrl, true);
         ajaxRequest.setRequestHeader(
           "Content-type",
           "application/x-www-form-urlencoded"
         );
         ajaxRequest.send(parms);
        }
      else if ( getTagParm( "apiVersion", tagUid ) == 2 )
      {
         var restData = {};
         var xhrData = {};
         xhrData[ "containerId"         ] =  tagUid;
         xhrData[ "refreshSectionIds"   ] =  "";
         xhrData[ "callbackFn"          ] =  "removeDOMItemV2";
         xhrData[ "callbackParameters"  ] =  tr;
         xhrData[ "nextView"            ] =  "";

         restData[ "method"             ] =  "DELETE";
         restData[ "dataObj"            ] =  getTagParm( "dataObj", tagUid );
         restData[ "command"            ] =  "" // command is implied in DELETE method
         restData[ "identifier"         ] =  "Delete/" + getTagParm( "dataObj", tagUid ) + "/" + getTagParm( "locatorId", tagUid );
         restData[ "locatorId"          ] =  Number( getTagParm( "locatorId", tagUid ) );
         restData[ "locatorType"        ] =  Number( getTagParm( "locatorType", tagUid ) );
         restData[ "locatorRelationship"] =  Number( getTagParm( "locatorRelationship", tagUid ) );
         restData[  "locatorRecordType" ] =  getLocatorRecordTypeByView( getTagParm( "recordType", tagUid ), tagUid );
         restData[ "dataReq"            ] =  getTagParm( "dataReq", tagUid );
         restData[ "reqJson"            ] =  {}
         restData[ "xhrData"            ] =  xhrData;

         xhrREST( restData );
      }
    }
    else
    {
      $(icon).closest(containerTag).css("background-color", origBG);
    }
  }, 100);
}

function populateV2( method,
                     dataObj,
                     command,
                     locatorType,
                     locatorId,
                     locatorRelationship,
                     locatorRecordType,
                     viewName,
                     tagUid,
                     containerId,
                     dataReq,
                     renderer )
{
   var restData = {};
   var xhrData = {};
   xhrData[ "containerId"         ] =  containerId;
   xhrData[ "refreshSectionIds"   ] =  "";
   xhrData[ "callbackFn"          ] =  ""
   xhrData[ "callbackParameters"  ] =  "";
   xhrData[ "nextView"            ] =  "";

   restData[ "method"             ] =  method
   restData[ "dataObj"            ] =  dataObj
   restData[ "command"            ] =  command
   restData[ "identifier"         ] =  method +"/" + dataObj + " " + locatorType + "/" + locatorId + "/" + locatorRelationship + "/" + getLocatorRecordTypeByView( locatorRecordType, tagUid ) + "/" + viewName
   restData[ "locatorId"          ] =  locatorId
   restData[ "locatorType"        ] =  locatorType
   restData[ "locatorRelationship"] =  locatorRelationship
   restData[ "locatorRecordType"  ] =  getLocatorRecordTypeByView( locatorRecordType, tagUid )
   restData[ "dataReq"            ] =  dataReq
   restData[ "reqJson"            ] =  {}
   restData[ "viewName"           ] =  viewName
   restData[ "tagUid"             ] =  tagUid
   restData[ "renderer"           ] =  renderer
   restData[ "xhrData"            ] =  xhrData;

   xhrREST( restData );
}

function actionButton( method,
                     dataObj,
                     command,
                     locatorId,
                     locatorType,
                     locatorRelationship,
                     locatorRecordType,
                     rangeBgn,
                     rangeEnd,
                     page,
                     count,
                     tagUid
                     )
{
   var restData = {};
   var xhrData = {};
   xhrData[ "containerId"         ] =  "";
   xhrData[ "refreshSectionIds"   ] =  "";
   xhrData[ "callbackFn"          ] =  "";
   xhrData[ "callbackParameters"  ] =  "";
   xhrData[ "nextView"            ] =  "";

   restData[ "method"             ] =  method
   restData[ "dataObj"            ] =  dataObj
   restData[ "command"            ] =  command
   restData[ "identifier"         ] =  method +"/" + dataObj + " " + locatorType + "/" + locatorId + "/" + locatorRelationship + "/" + locatorRecordType
   restData[ "locatorId"          ] =  locatorId
   restData[ "locatorType"        ] =  locatorType
   restData[ "locatorRelationship"] =  locatorRelationship
   restData[ "locatorRecordType"  ] =  getLocatorRecordTypeByView( locatorRecordType, tagUid )
   restData[ "dataReq"            ] =  ""
   restData[ "reqJson"            ] =  {}
   restData[ "viewName"           ] =  ""
   restData[ "tagUid"             ] =  ""
   restData[ "renderer"           ] =  ""
   restData[ "xhrData"            ] =  xhrData;
   restData[ "rangeBgn"           ] =  rangeBgn;
   restData[ "rangeEnd"           ] =  rangeEnd;
   restData[ "page"               ] =  page;
   restData[ "count"              ] =  count;

   xhrREST( restData );
}


function removeDOMItem( anElement )
{
   anElement.remove();
}

function removeDOMItemV2( respJson, anElement )
{
   anElement.remove();
}

function addSectionListItem(tagUid, id, loc, forceRefreshTagUid, theObjectClassID, theFn ) {
  // new or existing based on id
  // in some situations, addIcon is hidden after single add (attributes w/ cardinality=1); area is still clickable... if icon not visible, don't process

  var addItemsIconElement = document.getElementById(
    "sectionList_addItems" + tagUid
  );

  //    console.log( "addSectionListItem( " + tagUid + ", " + id + ", " + loc + " )" );

  if (addItemsIconElement != null) {
    if (addItemsIconElement.style.display == "none") return false;
  }

  var viewNames = getTagParm("viewNames", tagUid);
  var viewId = "section_view" + tagUid;
  var containerRootId = "section_viewlayer" + tagUid;
  var tableIdRoot = getTagParm("tableIdRoot", tagUid);
  var addUrl = getTagParm("addUrl", tagUid);

  var tableId =
    tableIdRoot +
    "_" +
    getThisViewName(viewNames, viewId, containerRootId, "", tagUid);

  var containerId = createId();
  var tableElement = document.getElementById(tableId);
  //    console.log( "tableId " + tableId );
  if (tableElement != null) {
    // first remove 'No Entries Found' row if it exists
    for (var i = 0, row; (row = tableElement.rows[i]); i++) {
      //          console.log( i + " row.id " + row.id );
      if (row.id == tableId + "_NoRecords") {
        //             console.log( "remove" );
        row.remove();
        break;
      }
    }
    var trElement;
    // now add the row
    if (loc != "") trElement = tableElement.insertRow(loc);
    else trElement = tableElement.insertRow(); // bottom of table
    trElement.id = containerId;
    trElement.className = "row0";
    //       console.log( "add row ..." +trElement.id );
  } else {
//    console.error("addSectionListItem() -- tableElement not found: " + tableId);
//    2023-08-16 moving from lists in table to lists in responsive row/col
      var newRow = document.createElement("div");
      newRow.className = "jwmbos-row row0";
      newRow.id = containerId;
      document.getElementById( "listContainer"+tagUid ).prepend( newRow );
  }

  if ((typeof theFn == "undefined") || ( theFn == "" ) )
  {
     if (id == -1) {
       setTagParm("fn", "createNew", tagUid);

     } // addExisting
     else {
       setTagParm("fn", "addExisting", tagUid);
       setTagParm("id", id, tagUid);
     }
  }
  else {
     setTagParm("fn", theFn, tagUid);
  }

  if ((typeof theObjectClassID == "undefined") || ( theObjectClassID == -1 ))
  {
     setTagParm("objectClassID", getTagParm("memberClassID", tagUid), tagUid); // swap the 'list' model handler class to the 'member' model handler class
  }
  else
  {
     setTagParm("objectClassID", theObjectClassID, tagUid); // use the one that was passed in (used to add invoice/lederitem to statementitemlist)
  }

  //console.log( "callServer..." );
  callServer(
    tagUid,
    addUrl,
    containerId,
    getTagParm("addedItemView", tagUid),
    forceRefreshTagUid
  );
}

function getLocatorRecordTypeByView( aRecordType, tagUid )
{
  if ( (""+aRecordType).indexOf( ";" ) == -1 ) return( Number( aRecordType ) );

  var locatorRecordTypeArray = (""+aRecordType).split(";");
  var aView = 1;
  try
  {
     var viewsDropDownElement = document.getElementById("viewList" + tagUid);
     var aView = viewsDropDownElement.selectedIndex
  }
  catch( e )
  {
  }
  return ( Number( locatorRecordTypeArray[ aView - 1] ) );
}

function populateViewHeader(tagUid) {
  var viewsDropDownElement = document.getElementById("viewList" + tagUid);
  var view = viewsDropDownElement.selectedIndex;
  //    console.log( "view: " + view );

  var viewHeaders = getTagParm("viewHeaders", tagUid);
  //    console.log( "viewHeaders: " + viewHeaders );
  if (viewHeaders == "") return;

  var viewHeaderArray = viewHeaders.split(";");
  var thisViewHeader = viewHeaderArray[view - 1];
  //    console.log( "ThisViewHeader: " + thisViewHeader );

  // force a refresh each time...
  var viewHeaderElement = document.getElementById(
    "section_viewHeader" + tagUid
  );
  document.getElementById(
    "pendingRefreshFlag_section_viewHeader" + tagUid
  ).checked = true;

  callServer(tagUid, "", "section_viewHeader" + tagUid, thisViewHeader);
}

function populate(tagUid, url, containerId, aViewName, aTagName, aLocatorRelationship ) {
  //    console.log( "populate() " + aViewName );
  //    console.trace();
  //      console.log( "populate( " + tagUid + ", " + url + ", " + containerId + ", " + aViewName + ", " + aTagName + " )" );
  //      console.log( "id="+getTagParm( "id", tagUid ) + " subid="+getTagParm( "subid", tagUid ));
  var pageElement = document.getElementById("page" + tagUid);
  if (pageElement != null) setTagParm("page", pageElement.value, tagUid);

  var countElement = document.getElementById("count" + tagUid);
  if (countElement != null) setTagParm("count", countElement.value, tagUid);

  var searchElement = document.getElementById("search" + tagUid);
  if (searchElement != null) {
    setTagParm("search", searchElement.value, tagUid);
  }

  var filterElement = document.getElementById("filter" + tagUid);
  if (filterElement != null) {
    setTagParm("typeFilter", filterElement.value, tagUid);
    setTagParm("filterSelect", filterElement.value, tagUid);
  }

  var deepSearchElement = document.getElementById("deepSearch" + tagUid);
  var searchType = 1;
  if (deepSearchElement != null) {
    searchType = deepSearchElement.value;
  }
  setTagParm("deepSearch", searchType, tagUid);

  //    console.log( "Populate: " + getTagParm( "tagName", tagUid ) + " " + tagUid + " - " + containerId + " - " + aViewName );
  callServer(tagUid, url, containerId, aViewName, '', aLocatorRelationship );
}

function doExport(tagUid, exportUrl) {
  //    console.log( "export() " + tagUid + " " + exportUrl );
  if (
    !confirm(
      "Exporting of this list to CSV format may take several minutes, depending on the size of the list.\n\nContinue?"
    )
  )
    return false;

  var searchElement = document.getElementById("search" + tagUid);
  if (searchElement != null) {
    setTagParm("search", searchElement.value, tagUid);
  }

  var filterElement = document.getElementById("filter" + tagUid);
  if (filterElement != null) {
    setTagParm("typeFilter", filterElement.value, tagUid);
  }

  var deepSearchElement = document.getElementById("deepSearch" + tagUid);
  var searchType = 1;
  if (deepSearchElement != null) {
    searchType = deepSearchElement.value;
  }
  setTagParm("deepSearch", searchType, tagUid);
  setTagParm("count", "9999999", tagUid);

  callServer(tagUid, exportUrl, "SaveAs", "--");
}

// need to get some sort of GPS location results before continuing
function callServer(tagUid, url, containerId, aViewName, forceRefreshTagUid, aLocatorRelationship ) {
  if (getTagParm("requireLocation", tagUid) != "true" || latitude != "") {
    //not required or already set, don't request location info
    callServerImpl(tagUid, url, containerId, aViewName, forceRefreshTagUid, aLocatorRelationship);
    return;
  }
  if (navigator.geolocation) {
    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
    };

    const geoSuccess = (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callServerImpl(tagUid, url, containerId, aViewName, forceRefreshTagUid);
    };

    const geoFailure = (geoErr) => {
      console.log(`Location Services Error ${geoErr}`);
      latitude = "x";
      longitude = "x";
      callServerImpl(tagUid, url, containerId, aViewName, forceRefreshTagUid);
    };

    navigator.geolocation.getCurrentPosition(
      geoSuccess,
      geoFailure,
      geoOptions
    );
  }
}

function callServerImpl(
  tagUid,
  url,
  containerId,
  aViewName,
  forceRefreshTagUid,
  aLocatorRelationship
) {
  //    console.log( "callServer( " + tagUid + ", " + url + ", " + containerId + ", " + aViewName + " )" );
  //    console.log( "id="+getTagParm( "id", tagUid ) + " subid="+getTagParm( "subid", tagUid ));

  if (url == "") url = getTagParm("url", tagUid);
  var viewNames = getTagParm("viewNames", tagUid);
  var warning = getTagParm("warning", tagUid);
  var viewDisplay = getTagParm("viewDisplay", tagUid);

  var context = getTagParm("context", tagUid);
  if (context == "") context = "cis";

  setTagParmIfBlank("database", "jwmbos", tagUid); // force 'database' parm for jdbc datasource... but only if database parm empty
  //    console.log( "Database: " + context );

  setTagParm(
    "debugUid",
    "_" + getTagParm("tagName", tagUid) + tagUid + "_" + createId(),
    tagUid
  );

  setTagParm("currURL", document.location, tagUid);

  // ipify script loaded with other js loads after jwmbos.js load; callback sets global variable used here
  //    setTagParm( "clientIPAddress", clientIPAddress, tagUid );

  setTagParm("latitude", latitude, tagUid);
  setTagParm("longitude", longitude, tagUid);

  //  console.log( "Send Lat/Lng " + latitude + " / " + longitude );

  var d = new Date();
  setTagParm("timeZone", d.getTimezoneOffset() / 60, tagUid); // method returns offset minute... convert to hours

  var viewId = "section_view" + tagUid;
  var busyIcon = "section_busy" + tagUid;
  var containerRootId = "section_viewlayer" + tagUid;

  var primaryViewName = getThisViewName(
    viewNames,
    viewId,
    containerRootId,
    viewDisplay,
    tagUid
  );
  setTagParm("primaryViewName", primaryViewName, tagUid); // need to pass primary viewName for title and footer use
  //    console.log( "primaryViewName " + primaryViewName );

  if (containerId == "") {
    // addSectionListItem() generates its own containerId
    var view = "1";
    var viewElement = document.getElementById(viewId);
    if (viewElement != null) view = viewElement.value;

    var containerId = containerRootId + "_" + view;
    var thisViewName = getThisViewName(
      viewNames,
      viewId,
      containerRootId,
      viewDisplay,
      tagUid
    );
  }

  var tableIdRoot = getTagParm("tableIdRoot", tagUid);
  var tableId =
    tableIdRoot +
    "_" +
    getThisViewName(viewNames, viewId, containerRootId, viewDisplay, tagUid);
  setTagParm("tableId", tableId, tagUid);
//  console.log( "tableId " + tableId );

  if (aViewName != "") thisViewName = aViewName; // override used typically for 'createNew', title, footer, etc

  //    console.log( "ContainerId: " + containerId );
  var container = document.getElementById(containerId);
  try {
    if (container == null) {
      console.error("populate() invalid container id: " + containerId);
      /////    return;    // for now, go ahead and do the call since it might be a create where insert table doesn't exist... still want to create
    }
    //      else if ( container.innerHTML.trim().indexOf( 'gstatic.com' ) > 0 ) // this is special case for google maps
    //      {
    //       console.log( "contains google map" );
    //      }
    else if (
      container.innerHTML.trim().length > 5 &&
      document.getElementById("pendingRefreshFlag_" + containerId).checked ==
        false &&
      container.innerHTML.indexOf(pendingRefreshFlagText) == -1
    ) {
//                console.log( "Container already populated " + containerId);
//                console.log( "Container already populated " + containerId  + " = " + container.innerHTML.trim());
      return; // only load contents once
    }
  } catch (err) {
    console.error("pendingRefreshFlag_" + containerId + " -- " + err);
  }
  if (warning != "") {
    var messageDiv = document.getElementById("section_message" + tagUid);
    if (messageDiv != null) {
      messageDiv.innerHTML = warning;
      messageDiv.style.display = "block";
      setTimeout(function () {
        messageDiv.style.display = "none";
      }, 2000); // turn off message after 2 seconds
    } else {
      console.error("messageDiv is null");
    }
  }

  var ajaxRequest = getAjaxRequestObject();
  ajaxRequest.onreadystatechange = function () {
    insertContents(ajaxRequest, containerId, busyIcon, forceRefreshTagUid);
  };

  setBusy(busyIcon, "inline");

  setTagParm("user", getUserName(), tagUid);
  setTagParm("currUserId", getCurrUserId(), tagUid);
  setTagParm("viewName", thisViewName, tagUid); // this is the current viewName extracted from viewNames
  setTagParm("reqUid", generateReqUid(), tagUid);

  setTagParm( "windowLocationOrigin", window.location.origin, tagUid );
  setTagParm( "windowLocationPathName", window.location.pathname, tagUid  );
  setTagParm( "windowLocationPathSearch", window.location.search, tagUid  );

  var forceView = getTagParm("forceView", tagUid);
  if (forceView != "") {
    //      console.log( "Force View: " + forceView );
    setTagParm("viewName", forceView, tagUid);
  }
  showParms(tagUid);

  if ( getTagParm( "apiVersion", tagUid ) == 1 )
  {
     ajaxRequest.open("POST", url, true);
     ajaxRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
     ajaxRequest.setRequestHeader( "x_timezone", Intl.DateTimeFormat().resolvedOptions().timeZone );
     ajaxRequest.send(getParmsAsString(tagUid) + "&uid_=" + uid++);
     //    ajaxRequest.send( getFormData(tagUid) ); // alt method... not supported on all browsers, but needed for fileUpload

  }

  else if ( getTagParm( "apiVersion", tagUid ) == 2 ) // api version 2 (9/28/21)
  {
     var renderer = url; // the url is now the renderer (jsp)
     var dataObj =  getTagParm( "tagName", tagUid ).toLowerCase();
     var locatorId = Number( getTagParm( "id", tagUid ) );
     var locatorType = dataObj;
     var locatorId = Number( getTagParm( "id", tagUid ) );
     var locatorRecordType = getLocatorRecordTypeByView( getTagParm( "type", tagUid ), tagUid );
     var restValue1 = "";
     var restValue2 = "";
     var restValue3 = "";
     var restValue4 = "";
     var restValue5 = "";
     var restValue6 = "";

     var locatorRelationship;
     if (( typeof aLocatorRelationship != 'undefined' )
        && ( aLocatorRelationship != '' ) )
     {
        locatorRelationship = aLocatorRelationship;
     }
     else if ( locatorId < 1 ) // id not specified; assume ownerType/ownerid
     {
        locatorId = Number( getTagParm( "ownerId", tagUid ) );
        locatorType = Number( getTagParm( "ownerType", tagUid ) );
        locatorRelationship = "owner";

        if ( locatorId < 1 ) // still not found... try actual locator names
        {
           locatorId = Number( getTagParm( "locatorId", tagUid ) );
           locatorType = Number( getTagParm( "locatorType", tagUid ) );
           locatorRelationship = Number( getTagParm( "locatorRelationship", tagUid ) );
           locatorRecordType = getLocatorRecordTypeByView( getTagParm( "locatorRecordType", tagUid ), tagUid );
           restValue1 = Number( getTagParm( "restValue1", tagUid ) );
           restValue2 = Number( getTagParm( "restValue2", tagUid ) );
           restValue3 = Number( getTagParm( "restValue3", tagUid ) );
           restValue4 = Number( getTagParm( "restValue4", tagUid ) );
           restValue5 = Number( getTagParm( "restValue5", tagUid ) );
           restValue6 = Number( getTagParm( "restValue6", tagUid ) );
        }
     }
     else
     {
        locatorRelationship = "id";
     }
     url = "/../"+dataObj+"/"+locatorId+"/"+locatorType+"/"+locatorRelationship+"/"+ getLocatorRecordTypeByView( locatorRecordType, tagUid );
     if ( restValue1 != "" ) url += "/"+restValue1;
     if ( restValue2 != "" ) url += "/"+restValue2;
     if ( restValue3 != "" ) url += "/"+restValue3;
     if ( restValue4 != "" ) url += "/"+restValue4;
     if ( restValue5 != "" ) url += "/"+restValue5;
     if ( restValue6 != "" ) url += "/"+restValue6;

     var dataReqList = getTagParm( "dataReq", tagUid ).split(",")
     var dataReq = "[";
     if ( locatorRelationship != 13 ) // full dataReq not required for search options box
     {
        for (var i = 0; i < dataReqList.length; i++ )
        {
           if ( i > 0 ) dataReq += ", ";
           dataReq += '"'+dataReqList[i]+'"'
        }
     }
     else
     {
        dataReq += '"*PageBasic","bgnSearchDefault","endSearchDefault"'
     }
     dataReq += "]";

     var pageElement = document.getElementById("page" + tagUid);
     var countElement = document.getElementById("count" + tagUid);
     var rangeBgnElement = document.getElementById("rangeBgn" + tagUid);
     var rangeEndElement = document.getElementById("rangeEnd" + tagUid);

     ajaxRequest.open("GET", url, true);
     ajaxRequest.setRequestHeader( "Content-type",    "application/x-www-form-urlencoded" );
     ajaxRequest.setRequestHeader( "authorization",   "Session"                   );
     ajaxRequest.setRequestHeader( "x_identifier",    "PageREST"                  );
     ajaxRequest.setRequestHeader( "x_reqUid",        createId()                  );
     ajaxRequest.setRequestHeader( "x_timeStamp",     new Date()                  );
     ajaxRequest.setRequestHeader( "x_logLevel",      "1200"                      );
     ajaxRequest.setRequestHeader( "x_ipAddress",     "192.168.1.1"               );
     ajaxRequest.setRequestHeader( "x_appInstanceId", "28005"                     );
     ajaxRequest.setRequestHeader( "x_dataReq",       dataReq                     );
     ajaxRequest.setRequestHeader( "x_renderer",      renderer                    );
     ajaxRequest.setRequestHeader( "x_tagUid",        tagUid                      );
     ajaxRequest.setRequestHeader( "x_viewName",      getTagParm("viewName", tagUid));
     ajaxRequest.setRequestHeader( "x_requestJson",   JSON.stringify(getParmsAsJson(tagUid,true)) );// 2024-07-23 potential to be too long! (Chrome and Firefox handle that error differently) change to omitBlanks
     ajaxRequest.setRequestHeader( "x_timezone",      Intl.DateTimeFormat().resolvedOptions().timeZone );
     ajaxRequest.setRequestHeader( "x_tableId",       tableId );

     var searchElement1 = document.getElementById("search" + tagUid);
     if (searchElement1 != null) {
        ajaxRequest.setRequestHeader( "x_search", searchElement1.value );
     }

     if ( pageElement != null ) ajaxRequest.setRequestHeader( "x_page",          pageElement.value           );
     else                       ajaxRequest.setRequestHeader( "x_page",          Number( 1 )          );

     if ( countElement != null ) ajaxRequest.setRequestHeader( "x_count",          countElement.value           );
     else                        ajaxRequest.setRequestHeader( "x_count",          Number( 100 )          );

     if ( rangeBgnElement != null ) ajaxRequest.setRequestHeader( "x_rangeBgn",          rangeBgnElement.value           );
     else                           ajaxRequest.setRequestHeader( "x_rangeBgn",          "2021-01-01 00:00:00"        );

     if ( rangeEndElement != null ) ajaxRequest.setRequestHeader( "x_rangeEnd",          rangeEndElement.value           );
     else                           ajaxRequest.setRequestHeader( "x_rangeEnd",          "2030-12-31 23:59:59"          );

//2024-06-17 header too long... tried this.. but body is discarded unless put or post
//   var jsonString = JSON.stringify(getParmsAsJson(tagUid));
//   var body = '';
//
//   if ( jsonString.length < 3000 )
//   {
//      ajaxRequest.setRequestHeader( "x_requestJson", jsonString  );
//   }
//   else
//   {
//      body = jsonString;
//   }
//   ajaxRequest.send( body );
     ajaxRequest.send();
  }
}

function insertContents(
                         ajaxRequest,
                         containerId,
                         busyIcon,
                         forceRefreshTagUid
                       )
{
   if (ajaxRequest.readyState == 4)
   {
      timer.resetTimer();

//    console.log( "busy off " + busyIcon );
      setBusy(busyIcon, "none");

//    console.log( "insertContents() - " + containerId + " " + busyIcon);
//    console.log( "insertContents() - " + containerId + " =\n " + ajaxRequest.responseText.trim() );
//    console.log( "----------------------------------------------------------------------------");

    var responseText = ajaxRequest.responseText.trim();

    if (ajaxRequest.status === 200) {
      var contentType = ajaxRequest.getResponseHeader("content-type");
      //         console.log( "content-type: " + contentType );

      if (contentType.indexOf("application/csv") == -1) {
        if (responseText.indexOf("[Msg:") == 0) {
          // replacing ".startsWith()" due to dinosaur IE-11 javascript version doesn't support
          var delimiterOffset = responseText.indexOf("]");
          var msgText = responseText.substring(5, delimiterOffset);
          responseText = responseText.substring(delimiterOffset + 1);
          alert(msgText);
        }

        if (document.getElementById(containerId) != null) {
          var embeddedScripts;
          //               if ( document.getElementById( containerId).innerHTML.trim().indexOf( 'gstatic.com' ) > 0 ) // this is special case for google maps
          //               {
          //                  // do NOT replace contents of container if it contains a googleMap
          //                  // but still need to store responseText in an element in order to check for script eval below
          //                  tmp = document.createElement('div');
          //                  tmp.style.display = 'none';
          //                  tmp.innerHTML = responseText;
          //                  embeddedScripts = tmp.getElementsByTagName('script');
          //               }
          //               else // not google map
          //               {
          document.getElementById(containerId).innerHTML = responseText;
          try {
            document.getElementById(
              "pendingRefreshFlag_" + containerId
            ).checked = false;
          } catch (err) {
            //???                console.error( "Could not reset pendingRefreshFlag_"+containerId + " " + err );
          }

          embeddedScripts = document
            .getElementById(containerId)
            .getElementsByTagName("script");
          //                  console.log( "total embeddedScripts: " + embeddedScripts.length );
          //               }

          for (var iii = 0; iii < embeddedScripts.length; iii++) {
            var aScript = embeddedScripts[iii];
//                             console.log( "eval " + aScript.innerHTML);

            if (aScript.getAttribute("src") != null) {
              document.appendChild(aScript);
            } else {
              try {
                var evalReturn = eval(aScript.innerHTML);
                //                       if ( evalReturn != "" )
                //                       {
                //                          console.log( "Eval Return: " + evalReturn );
                //                          aScript.outerHTML = evalReturn;
                //                       }
              } catch (err) {
                console.error("Eval err: " + err);
                console.error(
                  "Eval exception: [" +
                    err.message +
                    "] ===> (Eval) \n>>>>>>>>>>" +
                    aScript.innerHTML +
                    "\n<<<<<<<<<<<"
                );
              }
            }
          }
          if ((typeof forceRefreshTagUid != "undefined")
             && (forceRefreshTagUid != "" ) )
          {
            forceRefresh(forceRefreshTagUid);
          }
        } else {
          console.error(
            "ajaxSection.insertContents() -- invalid containerId -- " +
              containerId
          );
        }
      } // csv download
      else {
        // Try to find out the filename from the content disposition `filename` value
        var disposition = ajaxRequest.getResponseHeader("content-disposition");
        var matches = /"([^"]*)"/.exec(disposition);
        var filename = matches != null && matches[1] ? matches[1] : "hml.csv";

        // this is a hack... not clean... but apparently only way to invoke the saveAs dialog
        var blob = new Blob([ajaxRequest.response], {
          type: "application/csv",
        });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}

function hideAddIcon(tagUid) {
  var addItemsIconElement = document.getElementById(
    "sectionList_addItems" + tagUid
  );
  if (addItemsIconElement != null) addItemsIconElement.style.display = "none";
}

function forceRefresh(tagUid) {
  if (document.getElementById("section_refresh" + tagUid) != null) {
    document.getElementById("section_refresh" + tagUid).click();
  } else {
    console.error(
      "forceRefresh() -- Element section_refresh" +
        tagUid +
        " was not found.  Cannot refresh section"
    );
  }
}

function newIdRefresh(idVar, idValue, tagUid, viewName) {
  //    console.log( "newIdRefresh " + idVar + " " + idValue  + " " + viewName );
  setTagParm(idVar, idValue, tagUid, true); //force the new id into the contact tag
  setTagParm("forceView", viewName, tagUid, false);
  forceRefresh(tagUid);
}

function forcePage1(tagUid) {
  var pageElement = document.getElementById("page" + tagUid);
  if (pageElement != null) {
    pageElement.value = 1;
  } else {
    console.error("pageElement not found " + tagUid);
  }
  setTagParm("page", 1, tagUid, true);
}

function changeView(tagUid, viewId) {
  var viewIconElement = document.getElementById(
    "viewIcon" + tagUid + "_" + viewId
  );
  viewIconElement.click();
}
var elements;
var stripe;

   async function submitStripeForm(clientSecret, hostName ) {
     try {
       const validateResult = await elements.submit();
       if (validateResult.error) {
         // Show error message
         alert( validateResult.error );
         console.log("ERROR: ", validateResult.error);
       }

       const submitResult = await stripe.confirmSetup({
         elements,
         clientSecret,
         confirmParams: {
           return_url: hostName+"/DriverSignUp",
         },
         redirect: "always",
       });

       if (submitResult.error) {
         throw submitResult.error;
       }

       return true;
     } catch (error) {
       // How should this be handled?
       alert( "Error:\n\nType: "+error.type + "\n\nCode: " + error.code + "\n\nReference: " + error.doc_url );
       return false;
     }
   }

   async function mountStripeElements(clientSecret, publicKey) {
     try {
       stripe = Stripe(publicKey);
       const appearance = {
         theme: "stripe",
       };
       const paymentOptions = {
         business: {
           name: "Wridz",
         },
         defaultValues: {
           billingDetails: {
             name: "",
           },
         },
         fields: {
           billingDetails: "auto",
         },
       };
       const addressOptions = {
         mode: "billing",
       };
       elements = stripe.elements({
         clientSecret: clientSecret,
         appearance,
       });
       const paymentElement = elements.create("payment", paymentOptions);
       const addressElement = elements.create("address", addressOptions);

       paymentElement.mount("#stripePaymentElement");
       addressElement.mount("#stripeAddressElement");

       return true;
     } catch (error) {
       // How should this be handled?
       alert(error);
       return false;
     }
   }
function requestConfirmationSubscribeToNewRegion( tagUid )
{
   var selectedRegionElement = document.querySelector('input[name = "regionSelection"]:checked');

   if ( selectedRegionElement == null )
   {
       alert('Please select a region from the list'); //Alert, nothing was checked.
       return( false );
   }

   setTagParm( "selectedRegionId", selectedRegionElement.value, tagUid, true );
   setTagParm( "requestConfirmationSubscribeToNewRegion", "true", tagUid, true );
   document.getElementById('viewIcon'+tagUid+'_3').click();
}

function subscribeToRegionConfirmed( selectedRegionId, memberId, tagUid )
{
   setTagParm( "selectedRegionId", selectedRegionId, tagUid, true );
   setTagParm( "memberId", memberId, tagUid, true );
   setTagParm( "addSubscriptionConfirmed", "true", tagUid, true );
   setTagParm( "requestConfirmationSubscribeToNewRegion", "false", tagUid, true ); // this parm will still be present from previous call.  Make sure it isn't processed again
   document.getElementById('viewIcon'+tagUid+'_1').click();
}

function updateSubscriptionStatus( newStatus, subscriptionId, theButton, tagUid )
{
   var url = "/cis/JWMBOS";

   var reqJson  = {};
   reqJson[ "table"         ] =  "GROUPMEMBERMAP";
   reqJson[ "col"           ] =  "REGIONSUBSCRIPTION"
   reqJson[ "identifier"    ] =  "pauseSubscription";
   reqJson[ "objId"         ] =  Number( subscriptionId );
   reqJson[ "value"         ] =  Number( newStatus ) ;

   xhrUpdate( "POST",
              url,
              reqJson,
              tagUid,
              theButton.id,  // reference element for busy icon location
              tagUid,        // refresh sectionId
              "",
              ""
            );
}
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


   function newTicket()
   {
      var templateId = getElementByName( "ticketTemplateSelect" ).value;
   }

   function contactUsTicket( aFormId, tagUid, source, regionId, refType, refId )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, 'name'+tagUid  );
      doValidate( aForm, 'emailAddress'+tagUid );
      doValidate( aForm, 'phoneNumber'+tagUid );
      doValidate( aForm, 'comments'+tagUid );
      doValidate( aForm, 'region'+tagUid );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }

      var name = getElementByName( 'name'+tagUid ).value;
      var emailAddress = getElementByName( 'emailAddress'+tagUid ).value;
      var altContact = getElementByName( 'altContact'+tagUid ).value;
      var phoneNumber = getElementByName( 'phoneNumber'+tagUid ).value;
      var userPersonId = getElementByName( 'userPersonId'+tagUid ).value;
      if ( userPersonId == null ) userPersonId = "-1";
      var comments = getElementByName( 'comments'+tagUid ).value;

      if ( regionId == "" )
      {
         regionId = getElementByName( 'region'+tagUid ).value;
      }

      var templateId = "-1";
      if ( source == "Calendar" ) templateId = "124"
      if ( source == "menu"     ) templateId = "139"
      if ( source == "trip"     ) templateId = "139"        // <==============================================================================

//    console.log( name + " " + emailAddress + " " + source + " " + regionId + " " + comments );

      var url = "/wridz/WebService.json";
      var reqJson  = {};

      reqJson[ "dataObj"       ] =  "Ticket";
      reqJson[ "command"       ] =  "createTicket";
      reqJson[ "identifier"    ] =  "ContactUsTicket";
      reqJson[ "name"          ] =  name;
      reqJson[ "emailAddress"  ] =  emailAddress;
      reqJson[ "phoneNumber"   ] =  phoneNumber;
      reqJson[ "altContact"    ] =  altContact;
      reqJson[ "comments"      ] =  comments;
      reqJson[ "regionId"      ] =  Number( regionId );
      reqJson[ "refType"       ] =  Number( refType );
      reqJson[ "refId"         ] =  Number( refId   );
      reqJson[ "userPersonId"  ] =  Number( userPersonId );
      reqJson[ "templateId"    ] =  Number( templateId );

      xhrService( "POST",
                  url,
                  reqJson,
                  tagUid,
                  tagUid,
                  tagUid,
                  "",
                  ""
                );

      getElementByName( 'name'+tagUid ).value = "";
      getElementByName( 'emailAddress'+tagUid ).value = "";
      getElementByName( 'userPersonId'+tagUid ).value = "";
      getElementByName( 'comments'+tagUid ).value ="";
      getElementByName( 'region'+tagUid ).value ="";

      createAlert( 1, "Your message has been sent." );
   }

   function replyToTicket( aFormId, tagUid, ticketId, refreshSectionIds )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, 'comments'+tagUid );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }
      var comments = getElementByName( 'comments'+tagUid ).value;

      var url = "/wridz/WebService.json";
      var reqJson  = {};

      reqJson[ "dataObj"       ] =  "Ticket";
      reqJson[ "command"       ] =  "replyToTicket";
      reqJson[ "identifier"    ] =  ticketId;
      reqJson[ "comments"      ] =  comments;
      reqJson[ "ticketId"      ] =  Number( ticketId );

      xhrService( "POST",
                  url,
                  reqJson,
                  tagUid,
                  tagUid,
                  refreshSectionIds,
                  "",
                  ""
                );
      createAlert( 1, "Your response has been added to the ticket." );
   }

   function searchTickets( tagUid )
   {
      forcePage1(tagUid);

      var dateField = getElementByName( "searchTicketDateBgn" );
      setTagParm( "searchBgnDate", dateField.value, tagUid, true );

      dateField = getElementByName( "searchTicketDateEnd" );
      setTagParm( "searchEndDate", dateField.value, tagUid, true );

      var searchTicketIdField = getElementByName( "searchTicketId" );
      var searchTicketId = searchTicketIdField.value;
      if ( isNaN( searchTicketId ) ) searchTicketId = -1;
      setTagParm( "searchTicketId", searchTicketId, tagUid, true );

      var searchTicketStatusField = getElementByName( "searchTicketStatus" );
      var searchTicketStatus = searchTicketStatusField.value;
      setTagParm( "searchTicketStatus", searchTicketStatus, tagUid, true );

      var searchTicketSeverityField = getElementByName( "searchTicketSeverity" );
      var searchTicketSeverity = searchTicketSeverityField.value;
      setTagParm( "searchTicketSeverity", searchTicketSeverity, tagUid, true );

      var searchTicketKeywordField = getElementByName( "keywordSearch" );
      var searchTicketKeyword = searchTicketKeywordField.value;
      setTagParm( "searchKeyword", searchTicketKeyword, tagUid, true );


      document.getElementById( 'section_refresh'+tagUid ).click();
   }
function utcToLocal( utcTime, format )
{
   if ( typeof format == "undefined") format = 'ddd, MMM D, YYYY hh:mm.ss a';
// console.log( "Format: " + format );
// console.log( "utcTime " + utcTime );
   if ( utcTime == '' ) return( '' );
   try
   {
      var localTime  = moment.utc(utcTime).toDate();
      var timeString  =moment(localTime).format(format);
   }
   catch( error )
   {
      return( error );
   }
// console.log( ">>> localTime " + timeString);
   return( timeString );
}

function localToUtc( localTime, format )
{

   if ( typeof format == "undefined") format = 'ddd, MMM D, YYYY hh:mm a';
   if ( localTime == "" ) return( "" );
 console.log( "localTime [" + localTime + "]");
   var utcTime = moment( localTime ).utc().format(format);
   var timeString  =moment(utcTime).format(format);
 console.log( ">>> utcTime " + utcTime );
   return( utcTime );
}

function utcToLocalContainer( utcTime, containerId, format )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime, format ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function utcDateToLocalContainer( utcTime, containerId )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime,'ddd, MMM D, YYYY' ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function utcTimeToLocalContainer( utcTime, containerId )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime, 'hh:mm.ss a' ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function utcTimeToLocalContainerNoSec( utcTime, containerId )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime, 'hh:mma' ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function timeCardTitleUtcToLocal(utcBgnTime, utcEndTime, containerId )
{
   var container = document.getElementById( containerId );
   container.innerHTML = utcToLocal( utcBgnTime ) + " ~ " + utcToLocal( utcEndTime );
}

function now()
{
   return( moment().utcOffset(0, true).format( 'ddd, MMM D, YYYY hh:mm A') );
}

function now( formatString )
{
   return( moment().utcOffset(0, true).format( formatString ));
}

function bgnRangeUtc( aDateTime )
{
   if ( aDateTime.indexOf( ":" ) == -1 )
   {
      return( localToUtc( moment(aDateTime, "MM/DD/YYYY" ), "YYYY-MM-DD hh:mm:ss" ));
   }
   else
   {
      return( localToUtc( aDateTime, "YYYY-MM-DD hh:mm:ss" ));
   }
}

function endRangeUtc( aDateTime )
{
   if ( aDateTime.indexOf( ":" ) == -1 )
   {
      return( localToUtc( moment( aDateTime + " 23:59:59", "MM/DD/YYYY hh:mm:ss" ), "YYYY-MM-DD hh:mm:ss" ));
   }
   else
   {
      return( localToUtc( aDateTime, "YYYY-MM-DD hh:mm:ss" ));
   }
}
   function searchTrips( tagUid )
   {
      forcePage1(tagUid);

      var dateField = getElementByName( "searchTripDateBgn"+tagUid );
      setTagParm( "searchBgnTimestamp", localToUtc( dateField.value ), tagUid, true );

      dateField = getElementByName( "searchTripDateEnd"+tagUid );
      setTagParm( "searchEndTimestamp", localToUtc( dateField.value ), tagUid, true );

      var inclTestTripsField = getElementByName( "inclTestTrips"+tagUid );
      setTagParm( "inclTestTrips", inclTestTripsField.checked, tagUid, true );

      var searchTripIdField = getElementByName( "searchTripId" );
      var searchTripId = searchTripIdField.value;
      if ( isNaN( searchTripId ) ) searchTripId = -1;
      setTagParm( "searchTripId", searchTripId, tagUid, true );

      var searchTripStateField = getElementByName( "searchTripState" );
      var searchTripState = searchTripStateField.value;
      if ( isNaN( searchTripState ) ) searchTripState = -1;
      setTagParm( "searchTripState", searchTripState, tagUid, true );

//    var searchAuditStateField = getElementByName( "searchAuditState" );
//    var searchAuditState = searchAuditStateField.value;
//    if ( isNaN( searchAuditState ) ) searchAuditState = -1;
//    setTagParm( "searchAuditState", searchAuditState, tagUid, true );

      var searchPassengerIdField = getElementByName( "searchPassenger" );
      var searchPassengerId = searchPassengerIdField.valueId; // made up attribute; see ajaxSuggest.js
      if ( isNaN( searchPassengerId ) ) searchPassengerId = -1;
      setTagParm( "searchPassengerId", searchPassengerId, tagUid, true );

      var searchPassengerLoginField = getElementByName( "searchPassengerByLogin" );
      var searchPassengerByLogin = searchPassengerLoginField.valueId; // made up attribute; see ajaxSuggest.js
      if ( typeof searchPassengerLoginField.valueId == 'undefined' ) searchPassengerByLogin = "";
      setTagParm( "searchPassengerByLogin", searchPassengerByLogin, tagUid, true );

      var searchDriverIdField = getElementByName( "searchDriver" );
      var searchDriverId = searchDriverIdField.valueId; // made up attribute; see ajaxSuggest.js
      if ( isNaN( searchDriverId ) ) searchDriverId = -1;
      setTagParm( "searchDriverId", searchDriverId, tagUid, true );

      var searchDriverLoginField = getElementByName( "searchDriverByLogin" );
      var searchDriverByLogin = searchDriverLoginField.valueId; // made up attribute; see ajaxSuggest.js
      if ( typeof searchDriverLoginField.valueId == 'undefined' ) searchDriverByLogin = "";
      setTagParm( "searchDriverByLogin", searchDriverByLogin, tagUid, true );


      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function replyToTripNotes( aFormId, tagUid, tripId )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, 'comments'+tagUid );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }
      var comments = getElementByName( 'comments'+tagUid ).value;

      var url = "/wridz/WebService.json";
      var reqJson  = {};

      reqJson[ "dataObj"       ] =  "Trip";
      reqJson[ "command"       ] =  "replyToTripNotes";
      reqJson[ "identifier"    ] =  tripId;
      reqJson[ "comments"      ] =  comments;
      reqJson[ "tripId"        ] =  Number( tripId );

      xhrService( "POST",
                  url,
                  reqJson,
                  tagUid,
                  tagUid,
                  tagUid,
                  "",
                  ""
                );
      createAlert( 1, "Your response has been added to the trip notes." );
   }

   function doLogin(aFormId, tagUid)
   {
      var busyIconId = "section_busy"+tagUid;
      document.getElementById( busyIconId ).style.display = "inline-block";

      document.getElementById( "loginErrorMsg" ).innerHTML = "";
      var ajaxRequest = getAjaxRequestObject();

      username = getValueByName( "j_username" );
      password = getValueByName( "j_password" );

      ajaxRequest.onreadystatechange = function() { handleLoginResponse( ajaxRequest, busyIconId, tagUid, aFormId );} ;

      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      // this is a 'fake' login just to determine if id/pw valid
      // we'll submit the real login if good response
      // do not want tomcat to send a separate login-failed page
      var params     = "username="+username
                      +"&password="+password
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&table=users"
                      +"&col=login";

      ajaxRequest.open("POST", serverCall, true);

      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function handleLoginResponse( ajaxRequest, busyIconId, tagUid, aFormId )
   {
      if (ajaxRequest.readyState == 4)
      {
         document.getElementById( busyIconId ).style.display = "none";

         var resp = ajaxRequest.responseText.replace(/^\s+|\s+$/g,"");

         if (( resp.indexOf( "AjaxRC:Ok" ) != -1 )
           ||  ( resp.indexOf( "already been authenticated" ) != -1 ))
         {
            var aForm = document.getElementById( aFormId );
            aForm.action = pageServletContext + "/j_security_check";
            aForm.submit();
         }
         else if ( resp.indexOf( "RC_ACCT_NOT_VALIDATED" ) != -1 )
         {
            var viewIcon = "viewIcon"+tagUid+"_2"
//          console.log( viewIcon );
            document.getElementById( viewIcon ).click();
         }
         else
         {
            if ( resp.indexOf( "Login failed" ) != -1 )
            {
               document.getElementById( "loginErrorMsg" ).innerHTML = "Your email address or password is incorrect"
            }
            else
            {
               parts = resp.split("|");
               if (parts.length > 1 )
               {
                  document.getElementById( "loginErrorMsg" ).innerHTML = parts[1];
               }
               else
               {
                  document.getElementById( "loginErrorMsg" ).innerHTML = resp;
               }
            }
         }
      }
   }

   function sendCreateUserCommand( aFormId, emailFieldName, tagUid )
   {
//    console.log( tagUid + " <== sendCreateUserCommand" );
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "searchEmailAddress" );

      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct error in email address" );
         return( false );
      }

      setTagParm( 'userId',       getValueByName( emailFieldName ), tagUid, true );
      setTagParm( 'command',      'CreateUser',                     tagUid, true );
      setTagParm( 'referer',      referer,                          tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function sendAcceptTermsAndConditionsCommand( tagUid )
   {
      setTagParm( 'command',      'AcceptTermsAndConditions', tagUid, true );
      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function sendRequestPasswordChangeCommand( aFormId, tagUid )
   {
//      console.log( tagUid + " <== sendRequestPasswordChangeCommand" );
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "username" );

      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct error in email address" );
         return( false );
      }

      setTagParm( 'userId',       getValueByName( 'username' ), tagUid, true );
      setTagParm( 'command',      'RequestPasswordChange',            tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function changePassword( id, aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "currentPassword" );
      doValidate( aForm, "newPassword" );
      doValidate( aForm, "verifyPassword" );

      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }
      if ( getValueByName( 'verifyPassword' ) != getValueByName( 'newPassword' ) )
      {
         createAlert( 3,  "Password verification does not match new password." );
         return( false );
      }

      var reqJson = {};
      reqJson[ "table"      ] =  "USERS";
      reqJson[ "col"        ] =  "CHANGEPASSWORD"
      reqJson[ "identifier" ] =  "USER / CHANGEPASSWORD"
      reqJson[ "objId"      ] =  id;
      reqJson[ "value"      ] =  getValueByName( 'newPassword' )
      reqJson[ "currPW"     ] =  getValueByName( 'currentPassword' )

      xhrUpdate( "POST",
                 "/cis/JWMBOS",
                 reqJson,
                 tagUid,
                 tagUid,
                 "",
                 ""
               );
   }

   function sendSetPasswordCommand( aFormId, tagUid )
   {
//    console.log( tagUid + " <== sendSetPasswordCommand" );
      setTagParm( 'password', getValueByName( "newPassword" ),    tagUid, true );
      setTagParm( 'command',  'SetPassword',                      tagUid, true );

      if (validateNewPassword( aFormId, tagUid ))
      {
         document.getElementById( 'section_refresh'+tagUid ).click();
      }
   }

   function sendRecoverySetPasswordCommand( aFormId, tagUid, userId )
   {
      setTagParm( 'command',  'RecoverySetPassword',              tagUid, true );
      setTagParm( 'password', getValueByName( "newPassword" ),    tagUid, true );
      setTagParm( 'userId',    userId,                            tagUid, true );

      if ( validateNewPassword( aFormId, tagUid ))
      {
         document.getElementById( 'section_refresh'+tagUid ).click();
      }
   }

   function sendUserChangePasswordCommand( aFormId, tagUid )
   {
//    console.log( tagUid + " <== sendUserChangePasswordCommand" );
      setTagParm( 'password', getValueByName( "newPassword" ),    tagUid, true );
      setTagParm( 'command',  'UserChangePassword',               tagUid, true );

      if ( validateNewPassword( aFormId, tagUid ) )
      {
         document.getElementById( 'section_refresh'+tagUid ).click();
      }
   }

   function validateNewPassword( aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "newPassword" );
      doValidate( aForm, "verifyPassword" );
      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }

      if ( getValueByName( "newPassword" ) != getValueByName( "verifyPassword" ) )
      {
         createAlert( 3,  "Passwords must match." );
         return( false );
      }
      return( true );
   }

   function sendUpdatePhoneNumberCommand( aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "phone" );
      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the phone number error." );
         return( false );
      }
      setTagParm( 'phoneNumber', getValueByName( "phone"), tagUid, true );
      setTagParm( 'command',  'UpdatePhoneNumber',         tagUid, true );
      setTagParm( 'sendTextVerification',  'false',        tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function sendUpdateAccountOwnerCommand( aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "lastName" );
      doValidate( aForm, "firstName" );
//    doValidate( aForm, "addressLine1"     );
//    doValidate( aForm, "city"     );
//    doValidate( aForm, "state"     );
//    doValidate( aForm, "zip"     );
      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }
      setTagParm( 'lastName',     getValueByName( "lastName"),     tagUid, true );
      setTagParm( 'firstName',    getValueByName( "firstName"),    tagUid, true );
//    setTagParm( 'addressLine1', getValueByName( "addressLine1"), tagUid, true );
//    setTagParm( 'addressLine2', getValueByName( "addressLine2"), tagUid, true );
//    setTagParm( 'city',         getValueByName( "city"),         tagUid, true );
//    setTagParm( 'state',        getValueByName( "state"),        tagUid, true );
//    setTagParm( 'zip',          getValueByName( "zip"),          tagUid, true );
      setTagParm( 'command',     'UpdateAccountOwner',             tagUid, true );
      setTagParm( 'referer',      referer,                         tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function goBack( tagUid, aCommand )
   {
//    setTagParm( 'viewName', 'locate',  tagUid, true );
      setTagParm( 'command',  aCommand,  tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }


   function sendResendEmailConfirmation(emailAddress, tagUid )
   {
      if (emailAddress == '' ) emailAddress = getValueByName( "j_username" );

      var busyIconId = "section_busy"+tagUid;
      document.getElementById( busyIconId ).style.display = "inline-block";

      getElementByName( "emailSentMsg" ).innerHTML = "";
      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { handleResendEmailConfirmationResponse( ajaxRequest, busyIconId, tagUid );} ;

      var serverCall = "/idmanager/jsp/ajax/ajaxGetUser.jsp";

      var params     = "command=ResendEmailConfirmation"
                      +"&objectClassID=78"  // ObjectClassID.USER
                      +"&userId="+emailAddress

      ajaxRequest.open("POST", serverCall, true);

      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function handleResendEmailConfirmationResponse( ajaxRequest, busyIconId, tagUid )
   {
      if (ajaxRequest.readyState == 4)
      {
         document.getElementById( busyIconId ).style.display = "none";

         var resp = ajaxRequest.responseText.replace(/^\s+|\s+$/g,"");

         var sentMsgElement = getElementByName( "emailSentMsg" );
         if ( resp.indexOf( "RC_SUCCESS" ) != -1 )
         {
            sentMsgElement.innerHTML = "Sent";
         }
         if ( resp.indexOf( "RC_USERID_NOT_FOUND" ) != -1 )
         {
            sentMsgElement.innerHTML = "Email address not found.";
         }
         if ( resp.indexOf( "RC_VALIDATION_NOT_REQUIRED" ) != -1 )
         {
            sentMsgElement.innerHTML = "Validation Not Required";
         }
      }
   }

   function getUserName()
   {
      if (userName == "") return( "Guest" );
      return(userName);
   }

   function getCurrUserId()
   {
      return(currUserPersonId);
   }

   function deleteAccount( webAccessCode )
   {
      var confirm = getElementByName( "confirmation" ).value;
      if ( confirm != "Delete My Account" )
      {
         createAlert( 3,  "Please enter the text 'Delete My Account' in the entry field, and then press the 'Delete My Account' button to delete your account" );
         return( false );
      }
      var restData = {};

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "user";
      restData[ "command"            ] =  "DeleteAccount";
      restData[ "identifier"         ] =  "DeleteAccount";
      restData[ "locatorId"          ] =  webAccessCode;
      restData[ "locatorType"        ] =  "78";  // User
      restData[ "locatorRelationship"] =  "12";  // webAccessCode
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );

      createAlert( 1,  "Your account has been deleted.  You have been signed out of Wridz.com." );

      return(true);
   }

   function sessionTimeout()
   {
      alert('Your session has expired.  Please sign in again.');
      window.location.href = "/logoff";
   }

   function impersonate( id )
   {
      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      var restData = {};
      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "user";
      restData[ "command"            ] =  "impersonate";
      restData[ "identifier"         ] =  "Impersonate "+ id;
      restData[ "locatorId"          ] =  id;
      restData[ "locatorType"        ] =  "5";  // Person
      restData[ "locatorRelationship"] =  "1";
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }
   function addVehicle( tagUid, ownerType, ownerId  )
   {
      if (document.getElementById( "enableAdd"+tagUid ).value == 'false' )
      {
         alert( 'Only one vehicle can be in the "Pending" state.  Please complete the registration process for that vehicle before adding another vehicle.' );
         return;
      }
      var restData = {};
      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  tagUid;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "PUT";
      restData[ "dataObj"            ] =  "Vehicle";
      restData[ "identifier"         ] =  "AddVehicle";
      restData[ "locatorId"          ] =  ownerId;
      restData[ "locatorType"        ] =  ownerType;
      restData[ "locatorRelationship"] =  "owner";
      restData[  "locatorRecordType"         ] =  0
      restData[ "dataReq"            ] =  "*Basic2,*VehicleBasic";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
   }
   function verifyDeleteLead( deleteAvailable )
   {
//    console.log( "deleteAvailable = " + deleteAvailable );
      if ( deleteAvailable != "true" )
      {
         var msg = "This lead cannot be deleted because it is a member of onr or more groups.";
         alert( msg );
         return( false );
      }
      return(true);
   }
   function ajaxAddOrphanProfile( tagUid )
   {
//    console.log( "ajaxAddOrphanProfile() " + tagUid );
      var addId = document.getElementById( 'suggestSelected'+tagUid ).value;
//    console.log( "addId " + addId );

      addSectionListItem( tagUid, addId );
   }
   function ajaxWGBELeadListDownload( ownerId, viewName, containerRootId, viewId, titleId, busyIcon )
   {
      var containerId = "";
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/wgbe/jsp/ajax/ajaxGetLeadListDownload.jsp"
                      +"?contactId="+ownerId
                      +"&viewName="+viewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function verifyDeleteVendor( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This vendor cannot be deleted because it contains profiles and/or is a member of one or more groups.";
         alert( msg );
         return( false );
      }
      return(true);
   }
   function ajaxWorkItemList( ownerType, ownerId, containerRootId, viewId, busyIcon, viewName, tableId, viewDisplay, tagUid )
   {
      var containerId = "";
      var page = 1;
      var count = 10;

      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view
      var thisViewName = getThisViewName( viewName, viewId, containerRootId, viewDisplay );

      var pageElement = document.getElementById( "page"  + tagUid );
      if (pageElement != null ) page = pageElement.value;

      var countElement = document.getElementById( "count"  + tagUid );
      if (countElement != null ) count = countElement.value;

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      document.getElementById( busyIcon ).style.display = "inline";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var jspSuffix = "";
      if ( viewName="defaultView" ) jspSuffix = "2";

      var serverCall = "/itemtrack/jsp/ajax/ajaxGetWorkItemList"+jspSuffix+".jsp"
                      +"?ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&count="+count
                      +"&page="+page
                      +"&viewName="+thisViewName
                      +"&tagUid="+tagUid
                      +"&tableId="+tableId
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxWorkItem( id, aViewName, containerRootId, viewId, titleId, busyIcon, customTitle, viewDisplay )
   {
      if (customTitle == "true") ajaxWorkItemContent( id, "title",   containerRootId, viewId, titleId, "", viewDisplay );
      ajaxWorkItemContent( id, aViewName,  containerRootId, viewId, titleId, busyIcon, viewDisplay );
   }

   function ajaxWorkItemContent( id, viewName, containerRootId, viewId, titleId, busyIcon, viewDisplay )
   {
      var containerId = "";
      var thisViewName = viewName;

      if ( viewName == 'title' )
      {
         containerId = titleId;
      }
      else
      {
         var view = document.getElementById( viewId ).value;
         var containerId = containerRootId+"_"+view
         thisViewName = getThisViewName( viewName, viewId, containerRootId, viewDisplay );

         if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once
      }

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/itemtrack/jsp/ajax/ajaxGetWorkItem2.jsp"
                      +"?id="+id
                      +"&viewName="+thisViewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }
   function searchDrivers( tagUid )
   {
      var searchLoginField = getElementByName( "searchLoginId" );
      var searchIdByLogin = searchLoginField.valueId; // made up attribute; see ajaxSuggest.js
      if ( searchIdByLogin == undefined ) searchIdByLogin = searchLoginField.value; // maybe user didn't click the suggested value and just left what they entered in the field
      if ( searchIdByLogin == "" )
      {
         var reload = getElementByName( "reloadData" );
         searchIdByLogin = reload.value;
      }
      setTagParm( "id", searchIdByLogin, tagUid, true );
      setTagParm( "search", searchIdByLogin, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function searchRegions( tagUid, placeName, latLng )
   {
      setTagParm( "placeName", placeName, tagUid, true );
      setTagParm( "search", latLng, tagUid, true );
      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function completeDriverSignupProcess( objId, tagUid, refreshSectionIds, callBackFn  )
   {
      var url = "/cis/JWMBOS";
      var reqJson  = {};
      reqJson[ "table"         ] =  "WRIDZPERSONEXT";
      reqJson[ "col"           ] =  "COMPLETEDRIVERSIGNUPPROCESS"
      reqJson[ "identifier"    ] =  "CompleteDriverSignupProcess";
      reqJson[ "objId"         ] =  Number( objId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 null,
                 refreshSectionIds,
                 callBackFn,
                 ""
               );
   }

   function toUserHome()
   {
      window.location.href = '/userhome';
   }

   function readDashPlacardQRString( jsonResponse, callBackParameters )
   {
      var parms = callBackParameters.split(";");
      tagUid = parms[3];
      var view = document.getElementById('section_view'+tagUid).value;
      console.log( "currView: " + view );

      if ( view == 1 ) // prevent QR processing when going to magnify view on the image
      {
         var url = "/cis/JWMBOS";

         var reqJson  = {};
         reqJson["dataObj"     ] = "wridzpersonext";
         reqJson["command"     ] = "ExtractPlacardQrId";
         reqJson[ "identifier" ] =  "wridzpersonext / ExtractPlacardQrId";
         reqJson[ "fileName"   ] =  getElementByName( parms[0] ).value;
         reqJson[ "ownerType"  ] =  parms[1];
         reqJson[ "ownerId"    ] =  parms[2];

         xhrService( "POST",
                     "/cis/JWMBOS",
                     reqJson,
                     null,
                     null,
                     null,
                     "processDashPlacardQRString",
                     tagUid );
      }
   }

   function processDashPlacardQRString( jsonResponse, tagUid )
   {
      if ( jsonResponse.RC == "RC_SUCCESS" )
      {
         document.getElementById('section_refresh'+tagUid).click();
         createAlert( 0, "", "Placard ID: " + jsonResponse.driverUid + " saved as the unique driver ID");
      }
      if ( jsonResponse.RC == "RC_QR_CODE_NOT_FOUND" )
      {
         createAlert( 3, "", "Unable to read the QR code in the selected image." );
      }
   }
   function sendXHR( method, url, reqJson, headers )
   {
     return new Promise(function (resolve, reject)
                        {
                           var xhr = new XMLHttpRequest();
                           xhr.open(method, url);
                           xhr.onload = function ()
                                        {
                                          if (xhr.status >= 200 && xhr.status < 500)
                                          {
                                            resolve(
                                                      {
                                                         contentType: xhr.getResponseHeader( "content-type" ),
                                                         content:     xhr.response
                                                      }
                                                   );
                                          }
                                          else
                                          {
                                            reject(
                                                      {
                                                         status: this.status,
                                                         statusText: xhr.statusText
                                                      }
                                                  );
                                          }
                                        };
                           xhr.onerror = function ()
                                         {
                                           reject(
                                                  {
                                                     status: this.status,
                                                     statusText: xhr.statusText
                                                  }
                                                 );
                                         };
                          if (headers)
                          {
                             Object.keys(headers).forEach(function (key)
                                                                 {
                                                                    xhr.setRequestHeader(key, headers[key]);
                                                                 }
                                                               );
                          }
                          xhr.send(JSON.stringify(reqJson));
     });
   }

   function xhrService( method, url, reqJson, tagUid, containerId, refreshSectionIds, callBackFn, callbackParameters, headers, nextView )
   {
      xhrSetBusy( containerId, true );
      reqJson = xhrAddSecurityInfo( reqJson );
      reqJson = xhrAddSystemInfo( reqJson );
      sendXHR( method, url, reqJson, headers )
                                        .then((data) =>   {
                                                             if ( data.contentType.indexOf( "text/html" ) > -1 )
                                                             {
                                                                processHTMLContent( containerId, data.content );
                                                             }
                                                             else
                                                             {
                                                                var respJson = JSON.parse( data.content );
                                                                xhrDisplayPopupUrl( respJson, refreshSectionIds );
                                                                xhrDisplayMessage( respJson );
                                                                xhrNextView( tagUid, nextView );
                                                                xhrRefreshSections( refreshSectionIds, respJson );
                                                                xhrChangeImage( tagUid, respJson );
                                                                xhrChangeSuffix( tagUid, respJson );
                                                                xhrCallBack( callBackFn, respJson, callbackParameters );
                                                             }
                                                          })
                                        .catch((error) => {
                                                             console.error(error)
                                                          })
                                        .finally((aa) =>  {
                                                             xhrSetBusy( containerId, false );
                                                             timer.resetTimer(); // inactivity expiration timer
                                                          })
   }


   function xhrSetBusy( containerId, status )
   {
      try
      {
         if ( status == true ) // add a 'busy' icon
         {
            var busyImg = document.createElement("img");
            busyImg.setAttribute("src", getSysImages()+"/loader2.gif");
            busyImg.id = "busy"+containerId;
            busyImg.style.width = "70";
            busyImg.style.right = "5";
            busyImg.style.position = "absolute";
            busyImg.style.top = "-17";

            document.getElementById( containerId ).appendChild( busyImg );
         }
         else // remove the busy icon
         {
            var busyImg = document.getElementById( "busy"+containerId );
            busyImg.remove();
         }
      }
      catch( e )
      {
      }
   }

   function xhrAddSecurityInfo( reqJson )
   {
      reqJson["sessionId" ] = "$system$";
      return( reqJson );
   }

   function xhrAddSystemInfo( reqJson )
   {
      reqJson[ "user"   ] = getUserName();
      reqJson[ "reqUid" ] = generateReqUid();
      return( reqJson );
   }

   function xhrDisplayMessage( respJson ) // if a displayable message was returned....
   {
      if ( typeof( respJson.displayMsg ) != 'undefined' )
      {
         var type = respJson.msgType;
         if ( isNaN( type ) ) type = 3;
         createAlert( type, respJson.displayMsg );
      }
   }

   function xhrDisplayPopupUrl( respJson, tagUid ) // if popupUrl is found in json....
   {
      if ( typeof( respJson.popupUrl ) != 'undefined' )
      {
         var aPopup = window.open(respJson.popupUrl, "_blank", "width=400px;titlebar=no,status=no,menubar=no,toolbar=no"); // no whitespace in options (??)
         if ( aPopup == null ) alert( "It appears you might have a popup blocker enabled on your browser. Popups must be enabled for this site in order to continue. \n\nPlease enable popups, then try again." );
         var pollTimer = window.setInterval( function()
                                             {
                                                if ( aPopup.closed !== false)  // !== is required for compatibility with Opera
                                                {
                                                    window.clearInterval(pollTimer);
                                                    xhrRefreshSections( tagUid, null );
                                                }
                                             }, 200);
      }
   }

   function xhrNextView( tagUid, nextView )
   {
      if ( ( nextView != null ) && ( nextView != "" ) && typeof( nextView != 'undefined' ) )
      {
         document.getElementById('viewIcon'+tagUid+"_"+nextView).click();
      }
   }

   function xhrRefreshSections( refreshSectionIds, respJson )
   {
      if ( ( refreshSectionIds != null ) && ( refreshSectionIds != "" ) && typeof( refreshSectionIds != 'undefined' ) )
      {
         // force a 'refresh' of containing section (initially used for payment section)
         // could be more than one section to refresh
         // also id can be sent as true id or as a "name".  Try both... one of them should be valid

         var refreshSections = refreshSectionIds.split( ";" )
         for ( var i = 0; i < refreshSections.length; i++ )
         {
            // see if it is an id
            if ( document.getElementById('section_refresh'+refreshSections[i] ) != null )
            {
//             console.log( "refreshing by tagUid: " + refreshSections[i] );
               document.getElementById('section_refresh'+refreshSections[i]).click();
            }
            else
            {
               // see if it is a name
               var aTagUid = getTagUidFromName( refreshSections[i] );
               if ( document.getElementById('section_refresh'+aTagUid ) != null )
               {
//                console.log( "refreshing by name: " + refreshSections[i] + " = " + aTagUid );
                  document.getElementById('section_refresh'+aTagUid ).click();
               }
            }
         }
      }
   }

   function xhrChangeImage( tagUid, respJson )
   {
      if ( typeof( respJson.newImage ) != 'undefined' )
      {
          document.getElementById(inputId).src = getSysImages()+"/"+respJson.newImage;
      }
   }

   function xhrChangeSuffix( tagUid, respJson )
   {
      if ( typeof( respJson.newSuffix ) != 'undefined' )
      {
          document.getElementById( tagUid+'Suffix' ).innerHTML = respJson.newSuffix;
      }
   }

   function xhrCallBack( callBackFns, respJson, callbackParameters )
   {
      if ( ( callBackFns != null ) && typeof( callBackFns != 'undefined' ) )
      {
         var callBacks = callBackFns.split( ";" )
         for ( var i = 0; i < callBacks.length; i++ )
         {
            try
            {
               window[ callBacks[i] ](respJson, callbackParameters);
            }
            catch(err)
            {
//             console.log( "callBack: " + err );
            }
         }
      }
   }

   function xhrUpdate( method, url, reqJson, tagUid, containerId, refreshSectionIds, callBackFn, callbackParameters )
   {
      reqJson["dataObj"        ] = "inputProcessor";
      reqJson["command"        ] = "update";
      var   headers = {
                         "content-type"     : "application/json"
                      };

      xhrService( method,
                  url,
                  reqJson,
                  tagUid,
                  containerId,
                  refreshSectionIds,
                  callBackFn,
                  callbackParameters,
                  headers);
   }

   function setPersistentParm( parm, tagUid )
   {
      var parms = parm.split("=");
      if (parms.length != 2 )
      {
         console.error( "SetPersistentParm error: " + parm );
         return;
      }

      var url = "/cis/JWMBOS";
      var reqJson    = {
                           "identifier"  : "PersistentParm",
                           "table"       : "PERSISTENTPARM",
                           "col"         : parms[0],
                           "value"       : parms[1]
                       };
      xhrUpdate( "POST", url, reqJson, tagUid, "container"+tagUid );
   }

   function xhrPopup( url, container, identifier, dataReq, fieldName, dynJdbc)
   {
      xhrSetBusy( container.id, true );

      var   headers = {  "x_identifier"     : identifier,
                         "Authorization"    : "Session",
                         "x_reqUid"         : generateReqUid(),
                         "x_timestamp"      : localToUtc( new Date(), "YYYY-MM-DD-hh:mm:ss.sss" ),
                         "x_logLevel"       : "Debug",
                         "x_ipAddress"      : "192.168.1.1",
                         "x_appInstanceId"  : "1234",
                         "x_dataReq"        : dataReq,
                         "x_dynJdbc"        : dynJdbc
                      };

      sendXHR( "GET", url, "", headers )
                                        .then((data) =>   {
                                                             if ( data.contentType.indexOf( "text/html" ) > -1 )
                                                             {
                                                                processHTMLContent( containerId, data.content );
                                                             }
                                                             else
                                                             {
                                                                var respJson = JSON.parse( data.content );
                                                                container.innerHTML = respJson[fieldName];
                                                                popupContent(container);
                                                             }
                                                          })
                                        .catch((error) => {
                                                             console.error(error)
                                                          })
                                        .finally((data) => {
                                                             xhrSetBusy( container.id, false );
                                                          })
   }

  function xhrREST( restData )
  {
     var url = "/../"
               +restData.dataObj;

               if (( restData.method != "GET" )
                 &&( restData.method != "PUT" )
                 &&( restData.method != "DELETE" ) )
               {
                  url += "/"+restData.command; //GET, DELETE, PUT don't need commands
               }
               url += "/"
                   +  restData.locatorId
                   +  "/"
                   +  restData.locatorType
                   +  "/"
                   +restData.locatorRelationship;

               if ( restData.locatorRecordType !== undefined ) url += "/"+restData.locatorRecordType;
               if ( restData.value1            !== undefined ) url += "/"+restData.value1;
               if ( restData.value2            !== undefined ) url += "/"+restData.value2;
               if ( restData.value3            !== undefined ) url += "/"+restData.value3;
               if ( restData.value4            !== undefined ) url += "/"+restData.value4;
               if ( restData.value5            !== undefined ) url += "/"+restData.value5;
               if ( restData.value6            !== undefined ) url += "/"+restData.value6;

     var dataReqList = (restData.dataReq).split(",")
     var dataReq = "[";
     for (var i = 0; i < dataReqList.length; i++ )
     {
        if ( i > 0 ) dataReq += ", ";
        dataReq += '"'+dataReqList[i]+'"'
     }
     dataReq += "]";

     var   headers = {  "x_identifier"     : restData.identifier,
                        "Authorization"    : "Session",
                        "x_reqUid"         : generateReqUid(),
                        "x_timestamp"      : localToUtc( new Date(), "YYYY-MM-DD-hh:mm:ss.sss" ),
                        "x_logLevel"       : "Debug",
                        "x_ipAddress"      : "192.168.1.1",
                        "x_appInstanceId"  : "1234",
                        "x_dataReq"        : dataReq,
                        "x_tagUid"         : restData.tagUid,
                        "x_source"         : "xhr",
                        "content-type"     : "application/json"
                     };
     if ( restData.viewName != '' ) headers[ "x_viewName" ] = restData.viewName;
     if ( restData.renderer != '' ) headers[ "x_renderer" ] = restData.renderer;
     addSearchAndPaginationHeadersFromForm( headers, restData );

     xhrService( restData.method,
                 url,
                 restData.reqJson,
                 restData.tagUid,
                 restData.xhrData.containerId,
                 restData.xhrData.refreshSectionIds,
                 restData.xhrData.callbackFn,
                 restData.xhrData.callbackParameters,
                 headers,
                 restData.xhrData.nextView );
  }

  function processHTMLContent( containerId, content )
  {
     if (document.getElementById(containerId) != null)
     {
       var embeddedScripts;
       document.getElementById(containerId).innerHTML = content;
       try
       {
         document.getElementById(
           "pendingRefreshFlag_" + containerId
         ).checked = false;
       } catch (err)
       {
       }

       embeddedScripts = document
         .getElementById(containerId)
         .getElementsByTagName("script");

       for (var iii = 0; iii < embeddedScripts.length; iii++)
       {
         var aScript = embeddedScripts[iii];
                            console.log( "eval " + aScript.innerHTML);

         if (aScript.getAttribute("src") != null)
         {
           document.appendChild(aScript);
         } else
         {
           try
           {
             var evalReturn = eval(aScript.innerHTML);
           } catch (err) {
             console.error("Eval err: " + err);
             console.error(
               "Eval exception: [" +
                 err.message +
                 "] ===> (Eval) \n>>>>>>>>>>" +
                 aScript.innerHTML +
                 "\n<<<<<<<<<<<"
             );
           }
         }
       }
       if ((typeof forceRefreshTagUid != "undefined")
          && (forceRefreshTagUid != "" ) )
       {
         forceRefresh(forceRefreshTagUid);
       }
     }
     else
     {
       console.error( "ajaxSection.insertContents() -- invalid containerId -- " + containerId
       );
     }
   }

   function addSearchAndPaginationHeadersFromForm( headers, restData )
   {
     // this requires standardization of entry field names on search boxes
     //  not there yet on many of the search boxes

     if ( restData.page == 'undefined' )
     {
        var pageElement = getElementByName("page" + restData.tagUid);
        if ( pageElement != '' ) headers[ "x_page" ]         = pageElement.value ;
        else                       headers[ "x_page" ]         = Number( 1 ) ;
     }
     else
     {
        headers[ "x_page" ] = restData.page ;
     }

     if ( restData.count == 'undefined' )
     {
        var countElement = getElementByName("count" + restData.tagUid);
        if ( countElement != '' ) headers[ "x_count" ]       = countElement.value ;
        else                        headers[ "x_count" ]       = Number( 100 ) ;
     }
     else
     {
        headers[ "x_count" ] = restData.count ;
     }

     if ( restData.rangeBgn == undefined )
     {
        var rangeBgnElement = getElementByName("rangeBgn" + restData.tagUid);
        if ( rangeBgnElement != '' ) headers[ "x_rangeBgn" ] = bgnRangeUtc( rangeBgnElement.value );
        else                           headers[ "x_rangeBgn" ] = "2001-01-01" ;
     }
     else
     {
        headers[ "x_rangeBgn" ] = bgnRangeUtc( restData.rangeBgn );
     }

     if ( restData.rangeEnd == undefined )
     {
        var rangeEndElement = getElementByName("rangeEnd" + restData.tagUid);
        if ( rangeEndElement != '' ) headers[ "x_rangeEnd" ] = endRangeUtc( rangeEndElement.value );
        else                           headers[ "x_rangeEnd" ] = "2001-12-31" ;
     }
     else
     {
        headers[ "x_rangeEnd" ] = endRangeUtc( restData.rangeEnd );
     }

     if ( restData.onDate == undefined )
     {
        var onDateElement = getElementByName("onDate" + restData.tagUid);
        if ( onDateElement != '' ) headers[ "x_onDate" ] = onDateElement.value;
        else                       headers[ "x_onDate" ] = now( "yyyy-mm-dd" ) ;
     }
  }
   function validateZipCodeInput( tagUid, required )
   {
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      if ( !isValidPostalCode( dataValue, "US" ) )  // default US only for now
      {
         showError( tagUid, "** Invalid Zip Code" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         errCount += 1;
         return( false );
      }
      return( true );
   }

function isValidPostalCode(postalCode, countryCode)
{
    switch (countryCode)
    {
        case "US":
            postalCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
            break;
        case "CA":
            postalCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
            break;
        default:
            postalCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
    }
    return postalCodeRegex.test(postalCode);
}
  var errCount = 0; // global... set by validation functions

  function leadFormValidate(form)
  {
     errCount = 0;  // reset count

     doValidate( form, "primaryEmail" );
     doValidate( form, "altEmail" );
     doValidate( form, "phone" );

     var contactTypeValue = 'wedding'; // default

     if (typeof form.contactType != 'undefined' )
     {
        for(var i = 0; i < form.contactType.length; i++)
        {
           if(form.contactType[i].checked) contactTypeValue = form.contactType[i].value;
        }
     }

     if ( contactTypeValue == 'wedding' )
     {
        doValidateIfVisible( form, "ceremonyReceptionLocation", "bothDiv" );
        doValidateIfVisible( form, "ceremonyLocation", "cerDiv" );
        doValidateIfVisible( form, "receptionLocation", "receptDiv" );
        doValidateIfVisible( form, "altContactLastName", "otherName" );

        doValidate( form, "weddingDate" );

//      console.log( "ensure bride or groom last name" );
        var brideNameErrorDiv = document.getElementById( "brideNameError" );
        var groomNameErrorDiv = document.getElementById( "groomNameError" );

        brideNameErrorDiv.style.display = "none";
        groomNameErrorDiv.style.display = "none";

        if (( form.brideLastName.value == "" ) && (form.groomLastName.value == "" ))
        {
           brideNameErrorDiv.style.display = "block";
           groomNameErrorDiv.style.display = "block";
           errCount++;
        }

//      console.log( "==>" + form.requestPhoto.checked +" "+ form.requestVideo.checked);
        if (( !form.requestPhoto.checked ) && (!form.requestVideo.checked ))
        {
           servicesErrorDiv.style.display = "block";
           errCount++;
        }
     }

     if ( contactTypeValue == 'otherEventType' )
     {
        doValidate( form, "eventName" );
        doValidate( form, "eventDate" );
        doValidate( form, "eventLocation" );
     }

     if (( contactTypeValue == 'otherEventType' )
        ||( contactTypeValue == 'generalContact' ))
     {
        doValidate( form, "reqLastName" );
     }

     form.submissionCode.value = "--> (JWMH)" + new Date(); // this is to identify that form was submitted via a human and not a spam robot

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }

     return(true);
  }

  function genCustomerFormValidate( form )
  {
     errCount = 0;  // reset count

     doValidate( form, "primaryEmail" );
     doValidate( form, "altEmail" );
     doValidate( form, "phone" );
     doValidate( form, "reqLastName" );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     return(true);
  }

  function setOtherVisible(selection)
  {
     var theDiv = document.getElementById( "otherName" );
     if (selection.value > 2 )
     {
        theDiv.style.display = 'block';
     }
     else
     {
        theDiv.style.display = 'none';
     }
     return(true);
  }

  function selectWeddingType(selection)
  {
     var bothDiv   = document.getElementById( "bothDiv" );
     var cerDiv    = document.getElementById( "cerDiv" );
     var receptDiv = document.getElementById( "receptDiv" );

     if ( selection.value == 'ceremonyAndReceptionSameLoc' )
     {
        bothDiv.style.display   = 'block';
        cerDiv.style.display    = 'none';
        receptDiv.style.display = 'none';
     }

     if ( selection.value == 'ceremonyAndReceptionDiffLoc' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'block';
        receptDiv.style.display = 'block';
     }

     if ( selection.value == 'ceremonyOnly' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'block';
        receptDiv.style.display = 'none';
     }

     if ( selection.value == 'receptionOnly' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'none';
        receptDiv.style.display = 'block';
     }

     if ( selection.value == 'locationNotBooked' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'none';
        receptDiv.style.display = 'none';
     }
  }

  function selectContactForm(selection)
  {
     var weddingDiv = document.getElementById( "wedding" );
     var eventDiv = document.getElementById( "event" );
     var myNameDiv = document.getElementById( "myName" );
     var generalInfoDiv = document.getElementById( "generalInfo" );
     var commonDiv = document.getElementById( "common" );

     if (selection.value == "wedding" )
     {
        weddingDiv.style.display          = 'block';
        eventDiv.style.display          = 'none';
        myNameDiv.style.display           = 'none';
        generalInfoDiv.style.display      = 'none';
        commonDiv.style.display           = 'block';
     }

     if (selection.value == "otherEventType" )
     {
        weddingDiv.style.display         = 'none';
        eventDiv.style.display          = 'block';
        myNameDiv.style.display           = 'block';
        generalInfoDiv.style.display      = 'none';
        commonDiv.style.display           = 'block';
     }

     if (selection.value == "generalContact" )
     {
        weddingDiv.style.display         = 'none';
        eventDiv.style.display          = 'none';
        myNameDiv.style.display           = 'block';
        generalInfoDiv.style.display      = 'block';
        commonDiv.style.display           = 'block';
     }
     return(true);
  }
function initMap()
  {
    const input = document.getElementById("pac-input");
    const options =
                    {
                       fields: ["formatted_address", "geometry", "name"],
                       strictBounds: false,
                       types: ["(cities)"],
                    };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  autocomplete.addListener("place_changed", () =>
  {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location)
    {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = place.formatted_address;

    searchRegions( document.getElementById("regionListTagUid").value,
                  place.formatted_address,
                  place.geometry.location );
  });
}
      function  playVideo( type, playerId )
      {
//       console.log( "Play " + type + " " + playerId )
         if (type == "YouTube" )
         {
            YT.get( playerId ).playVideo();
         }
         if ( type == "Vimeo" )
         {
            var iFrame = document.getElementById( playerId );
            var vimeoPlayer = new Vimeo.Player(iFrame);
            vimeoPlayer.play();
         }

         if (( type == "File" )
          ||( type == "MP4" ))
         {
            var videoElement = document.getElementById( playerId );
            videoElement.play();
         }
      }

      function initYouTubePlayer( playerId, ndx )
      {
//       console.log( "initYouTubePlayer " + playerId + " " + ndx  + " " + youTubeReadyFlag );
         if ( !youTubeReadyFlag )
         {
            if ( ndx < 5 )
            {
               setTimeout( function(){initYouTubePlayer(playerId, ndx+1);}, 500 );
            }
         }
         var thePlayer = new YT.Player(playerId,
                                {
                                  events: {
                                             'onStateChange': onPlayerStateChange
                                          }
                                }
                        );
         return( thePlayer );
      }

      function onPlayerStateChange(event)
      {
         if (event.data == YT.PlayerState.PLAYING ) stopSlider();
         else  startSlider();
      }

      function initVimeoPlayer( playerId )
      {
//       console.log( "initVimeoPlayer " + playerId  );
         var iFrame = document.getElementById( playerId );
         var vimeoPlayer = new Vimeo.Player(iFrame);

         vimeoPlayer.on('play', stopSlider);
         vimeoPlayer.on('pause', startSlider);
         vimeoPlayer.on('ended', startSlider);
      }

      function startSlider()
      {
//       console.log( "startSlider" );
         jssor_slider1.$Play();
      }

      function stopSlider()
      {
//       console.log( "stopSlider" );
         jssor_slider1.$Pause();
      }

      function initVideoPlayer( playerId )
      {
//       console.log( "initVideoPlayer " + playerId  );
         var videoElement = document.getElementById( playerId );

         videoElement.addEventListener('play',   stopSlider, false);
         videoElement.addEventListener('pause', startSlider, false);
         videoElement.addEventListener('ended', startSlider, false);
      }

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
var Timer = (function(){
  var instance = null;
  function PrivateConstructor(){
    var timer = null; // DOM element, that displays the page inactivity expiration time
    var remainingSeconds = 0; // Remaining seconds
    var initialSeconds = 0; // Time that was initially set
    var ticker = null; // Ticker which ticks every second
    var isRunning = false; // true, when the timer is running
    var timeExpiredAction = function(){
      console.log('Time expired.');
    };

    // 0) Method to set and display the timer
    this.createTimer = function(timerId,time,callback){
      if(typeof(callback) == 'function'){
        timeExpiredAction = callback;
      }
      timer = document.getElementById(timerId);
      initialSeconds = time;
      remainingSeconds = time;
      displayTime();
    };

    // 1) Starts the timer
    this.startTimer = function(){
      startTicking();
    };

    // 2) Internal method to realize the ticks
    var startTicking = function(){
      if(isRunning == true)
        return;
      else
        isRunning = true;

      function tick(){
        if (remainingSeconds <= 0){
          isRunning = false;
          displayTime();
          timeExpiredAction();
          return;
        }
        else{
          remainingSeconds -= 1;
          displayTime();
        }
        ticker = window.setTimeout(tick, 1000);
      }
      ticker = window.setTimeout(tick, 1000);
    };

    // 3) Internal method to display the time
    var displayTime = function(){
      function addLeadingZero(time){
        return (time < 10) ? '0' + time : + time;
      }
      var seconds = remainingSeconds;
      var days = Math.floor(seconds / 86400);
      seconds -= days * 86400;
      var hours = Math.floor(seconds / 3600);
      seconds -= hours * (3600);
      var minutes = Math.floor(seconds / 60);
      seconds -= minutes * (60);
      var timeString = ((days > 0) ? days + ' days ' : '')
      + addLeadingZero(hours)
      + ':' + addLeadingZero(minutes)
      + ':' + addLeadingZero(seconds)
      timer.value = timeString;
    };

    // 4) Pauses the timer
    this.pauseTimer = function(){
      window.clearTimeout(ticker);
      ticker = null;
      isRunning = false;
    };

    // 5) Continues the timer
    this.resumeTimer = function(){
      ticker = window.setTimeout(startTicking(), 10);
    };

    // 6) Pauses the timer, if it is running
    // OR continues the timer, if it is not running
    this.toggleTimer = function(){
      if(ticker != null)
        this.pauseTimer();
      else
        this.resumeTimer();
    };

    // 7) Resets the time to the initial time
    this.resetTimer = function(){
      remainingSeconds = initialSeconds;
      displayTime();
    };

    // 8) Resets the time to the initial time and starts ticking
    this.resetAndStartTimer = function(){
      this.resetTimer();
      startTicking();
    };

    // 9) Returns the remaining seconds of the timer
    this.getRemainingSeconds = function(){
      return remainingSeconds;
    };

    // 10) Sets the timer to a different time
    this.setSeconds = function(seconds){
      remainingSeconds = seconds;
      displayTime();
    };
  }
  return new function(){
    // Singleton for the timer
    this.getInstance = function(){
      if (instance == null){
        instance = new PrivateConstructor();
        instance.constructor = null;
      }
      return instance;
    }
  }
})();
