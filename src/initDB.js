var db

function initDB() {
    return new Promise(function (resolve, reject) {
        if (!window.indexedDB) {
            window.alert('메모 저장 기능을 사용할 수 없습니다. 브라우저가 IndexedDB를 지원하지 않습니다.')
        }
        
        var request = window.indexedDB.open('FroggyMemo')
        
        request.onerror = function(event) {
            alert('메모 저장 기능을 사용할 수 없습니다. IndexedDB 접근 권한이 없습니다.')
        }
        
        request.onsuccess = function(event) {
            db = request.result
            resolve()
        }
        
        request.onupgradeneeded = function(event) {
            alert('첫 시작을 환영합니다. 사용자님의 메모 데이터베이스가 생성되었습니다.\n주의: 브라우저가 시크릿(사생활 보호) 모드일 경우 메모가 저장되지 않습니다.\n경고: 브라우저 설정에서 웹사이트 데이터를 삭제하지 마십시오! 메모 데이터가 손실될 수 있습니다.')
            
            var db = event.target.result
            var objectStore = db.createObjectStore('memodata', {keyPath: 'id'})
        
            const init_memodata = [{id:0, title:'', text:'TIP - 상단의 입력 상자를 이용해 메모를 생성하세요.\n메모 위에 마우스를 올려 수정 또는 삭제할 수 있습니다.', time:new Date(2019, 0, 1, 0, 0, 0)}]
        
            for (var i in init_memodata) {
                objectStore.add(init_memodata[i])
            }
        }
    })
}
