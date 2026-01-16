function ajaxSetViewToggle(icon, tagUid) {
  var minusIcon = getSysImages() + "/minus.gif";
  var plusIcon = getSysImages() + "/plus.gif";
  iconElement = document.getElementById(icon);
  if (iconElement.src.indexOf(plusIcon) > -1) {
    ajaxSetView(1, tagUid);
    iconElement.src = minusIcon;
  } else {
    ajaxSetView(0, tagUid);
    iconElement.src = plusIcon;
  }
}

function ajaxExpand(
  id,
  icon,
  nextViewId,
  refreshId,
  views,
  edit,
  tagUid,
  viewId,
  viewDisplay,
  containerRootId,
  lightBoxOption
) {
  //    console.trace();
  //    console.log( "Expand " + id );
  divElement = document.getElementById(id);
  ctrlContainerElement = document.getElementById("section_ctrl" + tagUid);
  miscContainerElement = document.getElementById(
    "section_MiscHeaderContent" + tagUid
  );

  if (divElement == null) return; // this is not an error.... tableRow='true' will not have expansion stuff

  iconElement = document.getElementById(icon);
  nextViewElement = document.getElementById(nextViewId);
  refreshElement = document.getElementById(refreshId);
  var currFooterLayerElement = document.getElementById(
    "section_footer" + tagUid
  );

  if (divElement.style.display == "none") {
    divElement.style.display = getDisplayStyleForThisView(viewDisplay, viewId);
    divElement.style.float = getFloatStyleForThisView(viewDisplay, viewId);
    if (nextViewElement != null) {
      if (views > 1) nextViewElement.style.display = "inline";
    }

    if (refreshElement.className != "hidden")
      refreshElement.style.display = "inline";

    iconElement.src = getSysImages() + "/minus.gif";
    //       ctrlContainerElement.style.visibility = "visible";
    ctrlContainerElement.style.display = "inline-block";
    if (miscContainerElement != null)
      miscContainerElement.style.display = "block";

    currFooterLayerElement.style.display = "block";
  } else {
    //       ajaxNextView( views, viewId, containerRootId, tagUid, viewDisplay, lightBoxOption )

    divElement.style.display = "none";
    if (nextViewElement != null) nextViewElement.style.display = "none";
    refreshElement.style.display = "none";
    iconElement.src = getSysImages() + "/plus.gif";
    //       ctrlContainerElement.style.visibility = "hidden";
    ctrlContainerElement.style.display = "none";
    if (miscContainerElement != null)
      miscContainerElement.style.display = "none";
    currFooterLayerElement.style.display = "none";
  }
  //    console.log( "Exit Expand" );
}

function ajaxRefresh(viewId, containerRootId, footerId, atAGlanceId)
{
  if ( viewId != '' )  // probably an 'atAGlance-only' refresh if ''
  {
     // clear contents to force populate to reload....
     var view = document.getElementById(viewId).value;

     //    console.log( "pendingRefreshFlagHTML " + pendingRefreshFlagHTML );

     var currViewLayerElement = document.getElementById(
       containerRootId + "_" + view
     );

     if (currViewLayerElement == null) {
       //        console.log( "ajaxRefresh: currViewElement not found: " + containerRootId+"_"+view  + " " + viewId );
       currViewLayerElement = document.getElementById(containerRootId + "_1"); // force first view if view not found
       document.getElementById(viewId).value = 1;
     }
     //    console.log( "pendingRefreshFlag_"+containerRootId+"_"+view );
     try
     {
       document.getElementById(
         "pendingRefreshFlag_" + containerRootId + "_" + view
       ).checked = true;
     }
     catch( exception1 )
     {
     }

     var currFooterLayerElement = document.getElementById(footerId);
     document.getElementById("pendingRefreshFlag_" + footerId).checked = true;
  }
  ajaxRefreshAtAGlanceSection( atAGlanceId );
}

function ajaxRefreshAtAGlanceSection( atAGlanceId )
{
  var atAGlanceLayerElement = document.getElementById(atAGlanceId);
  document.getElementById("pendingRefreshFlag_" + atAGlanceId).checked = true;
}

function clearContents(containerId) {
  //    console.log( "clear contents: " + containerId );
  var container = document.getElementById(containerId);
  container.innerHTML = "";
}

function getThisViewName(
  viewNames,
  viewId,
  containerRootId,
  viewDisplay,
  tagUid
) {
  var viewIdElement = document.getElementById(viewId);
  if (viewIdElement == null) return "";

  var view = viewIdElement.value;
//  console.log( view );

  var viewNameArray = viewNames.split(";");

  if (viewDisplay != "") {
    forceView(viewNameArray.length, view, containerRootId, viewId, viewDisplay); // make sure we are in sync
  }

  var thisViewName = viewNameArray[view - 1];

  // 6/28/16 -- turn off addItems if inline-block
  var addItemsIcon = document.getElementById("sectionList_addItems" + tagUid);
  if (addItemsIcon != null) {
    //       console.log("viewDisplay: " + getDisplayStyleForThisView( viewDisplay, viewId) );
    if (getDisplayStyleForThisView(viewDisplay, viewId) == "inline-block") {
      addItemsIcon.style.display = "none";
    } else {
      addItemsIcon.style.display = "inline";
    }
  }
  //    console.log( "addItemsIcon|" + addItemsIcon + "|" + tagUid + "|" + thisViewName + "|" + viewNames + "|" + view + "|" + viewDisplay);
//  console.log( "thisViewName: " + thisViewName );
  return thisViewName;
}

function getDisplayStyleForThisView(viewDisplay, viewId) {
  var view = document.getElementById(viewId).value;
  if (view == 0) return "block"; // actually, this is the 'closed' view... just default

  if (viewDisplay == "") return "block";

  //    console.log( "getDisplayStyleForThisView " + view );
  var viewDisplayStyleArray = viewDisplay.split(";");
  var displayStyle = viewDisplayStyleArray[view - 1].split("^");
  return displayStyle[0];
}

function getAutoRefreshForThisView(autoRefresh, viewId) {
  var view = document.getElementById(viewId).value;
  if (view == 0) return "false";

  if (autoRefresh == "") return "false";

  var autoRefreshArray = autoRefresh.split(";");
  return autoRefreshArray[view - 1];
}

