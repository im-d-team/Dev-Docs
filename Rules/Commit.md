# Commit Rules

## Commit Type

커밋의 사용되는 타입은 크게 4가지로 구분한다.

- create: Create docs(새로운 문서 생성)
- update/{reviewerName}: Update docs(PR상 올라가 있는 문서 수정)
- hotfix: Update docs without brach(Master 머지 후 발견된 수정 사항)
- maintain: Update README.md(기타 문서 수정)

### Example

```md
// 괄호도 포함하는 메시지

[create]: Create Scope.md

[update] : Scope 설명 코드 예시 보충(최대한 자세하게)
[update/BKJang]: 서브넷 네트워크와 네트워크 주소 차이 추가(최대한 자세하게)
[update/sNyung]: 네트워크 주소 예시 수정(최대한 자세하게)

[hotfix]: 띄어쓰기
[hotfix]: 오탈자 수정

[maintain]: Update README.md (Add commit message type)
```

## 커밋 작성 예시

### github.com에서 새로운 파일 올리기

![레포 화면 버튼](https://user-images.githubusercontent.com/24274424/85224874-5199e680-b408-11ea-9ea5-f573d1fbe979.png)

> Create new file => Click

![글작성 페이지](https://user-images.githubusercontent.com/24274424/85224898-71310f00-b408-11ea-9079-31ed804861f6.png)

> 자신의 글 작성 및 하단으로 이동

![커밋 메시지 작성](https://user-images.githubusercontent.com/24274424/85224950-9f165380-b408-11ea-9cac-d5a00d61a1ff.png)

> 커밋메시지 타입 중 create를 사용하여 작성

### github.com에서 파일 수정하기

![PR 화면](https://user-images.githubusercontent.com/24274424/85225028-38456a00-b409-11ea-9c43-8cf821d15f2d.png)

> 자신의 PR로 들어감

![image](https://user-images.githubusercontent.com/24274424/85225044-54490b80-b409-11ea-83e3-4fbe1a8eff7e.png)

> Files changed => 우측 vertical dots 클릭 => edit file 클릭

![글 수정 및 하단 메시지](https://user-images.githubusercontent.com/24274424/85225071-865a6d80-b409-11ea-997c-bcfbf311cd6b.png)

> 글 수정 및 하단 메시지 이동

![update 메시지 작성](https://user-images.githubusercontent.com/24274424/85225088-9eca8800-b409-11ea-870c-b26a30fe36bf.png)

> update 타입을 사용하여 작성 및 commit 클릭
