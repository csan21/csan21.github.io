/* global postRobot */ // tell eslint that postRobot is globally defined
/* global Cookies */ // tell eslint that Cookies is globally defined
// console.log('[DEBUG] loading storedDataManager.js')
console.log('[DEBUG] postRobot loaded: ', postRobot);

function writeSSO(db, val) {
    var dbtrans = db.transaction(['ssotoken'], 'readwrite');
    var store = dbtrans.objectStore('ssotoken');
    var token = { token: val, timestamp: Date.now() };

    dbtrans.oncomplete = function() {
        var request = store.add(token);

        request.onsuccess = function() {
            console.log('sso token written to idb store');
        };
    };

    dbtrans.onerror = function(event) {
        console.log('error writing sso in the sso store =' + event.target.errorCode);
    };
}

function readSSO(db) {
    var dbtrans = db.transaction(['ssotoken']);
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
        // uncomment below to write the sso token to indexedDB
        writeSSO(db, 'foo-bar-1234');
        // uncomment below to read the sso token to indexedDB
        readSSO(db);
    };
}

createIDB();



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
        console.log('[DEBUG] postRobot.getData');
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
$button.setAttribute('id', 'mybutton');
$button.innerHTML = 'create idb';
document.body.appendChild($button);
// document.getElementById('mybutton').addEventListener('click', createIDB);

// createIDB();