function getLightBoxOptionForThisView(lightBoxOption, viewId) {
  //    console.log( "getLightBoxOptionForThisView(" + lightBoxOption + ", " + viewId );
  if (typeof lightBoxOption == "undefined") return "none";

  var view = document.getElementById(viewId).value;

  if (view == 0) {
    // actually, this is the 'closed' view... just default
    if (lightBoxOption.indexOf("none") > 0) return "none"; // section doesn't use lightBoxOption... don't do anything
    return "false"; // section uses lightBoxOption... need to close it;
  }

  if (lightBoxOption == "") return "none";

  var lightBoxOptionArray = lightBoxOption.split(";");
  //    console.log( "LightBoxOption: " + viewId + " " + view + " " + lightBoxOptionArray[view-1] );
  return lightBoxOptionArray[view - 1];
}

function getFloatStyleForThisView(viewDisplay, viewId) {
  var view = document.getElementById(viewId).value;
  if (view == 0) return "none"; // actually, this is the 'closed' view... just default

  //    console.log( "getFloatStyleForThisView " + view );
  var viewDisplayStyleArray = viewDisplay.split(";");
  var displayStyle = viewDisplayStyleArray[view - 1].split("^");
  var float = "none";
  if (displayStyle.length > 1) float = displayStyle[1];
  return float;
}

function forceView(views, view, containerRootId, viewId, viewDisplay) {
  // make sure the correct view layer is visible
  if (view > 0) {
    // view=0 is now 'closed'... so don't expect a view layer for it
    for (var i = 0; i < views; i++) {
      var viewLayerElement = document.getElementById(
        containerRootId + "_" + (i + 1)
      );
      viewLayerElement.style.display = "none";
    }

    var mapLayer = document.getElementById(containerRootId + "_map");
    if (mapLayer == null) {
      // no google map layer exists
      var currViewLayerElement = document.getElementById(
        containerRootId + "_" + view
      );
      currViewLayerElement.style.display = getDisplayStyleForThisView(
        viewDisplay,
        viewId
      );
      currViewLayerElement.style.float = getFloatStyleForThisView(
        viewDisplay,
        viewId
      );
    } // force map layer to be visible
    else {
      mapLayer.style.display = "block";
    }
  }
}

function ajaxIncrementView(views, tagUid) {
  //    console.log( "ajaxIncrementView( " + views + ", " + tagUid + " ) " );
  views += 1; // need to add 'closed' view
  var viewsDropDownElement = document.getElementById("viewList" + tagUid);

  var selNdx = viewsDropDownElement.selectedIndex;
  //    console.log( "Selected Ndx: " + selNdx );
  selNdx++;
  if (selNdx >= views) selNdx = 0;
  //    console.log( "Selected Ndx: " + selNdx );
  viewsDropDownElement.selectedIndex = selNdx;

  selNdx = viewsDropDownElement.selectedIndex;

  //    console.log( "new selected Ndx in dropdown: " + selNdx );
}

function ajaxSetView(view, tagUid) {
  //    console.log( "SetView: " + view );
  var viewsDropDownElement = document.getElementById("viewList" + tagUid);
  viewsDropDownElement.selectedIndex = view;
}

function setThumbnailMode(mode, tagUid) {
  var outerId = "section_outer" + tagUid;
  var thumbNailId = "section_thumbnail" + tagUid;
  var thumbNailDiv = document.getElementById(thumbNailId);
  var outerDiv = document.getElementById(outerId);

  if (mode == 1) {
    thumbNailDiv.style.display = "block";
    outerDiv.style.display = "none";
    //       console.log( "setting thumbnail mode: " + tagUid );
  } else {
    thumbNailDiv.style.display = "none";
    outerDiv.style.display = "block";
    //       console.log( "clearing thumbnail mode: " + tagUid );
  }
}

function toggleThumbnail(tagUid) {
  var outerId = "section_outer" + tagUid;
  var thumbNailId = "section_thumbnail" + tagUid;
  var thumbNailDiv = document.getElementById(thumbNailId);
  var outerDiv = document.getElementById(outerId);

  if (thumbNailDiv.style.display == "none") {
    thumbNailDiv.style.display = "block";
    outerDiv.style.display = "none";
  } else {
    thumbNailDiv.style.display = "none";
    outerDiv.style.display = "block";
  }
}

