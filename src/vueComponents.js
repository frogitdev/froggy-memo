const comp_memo = {
    template: `
        <div id="main" class="bgwhite">
            <header-area :l="l" :header="header" :settings="settings" @add-item="$emit('add-item')" @reset-field="$emit('reset-field')" @change-setting="$emit('change-setting')" @modal="$emit('modal', $event, $event)"></header-area>
            <memo-list :items="items" :settings="settings" @edit-item="$emit('edit-item', $event)" @remove-item="$emit('remove-item', $event)"></memo-list>
        </div>
    `,
    props: ['l', 'items', 'header', 'settings']
}

const comp_headerArea = {
    template: `
        <div id="header" class="bgwhite" :class="[header.expand]">
        <div id="icon-area" @click="$emit('change-setting')">
            <i class="fas fa-list-ul fa-fw link" v-if="settings.viewType!='list'" @click="settings.viewType='list'"></i>
            <i class="fas fa-grip-vertical fa-fw link" v-if="settings.viewType=='list'" @click="settings.viewType='tile'"></i>
            <!--<i class="fas fa-sort-amount-down link" @click=""></i>-->
            <i class="fas fa-cog link" @click="$emit('modal', 'settings', true)"></i> 
        </div>
        <input id="title-field" type="text" v-if="header.text!=''||header.title!=''" v-model="header.title" :placeholder="l.TITLE">
        <textarea id="text-field" v-model="header.text" :placeholder="l.NEW_MEMO"></textarea>
        <div id="btn-area">
            <input class="btn" type="button" style="background-color: rgba(64,128,240,.1)" @click="$emit('add-item')" :value="header.btn">
            <input class="btn" type="button" @click="$emit('reset-field')" :value="l.CANCEL">
        </div>
        </div>
    `,
    props: ['l', 'header', 'settings']
}

const comp_memoList = {
    template: `
        <div id="memo-list">
            <transition-group name="memo-list" tag="div">
                <memo-item class="memo-item" :class="[settings.viewType, settings.fontSize]" v-for="item in items" :key="item.id" :item="item" @edit="$emit('edit-item', item)" @remove="$emit('remove-item', item.id)" onclick="void(0)"></memo-item>
            </transition-group>
        </div>
    `,
    props: ['items', 'settings']
}

const comp_memoItem = {
    template: `
    <div>
        <span style="display:block;font-size:1.5em;">{{item.title}}</span>
        <pre>{{item.text}}</pre><br>
        {{timesince}}
        <div class="tooltiptext bgwhite">
            <div>
                <i class="fas fa-edit link" @click="$emit('edit')" style="margin-right: 10px"></i>
                <i class="fas fa-trash link" @click="$emit('remove')"></i>
                <b style="float: right">ID {{item.id}}</b>
            </div>
            <div>
                <span>{{timefull}}</span>
            </div>
        </div>
    </div>
    `,
    props: ['item'],
    computed: {
        timesince() {
            return getTimeSince(this.item.time)
        },
        timefull() {
            return convertTime(this.item.time)
        }
    }
}


