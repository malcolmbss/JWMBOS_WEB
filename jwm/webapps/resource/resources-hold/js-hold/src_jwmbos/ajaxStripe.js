var elements;
var stripe;

   async function submitStripeForm(clientSecret, hostName ) {
     try {
       const validateResult = await elements.submit();
       if (validateResult.error) {
         // Show error message
         alert( validateResult.error );
         console.log("ERROR: ", validateResult.error);
       }

       const submitResult = await stripe.confirmSetup({
         elements,
         clientSecret,
         confirmParams: {
           return_url: hostName+"/DriverSignUp",
         },
         redirect: "always",
       });

       if (submitResult.error) {
         throw submitResult.error;
       }

       return true;
     } catch (error) {
       // How should this be handled?
       alert( "Error:\n\nType: "+error.type + "\n\nCode: " + error.code + "\n\nReference: " + error.doc_url );
       return false;
     }
   }

   async function mountStripeElements(clientSecret, publicKey) {
     try {
       stripe = Stripe(publicKey);
       const appearance = {
         theme: "stripe",
       };
       const paymentOptions = {
         business: {
           name: "Wridz",
         },
         defaultValues: {
           billingDetails: {
             name: "",
           },
         },
         fields: {
           billingDetails: "auto",
         },
       };
       const addressOptions = {
         mode: "billing",
       };
       elements = stripe.elements({
         clientSecret: clientSecret,
         appearance,
       });
       const paymentElement = elements.create("payment", paymentOptions);
       const addressElement = elements.create("address", addressOptions);

       paymentElement.mount("#stripePaymentElement");
       addressElement.mount("#stripeAddressElement");

       return true;
     } catch (error) {
       // How should this be handled?
       alert(error);
       return false;
     }
   }
