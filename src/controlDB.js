var db
var sl
var lang

function getJSON(link) {
    return new Promise(function (resolve, reject) {
        var xmlhttp = new XMLHttpRequest()

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText))
            }
        };
        xmlhttp.open("GET", link, true)
        xmlhttp.send()
    })
}

function initLanguage() {
    return new Promise(function (resolve, reject) {
        var navlang = navigator.language
        var langsetting = localStorage.getItem('setting_language')
    
        if(!langsetting) {
            switch(navlang) {
                case 'ko':
                case 'ko-KR':
                    sl = 'kor'
                    localStorage.setItem('setting_language', sl)
                    break
                default:
                    sl = 'eng'
            }
        } else {
            sl = langsetting
        }

        getJSON('/src/lang/' + sl + '.json').then((json) => {
            lang = json
            resolve()
        })
    })
}

function initLocalStorage() {
    for (i in init_settings) {
        if (!localStorage.getItem(i)) {
            localStorage.setItem(i, init_settings[i])
        }
    }
}

function initDB() {
    return new Promise(function (resolve, reject) {
        if (!indexedDB) {
            alert(lang.FAIL_IDB)
            resolve('destroy')
        }
        
        var request = indexedDB.open('FroggyMemo')
        
        request.onerror = function(event) {
            alert(lang.FAIL_PERM)
            resolve('destroy')
        }
        
        request.onsuccess = function(event) {
            db = request.result
            resolve('continue')
        }
        
        request.onupgradeneeded = function(event) {
            alert(lang.DB_OUGN)
            
            var db = event.target.result
            var objectStore = db.createObjectStore('memodata', {keyPath: 'id'})
                
            for (var i in init_memodata[sl]) {
                objectStore.add(init_memodata[sl][i])
            }
        }
    })
}

function resetAll() {
    return new Promise(function (resolve, reject) {
        indexedDB.deleteDatabase('FroggyMemo')
        localStorage.clear()
        resolve()
    })
}


function dbControlRead(store) {
    return new Promise(function (resolve, reject) {
        var tempitems = []
        var request = db.transaction(store).objectStore(store).openCursor()

        request.onsuccess = function(event) {
            var cursor = event.target.result
            if (cursor) {
                tempitems.push({id: cursor.key, title: cursor.value.title, text: cursor.value.text, time: cursor.value.time})
                cursor.continue()
            } else {
                resolve(tempitems)
            }
        }
    })
}

function dbControlAdd(store, item) {
    return new Promise(function (resolve, reject) {
        var request = db.transaction([store], 'readwrite').objectStore(store).add(item)

        request.onsuccess = function(event) {
            resolve()
        }
    })
}

function dbControlEdit(store, item) {
    return new Promise(function (resolve, reject) {
        var request = db.transaction([store], 'readwrite').objectStore(store).put(item)
        
        request.onsuccess = function(event) {
            resolve()
        }
    })
}

function dbControlDelete(store, id) {
    return new Promise(function (resolve, reject) {
        var request = db.transaction([store], 'readwrite').objectStore(store).delete(id)

        request.onsuccess = function(event) {
            resolve()
        }    
    })
}
