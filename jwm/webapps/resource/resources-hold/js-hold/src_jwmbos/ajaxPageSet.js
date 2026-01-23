   function pageSetPrev( selectPrev, tagUid )
   {
      document.getElementById('page'+tagUid).value=selectPrev;
      document.getElementById('section_refresh'+tagUid).click();
   }

   function pageSetNext( selectNext, tagUid )
   {
      var aForm = document.getElementById( "form"+tagUid );
      if ( aForm != null )
      {
         setTagParm( 'override', "false", tagUid, true );     // onboarding admins can override missing requirements to move to next page in wizard

         if (( document.getElementById("override") != null )
           && ( document.getElementById("override").checked == true ) )
         {
            setTagParm( 'override', "true", tagUid, true );
         }
         else
         {
            errCount = 0;  // reset count
            validatePageSetPage(aForm);
            if (errCount > 0 ) return( false );
         }
      }
      document.getElementById('page'+tagUid).value=selectNext;
      document.getElementById('section_refresh'+tagUid).click();
   }

   function selectPage( pageNum, tagUid )
   {
      document.getElementById('page'+tagUid).value=pageNum;
      document.getElementById('section_refresh'+tagUid).click();
   }

   function confirmOnly( aName )
   {
      doValidate( null, aName );
      if (errCount > 0 )
      {
         createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
      }
   }


   function validatePageSetPage( aForm )
   {

      errCount = 0;  // reset count
      console.log( "aForm.name: " + aForm.name );

      // Signup Wizard ==============================================================================================

      if ( aForm.name == "SubscribeToRegion" )
      {
         var region = $("input[type='radio'][name='regionSelection']:checked").val();
         var theRegion = $("input[type='radio'][name='regionSelection']:checked").attr( "reference");
         if ( !isNaN( region ) )
         {

            if ( confirm( "You have selected to drive in the " + theRegion + " region.  By confirming below you are confirming that are able to drive and accept trips in the " + theRegion + " region as defined on the map.  Selecting " + theRegion + " does  NOT permit you to accept trips in any other region other than " + theRegion + ".  Background check fees and onboarding fees will not be refunded if you are unable or unwilling to drive in " + theRegion + ".\n\nI confirm and acknowledge that I am able and willing to drive for Wridz in " + theRegion + ":"))
            {
               return; // numeric region id... ok
            }
            else
            {
               errCount = 1;
               createAlert( 3, "", "You must confirm that you are willing and able to drive in " + theRegion + " to continue" );
            }
         }
         else
         {
            errCount = 1;
            createAlert( 3, "", "You must select a primary region to continue ["+region+"] ["+theRegion+"]" );
         }
      }

      if ( aForm.name == "BackgroundCheck" )
      {
         if ( getValueByName( "backgroundCheckStatus" ) == "Clear" ) return;

         errCount = 1;
         if ( getValueByName( "backgroundCheckStatus" ) == "Not Started" )
         {
            createAlert( 3, "", "Please click the button below to begin your background check process." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Pending" )
         {
            createAlert( 3, "", "Your background check application is not complete. You should have received an email from our background check company when you began the background check process.  That email contains a link that may be used to complete the application." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Application Completed, Awaiting Results" )
         {
            createAlert( 3, "", "Your background check is currently in progress.  You will receive an email from our background check company and an email from Wridz notifying you that you may return to the driver signup process and proceed." );
         }
         else
         {
            createAlert( 3, "", "There seems to be an issue with your background check results.  Please review emails from our background check company. But DO NOT contact our background check company.  You may open a ticket with Wridz using the Contact Us form on the menu above to discuss the results." );
         }
      }

      if ( aForm.name == "BackgroundCheckCheckr" )
      {
         if ( getValueByName( "backgroundCheckStatus" ) == "Clear" ) return;
         if ( getValueByName( "backgroundCheckStatus" ) == "Clear (With Documentation)" ) return;

         errCount = 1;
         if ( getValueByName( "backgroundCheckStatus" ) == "Not Started" )
         {
            createAlert( 3, "", "Please click the button below to begin your background check process." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Pending" )
         {
            createAlert( 3, "", "Your background check application is not complete. You should have received an email from Checkr when you began the background check process.  That email contains a link that may be used to complete the application." );
         }
         else if ( getValueByName( "backgroundCheckStatus" ) == "Application Completed, Awaiting Results" )
         {
            createAlert( 3, "", "Your background check is currently in progress.  You will receive an email from Checkr and an email from Wridz notifying you that you may return to the driver signup process and proceed." );
         }
         else
         {
            createAlert( 3, "", "There seems to be an issue with your background check results.  Please review emails from Checkr. You may discuss the results with Checkr."   );
         }
      }

      if ( aForm.name == "PersonalInfo" )
      {
         doValidate( aForm, "firstName"       );
         doValidate( aForm, "lastName"     );
         doValidate( aForm, "phone"     );
         doValidate( aForm, "birthDate"     );
         doValidate( aForm, "addressLine1"     );
         doValidate( aForm, "city"     );
         doValidate( aForm, "state"     );
         doValidate( aForm, "zip"     );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "UploadProfilePicture" )
      {
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "UploadDriversLicensePhoto" )
      {
         doValidate( aForm, "driverLicenseExpDate" );
         doValidate( aForm, "driversLicenseState" );
         doValidate( aForm, "driversLicenseNum" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
            return;
         }

         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "VehicleInfo" )
      {
         doValidateIfExist( "year"                  );
         doValidateIfExist( "make"                  );
         doValidateIfExist( "model"                 );
         doValidateIfExist( "vin"                   );
         doValidateIfExist( "color"                 );
         doValidateIfExist( "licenseplate"          );
         doValidateIfExist( "registrationExp");
         doValidateIfExist( "licenseplatestate"     );
         doValidateIfExist( "inspectionExp"  );

         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
            return;
         }

         aGalleryCountElement = getElementByName( "inspectionDocuments_galleryContainerCount" );
         if ( aGalleryCountElement != "" ) // doesn't exist... not required
         {
            if ( aGalleryCountElement.value == 0 )
            {
               errCount = 1;
               createAlert( 3, "", "You must upload at least one inspection report into the gallery to continue.  Click to upload files from the preview area to the gallery." );
               return;
            }
         }

         aGalleryCountElement = getElementByName( "registrationDocuments_galleryContainerCount" );
         if ( aGalleryCountElement != "" ) // doesn't exist... not required
         {
            if ( aGalleryCountElement.value == 0 )
            {
               errCount = 1;
               createAlert( 3, "", "You must upload at least one registration report into the gallery to continue.  Click to upload files from the preview area to the gallery." );
               return;
            }
         }
      }

      if ( aForm.name == "VehiclePreScreen" )
      {
         doValidate( aForm, "vehiclePreScreen0"     );
         doValidate( aForm, "vehiclePreScreen1"     );
         doValidate( aForm, "vehiclePreScreen2"     );
         doValidate( aForm, "vehiclePreScreen3"     );

         doValidateIfExist( "luxurySelection"       );
         doValidateIfExist( "evSelection"           );
         doValidateIfExist( "extraCargo"            );

         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "UploadVehiclePhoto" )
      {
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "UploadVehicleInsurancePhoto" )
      {
         doValidate( aForm, "vehicleInsuranceExpDate" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please enter a future expiration date to continue." );
            return;
         }

         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "PaymentProfiles" ) // must use this precise form name... required for other parts of the code for adding-credit-card validation
      {
         if ( getValueByName( aForm.name+"_"+"paymentProfileCount" ) > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must define at least one payment method (Credit Card or Debit Card) to continue" );
      }

      if ( aForm.name == "MerchantAccount" )
      {
         if ( getValueByName( "merchantAccountId" ).indexOf( "--" ) == -1 ) return;    // it will say something like "--not yet created--"
         if ( getValueByName( "canByPass" ) == "true" ) return;    // beta-testers

         errCount = 1;
         createAlert( 3, "", "You must create a deposit profile id using the button at the bottom of the page in order to continue." );
      }

      if ( aForm.name == "BESTPayee" )
      {
         console.log( getValueByName( "walletId" ) );
         if ( getValueByName( "walletId" ) != "" ) return;

         errCount = 1;
         createAlert( 3, "", "You must create a customer profile and create a wallet to continue" )
      }

      // TODO: Add form check for Stripe Driver Account Signup Status
      if ( aForm.name == "StripePayee" )
      {
         if ( getValueByName( aForm.name+"_"+"connectedAccountDetailsSubmitted" ) == "true" ) return;
         errCount = 1;
         createAlert( 3, "", "You must complete the Stripe Connect process to continue. Open the Stripe Link and finish onboarding before continuing." );
      }

      if ( aForm.name == "ScheduleOnboarding" )
      {
         if ( document.getElementById('appt').value < 1 )
         {
            errCount = 1;
            createAlert( 3, "", "Please click an onboarding event to continue.  Scroll down if events are not visible." );
            return( false );
         }
         else
         {
            createAlert( 1, "Your onboarding event has been scheduled.","Please review the information on the next page, and click the button to complete your signup process. When you have completed the signup process, you will receive an email confirming your appointment time and location." );
            return( true );
         }
      }

      // Driver Onboarding Wizard ==============================================================================================


      if ( aForm.name == "OnboardingDrugTest" ) confirmOnly( "confirmDrugTestStarted" );
      if ( aForm.name == "formVerifyRegion" )       confirmOnly( "verifyRegion" );

      if ( aForm.name == "onboardingProfilePhoto" )
      {
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a photo to continue" );
      }

      if ( aForm.name == "verifyPersonalInfo" )
      {
         doValidate( aForm, "personalInfoVerified" );
         doValidate( aForm, "firstName"       );
         doValidate( aForm, "lastName"     );
         doValidate( aForm, "phone"     );
         doValidate( aForm, "birthDate"     );
         doValidate( aForm, "addressLine1"     );
         doValidate( aForm, "city"     );
         doValidate( aForm, "state"     );
         doValidate( aForm, "zip"     );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "SelectDriversLicensePhoto" )
      {
         doValidate( null, "driverLicenseExpDate" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please enter a future expiration date to continue." );
            return;
         }
         doValidate( null, "passMinimumAge" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please verify that the driver is of minimum required age." );
            return;
         }
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a drivers license photo to continue" );
      }

      if ( aForm.name == "UploadDrugTestResultsPhoto" )
      {
         doValidate( null, "DrugTest1" );
         doValidate( null, "DrugTest2" );
         doValidate( null, "DrugTest3" );
         doValidate( null, "DrugTest4" );
         doValidate( null, "DrugTest5" );
         if (errCount > 0 )
         {
            return;
         }
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" )  > 0 ) return;
         errCount = 1;
         createAlert( 3, "", "You must upload at least one photo of the drug test into the gallery to continue.  Click to upload photos from the preview area to the gallery." );
      }

      if ( aForm.name == "UploadDashPlacardPhoto" )
      {
         console.log( aForm.name+"_"+"galleryContainerCount" );
         console.log( getValueByName( aForm.name+"_"+"galleryContainerCount" ) );
         if ( getValueByName( aForm.name+"_"+"galleryContainerCount" ) < 1 )
         {
            errCount = 1;
            createAlert( 3, "", "You must upload at least one photo of the placard and/or the placard box clearly showing the QR code and the unique placard id number." );
            return;
         }

         doValidate( null, "driverUID" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please ensure the driver placard id is entered." );
            return;
         }
      }

      if ( aForm.name == "onboardingKitCharge" )
      {
         var chargePaid = getElementByName( "onboardingFeePaid" );
         var primaryRegionOnboardingCharge = getElementByName( "primaryRegionOnboardingCharge" );

         if ( primaryRegionOnboardingCharge.value > 0 )
         {
            if ( chargePaid.value == "false" )
            {
               errCount = 1;
               createAlert( 3, "", "Payment must be successfully processed in order to continue." );
            }
         }
      }


      // Vehicle Onboarding Wizard ==============================================================================================

      if ( aForm.name == "VerifyVehicle" )
      {
         doValidate( null, "vehicleVerified" );
         if (errCount > 0 )
         {
            errCount = 1;
            createAlert( 3, "", "Please confirm that the vehicle information has been verified." );
         }
      }

      if ( aForm.name == "VerifyVehicleDetails" )
      {
		 doValidate( aForm, "vehicleDetailsVerified" );
         doValidate( aForm, "vehiclePreScreen0"     );
         doValidate( aForm, "vehiclePreScreen1"     );
         doValidate( aForm, "vehiclePreScreen2"     );
         doValidate( aForm, "vehiclePreScreen3"     );

         doValidateIfExist( "luxurySelection"       );
         doValidateIfExist( "evSelection"           );
         doValidateIfExist( "extraCargo"            );

         if (errCount > 0 )
         {
            createAlert( 3, "", "Please correct the " + errCount + " error(s) in the form to continue." );
         }
      }

      if ( aForm.name == "SelectVehiclePhoto" )
      {
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a photo to continue" );
      }

      if ( aForm.name == "SelectVehicleInsurancePhoto" )
      {
         doValidate( null, "vehicleInsuranceExpDate" );
         if (errCount > 0 )
         {
            createAlert( 3, "", "Please enter a future expiration date to continue." );
            return;
         }
         if ( getValueByName( aForm.name+"Selected" ) != "" ) return;
         errCount = 1;
         createAlert( 3, "", "You must select a vehicle insurance photo to continue" );
      }
   }

   function validatePreScreenQuestions()
   {
      for ( var i = 0; i < 20; i++ )
      {
         try
         {
            var preScreen = getSelectedRadioButtonValue( "PreScreen"+i );

            if ( preScreen == "1" ) // "yes" answer
            {
//             createAlert( 3, "", "Unfortunately, you do not qualify to become a Wridz driver." );
               return( confirm( "Your answer to one or more of these questions indicate that your background check results likely will not qualify you to drive for Wridz.\n\nContinue with the background check?" ));
            }
            else if ( preScreen == "2" ) // "no" answer
            {
            }
            else
            {
               createAlert( 3, "", "Please ensure all questions have been answered" );
               return( false );
            }
         }
         catch( err )
         {
            if ( i > 5 ) return( true ); // no guarantee how many... but we want to be sure we have processed a few as opposed to an error with no questions processed
            else
            {
               createAlert( 3, "", "System Error: No questions processed");
               return( false );
            }
         }
      }
      createAlert( 3, "", "prescreen pass");
      return( true );
   }
