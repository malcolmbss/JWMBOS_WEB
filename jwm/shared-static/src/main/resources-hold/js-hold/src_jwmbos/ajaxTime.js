function utcToLocal( utcTime, format )
{
   if ( typeof format == "undefined") format = 'ddd, MMM D, YYYY hh:mm.ss a';
// console.log( "Format: " + format );
// console.log( "utcTime " + utcTime );
   if ( utcTime == '' ) return( '' );
   try
   {
      var localTime  = moment.utc(utcTime).toDate();
      var timeString  =moment(localTime).format(format);
   }
   catch( error )
   {
      return( error );
   }
// console.log( ">>> localTime " + timeString);
   return( timeString );
}

function localToUtc( localTime, format )
{

   if ( typeof format == "undefined") format = 'ddd, MMM D, YYYY hh:mm a';
   if ( localTime == "" ) return( "" );
 console.log( "localTime [" + localTime + "]");
   var utcTime = moment( localTime ).utc().format(format);
   var timeString  =moment(utcTime).format(format);
 console.log( ">>> utcTime " + utcTime );
   return( utcTime );
}

function utcToLocalContainer( utcTime, containerId, format )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime, format ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function utcDateToLocalContainer( utcTime, containerId )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime,'ddd, MMM D, YYYY' ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function utcTimeToLocalContainer( utcTime, containerId )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime, 'hh:mm.ss a' ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function utcTimeToLocalContainerNoSec( utcTime, containerId )
{
// console.log( "+++" + utcTime + " " + containerId );
   var container = document.getElementById( containerId );
   container.innerHTML = container.innerHTML + utcToLocal( utcTime, 'hh:mma' ); // need to keep existing script tags or eval will start skipping script tags due to reindexing DOM
}

function timeCardTitleUtcToLocal(utcBgnTime, utcEndTime, containerId )
{
   var container = document.getElementById( containerId );
   container.innerHTML = utcToLocal( utcBgnTime ) + " ~ " + utcToLocal( utcEndTime );
}

function now()
{
   return( moment().utcOffset(0, true).format( 'ddd, MMM D, YYYY hh:mm A') );
}

function now( formatString )
{
   return( moment().utcOffset(0, true).format( formatString ));
}

function bgnRangeUtc( aDateTime )
{
   if ( aDateTime.indexOf( ":" ) == -1 )
   {
      return( localToUtc( moment(aDateTime, "MM/DD/YYYY" ), "YYYY-MM-DD hh:mm:ss" ));
   }
   else
   {
      return( localToUtc( aDateTime, "YYYY-MM-DD hh:mm:ss" ));
   }
}

function endRangeUtc( aDateTime )
{
   if ( aDateTime.indexOf( ":" ) == -1 )
   {
      return( localToUtc( moment( aDateTime + " 23:59:59", "MM/DD/YYYY hh:mm:ss" ), "YYYY-MM-DD hh:mm:ss" ));
   }
   else
   {
      return( localToUtc( aDateTime, "YYYY-MM-DD hh:mm:ss" ));
   }
}
