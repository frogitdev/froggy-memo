const version_info = {
    "ver":"BETA 0.4.2",
    "desc":"[ 오류 수정 ]\n- 아이콘 위치 오류 수정\n- 초기 설정 오류 수정\n- 시간 표시 오류 수정\n- 영어 시간 복수형 추가"
}

const init_memodata = {
    eng: [{id:0, title:'', text:'Create memo using the input field above.\nYou can edit or delete the memo by hovering/clicking the mouse on the memo.', time:new Date(2019, 0, 1, 0, 0, 0)}],
    kor: [{id:0, title:'', text:'TIP - 상단의 입력 상자를 이용해 메모를 생성하세요.\n메모 위에 마우스를 올리거나 눌러서 수정 또는 삭제할 수 있습니다.', time:new Date(2019, 0, 1, 0, 0, 0)}]
}

const init_settings = {'configured':true, 'setting_viewType':'tile', 'setting_fontSize':'medium', 'setting_nightMode':false, 'setting_sortmethod':'time', 'setting_sortorder':'desc'}
