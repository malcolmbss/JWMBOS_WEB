   function sendBatchPushNotifications( tagUid )
   {
//                 local.wridz.com/personlist/BatchMail/23             locatorId (WF)
//                                                     /64             locatorType (region)
//                                                     /11             locatorRelationship
//                                                     /0              RecordType
//                                                     /InSignUpState  data            1
//                                                     /3              filter value    2
//                                                     /19                             3
//                                                     /1                              4
//                                                     /simulate                       5
//                                                     /fromUser                       6

      var locatorElement            = getElementByName( "locator" + tagUid );
      var qualifierElement          = getElementByName( "qualifier" + tagUid );
      if (locatorElement.value == -1 )
      {
         alert( "Region Must Be Specified" );
         return(false);
      }
      if (qualifierElement.value == -1 )
      {
         alert( "Recipient Qualifier Must Be Specified" );
         return(false);
      }
      var titleElement              = getElementByName( "title" + tagUid );
      var bodyElement               = getElementByName( "body" + tagUid );
      var randomTemplateIdElement   = getElementByName( "randomTemplateId" + tagUid );

      var locatorParts              = locatorElement.value.split( "/" );
      var qualifierParts            = qualifierElement.value.split( "/" );

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      var reqJson = {};
      reqJson[ "title"               ] =  titleElement.value;
      reqJson[ "body"                ] =  bodyElement.value;
      if ( reqJson[ "title" ] == "" )
      {
         alert( "Title cannot be blank" );
         return(false);
      }
      if ( reqJson[ "title" ].length > 50 )
      {
         alert( "Maximum of 50 characters allowed in title" );
         return(false);
      }
      if ( reqJson[ "body" ] == "" )
      {
         alert( "Body cannot be blank" );
         return(false);
      }
      if ( reqJson[ "body" ].length > 350 )
      {
         alert( "Maximum of 350 characters allowed in body" );
         return(false);
      }

      var restData = {};
      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "personlist";
      restData[ "command"            ] =  "BatchPushNotification";
      restData[ "identifier"         ] =  "BatchPushNotification/"+locatorElement.value+"/"+qualifierElement.value;
      restData[ "locatorId"          ] =  locatorParts[0];
      restData[ "locatorRecordType"  ] =  locatorParts[1];
      restData[ "locatorRelationship"] =  locatorParts[2];
      restData[  "locatorRecordType"         ] =  "0";
      restData[ "value1"             ] =  qualifierParts[0];
      restData[ "value2"             ] =  ( qualifierParts.length > 1 ? qualifierParts[1] : "-" );
      restData[ "value3"             ] =  randomTemplateIdElement.value;
      restData[ "value4"             ] =  "0"
      restData[ "value5"             ] =  "simulate"
      restData[ "value6"             ] =  "0";
      restData[ "tagUid"             ] =  tagUid;
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  reqJson;
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      alert( "Your batch push notification has NOT yet been sent to the recipients.  A PROOF email has been sent to Wridz administration for verification and approval. The admin will complete the sending process or contact you for changes." );
   }
