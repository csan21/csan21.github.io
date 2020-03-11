/* global postRobot */ // tell eslint that postRobot is globally defined
/* global Cookies */ // tell eslint that Cookies is globally defined
// console.log('[DEBUG] loading storedDataManager.js')
console.log('[DEBUG] postRobot loaded: ', postRobot);
// var localStorageEnabled = false;

// source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
// function storageAvailable(type) {
//     var storage;
//     var x;
//     try {
//         storage = window[type];
//         x = '__storage_test__';
//         storage.setItem(x, x);
//         storage.removeItem(x);
//         return true;
//     } catch (e) {
//         return e instanceof DOMException && (
//             // everything except Firefox
//             e.code === 22 ||
//             // Firefox
//             e.code === 1014 ||
//             // test name field too, because code might not be present
//             // everything except Firefox
//             e.name === 'QuotaExceededError' ||
//             // Firefox
//             e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//             // acknowledge QuotaExceededError only if there's something already stored
//             storage.length !== 0;
//     }
// }
//
// if (storageAvailable('localStorage')) {
//     localStorageEnabled = true;
// }
//
// function setCookie(name, value, attributes) {
//     Cookies.set(name, value, attributes);
// }
//
// function setLocalStorage(name, value) {
//     if (localStorageEnabled) {
//         localStorage.setItem(name, value);
//     }
// }
//
// function getCookie(name) {
//     return Cookies.get(name) || null;
// }
//
// function getLocalStorage(name) {
//     // if (localStorageEnabled) {
//         return localStorage.getItem(name);
//     // }
//
//     // return null;
// }
//
// function clearCookie(name) {
//     Cookies.remove(name);
// }
//
// function clearLocalStorage(name) {
//     if (localStorageEnabled) {
//         localStorage.removeItem(name);
//     }
// }
//
// function checkStorageThenCookie(name) {
//     console.log('[DEBUG] local storage value: ', getLocalStorage(name))
//     return getLocalStorage(name) // || getCookie(name);
// }

function writeSSO(db, val) {
    var dbtrans = db.transaction(['ssotoken'], 'readwrite');
    var store = dbtrans.objectStore('ssotoken');
    var token = { token: val, timestamp: Date.now() };

    store.add(token);

    dbtrans.oncomplete = function() {
        console.log('sso token written to idb store');
    };

    dbtrans.onerror = function(event) {
        console.log('error writting ssoEntry in the sso store =' + event.target.errorCode);
    };
}

function readSSO(db) {
    console.log('[readSSO]');
    var dbtrans = db.transaction(['ssotoken'], 'readwrite');
    var store = dbtrans.objectStore('ssotoken');
    var request = store.get(1);

    request.onsuccess = function(event) {
        var ssotoken = event.target.result;
        console.log('readSSO: ssotoken = ', ssotoken);
    };

    request.onerror = function(event) {
        console.log('error calling get to retrieve ssotoken =' + event.target.errorCode);
    };
}

function createIDB() {
    var db;

    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }

    var request = indexedDB.open('testDB', 1);

    request.onupgradeneeded = function(event) {
      db = event.target.result;
      db.createObjectStore('ssotoken', { autoIncrement: true })
    };

    request.onerror = function(event) {
        console.log('[child:createIDB] error = ', request.errorCode)
    };

    request.onsuccess = function(event) {
        db = event.target.result;
    };

}

postRobot.on('setData', function prSetData(event) {
    // var daysToExpire = event.data.daysToExpire || 3650; // default to 10yr, like sso cookie
    // var domain = event.data.domain || '.shoprunner.com'; // default to .shoprunner.com base domain
    //
    // if (event.data.name && event.data.value) {
    //     setCookie(event.data.name, event.data.value, {
    //         expires: daysToExpire,
    //         domain: domain,
    //     });
    //     setLocalStorage(event.data.name, event.data.value);
    //
    //     return {
    //         value: checkStorageThenCookie(event.data.name),
    //     };
    // }
    //
    // throw new Error('name and value are required in all setCookie calls');
});

postRobot.on('getData', function prGetData(event) {
    // if (event.data.name) {
    //     // if (event.data.cookieOnly) {
    //     //     return {
    //     //         value: getCookie(event.data.name),
    //     //     };
    //     // }
    //     console.log('[DEBUG]checking local storage in efodi.github.io storedData Manager: ', checkStorageThenCookie(event.data.name));
    //     return {
    //         value: checkStorageThenCookie(event.data.name),
    //     };
    // }
    //
    // throw new Error('name is required in all getCookie calls');
});

postRobot.on('clearData', function prClearData(event) {
    // if (event.data.name) {
    //     clearCookie(event.data.name);
    //     clearLocalStorage(event.data.name);
    //     return {
    //         value: checkStorageThenCookie(event.data.name),
    //     };
    // }
    //
    // throw new Error('name is required in all clearCookie calls');
});


console.log('stored data manger adding button');
let $button = document.createElement("BUTTON");
// $button.onClick = requestAccess;
$button.setAttribute('id', 'mybutton');
$button.innerHTML = 'request dat access!';
document.body.appendChild($button);
document.getElementById('mybutton').addEventListener('click', createIDB);