function ajaxNextView(
  views,
  viewId,
  containerRootId,
  tagUid,
  viewDisplay,
  tagName,
  lightBoxOption,
  edit,
  innerId,
  expIconId,
  nextViewId,
  refreshId
) {
  //    console.log( "ajaxNextView( " + views + ", " + viewId + ", " + containerRootId + ", " + tagUid + ", " + viewDisplay + " ) " );
  var view = document.getElementById(viewId).value;

  var currViewLayerElement = document.getElementById(
    containerRootId + "_" + view
  );
  //    console.log( "currViewLayerElementId = " + containerRootId+"_"+view );
  if (currViewLayerElement != null) currViewLayerElement.style.display = "none";

  // tag option to use 'nextview' icon or view-select dropdown

  if (document.getElementById("viewList" + tagUid) != null) {
    // using list dropdown
    view = document.getElementById("viewList" + tagUid).selectedIndex; // indexes will be 1-based due to 'closed' always at 0 index

    // 5.25.16 -- replacing +/- icon with auto open/close based on view selection (closed is a 'view')
    var expElement = document.getElementById("section_expIcon" + tagUid);
    var sectionInnerElement = document.getElementById("section_inner" + tagUid);
    //       console.log( "view = " + view );

    // 10/20/16
    if (view == 0) {
      // this always means 'closed' (5/25/16)
      if (getTagParm("headerClass", tagUid) == "hidden") view = 1; // don't minimize/close if no header (everything disappears)

      if (sectionInnerElement.style.display != "none") {
        // if open, then close it
        ajaxExpand(
          innerId,
          expIconId,
          nextViewId,
          refreshId,
          views,
          edit,
          tagUid,
          viewId,
          viewDisplay,
          containerRootId,
          lightBoxOption
        );
      }
    } // view non-zero
    else {
      if (sectionInnerElement.style.display == "none") {
        // if closed, then open it
        ajaxExpand(
          innerId,
          expIconId,
          nextViewId,
          refreshId,
          views,
          edit,
          tagUid,
          viewId,
          viewDisplay,
          containerRootId,
          lightBoxOption
        );
      }
    }
  } // using 'nextView' icon
  else {
    view = view * 1 + 1; // need to prevent it from doing string concat instead of math
    if (view > views) view = 1;
  }
  document.getElementById(viewId).value = view;

  var nextViewLayerElement = document.getElementById(
    containerRootId + "_" + view
  );
  if (nextViewLayerElement != null) {
    // null will occur when 'closed' view is selected
    nextViewLayerElement.style.display = getDisplayStyleForThisView(
      viewDisplay,
      viewId
    );
    nextViewLayerElement.style.float = getFloatStyleForThisView(
      viewDisplay,
      viewId
    );

    var innerDiv = document.getElementById("section_inner" + tagUid);
    innerDiv.style.display = getDisplayStyleForThisView(viewDisplay, viewId); //parent 'inner div' can be block on inline depending on view layer pref
    //       console.log( "innerDiv: " + innerDiv.style.display );
    innerDiv.style.float = getFloatStyleForThisView(viewDisplay, viewId);

    //       var viewNameDisplay = document.getElementById( "viewNameDisplay"+tagUid );
    //       if ( viewNameDisplay != null )
    //       {
    //          var viewNameArray = getTagParm( "viewNames", tagUid ).split(";");
    //          viewNameDisplay.innerHTML = "["+viewNameArray[view-1]+"]";
    //       }
    //       else
    //       {
    //          console.error( "viewNameDisplay"+tagUid + " element not found." );
    //       }

    // 11/17/15 - need to force page 1 when swapping views
    var pageElement = document.getElementById("page" + tagUid);
    if (pageElement != null) pageElement.value = 1;
    setTagParm("page", 1, tagUid);
    //       console.log( "set page = 1" );

    // 12-19-15
    var currFooterLayerElement = document.getElementById(
      "section_footer" + tagUid
    );
    document.getElementById(
      "pendingRefreshFlag_section_footer" + tagUid
    ).checked = true;
  }

  var outerDiv = document.getElementById("section_outer" + tagUid);
  var innerDiv = document.getElementById("section_inner" + tagUid);
  var ctrlDiv = document.getElementById("section_ctrl" + tagUid);

  var doLightBox = getLightBoxOptionForThisView(lightBoxOption, viewId);
  if (doLightBox == "true") {
    innerDiv.style.position = "fixed";
    innerDiv.style.overflow = "auto";
//    innerDiv.style.border = "1px solid red";
    innerDiv.style.left = "5%";
    innerDiv.style.top = "15%";
    innerDiv.style.width = "90%";
    innerDiv.style.height = "80%";
    innerDiv.style.backgroundColor = "transparent !important";
    innerDiv.style.zIndex = "2";
    document.getElementById("lightBoxScreen").style.display = "block";
    document.getElementById("closeButton" + tagUid).style.display = "";
  } else if (doLightBox == "false") {
    // can't do 'else'... don't want to work the screen on subSections inside a lightBox'd section
    innerDiv.style.position = "static";
    innerDiv.style.zIndex = "0";
    innerDiv.style.width = ""; // remove
    innerDiv.style.height = ""; // remove

    if (view == 0) {
      innerDiv.style.display = "none";
    } else {
      innerDiv.style.display = "block";
    }

    //       ctrlDiv.style.visibility = "hidden";
    document.getElementById("lightBoxScreen").style.display = "none";
    //       document.getElementById( "viewIcons" + tagUid ).style.display = "inline-block";
    document.getElementById("closeButton" + tagUid).style.display = "none";
  } else if (doLightBox == "none") {
    // lightBox not used
  }

  // 10/1/16 add 'viewIcon' with borders to indicate selected view
  for (var i = 0; i <= views; i++) {
    var viewIconElement = document.getElementById(
      "viewIcon" + tagUid + "_" + i
    );
    if (viewIconElement != null) {
      if (view == i) {
        viewIconElement.style.opacity = 0.3;
        //             viewIconElement.className = "viewiconactive";
      } else {
        //             viewIconElement.className = "viewiconinactive";
        viewIconElement.style.opacity = 1;
      }
    }
  }

  //    console.log( "AutoRefresh: " + getAutoRefreshForThisView( getTagParm( "autoRefresh", tagUid ), viewId ) );
  if (
    getAutoRefreshForThisView(getTagParm("autoRefresh", tagUid), viewId) ==
    "true"
  ) {
    forceRefresh(tagUid);
  }
}

// function updateParentContainer( containerTagUid, tagUid, lightBoxOption, viewId ) // currently used by HML flow view to cause all cells to go to thumbnail view except active cell
// {
//    var tableElement = document.getElementById( containerTagUid );
//
//    var currRow = getTagParm( "ypos", tagUid );
//    var currCol = getTagParm( "xpos", tagUid );
//
//    if (tableElement != null )
//    {
//       var doLightBoxOption = getLightBoxOptionForThisView( lightBoxOption, viewId );
//       for (var i = 0, row; row = tableElement.rows[i]; i++)
//       {
//          for (var j = 0, cell; cell = row.cells[j]; j++)
//          {
//             var cellTagParmsElement = cell.getElementsByTagName( "table" )[0];
//             if ( cellTagParmsElement != null )
//             {
//                var cellTagUid = cellTagParmsElement.getAttribute( "tagUid" );
//
//                if ( doLightBoxOption == "true" )
//                {
//                   if (( i != currRow-1 )
//                      ||( j != currCol-1 ))
//                   {
//                      setThumbnailMode( 1, cellTagUid ); // all surrounding cells go to thumbnail mode
//                   }
//                   else // cell being magnified
//                   {
//                      setThumbnailMode( 0, cellTagUid ); // make main cell full size (non-thumbnail)
//                   }
//                }
//                else // no magnification.... make all cells non-thumbnail
//                {
//                   setThumbnailMode( 0, cellTagUid ); // make main cell full size
//                }
//             }
//          }
//       }
//    }
// }