const comp_settingsModal = {
    template: `
        <transition name="modal" appear>
        <div class="modal-mask">
            <div id="settings-modal" class="modal-container">
                <div class="tab-container">
                    <div class="tab-buttons bgwhite">
                        <div class="tab-btn bgwhite" @click="close()"> X </div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='gen'}" @click="openTab('gen')">{{l.GEN}}</div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='app'}" @click="openTab('app')">{{l.APP}}</div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='dat'}" @click="openTab('dat')">{{l.DAT}}</div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='inf'}" @click="openTab('inf')">{{l.INF}}</div>
                    </div>
                    <div class="tab-pages">
                        <div v-if="current=='gen'" id="settings-gen" class="tab-page">
                            <div class="tab-content bgwhite">
                                <h2>{{l.LANGUAGE}}</h2>
                                <select v-model="language">
                                    <option value="kor">한국어({{l.KOREAN}})</option>
                                    <option value="eng">English({{l.ENGLISH}})</option>
                                </select>
                                <div v-if="oldlanguage!=language">
                                    <p style="color:red">{{l.REFRESH_WARN}}</p>
                                    <input class="btn" type="button" :value="l.REFRESH" @click="refreshApp">                                        
                                </div>
                            </div>
                        </div>
                        <div v-if="current=='app'" id="settings-app" class="tab-page">
                            <div class="tab-content bgwhite">
                                <h2>{{l.NIGHT_MODE}}</h2>
                                <label class="switch">
                                    <input type="checkbox" value="night-mode" v-model="settings.nightMode">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="tab-content bgwhite">
                                <h2>{{l.TEXT_SIZE}}</h2>
                                <p>{{l.TEXT_SIZE_DESC}}</p>
                                <input type="radio" id="radio-font-size--small" value="small" v-model="settings.fontSize">
                                <label for="radio-font-size--small">{{l.SMALL}}</label><br>
                                <input type="radio" id="radio-font-size--medium" value="medium" v-model="settings.fontSize">
                                <label for="radio-font-size--medium">{{l.MEDIUM}}</label><br>
                                <input type="radio" id="radio-font-size--large" value="large" v-model="settings.fontSize">
                                <label for="radio-font-size--large">{{l.LARGE}}</label><br>
                            </div>
                        </div>
                        <div v-if="current=='dat'" id="settings-dat" class="tab-page">
                            <div class="tab-content bgwhite">
                                <h2>{{l.APP_RESET}}</h2>
                                <p><input type="checkbox" value="reset-confirm" v-model="resetchecked">{{l.APP_RESET_DESC}}</p>
                                <input v-if="resetchecked" class="btn" type="button" :value="l.RESET" @click="$emit('resetapp')">
                            </div>
                        </div>
                        <div v-if="current=='inf'" id="settings-inf" class="tab-page">
                            <div class="tab-content bgwhite">
                                <img src="./src/img/logo.png" width="100px"><br>
                                <b>FroggyMemo</b> {{version.ver}}<br>
                                (C) <a href="http://frogit.xyz" target="_blank">FrogIT</a>. Licensed under the GPL-3.0<br>
                                <a href="https://github.com/frogitdev/froggy-memo" target="_blank">GitHub Repository</a><br>
                            </div>
                            <div class="tab-content bgwhite">
                                <h2>{{l.VER_INFO}}</h2>
                                <p>{{version.ver}}</p>
                                <pre>{{version.desc}}</pre>
                            </div>
                            <div class="tab-content bgwhite">
                                <h2>{{l.CUS_SERV}}</h2>
                                <p>{{l.CUS_SERV_DESC}}</p>
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSe6vg4eT6dBfzz6Lu7SFn9GPK94R4o8ZSHEbSNGg5fiauKUPw/viewform?usp=sf_link" target="_blank">{{l.CUS_SERV_BTN}}</a><br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        `,
    props: ['l', 'settings', 'version'],
    data() {
        return {
            current: 'gen',
            resetchecked: false,
            oldlanguage: sl,
            language: sl
        }
    },
    methods: {
        openTab(tab) {
            this.current = tab
        },
        close() {
            this.$emit('save')
            this.$emit('close')
        },
        refreshApp() {
            window.location.reload()
        }
    },
    watch: {
        language() {
            localStorage.setItem('setting_language', this.language)
        }
    }
}

const comp_noticeModal = {
    template: `
        <transition name="modal" appear>
        <div class="modal-mask">
        <div id="notice-modal" class="modal-container">
            <h2>{{l.NOTICE_UPDATE}}</h2>
            <p>{{l.NOTICE_UPDATE_DESC}} - {{version.ver}}</p>
            <pre>{{version.desc}}</pre>
            <div class="btn" style="text-align: center" @click="close()">{{l.CONFIRM}}</div>
        </div>
        </div>
        </transition>
    `,
    props: ['l', 'version'],
    methods: {
        close() {
            localStorage.setItem('version', this.version.ver)
            this.$emit('close')
        }
    }
}

Vue.component('memo', comp_memo)
    Vue.component('headerArea', comp_headerArea)
    Vue.component('memoList', comp_memoList)
        Vue.component('memoItem', comp_memoItem)
Vue.component('settingsModal', comp_settingsModal)
Vue.component('noticeModal', comp_noticeModal)
