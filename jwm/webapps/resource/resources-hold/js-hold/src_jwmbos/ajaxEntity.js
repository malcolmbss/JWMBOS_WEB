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
