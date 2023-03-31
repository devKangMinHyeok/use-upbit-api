# GIT Message Template

## .gitmessage.txt

커밋 시 Git은 commit.template 옵션에 설정한 템플릿 파일을 보여준다.

커밋 메시지 템플릿을 지정하면 커밋 메시지를 작성할 때 일정한 스타일을 유지할 수 있다.

.gitmessage.txt 파일은 아래와 같이 구성되어있으며, 커밋시에 적용됩니다.

- [#Issue Number]를 커밋메세지 앞에 추가하면 이슈별로 커밋을 관리할 수 있음

```
################
# UNIST MIPS SIMULATOR GIT MESSAGE TEMPLATE
# [커밋 타입 종류]
# feat : 새로운 기능 추가
# fix : 버그 수정
# docs : 문서 수정
# test : 테스트 코드 추가
# refact : 코드 리팩토링
# style : 코드 의미에 영향을 주지 않는 변경사항
# chore : 빌드 부분 혹은 패키지 매니저 수정사항
################

# '#' 라인은 주석입니다.
# [#Issue Number] <타입> : <제목> 의 형식으로 제목을 아래 공백줄에 작성
# 제목은 50자 이내 / 변경사항이 "무엇"인지 명확히 작성 / 끝에 마침표 금지
# 예) feat : 로그인 기능 추가
# --이 라인 밑에 "[#Issue Number] <타입> : <제목>" 작성해주세요--

# 바로 아래 공백은 지우지 마세요 (제목과 본문의 분리를 위함)

################
# 본문(구체적인 내용)을 아랫줄에 작성
# 여러 줄의 메시지를 작성할 땐 "-"로 구분 (한 줄은 72자 이내)
# --이 라인 밑에 "본문" 작성해주세요--

################
# 꼬릿말(footer)을 아랫줄에 작성 (현재 커밋과 관련된 이슈 번호 추가 등)
# 예) Close #7
# --이 라인 밑에 "꼬릿말" 작성해주세요--

################
```

## 적용 방법

### 템플릿 파일 설정

템플릿 파일을 설정해놓으면, git commit 명령을 실행할 때 지정한 템플릿 메시지를 편집기에서 매번 사용할 수 있다.

템플릿 파일을 설정한다는 것은 commit.template에 .gitmessage.txt 파일을 등록한다는 의미다.

템플릿 파일을 설정하는 명령은 아래와 같다.

```
git config --global commit.template .gitmessage.txt
```

---

### 에디터 사용 방법

```
git add .
git commit
```

위 명령어를 사용하면 변경된 파일들을 스테이지에 올리고 commit을 실행한다.

이후 설정된 template이 터미널 에디터에 출력되고,

' i '를 눌러 INSERT 모드로 변경한다.

변경한 후에는

```
ESC + :wq! + ENTER
```

를 통해 커밋 메세지 저장 후 커밋을 완료할 수 있다.

만약 commit 메세지 작성 중 commit을 취소하고 싶다면,

```
ESC + :qa + ENTER
```

를 통해 commit 작업을 취소할 수 있다.

---

## Reference

https://velog.io/@bky373/Git-%EC%BB%A4%EB%B0%8B-%EB%A9%94%EC%8B%9C%EC%A7%80-%ED%85%9C%ED%94%8C%EB%A6%BF
