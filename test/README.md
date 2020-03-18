# ShopRunner & ApplePay

## Overview

The Applepay experience acts as a replacement to our Express Checkout in Safari and is gated behind this check
in `src/checkout/applePay.js:`
```javascript
if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
	blahblahblah
}
```

`ApplePaySession`
- Object is native code to Safari and by default has 3 type methods available by default. The methods return booleans and are used for detection.

    `supportsVersion`
    - Detects whether a web browser supports a particular Apple Pay version.

    `canMakePayments`
    - Indicates whether the device supports Apple Pay.

    `canMakePaymentsWithActiveCard`
    - Indicates whether the device supports Apple Pay and whether the user has an active card in Wallet.


There are event handlers and methods that are available ONLY to instances of ApplePaySession:

button action is created:

```javascript
const setSession = (s) => {
    session = s;
    if (session) {
        session.oncancel = onApplePayCancel;
        session.onpaymentauthorized = onApplePayPaymentAuthorized;
        session.onshippingcontactselected = onApplePayShippingContactSelected;
        session.onshippingmethodselected = onApplePayShippingMethodSelected;
        session.onvalidatemerchant = onApplePayValidateMerchant;
    }
};

sr_$.applePayButtonClicked = () => {
    trackPage({ page: 'srw_applepay_startCheckout' });
    resetCart();
    setSession(new ApplePaySession(1, applePayCart));
    session.begin();
};
```

instance methods and event handlers are now available

`begin`
- When this method is called, the payment sheet is presented and the merchant validation process is initiated.

kicked off here:
```javascript
sr_$.srDivs.applePayCartDiv = function applePayCartDiv(apDiv) {
        return {
        ...apDiv,
        id: false,
        oclass: '',
        html: '<div id = "sr-apple-pay" class="sr-apple-pay"><div id = "sr-apple-pay-button" class="sr-apple-pay-button visible" onclick="sr_$.applePayButtonClicked()"></div></div>',
        onload: () => {
            sr_$.jQ('[name=sr_expressCheckoutCartDiv]').prepend('<span class="sr_orButton">- Or -</span>');
        },
    };
};
```

Defined above are the event handlers for the ApplePay checkout at points where we need to do some backend calls to SR / Retailer
```javascript
session.oncancel = onApplePayCancel;
session.onpaymentauthorized = onApplePayPaymentAuthorized;
session.onshippingcontactselected = onApplePayShippingContactSelected;
session.onshippingmethodselected = onApplePayShippingMethodSelected;
session.onvalidatemerchant = onApplePayValidateMerchant;
```

`oncancel`
- An event handler that is automatically called when the payment UI is dismissed.

`onpaymentauthorized`
- An event handler that is called when the user has authorized the Apple Pay payment with Touch ID, Face ID, or passcode.

`onshippingcontactselected`
- An event handler that is called when a shipping contact is selected in the payment sheet.

`onshippingmethodselected`
- An event handler that is called when a shipping method is selected.

`onvalidatemerchant`
- An event handler that is called when the payment sheet is displayed.

