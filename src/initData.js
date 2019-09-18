const version_info = {
    "ver":"BETA 0.4.0",
    "desc":"[ 변경 사항 ]\n- 정렬 기능 추가 (네 가지 정렬 기준과 오름차순, 내림차순)\n- 실수 삭제 방지 기능 추가"
}

const init_memodata = {
    eng: [{id:0, title:'', text:'Create memo using the input field above.\nYou can edit or delete the memo by hovering/clicking the mouse on the memo.', time:new Date(2019, 0, 1, 0, 0, 0)}],
    kor: [{id:0, title:'', text:'TIP - 상단의 입력 상자를 이용해 메모를 생성하세요.\n메모 위에 마우스를 올리거나 눌러서 수정 또는 삭제할 수 있습니다.', time:new Date(2019, 0, 1, 0, 0, 0)}]
}

const init_settings = {'configured':true, 'setting_viewType':'tile', 'setting_fontSize':'medium', 'setting_nightMode':false, 'sortmethod':'time', 'sortorder':'desc'}
