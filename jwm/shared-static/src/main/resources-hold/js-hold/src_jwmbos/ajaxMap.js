   var maps = new Object();
   var mapBounds = new Object();
   var dragInProgress = false;

   function saveCoordinates( objType, objId, polygonCoordinates )
   {
      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { coordinatesUpdateResponse( ajaxRequest );} ;
      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      var coordinates = "";
      for (var i =0; i < polygonCoordinates.getLength(); i++)
      {
        var xy = polygonCoordinates.getAt(i);
        coordinates += "{"+ xy.lat() + ',' + xy.lng() +"};";
      }
      var params     = "table=GeoLoc"
                      +"&user="+getUserName()
                      +"&col=Coordinates"
                      +"&objType="+objType
                      +"&objId="+objId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&value="+coordinates;

      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function coordinatesUpdateResponse(ajaxRequest )
   {
      if(ajaxRequest.readyState == 4)
      {
         handleAjaxRC( ajaxRequest );
      }
   }

   function createNewRegionPolygon( objType, objId, point, refreshSectionId )
   {
//    console.log( "createNewRegionPolygon " + point.lat() + " " + point.lng() );
      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { createNewRegionResponse( ajaxRequest, refreshSectionId );} ;
      var coordinate = "{"+ point.lat() + ',' + point.lng() +"};";
      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      var params     = "table=Region"
                      +"&user="+getUserName()
                      +"&col=CREATEPOLYGON"
                      +"&objType="+objType
                      +"&objId="+objId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&value="+coordinate;

      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function createNewRegionResponse(ajaxRequest, refreshSectionId )
   {
      if(ajaxRequest.readyState == 4)
      {
         handleAjaxRC( ajaxRequest );
//       console.log( 'refreshSectionId ' + refreshSectionId );
         document.getElementById( 'section_refresh'+refreshSectionId ).click();
      }
   }

   function setLabelPosition( objType, objId, point, refreshSectionId )
   {
//    console.log( "setLabelPositionPolygon " + point.lat() + " " + point.lng() );
      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { setLabelPositionResponse( ajaxRequest, refreshSectionId );} ;
      var coordinate = "{"+ point.lat() + ',' + point.lng() +"};";
      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      var params     = "table=Region"
                      +"&user="+getUserName()
                      +"&col=SETLABELPOSITION"
                      +"&objType="+objType
                      +"&objId="+objId
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&value="+coordinate;

      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function setLabelPositionResponse(ajaxRequest, refreshSectionId )
   {
      if(ajaxRequest.readyState == 4)
      {
         handleAjaxRC( ajaxRequest );
//       console.log( 'refreshSectionId ' + refreshSectionId );
         document.getElementById( 'section_refresh'+refreshSectionId ).click();
      }
   }

   function setCountyOwner( point, objType, objId, mapTagUid  )
   {
      var marker = new google.maps.Marker(
      {
        position: {
          lat: point.lat(),
          lng: point.lng()
        },
        map: maps[mapTagUid],
        icon:
        {
           labelOrigin: new google.maps.Point(0, 0),
           scaledSize: new google.maps.Size(30, 30),
//         url: "http://maps.google.com/mapfiles/ms/icons/red.png"
        }
      });
      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"      ] =  "Region";
      reqJson[ "objType"    ] =  objType;
      reqJson[ "objId"      ] =  objId;
      reqJson[ "col"        ] =  "SETCOUNTYOWNER";
      reqJson[ "latitude"   ] =  ""+ point.lat();
      reqJson[ "longitude"  ] =  ""+ point.lng();

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 "",
                 "",
                 "",
                 "processCopyTo,processReturnToRO,processUpdateCallBack"
               );
   }
