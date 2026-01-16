   function uploadFile( inputId, roData, rwData, editIcon, busyIcon, ownerType, ownerId, refreshSectionId, folderPath, copyTo, action, actionParm, context )
   {
//    console.log("uploadFile()");
//    console.log( "Context: " + context );
      if (typeof context == 'undefined' ) context = "cis";
      if (context == '' ) context = "cis";

      document.getElementById( busyIcon ).style.display = "inline-block";

      var ajaxRequest = getAjaxRequestObject();

      var files = document.getElementById(inputId).files;

      var formData = new FormData();
      for (var i = 0; i < files.length; i++)
      {
        var file = files[i];
        formData.append('file', file, file.name);

        if ( document.getElementById(copyTo) != null ) // if more than one file, just use the last one in the loop
        {
           document.getElementById(copyTo).value = file.name;
//         console.log( "uploadFile() copyTo: " + copyTo + " " + file.name );
        }
      }

      var replace = 'true';

//    if (document.getElementById( "repl"+inputId ).checked) replace = "true";



      formData.append("user",      ""+getUserName() );
      formData.append("ownerType", ownerType );
      formData.append("ownerId",   ownerId );
      formData.append("replace",   replace );
      formData.append("folderPath",folderPath );
      formData.append("action",    action );
      formData.append("objectClassID", "242" );  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
      formData.append("actionParm", actionParm );

      ajaxRequest.onreadystatechange = function()
                                       {
                                          if(ajaxRequest.readyState == 4)
                                          {
                                             handleAjaxRC( ajaxRequest );

                                             document.getElementById( busyIcon ).style.display = "none";

                                             // force a 'refresh' of containing section (initially used for payment section)
                                             if ( document.getElementById('section_refresh'+refreshSectionId ) != null )
                                             {
//                                              console.log( "section_refresh" + refreshSectionId );
                                                document.getElementById('section_refresh'+refreshSectionId).click();
                                             }
                                          }
                                       }

      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";


      ajaxRequest.open("POST", serverCall, true);
      ajaxRequest.send(formData);
   }