function deleteSectionListItem(
  icon,
  id,
  tagUid,
  fn,
  message,
  ownerType,
  ownerId,
  containerTag,
  aDataObj
) {
  if ( getTagParm( "dataObj", tagUid ) == '' ) setTagParm("dataObj", aDataObj, tagUid);

  if (containerTag == "") containerTag = "tr";
  //    console.log( "tagUid '" + tagUid + "'" );
  //    this uses the parm list from the tag of the object being deleted since the delete tag itself does not have a parm list

  var origBG = $(icon).closest(containerTag).css("background-color");
  //    console.log( "origBG " + origBG );
  //    console.log( "id " + $(icon).closest( containerTag ).id );

  var closestTag = $(icon).closest(containerTag);
  $(icon).closest(containerTag).css("background-color", "yellow");

  setTimeout(function ()
  {
    if (confirm(message))
    {
      $(icon).closest(containerTag).css("background-color", "red"); // if delete is successful, red background will go away since element goes away
      var tr = $(icon).closest(containerTag);

      var deleteUrl = getTagParm("deleteUrl", tagUid);
      setTagParm("objectId", id, tagUid);
      setTagParm("fn", fn, tagUid);
      setTagParm("user", getUserName(), tagUid);
      setTagParm("reqUid", generateReqUid(), tagUid);
      setTagParm("objectClassID", getTagParm("memberClassID", tagUid), tagUid); // swap the 'list' model handler class to the 'member' model handler class


      if (ownerId != -1) setTagParm("ownerType", ownerType, tagUid);
      if (ownerId != -1) setTagParm("ownerId", ownerId, tagUid);

      var parms = getParmsAsString(tagUid);

        if ( getTagParm( "apiVersion", tagUid ) == 1 )
        {
         var ajaxRequest = getAjaxRequestObject();
         ajaxRequest.onreadystatechange = function () {
                                                        tr.remove();
                                                      };

         ajaxRequest.open("POST", deleteUrl, true);
         ajaxRequest.setRequestHeader(
           "Content-type",
           "application/x-www-form-urlencoded"
         );
         ajaxRequest.send(parms);
        }
      else if ( getTagParm( "apiVersion", tagUid ) == 2 )
      {
         var restData = {};
         var xhrData = {};
         xhrData[ "containerId"         ] =  tagUid;
         xhrData[ "refreshSectionIds"   ] =  "";
         xhrData[ "callbackFn"          ] =  "removeDOMItemV2";
         xhrData[ "callbackParameters"  ] =  tr;
         xhrData[ "nextView"            ] =  "";

         restData[ "method"             ] =  "DELETE";
         restData[ "dataObj"            ] =  getTagParm( "dataObj", tagUid );
         restData[ "command"            ] =  "" // command is implied in DELETE method
         restData[ "identifier"         ] =  "Delete/" + getTagParm( "dataObj", tagUid ) + "/" + getTagParm( "locatorId", tagUid );
         restData[ "locatorId"          ] =  Number( getTagParm( "locatorId", tagUid ) );
         restData[ "locatorType"        ] =  Number( getTagParm( "locatorType", tagUid ) );
         restData[ "locatorRelationship"] =  Number( getTagParm( "locatorRelationship", tagUid ) );
         restData[  "locatorRecordType" ] =  getLocatorRecordTypeByView( getTagParm( "recordType", tagUid ), tagUid );
         restData[ "dataReq"            ] =  getTagParm( "dataReq", tagUid );
         restData[ "reqJson"            ] =  {}
         restData[ "xhrData"            ] =  xhrData;

         xhrREST( restData );
      }
    }
    else
    {
      $(icon).closest(containerTag).css("background-color", origBG);
    }
  }, 100);
}

function populateV2( method,
                     dataObj,
                     command,
                     locatorType,
                     locatorId,
                     locatorRelationship,
                     locatorRecordType,
                     viewName,
                     tagUid,
                     containerId,
                     dataReq,
                     renderer )
{
   var restData = {};
   var xhrData = {};
   xhrData[ "containerId"         ] =  containerId;
   xhrData[ "refreshSectionIds"   ] =  "";
   xhrData[ "callbackFn"          ] =  ""
   xhrData[ "callbackParameters"  ] =  "";
   xhrData[ "nextView"            ] =  "";

   restData[ "method"             ] =  method
   restData[ "dataObj"            ] =  dataObj
   restData[ "command"            ] =  command
   restData[ "identifier"         ] =  method +"/" + dataObj + " " + locatorType + "/" + locatorId + "/" + locatorRelationship + "/" + getLocatorRecordTypeByView( locatorRecordType, tagUid ) + "/" + viewName
   restData[ "locatorId"          ] =  locatorId
   restData[ "locatorType"        ] =  locatorType
   restData[ "locatorRelationship"] =  locatorRelationship
   restData[ "locatorRecordType"  ] =  getLocatorRecordTypeByView( locatorRecordType, tagUid )
   restData[ "dataReq"            ] =  dataReq
   restData[ "reqJson"            ] =  {}
   restData[ "viewName"           ] =  viewName
   restData[ "tagUid"             ] =  tagUid
   restData[ "renderer"           ] =  renderer
   restData[ "xhrData"            ] =  xhrData;

   xhrREST( restData );
}

function actionButton( method,
                     dataObj,
                     command,
                     locatorId,
                     locatorType,
                     locatorRelationship,
                     locatorRecordType,
                     rangeBgn,
                     rangeEnd,
                     page,
                     count,
                     tagUid
                     )
{
   var restData = {};
   var xhrData = {};
   xhrData[ "containerId"         ] =  "";
   xhrData[ "refreshSectionIds"   ] =  "";
   xhrData[ "callbackFn"          ] =  "";
   xhrData[ "callbackParameters"  ] =  "";
   xhrData[ "nextView"            ] =  "";

   restData[ "method"             ] =  method
   restData[ "dataObj"            ] =  dataObj
   restData[ "command"            ] =  command
   restData[ "identifier"         ] =  method +"/" + dataObj + " " + locatorType + "/" + locatorId + "/" + locatorRelationship + "/" + locatorRecordType
   restData[ "locatorId"          ] =  locatorId
   restData[ "locatorType"        ] =  locatorType
   restData[ "locatorRelationship"] =  locatorRelationship
   restData[ "locatorRecordType"  ] =  getLocatorRecordTypeByView( locatorRecordType, tagUid )
   restData[ "dataReq"            ] =  ""
   restData[ "reqJson"            ] =  {}
   restData[ "viewName"           ] =  ""
   restData[ "tagUid"             ] =  ""
   restData[ "renderer"           ] =  ""
   restData[ "xhrData"            ] =  xhrData;
   restData[ "rangeBgn"           ] =  rangeBgn;
   restData[ "rangeEnd"           ] =  rangeEnd;
   restData[ "page"               ] =  page;
   restData[ "count"              ] =  count;

   xhrREST( restData );
}


