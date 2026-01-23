   function processAddCard(aForm, accountId, containerTagUid1, containerTagUid2, tagUid )
   {
     setBusy( 'section_busy2'+tagUid, "block" );

//    var aForm = document.getElementById( aFormId );
//    // callers might have called with the form name in the name parameter instead of id...
//    if ( aForm == null )
//    {
//       aForm = getElementByName( aFormId );
//    }

//    console.log( aFormId + " " + aForm );
      errCount = 0;  // reset count

      doValidateIfExist( "ccNumber"       );
      doValidateIfExist( "ccExpMonth"     );
      doValidateIfExist( "ccExpYear"      );
      doValidateIfExist( "cvv"            );
      doValidateIfExist( "firstName"      );
      doValidateIfExist( "lastName"       );
      doValidateIfExist( "emailAddress"   );
      doValidateIfExist( "phoneNumber"    );
      doValidateIfExist( "zipCode"        );
      doValidateIfExist( "addressLine1"   );
      doValidateIfExist( "city"           );
      doValidateIfExist( "state"          );
      doValidateIfExist( "zipCode"        );

//    doValidate( aForm, "ccNumber"       );
//    doValidate( aForm, "ccExpMonth"     );
//    doValidate( aForm, "ccExpYear"      );
//    doValidate( aForm, "cvv"            );
//    doValidate( aForm, "firstName"      );
//    doValidate( aForm, "lastName"       );
//    doValidate( aForm, "emailAddress"   );
//    doValidate( aForm, "phoneNumber"    );
//    doValidate( aForm, "zipCode"        );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         setBusy( 'section_busy2'+tagUid, "none" );
         return( false );
      }

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { cardAddResponse( ajaxRequest, containerTagUid1, containerTagUid2, tagUid );} ;

      try
      {
         var serverCall = "/payment/jsp/ajax/ajaxGetPaymentProfile.jsp"
                         +"?action=addNew"
                         +"&viewName=api"
                         +"&objectClassID=143"
                         +"&accountId="     +    accountId
                         +"&ccNumber="      +    getElementByName( 'ccNumber'     ).value
                         +"&ccType="        +    getElementByName( 'ccType'       ).value
                         +"&ccExpMonth="    +    getElementByName( 'ccExpMonth'   ).value
                         +"&ccExpYear="     +    getElementByName( 'ccExpYear'    ).value
                         +"&cvv="           +    getElementByName( 'cvv'          ).value
                         +"&firstName="     +    getElementByName( 'firstName'    ).value
                         +"&lastName="      +    getElementByName( 'lastName'     ).value
                         +"&emailAddress="  +    getElementByName( 'emailAddress' ).value
                         +"&phoneNumber="   +    getElementByName( 'phoneNumber'  ).value
                         +"&addressLine1="  +    getElementByName( 'addressLine1' ).value
                         +"&addressLine2="  +    getElementByName( 'addressLine2' ).value
                         +"&city="          +    getElementByName( 'city'         ).value
                         +"&state="         +    getElementByName( 'state'        ).value
                         +"&zipCode="       +    getElementByName( 'zipCode'      ).value
      }
      catch( err )
      {
         alert( "Error creating payment profile.  Please copy/paste or screen shot this error and use the contact form to report this. " + err );
      }

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
      return(false);
   }

   function cardAddResponse( ajaxRequest, parentContainerTagUid, grandParentContainerTagUid, tagUid )
   {
      if (ajaxRequest.readyState == 4)
      {
          setBusy( 'section_busy2'+tagUid, "none" );
          if ( handleAjaxRC( ajaxRequest ) )
          {
             document.getElementById('section_refresh' + grandParentContainerTagUid ).click();// need to refresh the whole payment block to ensure 'pay' button enabled
             document.getElementById('viewIcon'+parentContainerTagUid+'_1').click();  // now re-open list view if closed on container refresh above
          }
      }
   }


   function validateCreditCardInput( tagUid, required )
  {
      if( !validate( tagUid, required ) ) return(false);

      $('#'+tagUid).validateCreditCard(function(result) {
          document.getElementById('ccType'  + tagUid ).value = (result.card_type == null ? '-' : result.card_type.name);
          document.getElementById('ccValid' + tagUid ).value = result.valid;
      });

      if ( document.getElementById('ccValid' + tagUid ).value == 'false' )
      {
         showError( tagUid, "** Invalid Credit Card Number" );
         return( false );
      }
      return( true );
   }

  function submitOnboardingKitCharge( theButton, tagUid, objId, amount )
  {
     theButton.disabled = true; // don't want multiple charges
     var url = "/cis/JWMBOS";
     var cardCode = getElementByName( "cardCode" );
     var testMode = getElementByName( "testMode" );

     var colCommand;
     if ( amount > 0 ) colCommand = "SUBMITONBOARDINGKITCHARGE";
     else              colCommand = "SUBMITPREAUTHTHENVOIDFORONBOARDING"

     var reqJson  = {};
     reqJson[ "table"         ] =  "WRIDZPERSONEXT";
     reqJson[ "col"           ] =  colCommand
     reqJson[ "identifier"    ] =  "SubmitOnboardingKitCharge";
     reqJson[ "cardCode"      ] =  cardCode.value;
     reqJson[ "objId"         ] =  Number( objId );
     reqJson[ "value"         ] =  Number( amount );
     reqJson[ "testMode"      ] =  testMode.checked;

     xhrUpdate( "POST",
                url,
                reqJson,
                tagUid,
                theButton.id,  // reference element for busy icon location
                tagUid,        // refresh sectionId
                "",
                ""
              );
  }

  function submitBackgroundCheckPayment( theButton, tagUid, objId, amount )
  {
     theButton.disabled = true; // don't want multiple charges
     var url = "/cis/JWMBOS";
     var cardCode = getElementByName( "cardCode" );

     var reqJson  = {};
     reqJson[ "table"         ] =  "WRIDZPERSONEXT";
     reqJson[ "col"           ] =  "SUBMITBACKGROUNDCHECKFEEPAYMENT";
     reqJson[ "identifier"    ] =  "SubmitBackgroundCheckFeePayment";
     reqJson[ "cardCode"      ] =  cardCode.value;
     reqJson[ "objId"         ] =  Number( objId );
     reqJson[ "value"         ] =  Number( amount );

     xhrUpdate( "POST",
                url,
                reqJson,
                tagUid,
                theButton.id,  // reference element for busy icon location
                tagUid,        // refresh sectionId
                "",
                ""
              );
  }

  function submitWridzPaymentCharge( theButton, tagUid, objId, amount )
  {
     theButton.disabled = true; // don't want multiple charges
     var url = "/cis/JWMBOS";
     var cardCode = getElementByName( "cardCode" );
     var testMode = getElementByName( "testMode" );

     var reqJson  = {};
     reqJson[ "table"         ] =  "INVOICE3";
     reqJson[ "col"           ] =  "SUBMITWRIDZPAYMENTCHARGE";
     reqJson[ "identifier"    ] =  "SubmitWridzPaymentCharge";
     reqJson[ "cardCode"      ] =  cardCode.value;
     reqJson[ "objId"         ] =  Number( objId );
     reqJson[ "value"         ] =  Number( amount );
     reqJson[ "testMode"      ] =  testMode.checked;

     xhrUpdate( "POST",
                url,
                reqJson,
                tagUid,
                theButton.id,  // reference element for busy icon location
                tagUid,        // refresh sectionId
                "",
                ""
              );
  }

  function submitWridzV3PaymentCharge( theButton, tagUid, invoiceId, amount, containerTagUid )  // V3 Submit
  {
     setBusy( theButton.id+"busy", "block" );
     theButton.disabled = true; // don't want multiple charges
     var restData = {};
     var xhrData = {};
     xhrData[ "containerId"         ] =  "";
     xhrData[ "refreshSectionIds"   ] =  containerTagUid;
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";

     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "Invoice";
     restData[ "command"            ] =  "PayProvision";
     restData[ "identifier"         ] =  "PayProvision";
     restData[ "locatorId"          ] =  invoiceId;
     restData[ "locatorType"        ] =  "20";  // Invoice
     restData[ "locatorRelationship"] =  "id";
     restData[ "locatorRecordType"  ] =  "0"
     restData[ "value1"             ] =  amount
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  {}
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );
  }

   function paymentPayProvision( paymentId, refreshSectionId )
   {
      var restData = {};
      var command = "payProvision";

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  refreshSectionId;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "payment_";
      restData[ "command"            ] =  command;
      restData[ "identifier"         ] =  command + "/" + paymentId;
      restData[ "locatorId"          ] =  paymentId
      restData[ "locatorType"        ] =  "142";
      restData[ "locatorRelationship"] =  "0"; // id
      restData[  "locatorRecordType" ] =  "0";
      restData[ "dataReq"            ] =  ""
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      return(true);
   }

   function wridzPaymentFormValidate( aForm, id, tagUid )
   {
      errCount = 0;
      doValidate( aForm, "cardCode"       );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to submit the payment." );
         return( false );
      }
      return( true );
   }

   function onboardingKitChargeFormValidate( aForm, id, tagUid )
   {
      errCount = 0;
      doValidate( aForm, "cardCode"       );
      doValidate( null, "approveCharge"  ); // this element is not in the form due to form nesting issues on the page... null means getElementByName()

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to submit the payment." );
         return( false );
      }
      return( true );
   }

   function backgroundCheckPaymentFormValidate( aForm, id, tagUid )
   {
      errCount = 0;
      doValidate( aForm, "cardCode"       );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to submit the payment." );
         return( false );
      }
      return( true );
   }

   function processActivateCoupon( aForm, tagUid )
   {
      var couponID = getElementByName( 'couponID').value.replace(/\s/g, "");
      getElementByName( 'couponID'     ).value = couponID;

      errCount = 0;
      doValidate( aForm, "couponID"     );
      doValidate( aForm, "maxCouponValue"      );
      doValidate( aForm, "couponMonth"     );
      doValidate( aForm, "couponExpYear"      );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s)." );
         return( false );
      }

      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"                         ] =  "PAYMENTPROFILE";
      reqJson[ "col"                           ] =  "ACTIVATECOUPON";
      reqJson[ "identifier"                    ] =  "ActivateCoupon";
      reqJson[ "couponID"                      ] =  getElementByName( 'couponID'     ).value;
      reqJson[ "maxCouponValue"                ] =  Number( getElementByName( 'maxCouponValue').value );
      reqJson[ "couponExpMonth"                ] =  Number( getElementByName( 'couponExpMonth'   ).value );
      reqJson[ "couponExpYear"                 ] =  Number( getElementByName( 'couponExpYear'    ).value );


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

  function submitNonPreAuthInvoicePayment( theButton, tagUid, objId )
  {
      theButton.disabled = true; // don't want multiple charges

      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"         ] =  "INVOICE3";
      reqJson[ "col"           ] =  "SUBMITNONPREAUTHINVOICEPAYMENT"
      reqJson[ "identifier"    ] =  "SubmitNonPreAuthInvoicePayment";
      reqJson[ "objId"         ] =  Number( objId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 theButton.id,  // reference element for busy icon location
                 tagUid,        // refresh sectionId
                 "",
                 ""
               );
   }

   function testPDF( tagUid ){
      var couponID = getElementByName( 'couponID').value.replace(/\s/g, "");
      getElementByName( 'couponID'     ).value = couponID;


      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"                         ] =  "PAYMENTPROFILE";
      reqJson[ "col"                           ] =  "testPDF";
      reqJson[ "identifier"                    ] =  "TestPDF";
      reqJson[ "couponID"                      ] =  getElementByName( 'couponID'     ).value;
      reqJson[ "maxCouponValue"                ] =  Number( getElementByName( 'maxCouponValue').value );
      reqJson[ "couponExpMonth"                ] =  Number( getElementByName( 'couponExpMonth'   ).value );
      reqJson[ "couponExpYear"                 ] =  Number( getElementByName( 'couponExpYear'    ).value );


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

  function submitReverseCharges( theButton, tagUid, objId )
  {
      theButton.disabled = true; // don't want multiples calls

      var url = "/cis/JWMBOS";

      var reqJson  = {};
      reqJson[ "table"         ] =  "INVOICE3";
      reqJson[ "col"           ] =  "SUBMITREVERSEPAYMENT"
      reqJson[ "identifier"    ] =  "SubmitReverseCharges";
      reqJson[ "objId"         ] =  Number( objId );

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 theButton.id,  // reference element for busy icon location
                 tagUid,        // refresh sectionId
                 "",
                 ""
               );
   }

  function createPaymentProfileBEST( acctGatewayMapId, tagUid )
  {
     var restData = {};

     var xhrData = {};
     xhrData[ "containerId"         ] =  "";
     xhrData[ "refreshSectionIds"   ] =  "";
     xhrData[ "callbackFn"          ] =  "";
     xhrData[ "callbackParameters"  ] =  "";

     restData[ "method"             ] =  "POST";
     restData[ "dataObj"            ] =  "PaymentProfileList";
     restData[ "command"            ] =  "linkCreditCard";
     restData[ "identifier"         ] =  "linkCreditCard";
     restData[ "locatorId"          ] =  acctGatewayMapId;
     restData[ "locatorType"        ] =  "263";
     restData[ "locatorRelationship"] =  "owner";
     restData[  "locatorRecordType"         ] =  "0",
     restData[ "tagUid"             ] =  tagUid,
     restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
     restData[ "reqJson"            ] =  {}
     restData[ "xhrData"            ] =  xhrData;

     xhrREST( restData );

   return(true);
  }

  function closePopup( tagUid )
  {
     // link credit card / link bank account popup is closing... need to refresh the tagUid to update the list
     // see if it is an id
     if ( document.getElementById('section_refresh'+tagUid ) != null )
     {
        console.log( "refreshing by tagUid: " + tagUid );
        document.getElementById('section_refresh'+ tagUid ).click();
     }
  }
