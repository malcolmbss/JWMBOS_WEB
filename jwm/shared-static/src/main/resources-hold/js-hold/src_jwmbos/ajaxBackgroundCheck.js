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
