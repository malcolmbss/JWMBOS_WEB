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
