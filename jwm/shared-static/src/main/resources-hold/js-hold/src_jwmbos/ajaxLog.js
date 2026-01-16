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

