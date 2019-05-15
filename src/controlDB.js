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
