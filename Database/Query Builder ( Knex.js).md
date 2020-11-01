# Query Builder - Knex.js

REST API를 설계 /  구현할 때, 각 API에 해당하는 SQL문을 직접 만들어서 코드에 넣곤 했다. 가령, **회원정보 조회 API** (`GET` `/users`)라면 `Select를 이용한 Query`를, **회원정보 수정 API** (`PATCH` `/user/{userNo}`)라면 `Update를 이용한 Query`를 코드에 넣었다. 하지만 **조회** 시에 몇 가지 필터를 건다든가 **수정**을 할 때 매번 넘겨주는 컬럼의 종류 / 개수가 다른 경우에는 그에 맞게 Query를 변경해줘야 하는 이슈가 생긴다. 물론 각각의 조건을 걸어서 그에 맞는 Query를 작성할 수 있지만, 이를 좀 더 수월하게 해주는 Query Builder를 사용하기로 했다. 

현재는 Node.js로 API를 구성하고 있기 때문에 Node.js에서 많이 사용되는 Query Builder를 찾았다. 바로 `[Knex.js](http://knexjs.org/)`라는 라이브러리이다.

**Knex.js** (pronounced /kəˈnɛks/) is a "batteries included" SQL query builder for **Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift** designed to be flexible, portable, and fun to use. It features both traditional node style callbacks as well as a promise interface for cleaner async flow control, a stream interface, full featured query and **schema builders**, **transaction support (with savepoints)**, **connection pooling** and standardized responses between different query clients and dialects.

Knex.js는 다양한 DBMS(**Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift**)를 지원하고 있고 단순 Query 생성 뿐만 아니라 **schema builder, transaction, connection pooling** 등의 기능도 지원하고 있다. 자세한 내용은 [공식홈페이지](http://knexjs.org)를 살펴보자.

우선 프로젝트에 `npm install knex —save` 로 knex 모듈을 추가하고 다음과 같이 DB에 연결한다. 

```jsx
// knex.js

const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '',
        user: '',
        password:'',
        database: ''
    }
}) //  DB 구성에 맞게 설정하자.

module.exports = {
    knex: knex
};
```

참고로, 그냥 mysql 모듈을 사용하면 다음과 같은 오류가 나서 [구글링](https://www.inflearn.com/questions/3637)을 해보니 mysql2 모듈을 사용하여 해결할 수 있었다.

```
Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
```

예제를 살펴보자. 우선 나는 **일부 수정을 위한 API** 에서 클라이언트가 어떤 컬럼을 수정하고 싶은지 모르는 상태이다. (가령 회원정보 수정 API라면 name, age, birth 등) 하지만 몇 개를 수정하든 상관없이 넘겨 주는 컬럼 값들에 대해서 수정할 수 있는 Query를 만들기 위해 Knex.js를 사용하고 싶었다. 이 해결의 실마리는 다음 코드에서 살펴볼 수 있다.

```jsx
knex('books')
  .where('published_date', '<', 2000)
  .update({
    status: 'archived',
    thisKeyIsSkipped: undefined
  })
// Outputs:
update `books` set `status` = 'archived' where `published_date` < 2000
```

`thisKeyIsSkipped: undefined`로 설정한 Query Builder의 Outputs을 보면 thisKeyIsSkipped는 Query에 들어가지 않는 것을 확인할 수 있다. 만일 이런 Query Builder를 사용하지 않고 날 Query를 일일이 만들어줘야 한다면 어떤 컬럼이 undefined인지 확인 하고 그에 해당하는 Query를 만들어 줘야 하기 때문에 코드가 복잡해질 것이다.

위를 바탕으로 다음과 같이 코드를 작성하면 짜잘한 일에 시간을 쏟지 않아도 된다.  

```jsx
// userController.js

// Client로 부터 userAge, userName, userBirth가 있으면 받아오는 코드

knex('User')
  .where('published_date', '<', 2000)
  .update({
    age: userAge,
    name: userName,
		birth: userBirth
  })
```

이렇게 작성하면 Client에서 age만 넘기든, age와 name을 넘기든 혹은 3가지를 다 넘기든 상관없이 undefined인 컬럼을 제외한 Query가 자동으로 생성될 것이다.

transaction의 기능도 제공하니, transaction 처리가 필요한 곳에서도 knex.js를 통해 사용할 수 있다. 다음 코드는 `Catalogues` 테이블에 Old Books를 추가하고 Old Books `Catalogues`에 속하는 책 3권을 `Books` 테이블에 넣어주는 로직을 transaction으로 처리하고 있다. 

```jsx
// Using trx as a transaction object:
knex.transaction(function(trx) {

  const books = [
    {title: 'Canterbury Tales'},
    {title: 'Moby Dick'},
    {title: 'Hamlet'}
  ];

  knex.insert({name: 'Old Books'}, 'id')
    .into('catalogues')
    .transacting(trx)
    .then(function(ids) {
      books.forEach((book) => book.catalogue_id = ids[0]);
      return knex('books').insert(books).transacting(trx);
    })
    .then(trx.commit)
    .catch(trx.rollback);
})
.then(function(inserts) {
  console.log(inserts.length + ' new books saved.');
})
.catch(function(error) {
  // If we get here, that means that neither the 'Old Books' catalogues insert,
  // nor any of the books inserts will have taken place.
  console.error(error);
});
```

await/async 방식은 다음과 같이 사용할 수 있다.

```jsx
try {
  await knex.transaction(async trx => {

    const books = [
      {title: 'Canterbury Tales'},
      {title: 'Moby Dick'},
      {title: 'Hamlet'}
    ];

    const ids = await knex('catalogues')
      .insert({
        name: 'Old Books'
      }, 'id')
      .transacting(trx)

    books.forEach(book => book.catalogue_id = ids[0])
    await knex('books')
      .insert(books)
      .transacting(trx)

    console.log(inserts.length + ' new books saved.')
  })
} catch (error) {
  console.error(error);
}
```

물론, Raw SQL를 작성하는 것이 Knex.js를 통한 작성보다 쉬울 때가 많다. 그 때는 Raw SQL문을 사용하고 (Query Builder에서 Raw SQL도 지원한다), Raw SQL이 아닌 Query Builder가 좀 더 수월하게 코드를 작성할 경우에는 Query Builder를 사용하여 작성하면 된다.

---
#### Reference
- [Knex.js](http://knexjs.org)
- [nodejs와 mysql 연동 에러](https://www.inflearn.com/questions/3637)
