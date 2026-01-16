   function verifyDeleteLead( deleteAvailable )
   {
//    console.log( "deleteAvailable = " + deleteAvailable );
      if ( deleteAvailable != "true" )
      {
         var msg = "This lead cannot be deleted because it is a member of onr or more groups.";
         alert( msg );
         return( false );
      }
      return(true);
   }
