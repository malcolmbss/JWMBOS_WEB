   function newTicket()
   {
      var templateId = getElementByName( "ticketTemplateSelect" ).value;
   }

   function contactUsTicket( aFormId, tagUid, source, regionId, refType, refId )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, 'name'+tagUid  );
      doValidate( aForm, 'emailAddress'+tagUid );
      doValidate( aForm, 'phoneNumber'+tagUid );
      doValidate( aForm, 'comments'+tagUid );
      doValidate( aForm, 'region'+tagUid );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }

      var name = getElementByName( 'name'+tagUid ).value;
      var emailAddress = getElementByName( 'emailAddress'+tagUid ).value;
      var altContact = getElementByName( 'altContact'+tagUid ).value;
      var phoneNumber = getElementByName( 'phoneNumber'+tagUid ).value;
      var userPersonId = getElementByName( 'userPersonId'+tagUid ).value;
      if ( userPersonId == null ) userPersonId = "-1";
      var comments = getElementByName( 'comments'+tagUid ).value;

      if ( regionId == "" )
      {
         regionId = getElementByName( 'region'+tagUid ).value;
      }

      var templateId = "-1";
      if ( source == "Calendar" ) templateId = "124"
      if ( source == "menu"     ) templateId = "139"
      if ( source == "trip"     ) templateId = "139"        // <==============================================================================

//    console.log( name + " " + emailAddress + " " + source + " " + regionId + " " + comments );

      var url = "/wridz/WebService.json";
      var reqJson  = {};

      reqJson[ "dataObj"       ] =  "Ticket";
      reqJson[ "command"       ] =  "createTicket";
      reqJson[ "identifier"    ] =  "ContactUsTicket";
      reqJson[ "name"          ] =  name;
      reqJson[ "emailAddress"  ] =  emailAddress;
      reqJson[ "phoneNumber"   ] =  phoneNumber;
      reqJson[ "altContact"    ] =  altContact;
      reqJson[ "comments"      ] =  comments;
      reqJson[ "regionId"      ] =  Number( regionId );
      reqJson[ "refType"       ] =  Number( refType );
      reqJson[ "refId"         ] =  Number( refId   );
      reqJson[ "userPersonId"  ] =  Number( userPersonId );
      reqJson[ "templateId"    ] =  Number( templateId );

      xhrService( "POST",
                  url,
                  reqJson,
                  tagUid,
                  tagUid,
                  tagUid,
                  "",
                  ""
                );

      getElementByName( 'name'+tagUid ).value = "";
      getElementByName( 'emailAddress'+tagUid ).value = "";
      getElementByName( 'userPersonId'+tagUid ).value = "";
      getElementByName( 'comments'+tagUid ).value ="";
      getElementByName( 'region'+tagUid ).value ="";

      createAlert( 1, "Your message has been sent." );
   }

   function replyToTicket( aFormId, tagUid, ticketId, refreshSectionIds )
   {
      var aForm = document.getElementById( aFormId );
      errCount = 0;  // reset count

      doValidate( aForm, 'comments'+tagUid );

      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         return( false );
      }
      var comments = getElementByName( 'comments'+tagUid ).value;

      var url = "/wridz/WebService.json";
      var reqJson  = {};

      reqJson[ "dataObj"       ] =  "Ticket";
      reqJson[ "command"       ] =  "replyToTicket";
      reqJson[ "identifier"    ] =  ticketId;
      reqJson[ "comments"      ] =  comments;
      reqJson[ "ticketId"      ] =  Number( ticketId );

      xhrService( "POST",
                  url,
                  reqJson,
                  tagUid,
                  tagUid,
                  refreshSectionIds,
                  "",
                  ""
                );
      createAlert( 1, "Your response has been added to the ticket." );
   }

   function searchTickets( tagUid )
   {
      forcePage1(tagUid);

      var dateField = getElementByName( "searchTicketDateBgn" );
      setTagParm( "searchBgnDate", dateField.value, tagUid, true );

      dateField = getElementByName( "searchTicketDateEnd" );
      setTagParm( "searchEndDate", dateField.value, tagUid, true );

      var searchTicketIdField = getElementByName( "searchTicketId" );
      var searchTicketId = searchTicketIdField.value;
      if ( isNaN( searchTicketId ) ) searchTicketId = -1;
      setTagParm( "searchTicketId", searchTicketId, tagUid, true );

      var searchTicketStatusField = getElementByName( "searchTicketStatus" );
      var searchTicketStatus = searchTicketStatusField.value;
      setTagParm( "searchTicketStatus", searchTicketStatus, tagUid, true );

      var searchTicketSeverityField = getElementByName( "searchTicketSeverity" );
      var searchTicketSeverity = searchTicketSeverityField.value;
      setTagParm( "searchTicketSeverity", searchTicketSeverity, tagUid, true );

      var searchTicketKeywordField = getElementByName( "keywordSearch" );
      var searchTicketKeyword = searchTicketKeywordField.value;
      setTagParm( "searchKeyword", searchTicketKeyword, tagUid, true );


      document.getElementById( 'section_refresh'+tagUid ).click();
   }
