   function validatePhoneNumberInput( tagUid, required )
   {
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      if ( !is_phone( dataValue ) )
      {
         showError( tagUid, "** Invalid Phone Number (xxx) xxx-xxxx" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         errCount += 1;
         return( false );
      }
      return( true );
   }

   function is_phone(phone)
   {
      var raw_number = phone.replace(/[^0-9]/g,'');
      var regex1 = /^[0-9]{10}$/;
      return regex1.test(raw_number);
   }

