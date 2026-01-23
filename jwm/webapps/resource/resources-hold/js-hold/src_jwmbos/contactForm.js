  var errCount = 0; // global... set by validation functions

  function leadFormValidate(form)
  {
     errCount = 0;  // reset count

     doValidate( form, "primaryEmail" );
     doValidate( form, "altEmail" );
     doValidate( form, "phone" );

     var contactTypeValue = 'wedding'; // default

     if (typeof form.contactType != 'undefined' )
     {
        for(var i = 0; i < form.contactType.length; i++)
        {
           if(form.contactType[i].checked) contactTypeValue = form.contactType[i].value;
        }
     }

     if ( contactTypeValue == 'wedding' )
     {
        doValidateIfVisible( form, "ceremonyReceptionLocation", "bothDiv" );
        doValidateIfVisible( form, "ceremonyLocation", "cerDiv" );
        doValidateIfVisible( form, "receptionLocation", "receptDiv" );
        doValidateIfVisible( form, "altContactLastName", "otherName" );

        doValidate( form, "weddingDate" );

//      console.log( "ensure bride or groom last name" );
        var brideNameErrorDiv = document.getElementById( "brideNameError" );
        var groomNameErrorDiv = document.getElementById( "groomNameError" );

        brideNameErrorDiv.style.display = "none";
        groomNameErrorDiv.style.display = "none";

        if (( form.brideLastName.value == "" ) && (form.groomLastName.value == "" ))
        {
           brideNameErrorDiv.style.display = "block";
           groomNameErrorDiv.style.display = "block";
           errCount++;
        }

//      console.log( "==>" + form.requestPhoto.checked +" "+ form.requestVideo.checked);
        if (( !form.requestPhoto.checked ) && (!form.requestVideo.checked ))
        {
           servicesErrorDiv.style.display = "block";
           errCount++;
        }
     }

     if ( contactTypeValue == 'otherEventType' )
     {
        doValidate( form, "eventName" );
        doValidate( form, "eventDate" );
        doValidate( form, "eventLocation" );
     }

     if (( contactTypeValue == 'otherEventType' )
        ||( contactTypeValue == 'generalContact' ))
     {
        doValidate( form, "reqLastName" );
     }

     form.submissionCode.value = "--> (JWMH)" + new Date(); // this is to identify that form was submitted via a human and not a spam robot

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }

     return(true);
  }

  function genCustomerFormValidate( form )
  {
     errCount = 0;  // reset count

     doValidate( form, "primaryEmail" );
     doValidate( form, "altEmail" );
     doValidate( form, "phone" );
     doValidate( form, "reqLastName" );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     return(true);
  }

  function setOtherVisible(selection)
  {
     var theDiv = document.getElementById( "otherName" );
     if (selection.value > 2 )
     {
        theDiv.style.display = 'block';
     }
     else
     {
        theDiv.style.display = 'none';
     }
     return(true);
  }

  function selectWeddingType(selection)
  {
     var bothDiv   = document.getElementById( "bothDiv" );
     var cerDiv    = document.getElementById( "cerDiv" );
     var receptDiv = document.getElementById( "receptDiv" );

     if ( selection.value == 'ceremonyAndReceptionSameLoc' )
     {
        bothDiv.style.display   = 'block';
        cerDiv.style.display    = 'none';
        receptDiv.style.display = 'none';
     }

     if ( selection.value == 'ceremonyAndReceptionDiffLoc' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'block';
        receptDiv.style.display = 'block';
     }

     if ( selection.value == 'ceremonyOnly' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'block';
        receptDiv.style.display = 'none';
     }

     if ( selection.value == 'receptionOnly' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'none';
        receptDiv.style.display = 'block';
     }

     if ( selection.value == 'locationNotBooked' )
     {
        bothDiv.style.display   = 'none';
        cerDiv.style.display    = 'none';
        receptDiv.style.display = 'none';
     }
  }

  function selectContactForm(selection)
  {
     var weddingDiv = document.getElementById( "wedding" );
     var eventDiv = document.getElementById( "event" );
     var myNameDiv = document.getElementById( "myName" );
     var generalInfoDiv = document.getElementById( "generalInfo" );
     var commonDiv = document.getElementById( "common" );

     if (selection.value == "wedding" )
     {
        weddingDiv.style.display          = 'block';
        eventDiv.style.display          = 'none';
        myNameDiv.style.display           = 'none';
        generalInfoDiv.style.display      = 'none';
        commonDiv.style.display           = 'block';
     }

     if (selection.value == "otherEventType" )
     {
        weddingDiv.style.display         = 'none';
        eventDiv.style.display          = 'block';
        myNameDiv.style.display           = 'block';
        generalInfoDiv.style.display      = 'none';
        commonDiv.style.display           = 'block';
     }

     if (selection.value == "generalContact" )
     {
        weddingDiv.style.display         = 'none';
        eventDiv.style.display          = 'none';
        myNameDiv.style.display           = 'block';
        generalInfoDiv.style.display      = 'block';
        commonDiv.style.display           = 'block';
     }
     return(true);
  }
