const version_info = {
    "ver":"BETA 0.3.0",
    "desc":"[ 변경 사항 ]\n- 언어 설정 기능 추가\n- 영어 추가\n- 폼 요소 디자인 개선\n- 개발 측면에서 정말 많은 최적화가 이루어졌습니다.\n  ㄴ 컴포넌트 분리로 Single File Components 구현 기반 완성\n  ㄴ JSON을 통한 쉬운 언어 번역 가이드라인 제공 - 이 프로젝트의 GitHub Repo에서 누구나 언어를 새로 번역하거나 편집할 수 있습니다."
}

const init_memodata = {
    eng: [{id:0, title:'', text:'Create memo using the input field above.\nYou can edit or delete the memo by hovering/clicking the mouse on the memo.', time:new Date(2019, 0, 1, 0, 0, 0)}],
    kor: [{id:0, title:'', text:'TIP - 상단의 입력 상자를 이용해 메모를 생성하세요.\n메모 위에 마우스를 올리거나 눌러서 수정 또는 삭제할 수 있습니다.', time:new Date(2019, 0, 1, 0, 0, 0)}]
}

const init_settings = {'configured':true, 'setting_viewType':'tile', 'setting_fontSize':'medium', 'setting_nightMode':false}
