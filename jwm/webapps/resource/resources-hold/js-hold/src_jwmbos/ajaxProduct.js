  function newProductListingValidate(form)
  {
     errCount = 0;  // reset count

     doValidate( form, "manufacturer" );
     doValidate( form, "serialNumber" );
     doValidate( form, "model"        );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     return(true);
  }

  function productFormValidate(form)
  {
     errCount = 0;  // reset count

     doValidate( form, "productDescription" );

     if ( errCount > 0 )
     {
        alert( "Please correct the " + errCount + " error(s) in the form" );
        return(false);
     }
     updateDocumentElement( form, "productStatus", 3 ); // chg status to "Pending Approval"
     return(true);
  }

  function searchByProductCategory( categoryId, name, resultsSectionName )
  {
     var resultsTagUid = getTagUidFromName( resultsSectionName );
     setTagParm( "categoryId", categoryId, resultsTagUid, true );

     forcePage1( resultsTagUid );

     document.getElementById( 'section_title'+resultsTagUid ).innerHTML = "<h3>"+name+"</h3>";
     document.getElementById( 'search'+resultsTagUid ).value = ""; // need to clear out search; otherwise it will override category selection
     document.getElementById( 'section_refresh'+resultsTagUid ).click();
  }

  function selectNewProductItem( pItemId )
  {
     console.log( "select new ProductItem: " + pItemId );
     var storeFrontProductItemBlock = getTagUidFromName( "storeFrontProductItem" );
     setTagParm( "id", pItemId, storeFrontProductItemBlock, true );
     document.getElementById( 'section_refresh'+storeFrontProductItemBlock ).click();
  }

  function selectNewProductItemFromSecondary()
  {
     var secondaryVarSelectBlock = getTagUidFromName( "secondaryVarSelect" );
     var selectElement = document.getElementById(secondaryVarSelectBlock);
     selectNewProductItem( selectElement.options[ selectElement.selectedIndex ].value);
  }
