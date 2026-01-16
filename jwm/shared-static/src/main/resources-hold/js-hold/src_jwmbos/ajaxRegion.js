
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
