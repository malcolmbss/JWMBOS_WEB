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
