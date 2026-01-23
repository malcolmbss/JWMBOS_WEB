   function validateEmailAddressInput( tagUid, required )
   {
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      if ( !is_email( dataValue ) )
      {
         showError( tagUid, "** Invalid Email Address" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         errCount += 1;
         return( false );
      }
      return( true );
   }

   function is_email(email)
   {
      var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,15}$/;
      return emailReg.test(email);
   }

   function processTemplateInsertButton( buttonElement, idRoot, type, id, mailItemType, tagUid )
   {
      var templatesTagUid = buttonElement.getAttribute( "tagUid" );
      var busyIcon = "templatebusy"+tagUid;

      var selectionListElement = document.getElementById( "templates"+templatesTagUid );
      var optionElement = selectionListElement.options[selectionListElement.selectedIndex];

      var templateId         = optionElement.value;
      var templateName       = optionElement.text;

      // I have added user-defined attributes to the <options> tag:
      var toFollowUp         = optionElement.getAttribute( "toFollowup" );
      var toStatus           = optionElement.getAttribute( "toStatus" );
      var onlyToDue          = optionElement.getAttribute( "onlyToDue" )
      var preventDuplicates  = optionElement.getAttribute( "preventDuplicates" );

      var subjUid         = "Mail_Subject"+idRoot;
      var bodyUid         = "Body_"+idRoot;
      var statusUid       = "MailChangeStatus"+idRoot;
      var followupUid     = "MailChangeFollowUp"+idRoot;
      var onlyToDueUid    = "OnlyToFollowupDue"+idRoot;
      var duplicatesIdUid = "DuplicatesId"+idRoot;

//    console.log( "subjUid " + subjUid );
      var subjectElements = document.getElementsByName(            subjUid         );
      var nextStatusElements = document.getElementsByName(         statusUid       );

      var nextFollowUpElements      = document.getElementsByName(  followupUid     );
      var onlyToFollowUpDueElements = document.getElementsByName(  onlyToDueUid    );
      var duplicatesIdElements      = document.getElementsByName(  duplicatesIdUid );

      if ( templateId == -999 ) // this is the autosaved draft, NOT a template
      {
         var autoSavedBody = "";
         var autoSavedSubj = "";

         if (typeof Storage != "undefined")
         {
             autoSavedBody = localStorage.getItem(bodyUid);
             autoSavedSubj = localStorage.getItem(subjUid);
         }
//       console.log( "autoSavedSubj( " + subjUid + " ) = " + autoSavedSubj );

         if ( autoSavedSubj != "" ) subjectElements[0].value = autoSavedSubj;

         if ( autoSavedBody != "" ) insertIntoJQTE("Body_"+idRoot, autoSavedBody );
         else console.error( "autoSavedBody is blank" );

      }
      else // template
      {
         ajaxPopulateEmailBodyFromTemplate(    templateId, idRoot,       busyIcon, bodyUid,           type, id, mailItemType, tagUid );
         ajaxPopulateEmailSubjectFromTemplate( templateId, subjUid,      subjectElements[0],          type, id, mailItemType, tagUid  );

//                  if ( toStatus != "--No Status Change--" ) selectOptionByText(  nextStatusElements[0],        toStatus     );
// fn moved to HML  if ( toFollowUp != -1 )                   selectOptionByValue( nextFollowUpElements[0],      toFollowUp   );
//                  if ( onlyToDue  ==  1 )                   setCheckBox(         onlyToFollowUpDueElements[0], 1            );
//                  if ( preventDuplicates ==  1 )            selectOptionByText(  duplicatesIdElements[0],      templateName );
      }
   }

   function ajaxPopulateEmailBodyFromTemplate( templateId, idRoot, busyIcon, bodyUid, type, id, mailItemType, tagUid  )
   {
      setBusy( busyIcon,"inline" );

      var context          = getTagParm( "context", tagUid );
      if (context == '' ) context = "cis";

      var ajaxRequest = getAjaxRequestObject();

      ajaxRequest.onreadystatechange = function() { insertTemplateBody( ajaxRequest, idRoot, busyIcon, bodyUid );} ;
      var serverCall = "/"+context+"/jsp/ajax/ajaxGetMailTemplate.jsp"
                      +"?user="+getUserName()
                      +"&viewName=bodyContent"
                      +"&customizeType="+type
                      +"&customizeId="+id
                      +"&mailItemType="+mailItemType
                      +"&id="+templateId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }

   function ajaxPopulateEmailSubjectFromTemplate( templateId, uid, container, type, id, mailItemType, tagUid  )
   {
      var ajaxRequest = getAjaxRequestObject();

      var context          = getTagParm( "context", tagUid );
      if (context == '' ) context = "cis";

      ajaxRequest.onreadystatechange = function() { insertTemplateSubject( ajaxRequest, uid, container );} ;

      var serverCall = "/"+context+"/jsp/ajax/ajaxGetMailTemplate.jsp"
                      +"?user="+getUserName()
                      +"&viewName=subjectContent"
                      +"&customizeType="+type
                      +"&customizeId="+id
                      +"&mailItemType="+mailItemType
                      +"&id="+templateId

      ajaxRequest.open("GET", serverCall, true);
      ajaxRequest.send(null);
   }


   function insertTemplateBody( ajaxRequest, idRoot, busyIcon, bodyUid )
   {
      if (ajaxRequest.readyState == 4)
      {
         var templateBody = ajaxRequest.responseText.trim();

         setBusy( busyIcon, "none" );

         insertIntoJQTE( "Body_"+idRoot, templateBody );

         if (typeof Storage != "undefined")
         {
             localStorage.setItem(bodyUid, templateBody);
         }
      }
   }

   function insertIntoJQTE( idRoot, templateBody )
   {
//    console.log( "insertIntoJQTE idRoot " + idRoot );
      var textElement = document.getElementById( idRoot );
      var cursorPos = getCursorPos( textElement );

      var text = $( "#"+idRoot ).jqteVal();
      var before = text.substring(0, cursorPos )
      var after  = text.substring(cursorPos, text.length)

      $( "#"+idRoot ).jqteVal(before + templateBody.trim() + after);
   }

   function insertTemplateSubject( ajaxRequest, uid, container )
   {
      if (ajaxRequest.readyState == 4)
      {
         var subject = ajaxRequest.responseText.trim();
         var parts = subject.split("|")
         if ( parts.length > 1 ) subject = parts[1].trim();
//         console.log( "subj: " + subject );
         container.value = subject;
         autoSave( container, uid ); // need to make sure current subj is now the autosaved subj
      }
   }

   function selectOptionByText( selectElement, aText)
   {
      for(var i=0; i < selectElement.options.length; i++)
      {
        if(selectElement.options[i].text == aText)
        {
          selectElement.selectedIndex = i;
          break;
        }
      }
   }

   function selectOptionByValue( selectElement, aValue)
   {
      for(var i=0; i < selectElement.options.length; i++)
      {
        if(selectElement.options[i].value == aValue)
        {
          selectElement.selectedIndex = i;
          break;
        }
      }
   }

   function setCheckBox( checkBoxElement, value )
   {
      if ( value == '1' )
      {
         checkBoxElement.checked = "true";
      }
      else
      {
         checkBoxElement.checked = "false";
      }
   }

   function getCursorPos(element)
   {
       var caretOffset = 0;
       var doc = element.ownerDocument || element.document;
       var win = doc.defaultView || doc.parentWindow;
       var sel;
       if (typeof win.getSelection != "undefined")
       {
           sel = win.getSelection();
           if (sel.rangeCount > 0)
           {
               var range = win.getSelection().getRangeAt(0);
               var preCaretRange = range.cloneRange();
               preCaretRange.selectNodeContents(element);
               preCaretRange.setEnd(range.endContainer, range.endOffset);
               caretOffset = preCaretRange.toString().length;
           }
       }
       else if ( (sel = doc.selection) && sel.type != "Control")
       {
           var textRange = sel.createRange();
           var preCaretTextRange = doc.body.createTextRange();
           preCaretTextRange.moveToElementText(element);
           preCaretTextRange.setEndPoint("EndToEnd", textRange);
           caretOffset = preCaretTextRange.text.length;
       }
       return caretOffset;
   }

   function sendMail( idRoot, type, id, mailItemType, tagUid )
   {
      var busyIcon = "busy"+tagUid;
      var busyElement = document.getElementById( busyIcon );
      if ( busyElement != null )
      {
         if ( busyElement.style.display != "none" ) return;  // if busy... return... prevent double send from double clicks
      }
      setBusy( busyIcon, "inline" );

      setTagParm( "contactId", id, tagUid );

      var processAsLeadFlag = document.getElementsByName( "processLeadToNextState"+tagUid );
      if ( processAsLeadFlag != null )
      {
         if ( processAsLeadFlag[0] != null )
         {
            setTagParm( "processLeadToNextState", processAsLeadFlag[0].options[processAsLeadFlag[0].selectedIndex].value, tagUid );
         }
      }

      var parms = getParmsAsString(tagUid);

      var subjUid         = "Mail_Subject"+idRoot;
      var bodyUid         = "Body_"+idRoot;
      var footerUid       = "Footer_"+idRoot;


      var subjectElements = document.getElementsByName(            subjUid         );

      var subject = subjectElements[0].value;
      if ( subject.trim() == "" )
      {
         alert( "Subject cannot be blank" );
         setBusy( busyIcon, "none" );
         return( false );
      }

      var fromNameUid     = "FromName_"+idRoot;
      var fromAddrUid     = "FromAddr_"+idRoot;
      var toNameUid       = "ToName_"+idRoot;
      var toAddrUid       = "ToAddr_"+idRoot;

      var fromNameElements          = document.getElementsByName(  fromNameUid     );
      var fromAddrElements          = document.getElementsByName(  fromAddrUid     );
      var toNameElements            = document.getElementsByName(  toNameUid       );
      var toAddrElements            = document.getElementsByName(  toAddrUid       );

      var targetURL = "";

      if ( typeof fromNameElements[0]  != 'undefined' )
      {
         targetURL = "/cis/jsp/ajax/ajaxSendMail.jsp";
         parms += "&fromName="     + encodeURIComponent( fromNameElements[0].value );
         parms += "&fromAddr="     + encodeURIComponent( fromAddrElements[0].value );

         for ( var i = 0; i < toAddrElements.length; i++ )
         {
            parms += "&toName="       + encodeURIComponent( toNameElements[i].value );
            parms += "&toAddr="       + encodeURIComponent( toAddrElements[i].value );
         }
      }

      var leadStateSelect           = document.getElementById( "stateSelect" + tagUid );
      if ( leadStateSelect == null )      // this is a normal single email send
      {
         if ( typeof toNameElements[0]  == 'undefined' )
         {
            alert( "No Recipients Specified" );
            return( false );
         }
      }
      else // this is an HML batch where contact states are selected as recipients
      {
         var targetURL = "/hmlClient/jsp/ajax/ajaxQueueBatchMail.jsp";
         if ( mailItemType == "HMLSendTest" )
         {
            parms += "&HMLSendTest=true";
         }
         else
         {
            for (var i = 0; i < leadStateSelect.options.length; i++)
            {
               if(leadStateSelect.options[i].selected ==true)
               {
                  parms += "&leadState=" + encodeURIComponent( leadStateSelect.options[i].value );
               }
            }
         }
      }

      parms += "&mailItemType=" + encodeURIComponent( mailItemType );
      parms += "&type="         + encodeURIComponent( type );
      parms += "&id="           + encodeURIComponent( id );
      parms += "&subject="      + encodeURIComponent( subject);
      parms += "&body="         + encodeURIComponent( $( "#"+bodyUid ).jqteVal() );
      parms += "&footer="       + encodeURIComponent( $( "#"+footerUid ).jqteVal() );

      var ajaxRequest = getAjaxRequestObject();
      ajaxRequest.onreadystatechange = function() { emailSendResults( ajaxRequest, subjectElements[0], bodyUid, idRoot, busyIcon );} ;

      ajaxRequest.open("POST", targetURL, true);
      ajaxRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");

      ajaxRequest.send( parms );
   }

   function emailSendResults( ajaxRequest, subjectElement, bodyUid, idRoot, busyIcon )
   {
      if (ajaxRequest.readyState == 4)
      {
         setBusy( busyIcon, "none" );

         result = ajaxRequest.responseText.trim()
         var parts = result.split("|")
         if ( parts.length > 1 ) result = parts[1].trim();

         alert( result );

         if ( result.indexOf( "success" ) != -1 )
         {
            subjectElement.value = ""; // clear the subject and body to prevent a resend...
            $( "#Body_"+idRoot ).jqteVal( "" );
//          console.log( "#Body_"+idRoot );
         }
      }
   }

   function insertSelected( targetId, galleryTagUid )
   {
      var currSelectedTagUid = document.getElementById( "selected"+galleryTagUid ).value;

      var url = document.getElementById( "url"+currSelectedTagUid );
      var imgTag = "<img src='"+url.value+"' style='width:200px'>";

      insertIntoJQTE( targetId, imgTag )
   }

   function sendBatchEmail( tagUid )
   {
//                 local.wridz.com/personlist/BatchMail/23             locatorId (WF)
//                                                     /64             locatorType (region)
//                                                     /11             locatorRelationship
//                                                     /0              RecordType
//                                                     /InSignUpState  data            1
//                                                     /3              filter value    2
//                                                     /19             templateId      3
//                                                     /1              allow dups      4
//                                                     /simulate                       5
//                                                     /fromEmailAddress               6

      var fromElement               = getElementByName( "from" + tagUid );
      if ( fromElement.value == "" )
      {
         alert( "'From' Must Be Specified" );
         return(false);
      }
      var templateIdElement         = getElementByName( "templateId" + tagUid );
      var locatorElement            = getElementByName( "locator" + tagUid );
      var qualifierElement          = getElementByName( "qualifier" + tagUid );
      if (qualifierElement.value == -1 )
      {
         alert( "Recipient Qualifier Must Be Specified" );
         return(false);
      }
      var allowResendElement        = getElementByName( "allowResend" + tagUid );
      var subjectElement            = getElementByName( "subject" + tagUid );
      var bodyElement               = getElementByName( "body" + tagUid );

      var locatorParts              = locatorElement.value.split( "/" );
      var qualifierParts            = qualifierElement.value.split( "/" );

      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  "";
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      var reqJson = {};
      reqJson[ "subject"             ] =  subjectElement.value;
      reqJson[ "body"                ] =  bodyElement.value;

      var restData = {};
      restData[ "method"             ] =  "POST";
      restData[ "dataObj"            ] =  "personlist";
      restData[ "command"            ] =  "BatchMail";
      restData[ "identifier"         ] =  "BatchMail/"+locatorElement.value+"/"+qualifierElement.value;
      restData[ "locatorId"          ] =  locatorParts[0];
      restData[ "locatorType"        ] =  locatorParts[1];
      restData[ "locatorRelationship"] =  locatorParts[2];
      restData[ "locatorRecordType"  ] =  "0";
      restData[ "value1"             ] =  qualifierParts[0];
      restData[ "value2"             ] =  ( qualifierParts.length > 1 ? qualifierParts[1] : "-" );
      restData[ "value3"             ] =  templateIdElement.value;
      restData[ "value4"             ] =  ( allowResendElement.checked ? "allowResend" : "-" );
      restData[ "value5"             ] =  "simulate"
      restData[ "value6"             ] =  fromElement.value;
      restData[ "tagUid"             ] =  tagUid;
      restData[ "dataReq"            ] =  "*Basic2,*ServerStatistics,tagUid";
      restData[ "reqJson"            ] =  reqJson;
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
      alert( "Your batch email has NOT yet been sent to the recipients.  A PROOF email has been sent to your email inbox.  When you have proofed the content and the proposed recipient log at the bottom of the email, click the link below the log to actually send the email.  The link will expire in 15 minutes.");
   }
