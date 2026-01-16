   function restartSubscriptionPayInvoice( jsonResponse )
   {
      window.location.href = '/wridz/jsp/user/home.jsp?tile=singleInvoice&id='+jsonResponse.payableInvoiceId;
   }

   function rebuildDriverPasses( primaryKey, tagUid )
   {
      var initialLevel = getElementByName( tagUid );

      var restData = {};
      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  tagUid;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "DRIVERPASSLIST";
      restData[ "command"            ] =  "Rebuild";
      restData[ "identifier"         ] =  "Rebuild";
      restData[ "locatorId"          ] =  primaryKey;
      restData[ "locatorType"        ] =  "322";  // User
      restData[ "locatorRelationship"] =  "owner";
//      alert( "selectedIndex " + initialLevel.selectedIndex + initialLevel.options[ initialLevel.selectedIndex ].value + " " + initialLevel.options[ initialLevel.selectedIndex ].text )
      restData[  "locatorRecordType"         ] =  initialLevel.options[ initialLevel.selectedIndex ].value
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
   }
