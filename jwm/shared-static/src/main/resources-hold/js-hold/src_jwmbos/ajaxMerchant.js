  function merchantAcctCreatorFormValidate( aFormId, ownerType, tagUid )
  {
     errCount = 0;  // reset count

     var aForm = document.getElementById( aFormId );
     doValidate( aForm, tagUid + "_nameOnAccount"       );
     doValidate( aForm, tagUid + "_accountNumber"       );
     doValidate( aForm, tagUid + "_accountType"         );
     doValidate( aForm, tagUid + "_accountOwnershipType");
     doValidate( aForm, tagUid + "_bankName"            );
     doValidate( aForm, tagUid + "_routingNumber"       );
     doValidate( aForm, tagUid + "_taxIdentifier"       );
     doValidate( aForm, tagUid + "_propayTsCs"          );
     if ( ownerType == 8 )
     {
        doValidate( aForm, tagUid + "_ssn"              );
        doValidate( aForm, tagUid + "_uniqueEmailAddress" );
        doValidate( aForm, tagUid + "_accountUsage" );
        doValidate( aForm, tagUid + "_dba"                 );
        doValidate( aForm, tagUid + "_primaryPerson"       );
        doValidate( aForm, tagUid + "_birthDate"           );
     }

     if ( errCount > 0 )
     {
        createAlert(3, "Please correct the " + errCount + " error(s) in the form to continue" );
        return(false);
     }
     return(true);
  }

  function createMerchantProfile(tagUid, bankAccountId, ownerType, ownerId)
  {
      var url = "/cis/JWMBOS";

      // neither ssn or taxIdentifier is saved in the db... get them from the form and pass them in
      // all other data required for gateway to create a merchant is stored in db, accessed by bankAccount record id value

      var reqJson  = {};
      if ( ownerType == 8 )
      {
         reqJson[ "table"              ] =  "CONTACT";
         reqJson[ "ssn"                ] =  getValueByName( tagUid + "_ssn" );
         reqJson[ "uniqueEmailAddress" ] =  getValueByName( tagUid + "_uniqueEmailAddress" );
         reqJson[ "primaryPersonId"    ] =  getValueByName( tagUid + "_primaryPerson" );
      }
      else
      {
         reqJson[ "table"         ] =  "WRIDZPERSONEXT";
      }
      reqJson[ "col"           ] =  "CREATEMERCHANTACCOUNT";
      reqJson[ "identifier"    ] =  "CreateSubMerchant";
      reqJson[ "taxIndentifier"] =  getValueByName( tagUid + "_taxIdentifier" );
      reqJson[ "bankAccountId" ] =  Number( bankAccountId );
      reqJson[ "objType"       ] =  Number( ownerType );
      reqJson[ "objId"         ] =  Number( ownerId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 tagUid,
                 tagUid,
                 "",
                 ""
               );
   }

  function payeeAccountFormValidate( aFormId, acctGatewayMapId, tagUid )
  {
     return( true ); //################################################################################

     errCount = 0;  // reset count

     var aForm = document.getElementById( aFormId );
     doValidate( aForm, tagUid + "_nameOnAccount"       );
     doValidate( aForm, tagUid + "_accountNumber"       );
     doValidate( aForm, tagUid + "_accountType"         );
     doValidate( aForm, tagUid + "_accountOwnershipType");
     doValidate( aForm, tagUid + "_bankName"            );
     doValidate( aForm, tagUid + "_routingNumber"       );
     doValidate( aForm, tagUid + "_taxIdentifier"       );
     doValidate( aForm, tagUid + "_propayTsCs"          );
     if ( ownerType == 8 )
     {
        doValidate( aForm, tagUid + "_ssn"              );
        doValidate( aForm, tagUid + "_uniqueEmailAddress" );
        doValidate( aForm, tagUid + "_accountUsage" );
        doValidate( aForm, tagUid + "_dba"                 );
        doValidate( aForm, tagUid + "_primaryPerson"       );
        doValidate( aForm, tagUid + "_birthDate"           );
     }

     if ( errCount > 0 )
     {
        createAlert(3, "Please correct the " + errCount + " error(s) in the form to continue" );
        return(false);
     }
     return(true);
  }

  function validateMerchantForm( aForm, accountType )
  {
     errCount = 0;  // reset count

     if ( accountType == 1 )
     {
        doValidate( aForm, "lastName"       );
        doValidate( aForm, "firstName"       );
        doValidate( aForm, "dateOfBirth"       );
     }
     else // business account (types 3 and 4)
     {
        doValidate( aForm, "llcName"       );
        doValidate( aForm, "primaryPerson" );
     }
     doValidate( aForm, "addressLine1"       );
     doValidate( aForm, "city"       );
     doValidate( aForm, "state"       );
     doValidate( aForm, "postalcode"       );
     doValidate( aForm, "emailAddress"       );
     doValidate( aForm, "phoneNumber"       );
     doValidate( aForm, "taxIdentifier"       );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     return(true);
  }

  function createPayeeAccount( aForm, accountType, acctGatewayMapId, buttonTagUid, refreshSectionId, ownerId )
  {
     // most parameters are active save to db... these two are not stored in db
     var reqJson = {};
     reqJson[ "taxIdentifier" ] = getElementFromForm( aForm, "taxIdentifier" ).value;
     if ( accountType != 1 ) reqJson[ "primaryPerson" ] = getElementFromForm( aForm, "primaryPerson" ).value;

     var xhrData = {};
     xhrData[ "containerId"         ] =  buttonTagUid;
     xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "createPayeeAccount";
     restData[ "identifier"         ] =  "createPayeeAccount";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[  "locatorRecordType"         ] =  "0";
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function createWalletAccount( acctGatewayMapId, buttonTagUid, refreshSectionId )
  {
     var reqJson = {};
     var xhrData = {};
     xhrData[ "containerId"         ] =  buttonTagUid;
     xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "createWalletAccount";
     restData[ "identifier"         ] =  "createWalletAccount";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[  "locatorRecordType"         ] =  "0";
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function verifyBankAccount( popupUrl, tagUid )
  {
     var respJson = {};  // dummy up a respJson shell for the popup method
     respJson[ "popupUrl" ] = popupUrl;
     xhrDisplayPopupUrl( respJson, tagUid )
  }

  function linkBankAccount( acctGatewayMapId, refreshSectionId )
  {
     var reqJson = {};

     var xhrData = {};
     xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "linkBankAccount";
     restData[ "identifier"         ] =  "linkBankAccount";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[  "locatorRecordType"         ] =  "0";
     restData[ "tagUid"             ] =  refreshSectionId;
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function enableCashOutButton( inputElement, id, tagUid, walletBalance )
  {
     var availableWalletBalance = walletBalance - 1.0;

     var buttonElement = getElementByName( "cashOutButton_"+id );
     var buttonRWDivElement = document.getElementById( buttonElement.id+"RW" );
     var regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

     buttonRWDivElement.style.opacity = 0.4;
     buttonElement.disabled = true;

     if ( inputElement.value == '' ) return;

     if ( !regex.test(inputElement.value) )
     {
        alert( "$"+inputElement.value + " is not a valid currency value" );
        return;
     }
     if ( Number(inputElement.value ) > availableWalletBalance )
     {
        alert( "$"+inputElement.value + " is greater than your current available wallet balance of $"+availableWalletBalance+", which is $1.00 less than your total wallet balance of $"+walletBalance+". Wridz is working to remedy this situation.  Please enter a value equal to or less than $" +availableWalletBalance+".");
        return;
     }
     buttonRWDivElement.style.opacity = 1.0;
     buttonElement.disabled = false;
  }

  function cashOut( acctGatewayMapId, id, tagUid )
  {
     var cashOutAmount = getElementByName( "cashOutAmount_"+id )
     var reqJson = {};

     var xhrData = {};
     xhrData[ "refreshSectionIds"   ] =  tagUid;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";
     xhrData[ "nextView"            ] =  "";

     var restData = {};
     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "AcctGatewayMap";
     restData[ "command"            ] =  "cashOut";
     restData[ "identifier"         ] =  "cashOut";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "id";
     restData[ "locatorRecordType"  ] =  "0";
     restData[ "value1"             ] =  id;
     restData[ "value2"             ] =  cashOutAmount.value;
     restData[ "tagUid"             ] =  tagUid;
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  reqJson;
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }
