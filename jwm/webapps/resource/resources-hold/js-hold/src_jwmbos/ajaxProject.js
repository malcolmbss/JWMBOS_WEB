   function ajaxProjectDates(id, containerRootId, viewId, busyIcon )
   {
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

//    console.log( "containerId " + containerId );
      var currContent = document.getElementById( containerId).innerHTML;
      if ((currContent.length >  5 )
              && ( currContent.indexOf( pendingRefreshFlagText ) == -1 ) )  return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetProject.jsp"
                      +"?id="+id
                      +"&viewName=projectDates"
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function verifyDeleteProject( icon, projectId )
   {
      var origBG = $(icon).closest( "tr" ).css( "background-color" );
      $(icon).closest( "tr" ).css( "background-color", "yellow" );

      if ( confirm( "Confirm delete project" ))
      {
         $(icon).closest( "tr" ).css( "background-color", "red" );
         var tr = $(icon).closest( "tr" );

         var ajaxRequest = getAjaxRequestObject();

         ajaxRequest.onreadystatechange = function() { removeRow( ajaxRequest, tr );} ;

         var serverCall = "/projectmanager/jsp/ajax/ajaxGetProject.jsp"
                         +"?id="+projectId
                         +"&fn=delete"
                         +"&user="+getUserName()

         ajaxRequest.open("GET", serverCall, true);
         ajaxRequest.send(null);
      }
      else
      {
         $(icon).closest( "tr" ).css( "background-color", origBG );
      }
   }


   function ajaxSetProjectDataField( id, viewName, containerId, busyIcon, tagUid, onChangeFn )
   {
      setBusy( busyIcon, "inline");

      var onChangeFnStr = document.getElementById( onChangeFn ).value;

      var ajaxRequest = getAjaxRequestObject();

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetProject.jsp"
                      +"?id="+id
                      +"&viewName="+viewName
                      +"&tagUid="+tagUid
                      +"&onChangeFn="+onChangeFnStr
                      +"&user="+getUserName()

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxSetProjectStatusFields( id, roContainerId, dropdownContainerId, busyIcon, tagUid, onChangeFn )
   {
      ajaxSetProjectDataField( id, "status",         roContainerId,       busyIcon, tagUid, onChangeFn );
      ajaxSetProjectDataField( id, "statusDropdown", dropdownContainerId, busyIcon, tagUid, onChangeFn );
   }

   function ajaxProjectList( containerId, busyIcon, tagUid, filterId )
   {
      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetProjectList.jsp"
                      +"?user="+getUserName()
                      +"&viewName=selectList"
                      +"&filterId="+filterId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

