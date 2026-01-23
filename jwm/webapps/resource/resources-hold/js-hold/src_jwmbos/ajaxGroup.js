   function ajaxGroupSelect( containerId, busyIcon, tagUid, ownerType, ownerId, type, value, query )
   {
      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/cis/jsp/ajax/ajaxGetGroupList.jsp"
                      +"?ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&user="+getUserName()
                      +"&type="+type
                      +"&value="+value
                      +"&query="+query
                      +"&sortOrder="+getTagParm( "sortOrder", tagUid )
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&viewName=select";

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function verifyDeleteGroupCategory( active, inactive )
   {
      if ( active + inactive > 0 )
      {
         var msg = "This category is referenced by: \n";
         if ( active   > 0 ) msg += "\n" + active + " active group(s); ";
         if ( inactive > 0 ) msg += "\n" + inactive + " inactive group(s); ";
         msg += "\n\nThe category cannot be removed while groups are referencing it.";
         alert( msg );
         return( false);
      }
      return(true);
   }

   function verifyDeleteGroup( members )
   {
      if ( members > 0 )
      {
         var msg = "This group contains: \n";
         msg += "\n" + members + " member(s); ";
         msg += "\n\nThe group cannot be deleted while it contains members.";
         alert( msg );
         return( false);
      }
      return(true);
   }

   function populateAvailableList( searchSelectElement, targetId )
   {
      var name  = searchSelectElement.value;
      name = name.substring( name.indexOf(")") + 1 );

      var personId = searchSelectElement.value;
      personId = personId.substring( 1, personId.indexOf(")") );

      var listElement = document.getElementById( targetId );
      listElement.innerHTML = "<option value="+personId+">"+name+"</option>";
      listElement.options.selectedIndex=0;
   }

