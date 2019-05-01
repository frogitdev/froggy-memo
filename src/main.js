var memoApp = new Vue({
    el: 'main',
    data: {
        titleField: '',
        textField: '',
        items: [{id:0, text:'TIP - 상단의 입력 상자를 이용해 메모를 생성하세요.\n메모 위에 마우스를 올려 수정 또는 삭제할 수 있습니다.', time:new Date(2019, 0, 1, 0, 0, 0)}],
        nextItemNum: 1,
        rows: 2,
        edit: ''
    },
    methods: {
        addItem: function(){
            if (this.edit) { //EDIT MODE
                this.items[this.items.indexOf(this.edit)] = {
                    id: this.edit.id,
                    title: this.titleField,
                    text: this.textField,
                    time: new Date()
                }
                this.edit = ''
            } else { //NEW MODE
                this.items.push({
                    id: this.nextItemNum++,
                    title: this.titleField,
                    text: this.textField,
                    time: new Date()
                })
            }
            this.titleField = ''
            this.textField = ''
        },
        editItem: function(item) {
            this.titleField = item.title
            this.textField = item.text
            this.edit = item
        },
        removeItem: function(item){
//            if(confirm(`해당 메모를 삭제하시겠습니까?\n메모 ID: ${item.id}`)) {
                this.items.splice(this.items.indexOf(item), 1)
//            }
        },
        getTimesince: function(date) {
            var seconds = Math.floor((new Date() - date) / 1000);
            var interval = Math.floor(seconds / 31536000);
            if (interval > 1) {
                return interval + "년 전";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + "개월 전";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + "일 전";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + "시간 전";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + "분 전";
            }
            return "방금 전";
        },
        convertTime: function(time) {
            return `${time.getFullYear()} / ${time.getMonth()+1} / ${time.getDate()}  ${time.getHours()}시 ${time.getMinutes()}분 ${time.getSeconds()}초`
        }
    },
    watch: {
        textField: function() {
            if (this.textField == '') {
                this.rows = 2
            }
            else {
                this.rows = 8
            }
        }
    },
    components: {
        memoItem: {
            template: `<div><span style="display:block;font-size:1.5em;">{{title}}</span><pre>{{text}}</pre><br>{{timesince}}<div class="tooltiptext"><b>메모 ID</b> {{id}}<br><b>수정됨</b> {{timefull}}<br><span class="link" @click="$emit('edit')">수정</span> <span class="link" @click="$emit('remove')">삭제</span></div></div>`,
            props: ['id', 'title', 'text', 'timesince', 'timefull']
        }
    }
})
