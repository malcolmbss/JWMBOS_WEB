   function ajaxWGBELeadListDownload( ownerId, viewName, containerRootId, viewId, titleId, busyIcon )
   {
      var containerId = "";
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/wgbe/jsp/ajax/ajaxGetLeadListDownload.jsp"
                      +"?contactId="+ownerId
                      +"&viewName="+viewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function verifyDeleteVendor( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This vendor cannot be deleted because it contains profiles and/or is a member of one or more groups.";
         alert( msg );
         return( false );
      }
      return(true);
   }
