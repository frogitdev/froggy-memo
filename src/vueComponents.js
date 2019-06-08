const comp_memoItem = {
    template: `
    <div>
        <span style="display:block;font-size:1.5em;">{{title}}</span>
        <pre>{{text}}</pre><br>
        {{timesince}}
        <div class="tooltiptext bgwhite">
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

const comp_settingsModal = {
    template: `
        <transition name="modal" appear>
        <div class="modal-mask">
            <div id="settings-modal" class="modal-container">
                <div class="tab-container">
                    <div class="tab-buttons bgwhite">
                        <div class="tab-btn bgwhite" @click="close()"> X </div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='gen'}" @click="openTab('gen')">일반</div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='app'}" @click="openTab('app')">모양</div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='dat'}" @click="openTab('dat')">데이터</div>
                        <div class="tab-btn bgwhite" :class="{'tab-active':current=='inf'}" @click="openTab('inf')">정보</div>
                    </div>
                    <div class="tab-pages">
                        <div v-if="current=='gen'" id="settings-gen" class="tab-page">
                            <div class="tab-content bgwhite">
                                <h2>언어</h2>
                                <select>
                                    <option value="kor">한국어</option>
                                    <!--<option value="eng">English</option>-->
                                </select>
                            </div>
                        </div>
                        <div v-if="current=='app'" id="settings-app" class="tab-page">
                            <div class="tab-content bgwhite">
                                <h2>야간 모드</h2>
                                <input type="checkbox" value="night-mode" v-model="settings.nightMode">{{settings.nightMode?'켬':'끔'}}
                            </div>
                            <div class="tab-content bgwhite">
                                <h2>글자 크기</h2>
                                <p>메모의 글자 크기를 결정합니다.</p>
                                <input type="radio" id="radio-font-size--small" value="small" v-model="settings.fontSize">
                                <label for="radio-font-size--small">작게</label><br>
                                <input type="radio" id="radio-font-size--medium" value="medium" v-model="settings.fontSize">
                                <label for="radio-font-size--medium">보통</label><br>
                                <input type="radio" id="radio-font-size--large" value="large" v-model="settings.fontSize">
                                <label for="radio-font-size--large">크게</label><br>
                            </div>
                        </div>
                        <div v-if="current=='dat'" id="settings-dat" class="tab-page">
                            <div class="tab-content bgwhite">
                                <h2>앱 초기화</h2>
                                <p><input type="checkbox" value="reset-confirm" v-model="resetchecked">모든 메모/설정이 삭제된다는 것을 확인합니다.</p>
                                <input v-if="resetchecked" class="btn" type="button" value="초기화" @click="$emit('resetapp')">
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
                                <h2>버전 정보</h2>
                                <p>{{version.ver}}</p>
                                <pre>{{version.desc}}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        `,
    props: ['settings', 'version'],
    data() {
        return {
            current: 'gen',
            resetchecked: false
        }
    },
    methods: {
        openTab(tab) {
            this.current = tab
        },
        close() {
            this.$emit('save')
            this.$emit('close')
        }
    }
}

const comp_noticeModal = {
    template: `
        <transition name="modal" appear>
        <div class="modal-mask">
        <div id="notice-modal" class="modal-container">
            <h2>업데이트 안내</h2>
            <p>FroggyMemo가 {{version.ver}} 버전으로 업데이트 되었습니다.</p>
            <pre>{{version.desc}}</pre>
            <div class="btn" style="text-align: center" @click="close()">확인</div>
        </div>
        </div>
        </transition>
    `,
    props: ['version'],
    methods: {
        close() {
            localStorage.setItem('version', this.version.ver)
            this.$emit('close')
        }
    }
}
