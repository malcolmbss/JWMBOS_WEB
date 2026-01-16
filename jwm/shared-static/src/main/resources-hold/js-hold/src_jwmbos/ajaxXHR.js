   function sendXHR( method, url, reqJson, headers )
   {
     return new Promise(function (resolve, reject)
                        {
                           var xhr = new XMLHttpRequest();
                           xhr.open(method, url);
                           xhr.onload = function ()
                                        {
                                          if (xhr.status >= 200 && xhr.status < 500)
                                          {
                                            resolve(
                                                      {
                                                         contentType: xhr.getResponseHeader( "content-type" ),
                                                         content:     xhr.response
                                                      }
                                                   );
                                          }
                                          else
                                          {
                                            reject(
                                                      {
                                                         status: this.status,
                                                         statusText: xhr.statusText
                                                      }
                                                  );
                                          }
                                        };
                           xhr.onerror = function ()
                                         {
                                           reject(
                                                  {
                                                     status: this.status,
                                                     statusText: xhr.statusText
                                                  }
                                                 );
                                         };
                          if (headers)
                          {
                             Object.keys(headers).forEach(function (key)
                                                                 {
                                                                    xhr.setRequestHeader(key, headers[key]);
                                                                 }
                                                               );
                          }
                          xhr.send(JSON.stringify(reqJson));
     });
   }

   function xhrService( method, url, reqJson, tagUid, containerId, refreshSectionIds, callBackFn, callbackParameters, headers, nextView )
   {
      xhrSetBusy( containerId, true );
      reqJson = xhrAddSecurityInfo( reqJson );
      reqJson = xhrAddSystemInfo( reqJson );
      sendXHR( method, url, reqJson, headers )
                                        .then((data) =>   {
                                                             if ( data.contentType.indexOf( "text/html" ) > -1 )
                                                             {
                                                                processHTMLContent( containerId, data.content );
                                                             }
                                                             else
                                                             {
                                                                var respJson = JSON.parse( data.content );
                                                                xhrDisplayPopupUrl( respJson, refreshSectionIds );
                                                                xhrDisplayMessage( respJson );
                                                                xhrNextView( tagUid, nextView );
                                                                xhrRefreshSections( refreshSectionIds, respJson );
                                                                xhrChangeImage( tagUid, respJson );
                                                                xhrChangeSuffix( tagUid, respJson );
                                                                xhrCallBack( callBackFn, respJson, callbackParameters );
                                                             }
                                                          })
                                        .catch((error) => {
                                                             console.error(error)
                                                          })
                                        .finally((aa) =>  {
                                                             xhrSetBusy( containerId, false );
                                                             timer.resetTimer(); // inactivity expiration timer
                                                          })
   }


   function xhrSetBusy( containerId, status )
   {
      try
      {
         if ( status == true ) // add a 'busy' icon
         {
            var busyImg = document.createElement("img");
            busyImg.setAttribute("src", getSysImages()+"/loader2.gif");
            busyImg.id = "busy"+containerId;
            busyImg.style.width = "70";
            busyImg.style.right = "5";
            busyImg.style.position = "absolute";
            busyImg.style.top = "-17";

            document.getElementById( containerId ).appendChild( busyImg );
         }
         else // remove the busy icon
         {
            var busyImg = document.getElementById( "busy"+containerId );
            busyImg.remove();
         }
      }
      catch( e )
      {
      }
   }

   function xhrAddSecurityInfo( reqJson )
   {
      reqJson["sessionId" ] = "$system$";
      return( reqJson );
   }

   function xhrAddSystemInfo( reqJson )
   {
      reqJson[ "user"   ] = getUserName();
      reqJson[ "reqUid" ] = generateReqUid();
      return( reqJson );
   }

   function xhrDisplayMessage( respJson ) // if a displayable message was returned....
   {
      if ( typeof( respJson.displayMsg ) != 'undefined' )
      {
         var type = respJson.msgType;
         if ( isNaN( type ) ) type = 3;
         createAlert( type, respJson.displayMsg );
      }
   }

   function xhrDisplayPopupUrl( respJson, tagUid ) // if popupUrl is found in json....
   {
      if ( typeof( respJson.popupUrl ) != 'undefined' )
      {
         var aPopup = window.open(respJson.popupUrl, "_blank", "width=400px;titlebar=no,status=no,menubar=no,toolbar=no"); // no whitespace in options (??)
         if ( aPopup == null ) alert( "It appears you might have a popup blocker enabled on your browser. Popups must be enabled for this site in order to continue. \n\nPlease enable popups, then try again." );
         var pollTimer = window.setInterval( function()
                                             {
                                                if ( aPopup.closed !== false)  // !== is required for compatibility with Opera
                                                {
                                                    window.clearInterval(pollTimer);
                                                    xhrRefreshSections( tagUid, null );
                                                }
                                             }, 200);
      }
   }

   function xhrNextView( tagUid, nextView )
   {
      if ( ( nextView != null ) && ( nextView != "" ) && typeof( nextView != 'undefined' ) )
      {
         document.getElementById('viewIcon'+tagUid+"_"+nextView).click();
      }
   }

   function xhrRefreshSections( refreshSectionIds, respJson )
   {
      if ( ( refreshSectionIds != null ) && ( refreshSectionIds != "" ) && typeof( refreshSectionIds != 'undefined' ) )
      {
         // force a 'refresh' of containing section (initially used for payment section)
         // could be more than one section to refresh
         // also id can be sent as true id or as a "name".  Try both... one of them should be valid

         var refreshSections = refreshSectionIds.split( ";" )
         for ( var i = 0; i < refreshSections.length; i++ )
         {
            // see if it is an id
            if ( document.getElementById('section_refresh'+refreshSections[i] ) != null )
            {
//             console.log( "refreshing by tagUid: " + refreshSections[i] );
               document.getElementById('section_refresh'+refreshSections[i]).click();
            }
            else
            {
               // see if it is a name
               var aTagUid = getTagUidFromName( refreshSections[i] );
               if ( document.getElementById('section_refresh'+aTagUid ) != null )
               {
//                console.log( "refreshing by name: " + refreshSections[i] + " = " + aTagUid );
                  document.getElementById('section_refresh'+aTagUid ).click();
               }
            }
         }
      }
   }

   function xhrChangeImage( tagUid, respJson )
   {
      if ( typeof( respJson.newImage ) != 'undefined' )
      {
          document.getElementById(inputId).src = getSysImages()+"/"+respJson.newImage;
      }
   }

   function xhrChangeSuffix( tagUid, respJson )
   {
      if ( typeof( respJson.newSuffix ) != 'undefined' )
      {
          document.getElementById( tagUid+'Suffix' ).innerHTML = respJson.newSuffix;
      }
   }

   function xhrCallBack( callBackFns, respJson, callbackParameters )
   {
      if ( ( callBackFns != null ) && typeof( callBackFns != 'undefined' ) )
      {
         var callBacks = callBackFns.split( ";" )
         for ( var i = 0; i < callBacks.length; i++ )
         {
            try
            {
               window[ callBacks[i] ](respJson, callbackParameters);
            }
            catch(err)
            {
//             console.log( "callBack: " + err );
            }
         }
      }
   }

   function xhrUpdate( method, url, reqJson, tagUid, containerId, refreshSectionIds, callBackFn, callbackParameters )
   {
      reqJson["dataObj"        ] = "inputProcessor";
      reqJson["command"        ] = "update";
      var   headers = {
                         "content-type"     : "application/json"
                      };

      xhrService( method,
                  url,
                  reqJson,
                  tagUid,
                  containerId,
                  refreshSectionIds,
                  callBackFn,
                  callbackParameters,
                  headers);
   }

   function setPersistentParm( parm, tagUid )
   {
      var parms = parm.split("=");
      if (parms.length != 2 )
      {
         console.error( "SetPersistentParm error: " + parm );
         return;
      }

      var url = "/cis/JWMBOS";
      var reqJson    = {
                           "identifier"  : "PersistentParm",
                           "table"       : "PERSISTENTPARM",
                           "col"         : parms[0],
                           "value"       : parms[1]
                       };
      xhrUpdate( "POST", url, reqJson, tagUid, "container"+tagUid );
   }

   function xhrPopup( url, container, identifier, dataReq, fieldName, dynJdbc)
   {
      xhrSetBusy( container.id, true );

      var   headers = {  "x_identifier"     : identifier,
                         "Authorization"    : "Session",
                         "x_reqUid"         : generateReqUid(),
                         "x_timestamp"      : localToUtc( new Date(), "YYYY-MM-DD-hh:mm:ss.sss" ),
                         "x_logLevel"       : "Debug",
                         "x_ipAddress"      : "192.168.1.1",
                         "x_appInstanceId"  : "1234",
                         "x_dataReq"        : dataReq,
                         "x_dynJdbc"        : dynJdbc
                      };

      sendXHR( "GET", url, "", headers )
                                        .then((data) =>   {
                                                             if ( data.contentType.indexOf( "text/html" ) > -1 )
                                                             {
                                                                processHTMLContent( containerId, data.content );
                                                             }
                                                             else
                                                             {
                                                                var respJson = JSON.parse( data.content );
                                                                container.innerHTML = respJson[fieldName];
                                                                popupContent(container);
                                                             }
                                                          })
                                        .catch((error) => {
                                                             console.error(error)
                                                          })
                                        .finally((data) => {
                                                             xhrSetBusy( container.id, false );
                                                          })
   }

  function xhrREST( restData )
  {
     var url = "/../"
               +restData.dataObj;

               if (( restData.method != "GET" )
                 &&( restData.method != "PUT" )
                 &&( restData.method != "DELETE" ) )
               {
                  url += "/"+restData.command; //GET, DELETE, PUT don't need commands
               }
               url += "/"
                   +  restData.locatorId
                   +  "/"
                   +  restData.locatorType
                   +  "/"
                   +restData.locatorRelationship;

               if ( restData.locatorRecordType !== undefined ) url += "/"+restData.locatorRecordType;
               if ( restData.value1            !== undefined ) url += "/"+restData.value1;
               if ( restData.value2            !== undefined ) url += "/"+restData.value2;
               if ( restData.value3            !== undefined ) url += "/"+restData.value3;
               if ( restData.value4            !== undefined ) url += "/"+restData.value4;
               if ( restData.value5            !== undefined ) url += "/"+restData.value5;
               if ( restData.value6            !== undefined ) url += "/"+restData.value6;

     var dataReqList = (restData.dataReq).split(",")
     var dataReq = "[";
     for (var i = 0; i < dataReqList.length; i++ )
     {
        if ( i > 0 ) dataReq += ", ";
        dataReq += '"'+dataReqList[i]+'"'
     }
     dataReq += "]";

     var   headers = {  "x_identifier"     : restData.identifier,
                        "Authorization"    : "Session",
                        "x_reqUid"         : generateReqUid(),
                        "x_timestamp"      : localToUtc( new Date(), "YYYY-MM-DD-hh:mm:ss.sss" ),
                        "x_logLevel"       : "Debug",
                        "x_ipAddress"      : "192.168.1.1",
                        "x_appInstanceId"  : "1234",
                        "x_dataReq"        : dataReq,
                        "x_tagUid"         : restData.tagUid,
                        "x_source"         : "xhr",
                        "content-type"     : "application/json"
                     };
     if ( restData.viewName != '' ) headers[ "x_viewName" ] = restData.viewName;
     if ( restData.renderer != '' ) headers[ "x_renderer" ] = restData.renderer;
     addSearchAndPaginationHeadersFromForm( headers, restData );

     xhrService( restData.method,
                 url,
                 restData.reqJson,
                 restData.tagUid,
                 restData.xhrData.containerId,
                 restData.xhrData.refreshSectionIds,
                 restData.xhrData.callbackFn,
                 restData.xhrData.callbackParameters,
                 headers,
                 restData.xhrData.nextView );
  }

  function processHTMLContent( containerId, content )
  {
     if (document.getElementById(containerId) != null)
     {
       var embeddedScripts;
       document.getElementById(containerId).innerHTML = content;
       try
       {
         document.getElementById(
           "pendingRefreshFlag_" + containerId
         ).checked = false;
       } catch (err)
       {
       }

       embeddedScripts = document
         .getElementById(containerId)
         .getElementsByTagName("script");

       for (var iii = 0; iii < embeddedScripts.length; iii++)
       {
         var aScript = embeddedScripts[iii];
                            console.log( "eval " + aScript.innerHTML);

         if (aScript.getAttribute("src") != null)
         {
           document.appendChild(aScript);
         } else
         {
           try
           {
             var evalReturn = eval(aScript.innerHTML);
           } catch (err) {
             console.error("Eval err: " + err);
             console.error(
               "Eval exception: [" +
                 err.message +
                 "] ===> (Eval) \n>>>>>>>>>>" +
                 aScript.innerHTML +
                 "\n<<<<<<<<<<<"
             );
           }
         }
       }
       if ((typeof forceRefreshTagUid != "undefined")
          && (forceRefreshTagUid != "" ) )
       {
         forceRefresh(forceRefreshTagUid);
       }
     }
     else
     {
       console.error( "ajaxSection.insertContents() -- invalid containerId -- " + containerId
       );
     }
   }

   function addSearchAndPaginationHeadersFromForm( headers, restData )
   {
     // this requires standardization of entry field names on search boxes
     //  not there yet on many of the search boxes

     if ( restData.page == 'undefined' )
     {
        var pageElement = getElementByName("page" + restData.tagUid);
        if ( pageElement != '' ) headers[ "x_page" ]         = pageElement.value ;
        else                       headers[ "x_page" ]         = Number( 1 ) ;
     }
     else
     {
        headers[ "x_page" ] = restData.page ;
     }

     if ( restData.count == 'undefined' )
     {
        var countElement = getElementByName("count" + restData.tagUid);
        if ( countElement != '' ) headers[ "x_count" ]       = countElement.value ;
        else                        headers[ "x_count" ]       = Number( 100 ) ;
     }
     else
     {
        headers[ "x_count" ] = restData.count ;
     }

     if ( restData.rangeBgn == undefined )
     {
        var rangeBgnElement = getElementByName("rangeBgn" + restData.tagUid);
        if ( rangeBgnElement != '' ) headers[ "x_rangeBgn" ] = bgnRangeUtc( rangeBgnElement.value );
        else                           headers[ "x_rangeBgn" ] = "2001-01-01" ;
     }
     else
     {
        headers[ "x_rangeBgn" ] = bgnRangeUtc( restData.rangeBgn );
     }

     if ( restData.rangeEnd == undefined )
     {
        var rangeEndElement = getElementByName("rangeEnd" + restData.tagUid);
        if ( rangeEndElement != '' ) headers[ "x_rangeEnd" ] = endRangeUtc( rangeEndElement.value );
        else                           headers[ "x_rangeEnd" ] = "2001-12-31" ;
     }
     else
     {
        headers[ "x_rangeEnd" ] = endRangeUtc( restData.rangeEnd );
     }

     if ( restData.onDate == undefined )
     {
        var onDateElement = getElementByName("onDate" + restData.tagUid);
        if ( onDateElement != '' ) headers[ "x_onDate" ] = onDateElement.value;
        else                       headers[ "x_onDate" ] = now( "yyyy-mm-dd" ) ;
     }
  }
