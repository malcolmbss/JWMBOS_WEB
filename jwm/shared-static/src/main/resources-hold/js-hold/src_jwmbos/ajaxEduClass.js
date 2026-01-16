   function verifyDeleteEduClassDivision( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This division contains classes.  It cannot be deleted.";
         alert( msg );
         return( false );
      }
      return(true);
   }

   function verifyDeleteEduClass( deleteAvailable )
   {
      if ( deleteAvailable != "true" )
      {
         var msg = "This class contains members.  It cannot be deleted.";
         alert( msg );
         return( false );
      }
      return(true);
   }