function removeDOMItem( anElement )
{
   anElement.remove();
}

function removeDOMItemV2( respJson, anElement )
{
   anElement.remove();
}

function addSectionListItem(tagUid, id, loc, forceRefreshTagUid, theObjectClassID, theFn ) {
  // new or existing based on id
  // in some situations, addIcon is hidden after single add (attributes w/ cardinality=1); area is still clickable... if icon not visible, don't process

  var addItemsIconElement = document.getElementById(
    "sectionList_addItems" + tagUid
  );

  //    console.log( "addSectionListItem( " + tagUid + ", " + id + ", " + loc + " )" );

  if (addItemsIconElement != null) {
    if (addItemsIconElement.style.display == "none") return false;
  }

  var viewNames = getTagParm("viewNames", tagUid);
  var viewId = "section_view" + tagUid;
  var containerRootId = "section_viewlayer" + tagUid;
  var tableIdRoot = getTagParm("tableIdRoot", tagUid);
  var addUrl = getTagParm("addUrl", tagUid);

  var tableId =
    tableIdRoot +
    "_" +
    getThisViewName(viewNames, viewId, containerRootId, "", tagUid);

  var containerId = createId();
  var tableElement = document.getElementById(tableId);
  //    console.log( "tableId " + tableId );
  if (tableElement != null) {
    // first remove 'No Entries Found' row if it exists
    for (var i = 0, row; (row = tableElement.rows[i]); i++) {
      //          console.log( i + " row.id " + row.id );
      if (row.id == tableId + "_NoRecords") {
        //             console.log( "remove" );
        row.remove();
        break;
      }
    }
    var trElement;
    // now add the row
    if (loc != "") trElement = tableElement.insertRow(loc);
    else trElement = tableElement.insertRow(); // bottom of table
    trElement.id = containerId;
    trElement.className = "row0";
    //       console.log( "add row ..." +trElement.id );
  } else {
//    console.error("addSectionListItem() -- tableElement not found: " + tableId);
//    2023-08-16 moving from lists in table to lists in responsive row/col
      var newRow = document.createElement("div");
      newRow.className = "jwmbos-row row0";
      newRow.id = containerId;
      document.getElementById( "listContainer"+tagUid ).prepend( newRow );
  }

  if ((typeof theFn == "undefined") || ( theFn == "" ) )
  {
     if (id == -1) {
       setTagParm("fn", "createNew", tagUid);

     } // addExisting
     else {
       setTagParm("fn", "addExisting", tagUid);
       setTagParm("id", id, tagUid);
     }
  }
  else {
     setTagParm("fn", theFn, tagUid);
  }

  if ((typeof theObjectClassID == "undefined") || ( theObjectClassID == -1 ))
  {
     setTagParm("objectClassID", getTagParm("memberClassID", tagUid), tagUid); // swap the 'list' model handler class to the 'member' model handler class
  }
  else
  {
     setTagParm("objectClassID", theObjectClassID, tagUid); // use the one that was passed in (used to add invoice/lederitem to statementitemlist)
  }

  //console.log( "callServer..." );
  callServer(
    tagUid,
    addUrl,
    containerId,
    getTagParm("addedItemView", tagUid),
    forceRefreshTagUid
  );
}

function getLocatorRecordTypeByView( aRecordType, tagUid )
{
  if ( (""+aRecordType).indexOf( ";" ) == -1 ) return( Number( aRecordType ) );

  var locatorRecordTypeArray = (""+aRecordType).split(";");
  var aView = 1;
  try
  {
     var viewsDropDownElement = document.getElementById("viewList" + tagUid);
     var aView = viewsDropDownElement.selectedIndex
  }
  catch( e )
  {
  }
  return ( Number( locatorRecordTypeArray[ aView - 1] ) );
}

function populateViewHeader(tagUid) {
  var viewsDropDownElement = document.getElementById("viewList" + tagUid);
  var view = viewsDropDownElement.selectedIndex;
  //    console.log( "view: " + view );

  var viewHeaders = getTagParm("viewHeaders", tagUid);
  //    console.log( "viewHeaders: " + viewHeaders );
  if (viewHeaders == "") return;

  var viewHeaderArray = viewHeaders.split(";");
  var thisViewHeader = viewHeaderArray[view - 1];
  //    console.log( "ThisViewHeader: " + thisViewHeader );

  // force a refresh each time...
  var viewHeaderElement = document.getElementById(
    "section_viewHeader" + tagUid
  );
  document.getElementById(
    "pendingRefreshFlag_section_viewHeader" + tagUid
  ).checked = true;

  callServer(tagUid, "", "section_viewHeader" + tagUid, thisViewHeader);
}

function populate(tagUid, url, containerId, aViewName, aTagName, aLocatorRelationship ) {
  //    console.log( "populate() " + aViewName );
  //    console.trace();
  //      console.log( "populate( " + tagUid + ", " + url + ", " + containerId + ", " + aViewName + ", " + aTagName + " )" );
  //      console.log( "id="+getTagParm( "id", tagUid ) + " subid="+getTagParm( "subid", tagUid ));
  var pageElement = document.getElementById("page" + tagUid);
  if (pageElement != null) setTagParm("page", pageElement.value, tagUid);

  var countElement = document.getElementById("count" + tagUid);
  if (countElement != null) setTagParm("count", countElement.value, tagUid);

  var searchElement = document.getElementById("search" + tagUid);
  if (searchElement != null) {
    setTagParm("search", searchElement.value, tagUid);
  }

  var filterElement = document.getElementById("filter" + tagUid);
  if (filterElement != null) {
    setTagParm("typeFilter", filterElement.value, tagUid);
    setTagParm("filterSelect", filterElement.value, tagUid);
  }

  var deepSearchElement = document.getElementById("deepSearch" + tagUid);
  var searchType = 1;
  if (deepSearchElement != null) {
    searchType = deepSearchElement.value;
  }
  setTagParm("deepSearch", searchType, tagUid);

  //    console.log( "Populate: " + getTagParm( "tagName", tagUid ) + " " + tagUid + " - " + containerId + " - " + aViewName );
  callServer(tagUid, url, containerId, aViewName, '', aLocatorRelationship );
}

