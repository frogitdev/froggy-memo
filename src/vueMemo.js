const vueMemoContent = {
    el: '#screen',
    data: {
        items: [],
        nextItemNum: 1,
        edit: '',

        expandHeader: '',
        titleField: '',
        textField: '',
        btnArea: '생성',

        showSettings: false,
        showNotice: false,

        version: {

        },
        settings: {
            viewType: 'tile',
            language: 'kor',
            fontSize: 'medium',
            nightMode: false
        }
    },
    mounted() {
        Vue.component('memoItem', comp_memoItem)
        Vue.component('settingsModal', comp_settingsModal)
        Vue.component('noticeModal', comp_noticeModal)

        this.checkUpdate()
        this.initSetting()
        this.readItem()

        window.addEventListener('focus', () => {
            this.readItem()
        })

        window.addEventListener('keyup', (event) => {
            if (event.keyCode === 27) {
                this.changeSetting()
                this.showSettings = false
            }
        })
    },
    methods: {
        checkUpdate() {
            this.version = version_info
            if (localStorage.getItem('version') != this.version.ver) {
                this.showNotice = true
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
        },
        changeSetting() {
            for (i in this.settings) {
                localStorage.setItem(`setting_${i}`, this.settings[i])
            }
        },
        resetApp() {
            if (confirm('모든 메모/설정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                resetAll().then(() => {
                    alert('앱이 초기화되었습니다.')
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
                    title: this.titleField,
                    text: this.textField,
                    time: new Date()
                }).then(() => {
                    this.resetField()
                    this.readItem()
                })
            } else { //NEW MODE
                dbControlAdd('memodata', {
                    id: this.nextItemNum,
                    title: this.titleField,
                    text: this.textField,
                    time: new Date()
                }).then(() => {
                    this.resetField()
                    this.readItem()
                })
            }
        },
        editItem(item) {
            if(this.textField) {
                if(!confirm('입력 필드에 입력중인 내용이 있습니다. 입력중인 내용을 지우고 선택한 메모를 수정하시겠습니까?')) return
            }
            this.titleField = item.title
            this.textField = item.text
            this.edit = item
        },
        removeItem(id) {
            dbControlDelete('memodata', id).then(() => {
                this.readItem()
            })
        },
        resetField() {
            this.titleField = ''
            this.textField = ''
            this.edit = ''
        },
        getTimesince(date) {
            var seconds = Math.floor((new Date() - date) / 1000);
            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                return interval + "년 전";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                return interval + "개월 전";
            }
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                return interval + "일 전";
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return interval + "시간 전";
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return interval + "분 전";
            }
            return "방금 전";
        },
        convertTime(time) {
            return `${time.getFullYear()} / ${time.getMonth()+1} / ${time.getDate()} ${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`
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
        textField() {
            if ((this.textField == '') && !(this.edit)) {
                this.expandHeader = ''
            } else {
                this.expandHeader = 'expand'
            }
        },
        edit() {
            if(this.edit) {
                this.btnArea = '수정'
            } else {
                this.btnArea = '생성'
            }
        }
    }
}
