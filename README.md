# 프론트엔드 과제시험: 투자일지 웹 서비스

## 목표
- 투자일지를 통해서 자산을 관리하는 웹 서비스의 프론트엔드를 개발합니다.

## 흐름도
![flow](./assets/flow.png)

## API 목록
- 각 API의 응답 결과는은 실제 응답 결과가 아닌 참고용으로 작성한 결과입니다.
- `curl` 옵션 중 `-k` 는 SSL 인증서 문제가 있는 경우를 감안하여 사용하였습니다.
- 대부분의 API는 로그인시 발급되는 토큰을 사용해야지 호출이 가능합니다.
- 토큰은 JWT이며 헤더에 `Authorization: Bearer ${token}`으로 전달되어야 합니다.
- 서버는 [https://the-rich-coding-test1.herokuapp.com](https://the-rich-coding-test1.herokuapp.com)에 존재합니다.
- DB는 [https://the-rich-coding-test1.herokuapp.com/admin](https://the-rich-coding-test1.herokuapp.com/admin)에서 확인 가능합니다.

### 회원가입 API
```shell
$ curl -k -d "user[email]=test1@example.com&user[password]=1234" -X POST https://the-rich-coding-test1.herokuapp.com/users.json
{"id":2,"email":"test1@example.com","password":"!@#$!@#$","created_at":"2020-11-24T20:22:24.442Z","updated_at":"2020-11-24T20:22:24.442Z","url":"https://the-rich-coding-test1.herokuapp.com/users/2.json"}%
```

### 로그인 API
```shell
$ curl -k -d "email=test1@example.com&password=1234" -X POST https://the-rich-coding-test1.herokuapp.com/users/login
{"token":"eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6InRlc3QxQGV4YW1wbGUuY29tIn0.SBsK7V2Dx8R4sPsHU7zt7tGa2e4fDuz0ZpecqK8j7Xo","user_id":2}
```
- 로그인을 성공하면 JWT을 얻습니다. JWT에 대한 정보는 [https://jwt.io](https://jwt.io)에서 확인 가능합니다.

### 자산종목 정보 조회 API
```shell
$ curl -k -X GET https://the-rich-coding-test1.herokuapp.com/assets.json 
[{"id":1,"ticker":"AAPL","name":"Apple","price":"150","created_at":"2020-11-24T20:20:47.706Z","updated_at":"2020-11-24T20:20:47.706Z","url":"https://the-rich-coding-test1.herokuapp.com/assets/1.json"},{"id":2,"ticker":"AMZN","name":"Amazon","price":"110","created_at":"2020-11-24T20:20:47.715Z","updated_at":"2020-11-24T20:20:47.715Z","url":"https://the-rich-coding-test1.herokuapp.com/assets/2.json"},{"id":3,"ticker":"T","name":"AT\u0026T","price":"130","created_at":"2020-11-24T20:20:47.727Z","updated_at":"2020-11-24T20:20:47.727Z","url":"https://the-rich-coding-test1.herokuapp.com/assets/3.json"}]
```
- 투자 다이어리에 추가할 수 있는 자산종목들이 나타납니다.

### 투자일지 목록 조회 API
```shell
$ curl -k -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.uBW651carDjPRmZ160DJG7PDcVFXsRz4orqEOkI1BX4' https://the-rich-coding-test1.herokuapp.com/diaries.json
[{"id":1,"title":"111","contents":"11","date":"2020-11-08T04:04:12.000Z","created_at":"2020-11-24T19:04:14.706Z","updated_at":"2020-11-24T19:04:14.706Z","url":"http://localhost:3000/diaries/1.json"}]%
```
- 투자일지 추가 API를 호출하여 등록한 투자일지 목록을 가져옵니다.
- 투자일지에 포함되어 있는 투자자산 정보는 투자일지에 속해 있는 자산목록 확인 API를 호출하여 확인할 수 있습니다.

### 투자일지 추가 API
```shell
$ curl -k -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.uBW651carDjPRmZ160DJG7PDcVFXsRz4orqEOkI1BX4' -d "diary[title]=title&diary[contents]=contentsdfdfd&diary[date]=2020-11-08T04:04:12.000Z" -X POST https://the-rich-coding-test1.herokuapp.com/diaries.json 
{"id":1,"title":"title","contents":"contentsdfdfd","date":"2020-11-08T04:04:12.000Z","created_at":"2020-11-24T20:26:45.558Z","updated_at":"2020-11-24T20:26:45.558Z","url":"https://the-rich-coding-test1.herokuapp.com/diaries/1.json"}%
```
- 투자일지를 추가합니다.
- 제목(title), 내용(contents), 날짜(date)를 입력합니다.

### 투자일지 삭제 API
```shell
$ curl -k -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.uBW651carDjPRmZ160DJG7PDcVFXsRz4orqEOkI1BX4' -X DELETE https://the-rich-coding-test1.herokuapp.com/diaries/1.json
```
- 투자일지를 삭제 합니다.
- 투자일지 목록 조회 API를 호출한 뒤 반환된 `id`를 URL에 포함시켜서 전달합니다.

### 투자일지 목록에 자산 추가 API
```shell
$ curl -k -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.uBW651carDjPRmZ160DJG7PDcVFXsRz4orqEOkI1BX4' -X POST -d "diary_asset[diary_id]=2&diary_asset[asset_id]=1&diary_asset[amount]=10&diary_asset[buy_price]=110.5" https://the-rich-coding-test1.herokuapp.com/diary_assets.json
```
- 투자일지 추가 API를 호출하여 얻은 `diary_id`과 자산 종목 정보 조회 API를 호출하여 얻은 `asset_id`를 이용합니다.
- `diary_id`와 `asset_id`를 페이로드(`diary_asset[diary_id], diary_asset[asset_id]`)로 전달합니다.
- 여러 종목을 추가하는 경우 이 API를 반복 호출합니다.

### 투자일지 목록에 자산 삭제 API
```shell
$ curl -k -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.uBW651carDjPRmZ160DJG7PDcVFXsRz4orqEOkI1BX4' -X DELETE https://the-rich-coding-test1.herokuapp.com/diary_assets/1.json
```
- 삭제하려는 투자일지의 `id`를 URL에 포함시켜서 호출합니다. 위 예시에서 `diary_asset`의 `id`는 `1`입니다.

### 투자일지에 속해 있는 자산목록 확인 API
```shell
$ curl -k -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.uBW651carDjPRmZ160DJG7PDcVFXsRz4orqEOkI1BX4' -X GET https://the-rich-coding-test1.herokuapp.com/diaries/2/assets.json
[{"id":2,"diary_id":2,"asset_id":1,"amount":"10.0","buy_price":"100.0","created_at":"2020-11-24T20:33:40.541Z","updated_at":"2020-11-24T20:33:40.541Z"},{"id":3,"diary_id":2,"asset_id":2,"amount":"15.0","buy_price":"120.0","created_at":"2020-11-24T20:33:52.262Z","updated_at":"2020-11-24T20:33:52.262Z"}]% 
```
- 투자일지의 `id`를 URL에 포함시켜서 호출합니다

## 참고사항
- 사용한 언어, 프레임워크, 코딩스타일, 개발환경을 사용한 이유를 명시해 주시면 좋습니다.
- 테스트 케이스를 작성해 주시면 좋습니다.
- 작성한 코드는 과제시험을 위해 실행 가능해야 합니다. 
- 과제는 Pull Request를 통해 제출하면 됩니다.