function doExport(tagUid, exportUrl) {
  //    console.log( "export() " + tagUid + " " + exportUrl );
  if (
    !confirm(
      "Exporting of this list to CSV format may take several minutes, depending on the size of the list.\n\nContinue?"
    )
  )
    return false;

  var searchElement = document.getElementById("search" + tagUid);
  if (searchElement != null) {
    setTagParm("search", searchElement.value, tagUid);
  }

  var filterElement = document.getElementById("filter" + tagUid);
  if (filterElement != null) {
    setTagParm("typeFilter", filterElement.value, tagUid);
  }

  var deepSearchElement = document.getElementById("deepSearch" + tagUid);
  var searchType = 1;
  if (deepSearchElement != null) {
    searchType = deepSearchElement.value;
  }
  setTagParm("deepSearch", searchType, tagUid);
  setTagParm("count", "9999999", tagUid);

  callServer(tagUid, exportUrl, "SaveAs", "--");
}

// need to get some sort of GPS location results before continuing
function callServer(tagUid, url, containerId, aViewName, forceRefreshTagUid, aLocatorRelationship ) {
  if (getTagParm("requireLocation", tagUid) != "true" || latitude != "") {
    //not required or already set, don't request location info
    callServerImpl(tagUid, url, containerId, aViewName, forceRefreshTagUid, aLocatorRelationship);
    return;
  }
  if (navigator.geolocation) {
    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
    };

    const geoSuccess = (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      callServerImpl(tagUid, url, containerId, aViewName, forceRefreshTagUid);
    };

    const geoFailure = (geoErr) => {
      console.log(`Location Services Error ${geoErr}`);
      latitude = "x";
      longitude = "x";
      callServerImpl(tagUid, url, containerId, aViewName, forceRefreshTagUid);
    };

    navigator.geolocation.getCurrentPosition(
      geoSuccess,
      geoFailure,
      geoOptions
    );
  }
}

