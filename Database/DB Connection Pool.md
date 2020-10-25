# DB Connection Pool

API 서버를 구동하고 있었는데, 이따금씩 Nginx `502 Bad Gateway` 오류가 났다. 

![1](https://user-images.githubusercontent.com/43839938/97099038-524ccd00-16c7-11eb-8cbb-439763a3599f.png)

서버는 Nginx- PM2 - Node.js - MySQL로 구성돼있었는데 도대체 문제 원인이 무엇인지, 한참 찾았다. 로컬 환경에서는 추가한 node_module을 Git에서는 ignore 해줬기 때문에 실 서버에서 npm install 을 하지 않아서 생기는 문제이기도 했고, Node.js 코드 자체에 문제가 있는 경우에도 `502 Bad Gateway` 가 뜨곤했다. 그런데 이번에는 npm install도 해주고 코드에도 이상이 없는데 처음에는 잘 작동되다가 갑자기 `502 Bad Gateway` 가 뜨는 것.

Nginx 에러 로그, PM2 에러 로그, winston을 이용한 에러로그 확인을 모두 했으나 뾰족하게 원인을 찾기 힘들었다. 이곳 저곳 물어보다가 결국 `DB Connection Pool` 을 Release 하지 않아서 발생한 문제라는 것을 알게 됐다. 

구글링을 해보니 `DB Connection Pool` 문제로 인해 서버 오류가 터졌을 때 그 원인이 `DB Connection Pool` 이라는 것을 단번에 찾기 어렵다는 글이 많았다. ~~(휴 발견해서 다행 ㅋ)~~

그래서 정리해보려 한다. `DB Connection Pool` 은 무엇이며 `Pool`을 `Release` 해준다는 것은 어떤 의미인가? 만약 `Pool`은 여러 개 생성만 하고 `Release`를 하지 않으면 어떤 문제가 발생하는가? 알아보자.

# DB Connection Pool 이란?

### Single Connection

`Single Connection`을 사용할 경우 해당 `Connection`에 여러 `Statement`를 사용하게 된다. 여러 `Statement` 중 한 `Statement`에서 예외가 발생하면 `Rollback`을 수행해야 하는데 `Single Connection`의 경우는 해당 `Connection`을 통해 생성된 다른 모든 `Statement`의 작업도 `Rollback`되게 된다. (원치 않는 작업이 발생한다)

> [npm mysql2](https://www.npmjs.com/package/mysql2#using-connection-pools)

```jsx
// get the client
const mysql = require('mysql2');
 
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});
 
// simple query
connection.query(
  'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);
 
// with placeholder
connection.query(
  'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
  ['Page', 45],
  function(err, results) {
    console.log(results);
  }
);
```

참고> 위 예시는 날 쿼리를 그대로 사용했기 때문에 [SQL Injection](https://ko.wikipedia.org/wiki/SQL_%EC%82%BD%EC%9E%85)의 위험이 있을 수 있다. 그래서 [Prepared Statement](https://www.npmjs.com/package/mysql2#using-prepared-statements)라는 것을 대신 사용한다. 이유는 [이 사이트](https://stackoverflow.com/questions/8263371/how-can-prepared-statements-protect-from-sql-injection-attacks)를 참조.

### 단순 Multiple Connection

![2](https://user-images.githubusercontent.com/43839938/97099039-537dfa00-16c7-11eb-8b24-6f9b9bbe3fa7.png)


위의 문제를 해결하려면 클라이언트의 각 요청에 대해 개별 `Connection`을 사용해야 한다. 하지만 다수의 클라이언트가 요청을 하는 경우, 매번 `Connection`객체를 각각 생성해야 하기 때문에 생성에 대한 소요 시간이 많아진다. 

### Connection Pool

![3](https://user-images.githubusercontent.com/43839938/97099041-54af2700-16c7-11eb-8b01-b4971dafc7bf.png)

`Connection Pool`은 `단순 Multiple Connection` 의 문제를 해결할 수 있다. `Connection Pool`은 미리 일정량의 `Connection` 객체를 생성하고 `Pool`이라는 공간에 저장한다. DB에 `Connection`해야하는 클라이언트 요청이 들어올 때, 해당 `Pool`에 가서 이미 생성되어 있고, 사용가능한 `Connection`을 찾아 DB에 접근한다. 

npm mysql2 문서에는 다음과 같이 설명되어 있다. 

```
Connection pools help **reduce the time** **spent connecting to the MySQL server by reusing a previous connection**, leaving them open instead of closing when you are done with them.

This improves the latency of queries as you avoid all of the overhead that comes with establishing a new connection.
```

### Connection Release

이 `Connection`은 사용 이후 반드시 `Pool`에 다시 반납해줘야 한다. `Pool`에 있는 `Connection`을 재활용해야하기 때문이다. 가령, `Pool`에서 생성가능한 `Connection`의 개수가 최대 4개라고 할 때, `Release`하지 않은 상태에서 계속 `Connection`요청이 들어온다면, 5번째 요청 부터는 제대로 응답받지 못할 것이다. `Pool`에서 이미 4개의 `Connection`이 사용 중이고, 더 이상 사용가능한 `Connection`이 없어서 대기 상태에 빠지기 때문이다.

실제 실행 결과는 [이 포스트](http://blog.naver.com/PostView.nhn?blogId=pjt3591oo&logNo=221505148267&parentCategoryNo=&categoryNo=55&viewDate=&isShowPopularPosts=false&from=postView)의 `Connection limit` 부분을 참조하시라.

```jsx
...

try {
        const connection = await pool.getConnection(async conn => conn);
        try {

							const Query;
							const Params;

							const [ResultSet] = await connection.query( 
                    Query,
                    Params
                );
		
						} catch (err) {
		            connection.release(); // 다음과 같이 사용 이후에는 release를 해줘야 한다.
		            return res.json({isSuccess: false, code: 500, message: "서버 오류"});
			      }
    } catch (err) {
        return res.json({isSuccess: false, code: 501, message: "서버 오류"});

```

`Connection`연결 이후 **잘 사용 되고 나서도** `Release`를 해줘야 하지만, **Error가 발생했을 때도** 반드시 `Release`를 해줘야 한다. ( 나는 이 모든 부분을 고려하지 못해서 결국 `502 Bad Gateway` 문제가 발생했었다;)

## Pool에서 Connection의 최대 개수는 몇 개가 적당한가?

다음은 8개의 `Connection`을 최대로 활용할 수 있을 때 4개는 사용 중이고 4개는 대기 중인 상태의 `Connection Pool`의 상태이다.

![4](https://user-images.githubusercontent.com/43839938/97099042-5547bd80-16c7-11eb-8a1c-64ead16af993.png)


![image](https://user-images.githubusercontent.com/43839938/97099080-db640400-16c7-11eb-932c-d932ac936877.png)


위 4개 속성에 대한 조건은 논리적으로 따져서 결정하면 되지만, (가령, `maxIdle`은 `minIdle` 보다 작으면 안된다 등) 4개 속성을 모두 동일한 개수로 설정해도 무방하다. 중요한 건, `maxActive`의 값 자체이다. 

`Connection`의 개수를 크게 하면 메모리 소모가 크고 적게 하면 `Connection`이 많이 발생할 때 대기 시간이 발생하기 때문에 `Connection Pool`의 `Connection`개수는 어플리케이션의 요구사항과 사용자의 수, 서버 메모리, 서버 부하 등의 여러 요소를 고려해서 결정해야 한다.

---
#### Reference
- [NPM mysql2](https://www.npmjs.com/package/mysql2)
- [Commons DBCP 이해하기](https://d2.naver.com/helloworld/5102792)
- [DB Connection Pool에 대한 이야기](https://www.holaxprogramming.com/2013/01/10/devops-how-to-manage-dbcp/)
- [Node.js mysql 사용부터 pool 관리까지](http://blog.naver.com/pjt3591oo/221505148267)