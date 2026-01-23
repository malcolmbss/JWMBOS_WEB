
   function clearFollowUp( contactId )
   {
      addHistoryWithIcon( "clearFollowUp", 17, 8, contactId, getSysImages()+"/broom.png", "/images/broom-bw.png" )
   }

   function setResponseDue( contactId )
   {
      addHistoryWithIcon( "setResponseDue", 18, 8, contactId, getSysImages()+"/reddot.png", "/images/graydot.png" )
   }

   function ajaxSetContactDataField( id, viewName, containerId, busyIcon, tagUid, onChangeFn, value, name, context )
   {
      setBusy( busyIcon, "inline");

      var onChangeFnStr = document.getElementById( onChangeFn ).value;

      var ajaxRequest = getAjaxRequestObject();

//      console.log( "contact: context - " + context );

      var serverCall = "/"+context+"/jsp/ajax/ajaxGetContact.jsp"
                      +"?id="+id
                      +"&viewName="+viewName
                      +"&tagUid="+tagUid
                      +"&onChangeFn="+onChangeFnStr
                      +"&user="+getUserName()
                      +"&name="+name
                      +"&value="+value

      ajaxRequest.onreadystatechange = function() { insertContents( ajaxRequest, containerId, busyIcon );} ;

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxSetContactStatusFields( id, roContainerId, dropdownContainerId, busyIcon, tagUid, onChangeFn, value, name, nextStatesForState, context )
   {
      ajaxSetContactDataField( id, "status",         roContainerId,       busyIcon, tagUid, onChangeFn, value, name, context );

      if ( nextStatesForState != "" ) value = nextStatesForState; // override and get nextStates for specified state rather than current state
//      console.log( nextStatesForState + " " + value );
      ajaxSetContactDataField( id, "statusDropdown", dropdownContainerId, busyIcon, tagUid, onChangeFn, value, name, context );
   }


   function verifyDeleteContact( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This contact (Client/Vendor/Business) cannot be deleted because it contains projects and/or is a member of one or more groups.";
         alert( msg );
         return( false );
      }
      return(true);
   }

   function locateContactByEmailAddress( aFormId, emailFieldName, tagUid )
   {
//    console.log( tagUid + " <== locateContactByEmailAddress" );
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "searchEmailAddress" );

      if (errCount > 0 )
      {
         alert( "Please correct error in email address" );
         return( false );
      }

      emailAddress = document.getElementById( getTagUidFromName( emailFieldName ) ).value;
      setTagParm( 'emailAddress', emailAddress, tagUid, true );

      document.getElementById( 'section_refresh'+tagUid ).click();
   }

   function WridzBankAccountPreReqCheck( tagUid, containerTagUid )
   {
      errCount = 0;
      var form = document.getElementById( "form"+containerTagUid );
      doValidate( form, "BusinessDescription"+containerTagUid );
      doValidate( form, "DBA"+containerTagUid );
      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }
      var addressCount = getElementByName( "addressCount"+containerTagUid );
      if ( addressCount.value == 0 )
      {
         createAlert( 3, "", "You must define at least one business address." );
         return( false );
      }
      return( true );
   }