function callServerImpl(
  tagUid,
  url,
  containerId,
  aViewName,
  forceRefreshTagUid,
  aLocatorRelationship
) {
  //    console.log( "callServer( " + tagUid + ", " + url + ", " + containerId + ", " + aViewName + " )" );
  //    console.log( "id="+getTagParm( "id", tagUid ) + " subid="+getTagParm( "subid", tagUid ));

  if (url == "") url = getTagParm("url", tagUid);
  var viewNames = getTagParm("viewNames", tagUid);
  var warning = getTagParm("warning", tagUid);
  var viewDisplay = getTagParm("viewDisplay", tagUid);

  var context = getTagParm("context", tagUid);
  if (context == "") context = "cis";

  setTagParmIfBlank("database", "jwmbos", tagUid); // force 'database' parm for jdbc datasource... but only if database parm empty
  //    console.log( "Database: " + context );

  setTagParm(
    "debugUid",
    "_" + getTagParm("tagName", tagUid) + tagUid + "_" + createId(),
    tagUid
  );

  setTagParm("currURL", document.location, tagUid);

  // ipify script loaded with other js loads after jwmbos.js load; callback sets global variable used here
  //    setTagParm( "clientIPAddress", clientIPAddress, tagUid );

  setTagParm("latitude", latitude, tagUid);
  setTagParm("longitude", longitude, tagUid);

  //  console.log( "Send Lat/Lng " + latitude + " / " + longitude );

  var d = new Date();
  setTagParm("timeZone", d.getTimezoneOffset() / 60, tagUid); // method returns offset minute... convert to hours

  var viewId = "section_view" + tagUid;
  var busyIcon = "section_busy" + tagUid;
  var containerRootId = "section_viewlayer" + tagUid;

  var primaryViewName = getThisViewName(
    viewNames,
    viewId,
    containerRootId,
    viewDisplay,
    tagUid
  );
  setTagParm("primaryViewName", primaryViewName, tagUid); // need to pass primary viewName for title and footer use
  //    console.log( "primaryViewName " + primaryViewName );

  if (containerId == "") {
    // addSectionListItem() generates its own containerId
    var view = "1";
    var viewElement = document.getElementById(viewId);
    if (viewElement != null) view = viewElement.value;

    var containerId = containerRootId + "_" + view;
    var thisViewName = getThisViewName(
      viewNames,
      viewId,
      containerRootId,
      viewDisplay,
      tagUid
    );
  }

  var tableIdRoot = getTagParm("tableIdRoot", tagUid);
  var tableId =
    tableIdRoot +
    "_" +
    getThisViewName(viewNames, viewId, containerRootId, viewDisplay, tagUid);
  setTagParm("tableId", tableId, tagUid);
//  console.log( "tableId " + tableId );

  if (aViewName != "") thisViewName = aViewName; // override used typically for 'createNew', title, footer, etc

  //    console.log( "ContainerId: " + containerId );
  var container = document.getElementById(containerId);
  try {
    if (container == null) {
      console.error("populate() invalid container id: " + containerId);
      /////    return;    // for now, go ahead and do the call since it might be a create where insert table doesn't exist... still want to create
    }
    //      else if ( container.innerHTML.trim().indexOf( 'gstatic.com' ) > 0 ) // this is special case for google maps
    //      {
    //       console.log( "contains google map" );
    //      }
    else if (
      container.innerHTML.trim().length > 5 &&
      document.getElementById("pendingRefreshFlag_" + containerId).checked ==
        false &&
      container.innerHTML.indexOf(pendingRefreshFlagText) == -1
    ) {
//                console.log( "Container already populated " + containerId);
//                console.log( "Container already populated " + containerId  + " = " + container.innerHTML.trim());
      return; // only load contents once
    }
  } catch (err) {
    console.error("pendingRefreshFlag_" + containerId + " -- " + err);
  }
  if (warning != "") {
    var messageDiv = document.getElementById("section_message" + tagUid);
    if (messageDiv != null) {
      messageDiv.innerHTML = warning;
      messageDiv.style.display = "block";
      setTimeout(function () {
        messageDiv.style.display = "none";
      }, 2000); // turn off message after 2 seconds
    } else {
      console.error("messageDiv is null");
    }
  }

  var ajaxRequest = getAjaxRequestObject();
  ajaxRequest.onreadystatechange = function () {
    insertContents(ajaxRequest, containerId, busyIcon, forceRefreshTagUid);
  };

  setBusy(busyIcon, "inline");

  setTagParm("user", getUserName(), tagUid);
  setTagParm("currUserId", getCurrUserId(), tagUid);
  setTagParm("viewName", thisViewName, tagUid); // this is the current viewName extracted from viewNames
  setTagParm("reqUid", generateReqUid(), tagUid);

  setTagParm( "windowLocationOrigin", window.location.origin, tagUid );
  setTagParm( "windowLocationPathName", window.location.pathname, tagUid  );
  setTagParm( "windowLocationPathSearch", window.location.search, tagUid  );

  var forceView = getTagParm("forceView", tagUid);
  if (forceView != "") {
    //      console.log( "Force View: " + forceView );
    setTagParm("viewName", forceView, tagUid);
  }
  showParms(tagUid);

  if ( getTagParm( "apiVersion", tagUid ) == 1 )
  {
     ajaxRequest.open("POST", url, true);
     ajaxRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
     ajaxRequest.setRequestHeader( "x_timezone", Intl.DateTimeFormat().resolvedOptions().timeZone );
     ajaxRequest.send(getParmsAsString(tagUid) + "&uid_=" + uid++);
     //    ajaxRequest.send( getFormData(tagUid) ); // alt method... not supported on all browsers, but needed for fileUpload

  }

  else if ( getTagParm( "apiVersion", tagUid ) == 2 ) // api version 2 (9/28/21)
  {
     var renderer = url; // the url is now the renderer (jsp)
     var dataObj =  getTagParm( "tagName", tagUid ).toLowerCase();
     var locatorId = Number( getTagParm( "id", tagUid ) );
     var locatorType = dataObj;
     var locatorId = Number( getTagParm( "id", tagUid ) );
     var locatorRecordType = getLocatorRecordTypeByView( getTagParm( "type", tagUid ), tagUid );
     var restValue1 = "";
     var restValue2 = "";
     var restValue3 = "";
     var restValue4 = "";
     var restValue5 = "";
     var restValue6 = "";

     var locatorRelationship;
     if (( typeof aLocatorRelationship != 'undefined' )
        && ( aLocatorRelationship != '' ) )
     {
        locatorRelationship = aLocatorRelationship;
     }
     else if ( locatorId < 1 ) // id not specified; assume ownerType/ownerid
     {
        locatorId = Number( getTagParm( "ownerId", tagUid ) );
        locatorType = Number( getTagParm( "ownerType", tagUid ) );
        locatorRelationship = "owner";

        if ( locatorId < 1 ) // still not found... try actual locator names
        {
           locatorId = Number( getTagParm( "locatorId", tagUid ) );
           locatorType = Number( getTagParm( "locatorType", tagUid ) );
           locatorRelationship = Number( getTagParm( "locatorRelationship", tagUid ) );
           locatorRecordType = getLocatorRecordTypeByView( getTagParm( "locatorRecordType", tagUid ), tagUid );
           restValue1 = Number( getTagParm( "restValue1", tagUid ) );
           restValue2 = Number( getTagParm( "restValue2", tagUid ) );
           restValue3 = Number( getTagParm( "restValue3", tagUid ) );
           restValue4 = Number( getTagParm( "restValue4", tagUid ) );
           restValue5 = Number( getTagParm( "restValue5", tagUid ) );
           restValue6 = Number( getTagParm( "restValue6", tagUid ) );
        }
     }
     else
     {
        locatorRelationship = "id";
     }
     url = "/../"+dataObj+"/"+locatorId+"/"+locatorType+"/"+locatorRelationship+"/"+ getLocatorRecordTypeByView( locatorRecordType, tagUid );
     if ( restValue1 != "" ) url += "/"+restValue1;
     if ( restValue2 != "" ) url += "/"+restValue2;
     if ( restValue3 != "" ) url += "/"+restValue3;
     if ( restValue4 != "" ) url += "/"+restValue4;
     if ( restValue5 != "" ) url += "/"+restValue5;
     if ( restValue6 != "" ) url += "/"+restValue6;

     var dataReqList = getTagParm( "dataReq", tagUid ).split(",")
     var dataReq = "[";
     if ( locatorRelationship != 13 ) // full dataReq not required for search options box
     {
        for (var i = 0; i < dataReqList.length; i++ )
        {
           if ( i > 0 ) dataReq += ", ";
           dataReq += '"'+dataReqList[i]+'"'
        }
     }
     else
     {
        dataReq += '"*PageBasic","bgnSearchDefault","endSearchDefault"'
     }
     dataReq += "]";

     var pageElement = document.getElementById("page" + tagUid);
     var countElement = document.getElementById("count" + tagUid);
     var rangeBgnElement = document.getElementById("rangeBgn" + tagUid);
     var rangeEndElement = document.getElementById("rangeEnd" + tagUid);

     ajaxRequest.open("GET", url, true);
     ajaxRequest.setRequestHeader( "Content-type",    "application/x-www-form-urlencoded" );
     ajaxRequest.setRequestHeader( "authorization",   "Session"                   );
     ajaxRequest.setRequestHeader( "x_identifier",    "PageREST"                  );
     ajaxRequest.setRequestHeader( "x_reqUid",        createId()                  );
     ajaxRequest.setRequestHeader( "x_timeStamp",     new Date()                  );
     ajaxRequest.setRequestHeader( "x_logLevel",      "1200"                      );
     ajaxRequest.setRequestHeader( "x_ipAddress",     "192.168.1.1"               );
     ajaxRequest.setRequestHeader( "x_appInstanceId", "28005"                     );
     ajaxRequest.setRequestHeader( "x_dataReq",       dataReq                     );
     ajaxRequest.setRequestHeader( "x_renderer",      renderer                    );
     ajaxRequest.setRequestHeader( "x_tagUid",        tagUid                      );
     ajaxRequest.setRequestHeader( "x_viewName",      getTagParm("viewName", tagUid));
     ajaxRequest.setRequestHeader( "x_requestJson",   JSON.stringify(getParmsAsJson(tagUid,true)) );// 2024-07-23 potential to be too long! (Chrome and Firefox handle that error differently) change to omitBlanks
     ajaxRequest.setRequestHeader( "x_timezone",      Intl.DateTimeFormat().resolvedOptions().timeZone );
     ajaxRequest.setRequestHeader( "x_tableId",       tableId );

     var searchElement1 = document.getElementById("search" + tagUid);
     if (searchElement1 != null) {
        ajaxRequest.setRequestHeader( "x_search", searchElement1.value );
     }

     if ( pageElement != null ) ajaxRequest.setRequestHeader( "x_page",          pageElement.value           );
     else                       ajaxRequest.setRequestHeader( "x_page",          Number( 1 )          );

     if ( countElement != null ) ajaxRequest.setRequestHeader( "x_count",          countElement.value           );
     else                        ajaxRequest.setRequestHeader( "x_count",          Number( 100 )          );

     if ( rangeBgnElement != null ) ajaxRequest.setRequestHeader( "x_rangeBgn",          rangeBgnElement.value           );
     else                           ajaxRequest.setRequestHeader( "x_rangeBgn",          "2021-01-01 00:00:00"        );

     if ( rangeEndElement != null ) ajaxRequest.setRequestHeader( "x_rangeEnd",          rangeEndElement.value           );
     else                           ajaxRequest.setRequestHeader( "x_rangeEnd",          "2030-12-31 23:59:59"          );

//2024-06-17 header too long... tried this.. but body is discarded unless put or post
//   var jsonString = JSON.stringify(getParmsAsJson(tagUid));
//   var body = '';
//
//   if ( jsonString.length < 3000 )
//   {
//      ajaxRequest.setRequestHeader( "x_requestJson", jsonString  );
//   }
//   else
//   {
//      body = jsonString;
//   }
//   ajaxRequest.send( body );
     ajaxRequest.send();
  }
}

