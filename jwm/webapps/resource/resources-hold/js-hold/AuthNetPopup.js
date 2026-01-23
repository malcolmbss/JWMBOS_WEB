/* Usage:

<script type="text/javascript" src="contentx/popup.js"></script>

<script type="text/javascript">
//<![CDATA[

// Uncomment this line if eCheck is enabled. This does not affect functionality, only the initial sizing of the popup page for add payment.
//AuthorizeNetPopup.options.eCheckEnabled = true;

// Uncomment these lines to define a function that will be called when the popup is closed.
// For example, you may want to refresh your page and/or call the GetCustomerProfile API method from your server.
//AuthorizeNetPopup.options.onPopupClosed = function() {
//      your code here.
//};

// Uncomment this line if you do not have absolutely positioned elements on your page that can obstruct the view of the popup.
// This can speed up the processing of the page slightly.
//AuthorizeNetPopup.options.skipZIndexCheck = true;

// Uncomment this line to use test.authorize.net instead of secure.authorize.net.
//AuthorizeNetPopup.options.useTestEnvironment = true;

//]]>


</script>

*/

var authNetTagUid = "--";

(function () {
        if (!window.AuthorizeNetPopup) window.AuthorizeNetPopup = {};
        if (!AuthorizeNetPopup.options) AuthorizeNetPopup.options = {
                onPopupClosed: null
                ,eCheckEnabled: false
                ,skipZIndexCheck: false
                ,useTestEnvironment: false
        };
        AuthorizeNetPopup.closePopup = function() {
                document.getElementById("divAuthorizeNetPopupScreen").style.display = "none";
                document.getElementById("divAuthorizeNetPopup").style.display = "none";
                document.getElementById("iframeAuthorizeNet").src = "/payment/jsp/guest/AuthNetEmpty.jsp";
                if (AuthorizeNetPopup.options.onPopupClosed) AuthorizeNetPopup.options.onPopupClosed();
        };
        AuthorizeNetPopup.openManagePopup = function() {
                openSpecificPopup({action:"manage"});
        };
        AuthorizeNetPopup.openAddPaymentPopup = function(aTagUid) {
                authNetTagUid = aTagUid;
                openSpecificPopup({action:"addPayment", paymentProfileId:"new"});
        };
        AuthorizeNetPopup.openEditPaymentPopup = function(paymentProfileId, aTagUid) {
                authNetTagUid = aTagUid;
                openSpecificPopup({action:"editPayment", paymentProfileId:paymentProfileId});
        };
        AuthorizeNetPopup.openPaymentPopup = function(aTagUid, anAccountId) {
                authNetTagUid = aTagUid;
                accountId = anAccountId;
                openSpecificPopup({action:"payment"});
        };
        AuthorizeNetPopup.openAddShippingPopup = function() {
                openSpecificPopup({action:"addShipping", shippingAddressId:"new"});
        };
        AuthorizeNetPopup.openEditShippingPopup = function(shippingAddressId) {
                openSpecificPopup({action:"editShipping", shippingAddressId:shippingAddressId});
        };
        AuthorizeNetPopup.onReceiveCommunication = function (querystr) {
                console.log( "AuthNetPopup onReceiveCommunication("+querystr+")" );
                var params = parseQueryString(querystr);
                switch(params["action"]) {
                        case "successfulSave":
                                console.log( "AuthNetPopup successfulSave" );
                                AuthorizeNetPopup.closePopup();
                                console.log( "Refreshing: " + authNetTagUid );
                                document.getElementById( 'section_refresh'+authNetTagUid ).click();
                                break;
                        case "cancel":
                                console.log( "AuthNetPopup cancel" );
                                AuthorizeNetPopup.closePopup();
                                break;
                        case "resizeWindow":
                                console.log( "AuthNetPopup resizeWindow" );
                                var w = parseInt(params["width"]);
                                var h = parseInt(params["height"]);

                                var ifrm = document.getElementById("iframeAuthorizeNet");
                                ifrm.style.width = w.toString() + "px";
                                ifrm.style.height = h.toString() + "px";

                                var popupDiv = document.getElementById("divAuthorizeNetPopup");
                                popupDiv.style.width = (w+10).toString() + "px";
                                popupDiv.style.height = (h+10).toString() + "px";

                              //centerPopup();
                                adjustPopupScreen();
                                break;
                        case "transactResponse":
                                console.log( "AuthNetPopup transactResponse" );
                                document.getElementById( "acceptHostedResponse" ).value = params["response"];
                                var form = document.forms["formAuthorizeNetPopup"];
                                form.action = "/pay";
                                form.target = "";
                                form.submit();
                                break;

// AuthNetPopup onReceiveCommunication(action=transactResponse&response={"accountType":"MasterCard","accountNumber":"XXXX4010","transId":"20378653175","authorization":"525201","billTo":{"firstName":"Jerry","lastName":"Malcolm","address":"13016 Scofield Farms","city":"Austin","state":"Tx","zip":"78727"},"shipTo":{},"totalAmount":"1.00","dateTime":"1/23/2017 7:33:34 PM"})
                }
        };
        function openSpecificPopup(opt) {
                console.log( "openSpecificPopup("+opt+")" );
                var popup = document.getElementById("divAuthorizeNetPopup");
                var popupScreen = document.getElementById("divAuthorizeNetPopupScreen");
                var ifrm = document.getElementById("iframeAuthorizeNet");
                var form = document.forms["formAuthorizeNetPopup"];
                var env = "profile";

                switch (opt.action) {
                        case "addPayment":
                                ifrm.style.width = "435px";
                                ifrm.style.height = AuthorizeNetPopup.options.eCheckEnabled ? "520px" : "520px";
                                break;
                        case "editPayment":
                                ifrm.style.width = "435px";
                                ifrm.style.height = "479px";
                                break;
                        case "payment":
                                ifrm.style.width = "435px";
                                ifrm.style.height = "550px";
                                env = "payment";
                                break;
                        case "addShipping":
                                ifrm.style.width = "385px";
                                ifrm.style.height = "359px";
                                break;
                        case "editShipping":
                                ifrm.style.width = "385px";
                                ifrm.style.height = "359px";
                                break;
                        case "manage":
                                ifrm.style.width = "442px";
                                ifrm.style.height = "678px";
                                break;
                }

                if (!AuthorizeNetPopup.options.skipZIndexCheck)
                {
//                      var zIndexHightest = getHightestZIndex();
                        var zIndexHightest = 1;
                        popup.style.zIndex = zIndexHightest + 2;
                        popupScreen.style.zIndex = zIndexHightest + 1;
                }

                form.target="iframeAuthorizeNet";
//              if (AuthorizeNetPopup.options.useTestEnvironment)
//              {
//                      form.action = "https://test.authorize.net/"+env+"/" + opt.action;
//              }
//              else
//              {
                       form.action = "https://secure.authorize.net/"+env+"/" + opt.action;
//                     form.action = "https://accept.authorize.net/"+env+"/" + opt.action;

//              }
                if (form.elements["PaymentProfileId"]) form.elements["PaymentProfileId"].value = opt.paymentProfileId ? opt.paymentProfileId : "";
                if (form.elements["ShippingAddressId"]) form.elements["ShippingAddressId"].value = opt.shippingAddressId ? opt.shippingAddressId : "";
                form.submit();

                popup.style.display = "";
                popupScreen.style.display = "block";
                popupScreen.style.opacity = "0.5";
            //  centerPopup();
                adjustPopupScreen();
        };
        function centerPopup() {
                var d = document.getElementById("divAuthorizeNetPopup");
                d.style.left = "50%";
                d.style.top = "50%";
                var left = -Math.floor(d.clientWidth / 2);
                var top = -Math.floor(d.clientHeight / 2);
                d.style.marginLeft = left.toString() + "px";
                d.style.marginTop = top.toString() + "px";
                if (d.offsetLeft < 16) {
                        d.style.left = "16px";
                        d.style.marginLeft = "0px";
                }
                if (d.offsetTop < 16) {
                        d.style.top = "16px";
                        d.style.marginTop = "0px";
                }
        }
        function adjustPopupScreen() { // IE6 fix
                var popupScreen = document.getElementById("divAuthorizeNetPopupScreen");
                if (popupScreen.currentStyle && popupScreen.currentStyle.position == "absolute") {
                        if (popupScreen.clientHeight < document.documentElement.scrollHeight) {
                                popupScreen.style.height = document.documentElement.scrollHeight.toString() + "px";
                        }
                        if (popupScreen.clientWidth < document.documentElement.scrollWidth) {
                                popupScreen.style.width = document.documentElement.scrollWidth.toString() + "px";
                        }
                }
        }
        function getHightestZIndex() {
                var max = 0;
                var z = 0;
                var a = document.getElementsByTagName('*');
                for (var i = 0; i < a.length; i++) {
                        z = 0;
                        if (a[i].currentStyle) {
                                var style = a[i].currentStyle;
                                if (style.display != "none") {
                                        z = parseFloat(style.zIndex);
                                }
                        } else if (window.getComputedStyle) {
                                var style = window.getComputedStyle(a[i], null);
                                if (style.getPropertyValue("display") != "none") {
                                        z = parseFloat(style.getPropertyValue("z-index"));
                                }
                        }
                        if (!isNaN(z) && z > max) max = z;
                }
                return Math.ceil(max);
        }
        function parseQueryString(str) {
                var vars = [];
                var arr = str.split('&');
                var pair;
                for (var i = 0; i < arr.length; i++) {
                        pair = arr[i].split('=');
                        vars.push(pair[0]);
                        vars[pair[0]] = unescape(pair[1]);
                }
                return vars;
        }
} ());
