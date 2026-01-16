   function ajaxWorkItemList( ownerType, ownerId, containerRootId, viewId, busyIcon, viewName, tableId, viewDisplay, tagUid )
   {
      var containerId = "";
      var page = 1;
      var count = 10;

      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view
      var thisViewName = getThisViewName( viewName, viewId, containerRootId, viewDisplay );

      var pageElement = document.getElementById( "page"  + tagUid );
      if (pageElement != null ) page = pageElement.value;

      var countElement = document.getElementById( "count"  + tagUid );
      if (countElement != null ) count = countElement.value;

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      document.getElementById( busyIcon ).style.display = "inline";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var jspSuffix = "";
      if ( viewName="defaultView" ) jspSuffix = "2";

      var serverCall = "/itemtrack/jsp/ajax/ajaxGetWorkItemList"+jspSuffix+".jsp"
                      +"?ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&count="+count
                      +"&page="+page
                      +"&viewName="+thisViewName
                      +"&tagUid="+tagUid
                      +"&tableId="+tableId
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxWorkItem( id, aViewName, containerRootId, viewId, titleId, busyIcon, customTitle, viewDisplay )
   {
      if (customTitle == "true") ajaxWorkItemContent( id, "title",   containerRootId, viewId, titleId, "", viewDisplay );
      ajaxWorkItemContent( id, aViewName,  containerRootId, viewId, titleId, busyIcon, viewDisplay );
   }

   function ajaxWorkItemContent( id, viewName, containerRootId, viewId, titleId, busyIcon, viewDisplay )
   {
      var containerId = "";
      var thisViewName = viewName;

      if ( viewName == 'title' )
      {
         containerId = titleId;
      }
      else
      {
         var view = document.getElementById( viewId ).value;
         var containerId = containerRootId+"_"+view
         thisViewName = getThisViewName( viewName, viewId, containerRootId, viewDisplay );

         if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once
      }

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/itemtrack/jsp/ajax/ajaxGetWorkItem2.jsp"
                      +"?id="+id
                      +"&viewName="+thisViewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }
