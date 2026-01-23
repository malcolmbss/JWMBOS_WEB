   function ajaxAddOrphanProfile( tagUid )
   {
//    console.log( "ajaxAddOrphanProfile() " + tagUid );
      var addId = document.getElementById( 'suggestSelected'+tagUid ).value;
//    console.log( "addId " + addId );

      addSectionListItem( tagUid, addId );
   }
