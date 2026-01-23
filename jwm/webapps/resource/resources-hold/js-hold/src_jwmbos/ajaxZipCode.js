   function validateZipCodeInput( tagUid, required )
   {
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      if ( !isValidPostalCode( dataValue, "US" ) )  // default US only for now
      {
         showError( tagUid, "** Invalid Zip Code" );
         document.getElementById(tagUid+"RO").innerHTML = dataValue; // make sure RO layer shows what was entered
         errCount += 1;
         return( false );
      }
      return( true );
   }

function isValidPostalCode(postalCode, countryCode)
{
    switch (countryCode)
    {
        case "US":
            postalCodeRegex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/;
            break;
        case "CA":
            postalCodeRegex = /^([A-Z][0-9][A-Z])\s*([0-9][A-Z][0-9])$/;
            break;
        default:
            postalCodeRegex = /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/;
    }
    return postalCodeRegex.test(postalCode);
}
