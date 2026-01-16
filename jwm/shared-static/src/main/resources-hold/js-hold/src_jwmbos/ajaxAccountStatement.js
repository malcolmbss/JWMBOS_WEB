
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
