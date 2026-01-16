
   function ajaxRoleListSet( ownerId, containerRootId, viewId, busyIcon, viewName, viewDisplay )
   {
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view
      var thisViewName = getThisViewName( viewName, viewId, containerRootId, viewDisplay );

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      document.getElementById( busyIcon ).style.display = "inline";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/idmanager/jsp/ajax/ajaxGetRoleListSet.jsp"
                      +"?ownerId="+ownerId
                      +"&viewName="+thisViewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

