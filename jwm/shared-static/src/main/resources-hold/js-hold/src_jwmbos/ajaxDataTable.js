   function initDataTable( tableId, dbTable, dbCol )
   {
     $(document).ready(function()
     {
        var tableElement = document.getElementById( tableId );
        if ( tableElement != null )
        {
           var table = $('#'+tableId ).DataTable(
                                                {
                                                  "paging"   :  false,
                                                  "info"     :  false,
                                                  "autoWidth":  false,
                                                  "searching":  false
                                                });

           new $.fn.dataTable.RowReorder( table, {
                                                   selector: 'tr'
                                                 } );

           table.on( 'row-reorder', function ( e, diff, edit )
           {
               var movesArray = [];
               for ( var i=0, ien=diff.length ; i<ien ; i++ )
               {
                  movesArray.push({
                     "fromPosition"        : diff[i].oldPosition,
                     "toPosition"          : diff[i].newPosition,
                     "instanceId"          : diff[i].node.attributes["instanceId"].value
                  });
               }
               var json = {};
               json.moves = movesArray;
               var serverCall = "/cis/jsp/ajax/ajaxCustomTagUpdate.jsp"
                               +"?table="+dbTable
                               +"&col="+dbCol
                               +"&moves="+encodeURIComponent(JSON.stringify(json))
                               +"&objectClassID=242"  // ObjectClassID.INPUTTAGUPDATEPROCESSOR
                               +"&reqUid="+generateReqUid();

               var ajaxRequest = getAjaxRequestObject();

               ajaxRequest.onreadystatechange = function()
                                                {
                                                   if(ajaxRequest.readyState == 4)
                                                   {
                                                      handleAjaxRC( ajaxRequest );
                                                   }
                                                }
               ajaxRequest.open("GET", serverCall, true);
               ajaxRequest.send(null);
            });
        }
     });
   }
