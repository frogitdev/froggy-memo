const vueMemoContent = {
    el: '#screen',
    data: {
        items: [],
        nextItemNum: 1,
        edit: '',

        header: {
            expand: '',
            title: '',
            text: '',
            btn: ''
        },

        showSettings: false,
        showNotice: false,

        version: {

        },
        settings: {
            viewType: 'tile',
            fontSize: 'medium',
            nightMode: false
        },
        l: {

        }
    },
    mounted() {
        this.checkUpdate()
        this.initSetting()
        this.readItem()

        window.addEventListener('focus', () => {
            this.readItem()
        })

        window.addEventListener('keyup', (event) => {
            if (event.keyCode === 27) {
                this.changeSetting()
                this.modal('settings', false)
            }
        })

        this.l = lang
        this.header.btn = this.l.CREATE
    },
    methods: {
        checkUpdate() {
            this.version = version_info
            if (localStorage.getItem('version') != this.version.ver) {
                this.modal('notice', true)
            }
        },
        initSetting() {
            var setitem = ['viewType', 'fontSize', 'nightMode']
            setitem.forEach(i => {
                var item = localStorage.getItem(`setting_${i}`)
                if (item=='true') {
                    this.settings[i] = true
                } else if (item=='false') {
                    this.settings[i] = false
                } else {
                    this.settings[i] = item
                }
            })
            if (this.settings.nightMode == true) {
                document.getElementById('body').classList.add('dark')
            }
        },
        changeSetting() {
            for (i in this.settings) {
                localStorage.setItem(`setting_${i}`, this.settings[i])
            }
            if (this.settings.nightMode == true) {
                document.getElementById('body').classList.add('dark')
            } else {
                document.getElementById('body').classList.remove('dark')                
            }
        },
        resetApp() {
            if (confirm(this.l.APP_RESET_CONFIRM)) {
                resetAll().then(() => {
                    alert(this.l.APP_RESET_OK)
                    window.location.reload()
                })
            }
        },
        readItem() {
            dbControlRead('memodata').then(resolvedItems => {
                this.items = resolvedItems
            })
        },
        addItem() {
            if (this.edit) { //EDIT MODE
                dbControlEdit('memodata', {
                    id: this.edit.id,
                    title: this.header.title,
                    text: this.header.text,
                    time: new Date()
                }).then(() => {
                    this.resetField()
                    this.readItem()
                })
            } else { //NEW MODE
                dbControlAdd('memodata', {
                    id: this.nextItemNum,
                    title: this.header.title,
                    text: this.header.text,
                    time: new Date()
                }).then(() => {
                    this.resetField()
                    this.readItem()
                })
            }
        },
        editItem(item) {
            if(this.header.text) {
                if(!confirm(this.l.EDIT_CONFIRM)) return
            }
            this.header.title = item.title
            this.header.text = item.text
            this.edit = item
        },
        removeItem(id) {
            dbControlDelete('memodata', id).then(() => {
                this.readItem()
            })
        },
        resetField() {
            this.header.title = ''
            this.header.text = ''
            this.edit = ''
        },
        modal(name, action) {
            switch(name) {
                case 'settings':
                    this.showSettings = action
                    break
                case 'notice':
                    this.showNotice = action
                    break
            }
        }
    },
    watch: {
        items() {
            if (this.items.length) {
                this.nextItemNum = this.items[this.items.length - 1].id + 1                    
            } else {
                this.nextItemNum = 0
            }
        },
        edit() {
            if(this.edit) {
                this.header.btn = this.l.EDIT
            } else {
                this.header.btn = this.l.CREATE
            }
        },
        'header.text': function() {
            if ((this.header.text == '') && !(this.edit)) {
                this.header.expand = ''
            } else {
                this.header.expand = 'expand'
            }
        }
    }
}

function pad(n, width) {
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
}

function getTimeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000)
    var interval = Math.floor(seconds / 31536000)
    if (interval >= 1) {
        return interval + lang.YEAR + ' ' + lang.AGO
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + lang.MONTH + ' ' + lang.AGO
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + lang.DAY + ' ' + lang.AGO
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + lang.HOUR + ' ' + lang.AGO
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + lang.MIN + ' ' + lang.AGO
    }
    return lang.JUSBEF
}

function convertTime(time) {
    return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}`
}
