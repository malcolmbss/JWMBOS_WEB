
   function doLogin(aFormId, tagUid)
   {
      var busyIconId = "section_busy"+tagUid;
      document.getElementById( busyIconId ).style.display = "inline-block";

      document.getElementById( "loginErrorMsg" ).innerHTML = "";
      var ajaxRequest = getAjaxRequestObject();

      username = getValueByName( "j_username" );
      password = getValueByName( "j_password" );

      ajaxRequest.onreadystatechange = function() { handleLoginResponse( ajaxRequest, busyIconId, tagUid, aFormId );} ;

      var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp";

      // this is a 'fake' login just to determine if id/pw valid
      // we'll submit the real login if good response
      // do not want tomcat to send a separate login-failed page
      var params     = "username="+username
                      +"&password="+password
                      +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                      +"&table=users"
                      +"&col=login";

      ajaxRequest.open("POST", serverCall, true);

      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function handleLoginResponse( ajaxRequest, busyIconId, tagUid, aFormId )
   {
      if (ajaxRequest.readyState == 4)
      {
         document.getElementById( busyIconId ).style.display = "none";

         var resp = ajaxRequest.responseText.replace(/^\s+|\s+$/g,"");

         if (( resp.indexOf( "AjaxRC:Ok" ) != -1 )
           ||  ( resp.indexOf( "already been authenticated" ) != -1 ))
         {
            var aForm = document.getElementById( aFormId );
            aForm.action = pageServletContext + "/j_security_check";
            aForm.submit();
         }
         else if ( resp.indexOf( "RC_ACCT_NOT_VALIDATED" ) != -1 )
         {
            var viewIcon = "viewIcon"+tagUid+"_2"
//          console.log( viewIcon );
            document.getElementById( viewIcon ).click();
         }
         else
         {
            if ( resp.indexOf( "Login failed" ) != -1 )
            {
               document.getElementById( "loginErrorMsg" ).innerHTML = "Your email address or password is incorrect"
            }
            else
            {
               parts = resp.split("|");
               if (parts.length > 1 )
               {
                  document.getElementById( "loginErrorMsg" ).innerHTML = parts[1];
               }
               else
               {
                  document.getElementById( "loginErrorMsg" ).innerHTML = resp;
               }
            }
         }
      }
   }

   function sendCreateUserCommand( aFormId, emailFieldName, tagUid )
   {
//    console.log( tagUid + " <== sendCreateUserCommand" );
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "searchEmailAddress" );

      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct error in email address" );
         return( false );
      }

      setTagParm( 'userId',       getValueByName( emailFieldName ), tagUid, true );
      setTagParm( 'command',      'CreateUser',                     tagUid, true );
      setTagParm( 'referer',      referer,                          tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function sendAcceptTermsAndConditionsCommand( tagUid )
   {
      setTagParm( 'command',      'AcceptTermsAndConditions', tagUid, true );
      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function sendRequestPasswordChangeCommand( aFormId, tagUid )
   {
//      console.log( tagUid + " <== sendRequestPasswordChangeCommand" );
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "username" );

      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct error in email address" );
         return( false );
      }

      setTagParm( 'userId',       getValueByName( 'username' ), tagUid, true );
      setTagParm( 'command',      'RequestPasswordChange',            tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function changePassword( id, aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "currentPassword" );
      doValidate( aForm, "newPassword" );
      doValidate( aForm, "verifyPassword" );

      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }
      if ( getValueByName( 'verifyPassword' ) != getValueByName( 'newPassword' ) )
      {
         createAlert( 3,  "Password verification does not match new password." );
         return( false );
      }

      var reqJson = {};
      reqJson[ "table"      ] =  "USERS";
      reqJson[ "col"        ] =  "CHANGEPASSWORD"
      reqJson[ "identifier" ] =  "USER / CHANGEPASSWORD"
      reqJson[ "objId"      ] =  id;
      reqJson[ "value"      ] =  getValueByName( 'newPassword' )
      reqJson[ "currPW"     ] =  getValueByName( 'currentPassword' )

      xhrUpdate( "POST",
                 "/cis/JWMBOS",
                 reqJson,
                 tagUid,
                 tagUid,
                 "",
                 ""
               );
   }

   function sendSetPasswordCommand( aFormId, tagUid )
   {
//    console.log( tagUid + " <== sendSetPasswordCommand" );
      setTagParm( 'password', getValueByName( "newPassword" ),    tagUid, true );
      setTagParm( 'command',  'SetPassword',                      tagUid, true );

      if (validateNewPassword( aFormId, tagUid ))
      {
         document.getElementById( 'section_refresh'+tagUid ).click();
      }
   }

   function sendRecoverySetPasswordCommand( aFormId, tagUid, userId )
   {
      setTagParm( 'command',  'RecoverySetPassword',              tagUid, true );
      setTagParm( 'password', getValueByName( "newPassword" ),    tagUid, true );
      setTagParm( 'userId',    userId,                            tagUid, true );

      if ( validateNewPassword( aFormId, tagUid ))
      {
         document.getElementById( 'section_refresh'+tagUid ).click();
      }
   }

   function sendUserChangePasswordCommand( aFormId, tagUid )
   {
//    console.log( tagUid + " <== sendUserChangePasswordCommand" );
      setTagParm( 'password', getValueByName( "newPassword" ),    tagUid, true );
      setTagParm( 'command',  'UserChangePassword',               tagUid, true );

      if ( validateNewPassword( aFormId, tagUid ) )
      {
         document.getElementById( 'section_refresh'+tagUid ).click();
      }
   }

   function validateNewPassword( aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "newPassword" );
      doValidate( aForm, "verifyPassword" );
      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }

      if ( getValueByName( "newPassword" ) != getValueByName( "verifyPassword" ) )
      {
         createAlert( 3,  "Passwords must match." );
         return( false );
      }
      return( true );
   }

   function sendUpdatePhoneNumberCommand( aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "phone" );
      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the phone number error." );
         return( false );
      }
      setTagParm( 'phoneNumber', getValueByName( "phone"), tagUid, true );
      setTagParm( 'command',  'UpdatePhoneNumber',         tagUid, true );
      setTagParm( 'sendTextVerification',  'false',        tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function sendUpdateAccountOwnerCommand( aFormId, tagUid )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "lastName" );
      doValidate( aForm, "firstName" );
