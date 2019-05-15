initDB().then(() => {
    vueMemo.readItem()
})

var vueMemo = new Vue(vueMemoContent)
