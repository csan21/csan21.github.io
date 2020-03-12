/* global postRobot */ // tell eslint that postRobot is globally defined
/* global Cookies */ // tell eslint that Cookies is globally defined
// console.log('[DEBUG] loading storedDataManager.js')
console.log('[DEBUG] postRobot loaded: ', postRobot);

function writeSSO(db, val) {
    var dbtrans = db.transaction(['ssotoken'], 'readwrite');
    var store = dbtrans.objectStore('ssotoken');
    var token = { token: val, timestamp: Date.now() };

    var check = store.openCursor(1);

    check.onsuccess = function(event) {
        var exists = event.target.result;
        if (!exists) {
            store.add(token);
            console.log('sso token added');
        } else {
            console.log('sso token value exists');
        }
    };

    dbtrans.oncomplete = function() {
        console.log('write transaction complete')
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
t
// createIDB();

console.log('stored data manger adding button');
let $button = document.createElement("BUTTON");
$button.setAttribute('id', 'mybutton');
$button.innerHTML = 'create idb';
document.body.appendChild($button);
document.getElementById('mybutton').addEventListener('click', createIDB);



