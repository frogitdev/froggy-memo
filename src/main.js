initDB().then(mode => {
    switch(mode) {
        case 'continue':
            var vueMemo = new Vue(vueMemoContent)
            vueMemo.readItem()
            window.addEventListener('focus', function() {
                vueMemo.readItem()
            })
            break
        case 'destroy':
            break
    }
})
