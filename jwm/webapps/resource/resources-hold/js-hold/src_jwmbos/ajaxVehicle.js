   function addVehicle( tagUid, ownerType, ownerId  )
   {
      if (document.getElementById( "enableAdd"+tagUid ).value == 'false' )
      {
         alert( 'Only one vehicle can be in the "Pending" state.  Please complete the registration process for that vehicle before adding another vehicle.' );
         return;
      }
      var restData = {};
      var xhrData = {};
      xhrData[ "containerId"         ] =  "";
      xhrData[ "refreshSectionIds"   ] =  tagUid;
      xhrData[ "callbackFn"          ] =  "";
      xhrData[ "callbackParameters"  ] =  "";

      restData[ "method"             ] =  "PUT";
      restData[ "dataObj"            ] =  "Vehicle";
      restData[ "identifier"         ] =  "AddVehicle";
      restData[ "locatorId"          ] =  ownerId;
      restData[ "locatorType"        ] =  ownerType;
      restData[ "locatorRelationship"] =  "owner";
      restData[  "locatorRecordType"         ] =  0
      restData[ "dataReq"            ] =  "*Basic2,*VehicleBasic";
      restData[ "reqJson"            ] =  {}
      restData[ "xhrData"            ] =  xhrData;

      xhrREST( restData );
   }
