console.log('[IDB]');

function writeSSO(db, val) {
    var dbtrans = db.transaction(['ssotoken'], 'readwrite');
    var store = dbtrans.objectStore('ssotoken');
    var token = { token: val, timestamp: Date.now() };

    var check = store.openCursor(1);

    check.onsuccess = function(event) {
        var exists = check.result;

        if (!exists) {
            store.add(token);
            console.log('[IDB] sso token added');
        } else {
            console.log('[IDB] sso token value exists, no write necessary');
        }
    };

    dbtrans.oncomplete = function() {
        console.log('[IDB] write transaction complete')
    };

    dbtrans.onerror = function(event) {
        console.log('[IDB] error writing sso in the sso store =' + dbtrans.errorCode);
    };
}

function readSSO(db) {
    var dbtrans = db.transaction(['ssotoken']);
    var store = dbtrans.objectStore('ssotoken');
    var request = store.get(1);

    request.onsuccess = function(event) {
        var ssotoken = request.result;
        console.log('[IDB] readSSO: ssotoken = ', ssotoken.token);

        postRobot.on('read', function(event) {
            return {
                id: 1,
                token: ssotoken.token,
            };
        });
    };

    request.onerror = function(event) {
        console.log('[IDB] error calling get to retrieve ssotoken =' + request.errorCode);
    };
}

function createIDB() {
    var db;

    if (!('indexedDB' in window)) {
        console.log('[IDB] This browser doesn\'t support IndexedDB');
        return;
    }

    var request = indexedDB.open('testDB', 1);

    request.onupgradeneeded = function(event) {
        db = request.result;
        db.createObjectStore('ssotoken', { autoIncrement: true })
    };

    request.onerror = function(event) {
        console.log('[IDB] [child:createIDB] error = ', request.errorCode)
    };

    request.onsuccess = function(event) {
        db = request.result;
        // uncomment below to write the sso token to indexedDB
        writeSSO(db, 'foo-bar-1234');
        // uncomment below to read the sso token to indexedDB
        readSSO(db);

        console.log(db);
    };
}

createIDB();
