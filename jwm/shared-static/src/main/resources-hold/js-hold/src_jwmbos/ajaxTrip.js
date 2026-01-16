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
