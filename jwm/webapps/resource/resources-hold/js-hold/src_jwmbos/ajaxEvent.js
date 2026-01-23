   function ajaxEventList( ownerType, ownerId, page, count, containerRootId, viewId, busyIcon, viewName, tableId )
   {
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      document.getElementById( busyIcon ).style.display = "inline";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetEventList.jsp"
                      +"?ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&viewName="+viewName
                      +"&tableId="+tableId
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }



   function ajaxAddEvent( ownerType, ownerId, containerRootId, viewId, busyIcon, viewName, tableId )
   {
      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      var tableElement = document.getElementById( tableId );
      if ( tableElement != null )
      {
         var trElement = tableElement.insertRow( 0 );
         var containerId = createId();
         trElement.id = containerId;
      }

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetEvent.jsp"
                      +"?addEvent=true"
                      +"&ownerType="+ownerType
                      +"&ownerId="+ownerId
                      +"&viewName="+viewName
                      +"&user="+getUserName()


      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function ajaxEvent( id, viewName, containerRootId, viewId, titleId, busyIcon )
   {
      var containerId = "";
      var view = document.getElementById( viewId ).value;
      var containerId = containerRootId+"_"+view

      if ((document.getElementById( containerId).innerHTML).length >  5 ) return; // only load contents once

      setBusy( busyIcon,"inline" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      var serverCall = "/projectmanager/jsp/ajax/ajaxGetEvent.jsp"
                      +"?id="+id
                      +"&viewName="+viewName
                      +"&user="+getUserName()

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function clearFollowUp( contactId )
   {
      addHistoryWithIcon( "clearFollowUp", 17, 8, contactId, getSysImages()+"/broom.png", "/images/broom-bw.png" )
   }

   function setResponseDue( contactId )
   {
      addHistoryWithIcon( "setResponseDue", 18, 8, contactId, getSysImages()+"/reddot.png", "/images/graydot.png" )
   }

   function verifyDeleteEvent( icon, eventId )
   {
      var origBG = $(icon).closest( "tr" ).css( "background-color" );
      $(icon).closest( "tr" ).css( "background-color", "yellow" );

      if ( confirm( "Confirm delete event" ))
      {
//       setBusy( busyIcon,"inline" );
         $(icon).closest( "tr" ).css( "background-color", "red" );
         var tr = $(icon).closest( "tr" );

         var ajaxRequest = getAjaxRequestObject();

         ajaxRequest.onreadystatechange = function() { removeEventRow( ajaxRequest, tr );} ;

         var serverCall = "/projectmanager/jsp/ajax/ajaxGetEvent.jsp"
                         +"?id="+eventId
                         +"&deleteEvent=true"
                         +"&user="+getUserName()

         ajaxRequest.open("GET", serverCall, true);
         ajaxRequest.send(null);
      }
      else
      {
         $(icon).closest( "tr" ).css( "background-color", origBG );
      }
   }

   function removeEventRow( ajaxRequest, tr )
   {
      tr.remove();
//    setBusy( busyIcon, "none" );
   }

   function searchEvents( tagUid )
   {
      forcePage1(tagUid);

      var dateTimeField = getElementByName( "searchEventDateBgn" );
      setTagParm( "beginTimestamp", dateTimeField.value, tagUid, true );

      var dateTimeField = getElementByName( "searchEventDateEnd" );
      setTagParm( "endTimestamp", dateTimeField.value, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

