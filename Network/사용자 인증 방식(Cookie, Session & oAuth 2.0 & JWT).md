# 사용자 인증 방식
## 목차 
1. 서버 기반 인증 (Cookie-Session)
2. 토큰 기반 인증 (oAuth 2.0, JWT) 

## 1. 서버 기반 인증 (Cookie-Session)
![image](https://user-images.githubusercontent.com/43839938/80296521-f906ee00-87b6-11ea-9e6f-fbf0a1e9712c.png)

- 설명: 전통적인 방식이다. HTTP의 stateless한 속성을 보완할 필요성이 생겨서 탄생했다.
- 장점: stateful 유지 가능
- 단점:  서버 부하 (유저의 인증 정보를 서버측에 담아둠)

## 2. 토큰 기반 인증 (oAuth 2.0, JWT)
![image](https://user-images.githubusercontent.com/43839938/80296527-0c19be00-87b7-11ea-86b1-500f6c269339.png)
- 설명: 서버 기반 인증 방식과 달리 stateless한 방식이다. 서버 부하를 덜 수 있다.
### (1) oAuth 2.0
> oAuth 에서 사용하는 refresh token- access token 구조
![image](https://user-images.githubusercontent.com/43839938/80296620-c14c7600-87b7-11ea-93aa-814375724d0a.png)

> oAuth 2.0 동작 방식
![image](https://user-images.githubusercontent.com/43839938/80296794-d2e24d80-87b8-11ea-97e2-514ef8fbfd23.png)

- 설명: Access Token, Refresh Token을 이용한 인증 방식은 한 서버에서 모두 관리하는 반면, 여기 OAuth에서는 Authorization Server에서 인증+권한 관리를 하고 Resource Server에서는 자원에 대한 관리만 한다.
- 장점: 보안성 좋다. (Access Token을 지속적으로 발급받아야 하므로)
- 단점: 필요한 Resource가 너무 많다. 시간도 많이 걸린다.

### (2) JWT (JSON Web Token)
- 설명: 토큰 자체가 data를 가지고 있다. 
- 장점: 토큰 기반 인증의 장점 (서버 부하 덜 수 있음)
- 단점: Packet(보내는 데이터) 양이 크다. 토큰 자체를 탈취하면 ID, PW 자체를 알 수 있다. (따라서 HTTPS 통신을 권장한다.)

![image](https://user-images.githubusercontent.com/43839938/80296561-5dc24880-87b7-11ea-8a48-8e8ab99e611b.png)

![image](https://user-images.githubusercontent.com/43839938/80297158-af6cd200-87bb-11ea-92f1-82cadb6c8643.png)


1) 헤더 (Header)
```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```
> typ: 토큰의 타입을 지정합니다. 바로 JWT 이죠.

> alg: 해싱 알고리즘을 지정합니다.  해싱 알고리즘으로는 보통 HMAC SHA256 혹은 RSA 가 사용되며, 이 알고리즘은, 토큰을 검증 할 때 사용되는 signature 부분에서 사용됩니다.

2) 정보 (payload)

3) 서명 (signature)
헤더의 인코딩값과, 정보의 인코딩값을 합친후 주어진 비밀키로 해쉬를 하여 생성합니다.

4) JWT 사용 예제
```php
use Firebase\JWT\JWT;

function getJWToken($id, $pw, $secretKey)
{
    $data = array(
        'date' => (string)getTodayByTimeStamp(),
        'id' => (string)$id,
        'pw' => (string)$pw
    );

    return $jwt = JWT::encode($data, $secretKey);
}

(...)
const JWT_SECRET_KEY = "(시크릿 키 입니다.)"

$jwt = getJWToken($req->id, $req->pw, JWT_SECRET_KEY);
```
```php
function getDataByJWToken($jwt, $secretKey)
{
    try{
        $decoded = JWT::decode($jwt, $secretKey, array('HS256'));
    }catch(\Exception $e){
        return "";
    }

    // print_r($decoded);
    return $decoded;

}
```
### 참고자료
- [[JWT] JSON Web Token 소개 및 구조](https://velopert.com/2389)
- [쉽게 알아보는 서버 인증 2편(Access Token + Refresh Token)](https://tansfil.tistory.com/59)