//    doValidate( aForm, "addressLine1"     );
//    doValidate( aForm, "city"     );
//    doValidate( aForm, "state"     );
//    doValidate( aForm, "zip"     );
      if (errCount > 0 )
      {
         createAlert( 3,  "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }
      setTagParm( 'lastName',     getValueByName( "lastName"),     tagUid, true );
      setTagParm( 'firstName',    getValueByName( "firstName"),    tagUid, true );
//    setTagParm( 'addressLine1', getValueByName( "addressLine1"), tagUid, true );
//    setTagParm( 'addressLine2', getValueByName( "addressLine2"), tagUid, true );
//    setTagParm( 'city',         getValueByName( "city"),         tagUid, true );
//    setTagParm( 'state',        getValueByName( "state"),        tagUid, true );
//    setTagParm( 'zip',          getValueByName( "zip"),          tagUid, true );
      setTagParm( 'command',     'UpdateAccountOwner',             tagUid, true );
      setTagParm( 'referer',      referer,                         tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function goBack( tagUid, aCommand )
   {
//    setTagParm( 'viewName', 'locate',  tagUid, true );
      setTagParm( 'command',  aCommand,  tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }


   function sendResendEmailConfirmation(emailAddress, tagUid )
   {
      if (emailAddress == '' ) emailAddress = getValueByName( "j_username" );

      var busyIconId = "section_busy"+tagUid;
      document.getElementById( busyIconId ).style.display = "inline-block";

      getElementByName( "emailSentMsg" ).innerHTML = "";
      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { handleResendEmailConfirmationResponse( ajaxRequest, busyIconId, tagUid );} ;

      var serverCall = "/idmanager/jsp/ajax/ajaxGetUser.jsp";

      var params     = "command=ResendEmailConfirmation"
                      +"&objectClassID=78"  // ObjectClassID.USER
                      +"&userId="+emailAddress

      ajaxRequest.open("POST", serverCall, true);

      ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.send(params);
   }

   function handleResendEmailConfirmationResponse( ajaxRequest, busyIconId, tagUid )
   {
      if (ajaxRequest.readyState == 4)
      {
         document.getElementById( busyIconId ).style.display = "none";

         var resp = ajaxRequest.responseText.replace(/^\s+|\s+$/g,"");

         var sentMsgElement = getElementByName( "emailSentMsg" );
         if ( resp.indexOf( "RC_SUCCESS" ) != -1 )
         {
            sentMsgElement.innerHTML = "Sent";
         }
         if ( resp.indexOf( "RC_USERID_NOT_FOUND" ) != -1 )
         {
            sentMsgElement.innerHTML = "Email address not found.";
         }
         if ( resp.indexOf( "RC_VALIDATION_NOT_REQUIRED" ) != -1 )
         {
            sentMsgElement.innerHTML = "Validation Not Required";
         }
      }
   }

   function getUserName()
   {
      if (userName == "") return( "Guest" );
      return(userName);
   }

   function getCurrUserId()
   {
      return(currUserPersonId);
   }

   function deleteAccount( webAccessCode )
   {
      var confirm = getElementByName( "confirmation" ).value;
      if ( confirm != "Delete My Account" )
      {
         createAlert( 3,  "Please enter the text 'Delete My Account' in the entry field, and then press the 'Delete My Account' button to delete your account" );
         return( false );
      }
      var restData = {};

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "user";
      restData[ "command"            ] =  "DeleteAccount";
      restData[ "identifier"         ] =  "DeleteAccount";
      restData[ "locatorId"          ] =  webAccessCode;
      restData[ "locatorType"        ] =  "78";  // User
      restData[ "locatorRelationship"] =  "12";  // webAccessCode
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );

      createAlert( 1,  "Your account has been deleted.  You have been signed out of Wridz.com." );

      return(true);
   }

   function sessionTimeout()
   {
      alert('Your session has expired.  Please sign in again.');
      window.location.href = "/logoff";
   }

   function impersonate( id )
   {
      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      var restData = {};
      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "user";
      restData[ "command"            ] =  "impersonate";
      restData[ "identifier"         ] =  "Impersonate "+ id;
      restData[ "locatorId"          ] =  id;
      restData[ "locatorType"        ] =  "5";  // Person
      restData[ "locatorRelationship"] =  "1";
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }
