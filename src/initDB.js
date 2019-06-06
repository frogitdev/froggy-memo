var db

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
            alert('앱 구성 실패: 브라우저가 IndexedDB를 지원하지 않습니다.\n최신 브라우저에서 사용해 주십시오.')
            resolve('destroy')
        }
        
        var request = indexedDB.open('FroggyMemo')
        
        request.onerror = function(event) {
            alert('앱 구성 실패: 사이트 데이터 접근 권한이 없습니다.')
            resolve('destroy')
        }
        
        request.onsuccess = function(event) {
            db = request.result
            resolve('continue')
        }
        
        request.onupgradeneeded = function(event) {
            alert('첫 시작을 환영합니다. 사용자님의 메모 데이터베이스가 생성되었습니다.\n경고: 브라우저 설정에서 웹사이트 데이터를 삭제하지 마십시오! 메모 데이터가 손실될 수 있습니다.')
            
            var db = event.target.result
            var objectStore = db.createObjectStore('memodata', {keyPath: 'id'})
                
            for (var i in init_memodata) {
                objectStore.add(init_memodata[i])
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
