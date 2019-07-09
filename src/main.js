window.onload = function() {
    initLocalStorage()

    initLanguage().then(() => {
        initDB().then(mode => {
            switch(mode) {
                case 'continue':
                    new Vue(vueMemoContent)
                    break
                case 'destroy':
                    break
            }
        })    
    })
}
