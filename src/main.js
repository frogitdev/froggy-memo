window.onload = function() {
    initLocalStorage()

    initDB().then(mode => {
        switch(mode) {
            case 'continue':
                new Vue(vueMemoContent)
                break
            case 'destroy':
                break
        }
    })
}
