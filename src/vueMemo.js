const vueMemoContent = {
    el: 'main',
    data: {
        items: [],
        nextItemNum: 1,
        edit: '',
        titleField: '',
        textField: '',
        btnArea: '생성',
        style: {
            iconArea: {
                display: 'flex'
            },
            btnArea: {
                display: 'none'
            },
            textField: {
                height: '50px'
            }
        }
    },
    methods: {
        readItem: function() {
            dbControlRead('memodata').then(resolvedItems => {
                this.items = resolvedItems
            })
        },
        addItem: function(){
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
        editItem: function(item) {
            if(this.textField) {
                if(!confirm('입력 필드에 입력중인 내용이 있습니다. 입력중인 내용을 지우고 선택한 메모를 수정하시겠습니까?')) return
            }
            this.titleField = item.title
            this.textField = item.text
            this.edit = item
        },
        removeItem: function(id){
            dbControlDelete('memodata', id).then(() => {
                this.readItem()
            })
        },
        resetField: function() {
            this.titleField = ''
            this.textField = ''
            this.edit = ''
        },
        getTimesince: function(date) {
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
        convertTime: function(time) {
            return `${time.getFullYear()} / ${time.getMonth()+1} / ${time.getDate()} ${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`
        },
    },
    watch: {
        items: function() {
            if (this.items.length) {
                this.nextItemNum = this.items[this.items.length - 1].id + 1                    
            } else {
                this.nextItemNum = 0
            }
        },
        textField: function() {
            if (this.textField == '') {
                this.style.iconArea.display = 'flex'
                this.style.btnArea.display = 'none'
                this.style.textField.height = '50px'
            }
            else {
                this.style.iconArea.display = 'none'
                this.style.btnArea.display = 'inline-block'
                this.style.textField.height = '300px'
            }
        },
        edit: function() {
            if(this.edit) {
                this.btnArea = '수정'
            } else {
                this.btnArea = '생성'
            }
        }
    },
    components: {
        memoItem: {
            template: `
                <div>
                    <span style="display:block;font-size:1.5em;">{{title}}</span>
                    <pre>{{text}}</pre><br>
                    {{timesince}}
                    <div class="tooltiptext">
                        <div>
                            <i class="fas fa-edit link" @click="$emit('edit')" style="margin-right: 10px"></i>
                            <i class="fas fa-trash link" @click="$emit('remove')"></i>
                            <b style="float: right">ID {{id}}</b>
                        </div>
                        <div>
                            <span>{{timefull}}</span>
                        </div>
                    </div>
                </div>
            `,
            props: ['id', 'title', 'text', 'timesince', 'timefull']
        }
    }
}
