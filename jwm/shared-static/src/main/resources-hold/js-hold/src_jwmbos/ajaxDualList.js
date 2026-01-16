   // Dual list move function

   function ajaxMoveDualList( type, srcList, destList, fn, table, ownerType, ownerId, listItemType, containerId, tagUid )
   {
      var destListElement = document.getElementById( destList );
      var srcListElement  = document.getElementById( srcList );

      if ( srcListElement.selectedIndex == -1 ) return;

      // start new dest list
      newDestList = new Array( destListElement.options.length );
      var len = 0;

      // put curr dest items in dest list
      for( len = 0; len < destListElement.options.length; len++ )
      {
        if ( destListElement.options[ len ] != null )
        {
          newDestList[ len ] = new Option( destListElement.options[ len ].text, destListElement.options[ len ].value, destListElement.options[ len ].defaultSelected, destListElement.options[ len ].selected );
        }
      }

      var listItemIds = [];

      // put selected source items in dest list and complete serverCall string
      for( var i = 0; i < srcListElement.options.length; i++ )
      {
        if ( ( srcListElement.options[i] != null )
           &&(srcListElement.options[i].selected == true ) )
        {
           listItemIds.push( srcListElement.options[i].value );
           newDestList[ len ] = new Option( srcListElement.options[i].text, srcListElement.options[i].value, srcListElement.options[i].defaultSelected, srcListElement.options[i].selected );
           len++;
        }
      }

      // sort dest list
      newDestList.sort( compareOptionText );   // BY TEXT

      // re-populate dest list box
      for ( var j = 0; j < newDestList.length; j++ )
      {
        if ( newDestList[ j ] != null )
        {
          destListElement.options[ j ] = newDestList[ j ];
        }
      }

      // Remove selected items from source list box
      for( var i = srcListElement.options.length - 1; i >= 0; i-- )
      {
        if ( ( srcListElement.options[i] != null )
          && ( srcListElement.options[i].selected == true ) )
        {
           srcListElement.options[i]       = null;
        }
      }

      var url = "/cis/JWMBOS";
      var reqJson    = {
                          "table"       : table,
                          "user"        : getUserName(),
                          "type"        : type,
                          "fn"          : fn,
                          "ownerType"   : ownerType,
                          "ownerId"     : ownerId,
                          "listItemType": listItemType,
                          "listItemId"  : listItemIds
                       };

      xhrUpdate( "POST",
                 url,
                 reqJson,
                 tagUid,
                 containerId,
                 "",
                 "" );
   } // End of moveDualList()

   function compareOptionText(a, b)
   {
     if (a.text.toUpperCase() < b.text.toUpperCase() ) return( -1 );
     if (a.text.toUpperCase() > b.text.toUpperCase() ) return(  1 );
     return 0;
   }
