   function updateCouponDiscountType( tagUid )
   {
      var discountType = document.getElementById(tagUid);
      console.log( "Discount Type: " + discountType.value );

      percentDiscountElement = document.getElementsByName( "DiscountPercent" )[0];
      amountDiscountElement  = document.getElementsByName( "DiscountAmount" )[0];

      if ( discountType.value == 1 )
      {
         percentDiscountElement.style.display = "block";
         amountDiscountElement.style.display = "none";
      }
      else
      {
         percentDiscountElement.style.display = "none";
         amountDiscountElement.style.display = "block";
      }
   }