function insertContents(
                         ajaxRequest,
                         containerId,
                         busyIcon,
                         forceRefreshTagUid
                       )
{
   if (ajaxRequest.readyState == 4)
   {
      timer.resetTimer();

//    console.log( "busy off " + busyIcon );
      setBusy(busyIcon, "none");

//    console.log( "insertContents() - " + containerId + " " + busyIcon);
//    console.log( "insertContents() - " + containerId + " =\n " + ajaxRequest.responseText.trim() );
//    console.log( "----------------------------------------------------------------------------");

    var responseText = ajaxRequest.responseText.trim();

    if (ajaxRequest.status === 200) {
      var contentType = ajaxRequest.getResponseHeader("content-type");
      //         console.log( "content-type: " + contentType );

      if (contentType.indexOf("application/csv") == -1) {
        if (responseText.indexOf("[Msg:") == 0) {
          // replacing ".startsWith()" due to dinosaur IE-11 javascript version doesn't support
          var delimiterOffset = responseText.indexOf("]");
          var msgText = responseText.substring(5, delimiterOffset);
          responseText = responseText.substring(delimiterOffset + 1);
          alert(msgText);
        }

        if (document.getElementById(containerId) != null) {
          var embeddedScripts;
          //               if ( document.getElementById( containerId).innerHTML.trim().indexOf( 'gstatic.com' ) > 0 ) // this is special case for google maps
          //               {
          //                  // do NOT replace contents of container if it contains a googleMap
          //                  // but still need to store responseText in an element in order to check for script eval below
          //                  tmp = document.createElement('div');
          //                  tmp.style.display = 'none';
          //                  tmp.innerHTML = responseText;
          //                  embeddedScripts = tmp.getElementsByTagName('script');
          //               }
          //               else // not google map
          //               {
          document.getElementById(containerId).innerHTML = responseText;
          try {
            document.getElementById(
              "pendingRefreshFlag_" + containerId
            ).checked = false;
          } catch (err) {
            //???                console.error( "Could not reset pendingRefreshFlag_"+containerId + " " + err );
          }

          embeddedScripts = document
            .getElementById(containerId)
            .getElementsByTagName("script");
          //                  console.log( "total embeddedScripts: " + embeddedScripts.length );
          //               }

          for (var iii = 0; iii < embeddedScripts.length; iii++) {
            var aScript = embeddedScripts[iii];
//                             console.log( "eval " + aScript.innerHTML);

            if (aScript.getAttribute("src") != null) {
              document.appendChild(aScript);
            } else {
              try {
                var evalReturn = eval(aScript.innerHTML);
                //                       if ( evalReturn != "" )
                //                       {
                //                          console.log( "Eval Return: " + evalReturn );
                //                          aScript.outerHTML = evalReturn;
                //                       }
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
        } else {
          console.error(
            "ajaxSection.insertContents() -- invalid containerId -- " +
              containerId
          );
        }
      } // csv download
      else {
        // Try to find out the filename from the content disposition `filename` value
        var disposition = ajaxRequest.getResponseHeader("content-disposition");
        var matches = /"([^"]*)"/.exec(disposition);
        var filename = matches != null && matches[1] ? matches[1] : "hml.csv";

        // this is a hack... not clean... but apparently only way to invoke the saveAs dialog
        var blob = new Blob([ajaxRequest.response], {
          type: "application/csv",
        });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}

function hideAddIcon(tagUid) {
  var addItemsIconElement = document.getElementById(
    "sectionList_addItems" + tagUid
  );
  if (addItemsIconElement != null) addItemsIconElement.style.display = "none";
}

function forceRefresh(tagUid) {
  if (document.getElementById("section_refresh" + tagUid) != null) {
    document.getElementById("section_refresh" + tagUid).click();
  } else {
    console.error(
      "forceRefresh() -- Element section_refresh" +
        tagUid +
        " was not found.  Cannot refresh section"
    );
  }
}

function newIdRefresh(idVar, idValue, tagUid, viewName) {
  //    console.log( "newIdRefresh " + idVar + " " + idValue  + " " + viewName );
  setTagParm(idVar, idValue, tagUid, true); //force the new id into the contact tag
  setTagParm("forceView", viewName, tagUid, false);
  forceRefresh(tagUid);
}

function forcePage1(tagUid) {
  var pageElement = document.getElementById("page" + tagUid);
  if (pageElement != null) {
    pageElement.value = 1;
  } else {
    console.error("pageElement not found " + tagUid);
  }
  setTagParm("page", 1, tagUid, true);
}

function changeView(tagUid, viewId) {
  var viewIconElement = document.getElementById(
    "viewIcon" + tagUid + "_" + viewId
  );
  viewIconElement.click();
}
