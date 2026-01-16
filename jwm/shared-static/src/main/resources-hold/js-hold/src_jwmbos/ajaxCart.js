   function processCartEmailAddress(aFormId)
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, "cartEmailAddress" );

      if (errCount > 0 )
      {
         alert( "Please correct error in email address" );
         return( false );
      }
      var cartEmailAddress = getValueByName( "cartEmailAddress" );



      setBusy( "cartBusy", "block" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { checkContactExists( ajaxRequest, cartEmailAddress );} ;

      var serverCall = "/cis/jsp/ajax/ajaxGetContact.jsp"
                      +"?user="+getUserName()
                      +"&viewName=getContactId"
                      +"&emailAddress="+cartEmailAddress

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return(false);
   }

   function validateWebUrl(aFormId)
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count
      doValidate( aForm, "url" );

      if (errCount > 0 )
      {
         alert( "Please correct error in web site url." );
         return( false );
      }
      return(true);
   }


   function checkContactExists( ajaxRequest, cartEmailAddress )
   {
      if (ajaxRequest.readyState == 4)
      {
         setBusy( "cartBusy", "none" );

         var responseParts = ajaxRequest.responseText.trim().split('|'); // in case other stuff appended to response like xml model link, etc.
         var contactId = responseParts[0];
         var firstMemberId = responseParts[1];
         var firstPersonLogin = responseParts[2];


         var existingContactInfoDiv = document.getElementById( "emailAddressFound" );
         var newContactInfoDiv      = document.getElementById( "emailAddressNotFound" );

         if ( contactId > 0 )
         {
            existingContactInfoDiv.style.display = "block";
            newContactInfoDiv.style.display = "none";

            setValueById( "paymentLoginUsername", cartEmailAddress ); // prime the login input field

            setValueById( "cartContactId", contactId ); // the contactId is passed in form to 'createInvoiceFromCart'
            setValueById( "cartPersonId", firstMemberId );

            // now refresh the 'existing contact' section using the contactId set in the 'getContactId' viewName request above
            // note that next page will use the email address to again locate the contact to get the id (nothing other than email addr is passed in form)

            var tagUid = getTagUidFromName( "cartContact" );
            setTagParm( "id", contactId, tagUid, true ); //force the new id into the contact tag
            forceRefresh( tagUid );

            var loginIdDoesNotExistDiv = document.getElementById( "loginIdDoesNotExist" );
            var loginIdExistsDiv       = document.getElementById( "loginIdExists" );

            if ( firstPersonLogin == "true" )
            {
               loginIdDoesNotExistDiv.style.display = "none";
               loginIdExistsDiv.style.display = "block";
            }
            else
            {
               loginIdDoesNotExistDiv.style.display = "block";
               loginIdExistsDiv.style.display = "none";
            }
         }
         else
         {
            newContactInfoDiv.style.display = "block";
            existingContactInfoDiv.style.display = "none";
         }
      }
   }

   function cartCreateAccount( aFormId, clientType, emailFieldName, tagUid )
   {

      // this is triggered from a button in the 'create new contact' section that was enabled above if email address not found
      // this will create the new contact
      // the response handler will now 'retry' the check at the top above to see if a contact matches the email addr.  Since we created it here, we should now get a contact id back

      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count

      doValidate( aForm, "reqLastName" );
      doValidate( aForm, "addressLine1" );
      doValidate( aForm, "city" );
      doValidate( aForm, "state" );
      doValidate( aForm, "zip" );
      doValidate( aForm, "companyName" );
      doValidate( aForm, "phone" );

      if (errCount > 0 )
      {
         alert( "Please correct the " + errCount + " error(s) in account form." );
         return( false );
      }

      setBusy( "cartBusy", "block" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { getCreatedAccount( ajaxRequest, aFormId, emailFieldName, tagUid );} ;

      var serverCall = "/cis/jsp/ajax/ajaxCreate"+clientType+"Lead.jsp"
                      +"?user="+getUserName()
                      +"&primaryEmail="+getValueByName(    "searchEmailAddress" )
                      +"&reqLastName="+getValueByName(     "reqLastName" )
                      +"&reqFirstName="+getValueByName(    "reqFirstName" )
                      +"&addressLine1="+getValueByName(    "addressLine1" )
                      +"&addressLine2="+getValueByName(    "addressLine2" )
                      +"&city="+getValueByName(            "city" )
                      +"&state="+getValueByName(           "state" )
                      +"&zip="+getValueByName(             "zip" )
                      +"&phone="+getValueByName(           "phone" )
                      +"&companyName="+getValueByName(     "companyName" )

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return( false );
   }

   function cartCreateLoginId( aFormId )
   {

      // this is triggered from a button in the 'create login id' section that was enabled above if login id not found
      // this will create the new login id
      // the response handler will now 'retry' Since we created it here, we should now get a login id back

      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count

      doValidate( aForm, "password" );
      doValidate( aForm, "passwordConfirm" );

      if (errCount > 0 )
      {
         alert( "Please correct the " + errCount + " error(s) in account form." );
         return( false );
      }

      setBusy( "cartBusy", "block" );

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { getCreatedLoginId( ajaxRequest );} ;

      var serverCall = "/idmanager/jsp/ajax/ajaxGetLoginId.jsp"
                      +"?user="+getUserName()
                      +"&id="+getValueByName(    "cartEmailAddress" )
                      +"&password="+getValueByName(        "password" )
                      +"&fn=createNew"
                      +"&ownerType=5"
                      +"&ownerId="+getValueById( "cartPersonId" )


      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return( false );
   }

   function getCreatedLoginId( ajaxRequest )
   {
      if (ajaxRequest.readyState == 4)
      {
         setBusy( "cartBusy", "none" );

         document.getElementById( "doSearch" ).click(); // do the search again.  This time the account should be found
      }
   }

   function getCreatedAccount( ajaxRequest, aFormId, emailFieldName, tagUid )
   {
      if (ajaxRequest.readyState == 4)
      {
         locateContactByEmailAddress( aFormId, emailFieldName, tagUid )
      }
   }

   function validateOrder( aFormId, count, tagUid )
   {
      var aForm = document.getElementById( aFormId );

      errCount = 0;  // reset count


      doValidate( aForm, "orderDate" ); // make sure an order date has been entered

      for ( var i=0; i<count; i++ )
      {
         doValidate( aForm, "delivery_"+i );   // make sure all order items have specified store pickup or delivery
      }

      if (errCount > 0 )
      {
         alert( "Please correct the " + errCount + " error(s) in the form." );
         return( false );
      }
      return( true );
   }

