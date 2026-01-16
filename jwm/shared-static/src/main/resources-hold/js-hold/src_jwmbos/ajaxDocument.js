
  function getElementFromForm( aForm, aName )
  {
     var elements = aForm.elements;
     for (i=0; i<elements.length; i++)
     {
//      console.log( "Name: " + aName + " " + elements[i].name );
        if ( elements[i].name == aName ) return( elements[i] );
     }
     console.warn( "Element with name: " + aName + " was not found in form: " + aForm.name );
     return(null);
  }

  function doValidateIfVisible( aForm, aName, aWrapper )
  {
//   console.log( 'doValidateIfVisible( '+ aForm + ' ' + aName + ' ' + aWrapper + ')' );
     var aWrapperElement        = document.getElementById( aWrapper );
     if ( aWrapperElement == null )
     {
//      console.log( "doValidateIfVisible() - wrapper id: " + aWrapper + " was not found" );
        return(1);
     }
     if (aWrapperElement.style.display == 'none' )
     {
//      console.log( "      " + aWrapper + " is not visible" );
        return(0);
     }
//   console.log(  "      " + aWrapper + " is visible" );
     return( doValidate( aForm, aName ));
  }

  function doValidateIfExist( aName )
  {
     anElement = getElementByName( aName );
     if ( anElement == "" ) return( 0 );  // not an error if element doesn't exist
     return( doValidate( null, aName ));
  }

  function doValidate( aForm, aName )
  {
//   console.log( 'doValidate( '+ aForm + ' ' + aName + ' )' );
     var anElement = null;
     if ( aForm == null )
     {
       try
       {
          anElement = getElementByName( aName );
          if ( anElement == "" )
          {
             console.warn( "Element with name: " + aName + " was not found (form not specified)." );
          errCount++;
             return( 1 );
          }
       }
       catch( e )
       {
          console.warn( "Element with name: " + aName + " was not found (form not specified)." );
          errCount++;
          return( 1 );
       }
     }
     else
     {
        anElement    = getElementFromForm( aForm, aName );
     }
     if ( anElement == null ) return( 1 );

//   console.log( anElement.id );
     var event = new Event('change'); // trigger an 'onChange' to force validation call
//   console.log( " --- Error Count: " + errCount);
     if ( anElement.dispatchEvent(event) == true) return( 0 );
     return( 1 );
  }

  function updateDocumentElement( aForm, aName, aValue )
  {
//   console.log( 'updateDocumentElement( '+ aForm + ' ' + aName + " = " + aValue + ' )' );
     var anElement    = getElementFromForm( aForm, aName );
     if ( anElement == null ) return(false);

//   console.log( anElement.id );
     anElement.value = aValue;

     var event = new Event('change'); // trigger an 'onChange'
     if ( anElement.dispatchEvent(event) == true)
     {
        return( true );
     }
     console.error( "updateDocumentElement error." );
     return( false );
  }

  function getValue( aForm, aName )
  {
     var anElement    = getElementFromForm( aForm, aName );
     if ( anElement == null ) return( 0 );

     var aValue = "0";

     if ( anElement.type == "checkbox" )
     {
        if ( anElement.checked )  aValue = anElement.value;
//      console.log( aName + " = " + aValue );
        return( aValue );
     }
     if ( anElement.type == "radio" )
     {
        var elements = document.getElementsByName( aName );
        for ( var i = 0; i < elements.length; i++ )
        {
//         console.log( elements[i].id + " " + elements[i].value + " " + elements[i].checked );
           if ( elements[i].checked )
           {
//            console.log( "true" );
              return( elements[i].value );
           }
        }
        return( 0 );
     }
//   console.log( aName + " = [" + anElement.value + "] " + anElement.id + " " + anElement.name );
     return( anElement.value );
  }

  function setCurrencyValue( aForm, aName, aValue )
  {
     setValue( aForm, aName, parseFloat(Math.round(aValue * 100) / 100).toFixed(2) );
  }

  function setValue( aForm, aName, aValue )
  {
//   console.log( 'setValue( ' + aName + ': ' + aValue +' )' );

     var anElement    = getElementFromForm( aForm, aName );
     if ( anElement == null ) return( null );
     if ( anElement.tagName == "SPAN" )
     {
        anElement.innerHTML = aValue;
     }
     else
     {
        anElement.value = aValue;
     }
     return( true );
  }

  function setROValue( aForm, aName, aValue )
  {
//   console.log( 'setROValue( ' + aName + ': ' + aValue +' )' );

     var anElement    = getElementFromForm( aForm, aName );   // this is the RW element
     if ( anElement == null ) return( null );

     // can't use names on span tags... got to locate using the id of the input tag
     roElement = document.getElementById( "RO_Content"+anElement.id );  // input tag id is the base tagUid
     if ( roElement != null )
     {
        roElement.innerHTML = aValue;
     }
     else
     {
        console.error( "** Element with id: " + "RO_Content"+anElement.id + " not found." );
     }
     return( true );
  }
