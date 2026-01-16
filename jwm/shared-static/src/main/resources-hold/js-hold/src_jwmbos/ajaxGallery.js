
   function selectGalleryItem( tagUid, containerTagUid, value, itemId, tagName )
   {
//    console.log( "select: " + tagUid + " " + containerTagUid );

      var currSelectedTagUidElement = document.getElementById( "selected"+containerTagUid )
      if ( currSelectedTagUidElement != null )
      {
         currSelectedTagUid = currSelectedTagUidElement.value;
//       console.log( "curr " + currSelectedTagUid );
         var currSelectedItem = document.getElementById( "section_outer"+currSelectedTagUid );
      }

      if ( currSelectedItem != null )
      {
         currSelectedItem.className = "galleryItem";
      }

      // select new
      if ( tagUid != '' )
      {
         document.getElementById( "section_outer"+tagUid ).className = "galleryItemSelected";
      }
      document.getElementById( "selected"+containerTagUid ).value = tagUid;

      // set RW Input field and trigger onChange()
      var rwElement   = document.getElementById( containerTagUid );
      if ( rwElement != null )
      {
         rwElement.value = value;
         rwElement.valueId = itemId; // need to send the galleryItemId as well as name; create a new attribute on input field to hold it

         var event       = new Event('change');
         rwElement.dispatchEvent(event);
      }
   }

   function addToAlbum( tagUid, albumId, itemType, itemId, containerTagUid )
   {
      document.getElementById( 'section_busy'+containerTagUid ).style.display = "inline";
      var imageElement = getElementByName( "galleryItem_"+itemId+"_outer" );

//    console.log( "AddtoAlbum " + tagUid + " " + albumId + " " + itemType + " " + itemId + " " + containerTagUid );

      var borderClass = imageElement.className;

      var fn;
      if ( borderClass.indexOf( 'Selected' ) == -1 ) // classname doesn't contain "Selected". So not currently selected
      {
         imageElement.className = "galleryItemSelected";
         fn = "add";
      }
      else // currently selected -- deselect it
      {
         imageElement.className = "galleryItem"
         fn = "remove";
      }

      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp"
                      +"?table=GROUPMEMBERMAP"
                      +"&user="+getUserName()
                      +"&type=memberlist"
                      +"&fn="+fn
                      +"&ownerId="+albumId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&listItemType="+itemType
                      +"&listItemId="+itemId;

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function()
                                       {
                                          if(ajaxRequest.readyState == 4)
                                          {
                                             handleAjaxRC( ajaxRequest );
                                          }
                                       }
//      alert( serverCall );

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);

      setTimeout(function(){document.getElementById( 'section_busy'+containerTagUid ).style.display = "none";}, 500);
   }

   function magnifyView( aGalleryItemId )
   {
      tagUid = getTagUidFromName( "galleryItem_"+aGalleryItemId );
      document.getElementById('viewIcon'+tagUid+'_2').click();
      return(false);
   }

   function popUpImage( url )
   {
      var aWindow = window.open("", "Content", "width=600,height=400,titlebar=no,status=no,menubar=no,toolbar=no"); // no whitespace in options (??)

      var theBody = aWindow.document.getElementById('theBody');
      if ( theBody != null ) theBody.innerHTML = '';
      aWindow.document.write( "<body id='theBody'>");
      aWindow.document.write("<img style='width:100%' src='"+url+"' >" );
      aWindow.focus();
   }


   function deleteGalleryItem( aDeleteItemName )
   {
      var tagUid = getTagUidFromName( aDeleteItemName );
//    console.log( ">>>"+aDeleteItemName + " -- " + tagUid );
      document.getElementById(tagUid).click();
      return(false);
   }


