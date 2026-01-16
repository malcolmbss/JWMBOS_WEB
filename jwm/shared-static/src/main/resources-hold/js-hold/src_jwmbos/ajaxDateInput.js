   function validateDateInput( tagUid, required )
   {
//    console.log( "validateDataInput()" );
      if (!validate( tagUid, required ) ) return( false ); // checks required field

      var dataValue = document.getElementById(tagUid).value;
      if (dataValue == "" ) return(true);

      // 2/13/23 - added due to somebody entering 09191983 for birthday
      // but realized we can't restrict all date entries to mm/dd/yyyy format
      // need to add an 'expected format' parm to the validation
//    var parts = dataValue.split("/");
//    if (( parts.length != 3 )
//       ||( parts[0].length != 2 )
//       ||( parts[1].length != 2 )
//       ||( parts[2].length !=4 ) )
//    {
//       showError( tagUid, "Error: The date format must be mm/dd/yyyy." );
//       errCount++;
//       return( false );
//    }

      var restrictions     = getTagParm( "restrictions", tagUid );
//    console.log( "validateDateInput() restrictions: " + restrictions );

      var now = new Date();
      var theDate = Date.parse( dataValue );
      if ( restrictions == 'futureOnly' )
      {
         if ( theDate <= now )
         {
            showError( tagUid, "Error: The value entered must be a future date." );
            errCount++;
            return( false );
         }
      }
      if ( restrictions == 'pastOnly' )
      {
         if ( theDate >= now )
         {
            showError( tagUid, "Error: The value entered must be a past date." );
            errCount++;
            return( false );
         }
      }
      return( true );
   }

   function initDateTime( hourMin, hourMax )
   {
//   console.log( "initDateTime() " + getSysImages()+'/calendar.png');
     $(document).ready(function()
     {
        $(".datetimepicker").datetimepicker(
           {
              showOn: 'both',
              buttonImage: getSysImages()+'/calendar.png',
              buttonImageOnly: true,
              buttonText: 'Open Calendar',
              changeMonth: true,
              changeYear: true,
              hourMin: hourMin,
              hourMax: hourMax,

              dateFormat: 'D, M d, yy',
              timeFormat: 'hh:mm TT',

              onSelect: function(d,i)
              {
                    var date = new Date(d);
                    var lastVal = new Date(i.lastVal);
                    if (!isNaN(lastVal.getHours()) )  // this is a complete kludge... only way I can find to tell if time was changed...
                    {                                 // if time slider changed, it messes up and doesn't set 'i' correctly resulting in NaN
                       date.setHours( 0 );
                       date.setMinutes( 0 );
                       $(this).datetimepicker('setDate', date );
                    }
              }
           }
        );

        $(".datepicker").datepicker(
           {
              showOn: 'both',
              buttonImage: getSysImages()+'/calendar.png',
              buttonImageOnly: true,
              buttonText: 'Open Calendar',
              changeMonth: true,
              changeYear: true,
              yearRange: '-100:+15',
              dateFormat: 'mm/dd/yy'
           }
        );

        $(".datepicker2").datepicker(
           {
              showOn: 'both',
              buttonImage: getSysImages()+'/calendar.png',
              buttonImageOnly: true,
              buttonText: 'Open Calendar',
              changeMonth: true,
              changeYear: true,
              yearRange: '-100:+15',
              dateFormat: 'M d, yy',
           }
        );

        $(".timepicker").timepicker(
           {
              showOn: 'both',
              timeFormat: 'hh:mm TT',
              hourMin: hourMin,
              hourMax: hourMax,
              onSelect: function(d,i)
              {
                    var date = new Date(d);
                    var lastVal = new Date(i.lastVal);
                    if (!isNaN(lastVal.getHours()) )  // this is a complete kludge... only way I can find to tell if time was changed...
                    {                                 // if time slider changed, it messes up and doesn't set 'i' correctly resulting in NaN
                       date.setHours( 0 );
                       date.setMinutes( 0 );
                       $(this).datetimepicker('setDate', date );
//                     console.log("Time changed: " + date);
                    }
              }
           }
        );
     });
   }

   function dateInputTagUtcToLocal( utcTime, tagUid, format )
   {
//    console.log( utcTime + " " + tagUid + " " + format );
      localTime = utcToLocal( utcTime, format );
      var roContainer = document.getElementById( tagUid+"RO" );
      roContainer.innerHTML = localTime;
      var inputElement = document.getElementById( tagUid );
      inputElement.value = localTime;
   }
