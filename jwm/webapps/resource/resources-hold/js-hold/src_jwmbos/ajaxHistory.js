
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
