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
