# Redux State 정규화(Normalization)

<br/>

## 상태 정규화의 필요성

많은 애플리케이션들은 실제로 중복된 데이터들을 많이 처리한다. Facebook의 타임라인을 예로 들어보자.

각각의 포스트가 있고 그 포스트에는 많은 사람들의 댓글, 좋아요, 공유 등의 작업이 일어난다.

이렇듯 상태 데이터 구조가 복잡해질수록 정규화가 필요한 이유에 대해 Redux docs에서는 다음과 같이 설명하고 있다.

> * When a piece of data is duplicated in several places, it becomes harder to make sure that it is updated appropriately.<br/>**(데이터가 제대로 업데이트 되었는지 확인하기 어렵다.)**
> * Nested data means that the corresponding reducer logic has to be more nested and therefore more complex. In particular, trying to update a deeply nested field can become very ugly very fast.<br/>**(Nested 데이터가 늘어나고 깊이 내장되어 있는 데이터일수록 업데이트하기 어려워진다.)**
> * Since immutable data updates require all ancestors in the state tree to be copied and updated as well, and new object references will cause connected UI components to re-render, an update to a deeply nested data object could force totally unrelated UI components to re-render even if the data they're displaying hasn't actually changed.<br/>**(불변 데이터를 업데이트 할 때 깊이 내장된 데이터일수록 상위 데이터들까지 업데이트 되어야하고 이는 관련되지 않은 UI 컴포넌트까지 리렌더링될 수 있다.)**

<br/>

## 상태 정규화

보통의 포스팅과 댓글은 아래와 같은 데이터 구조를 가질 것이다.

```js
const blogPosts = [
  {
    id: 'post1',
    author: { username: 'user1', name: 'User 1' },
    body: '......',
    comments: [
      {
        id: 'comment1',
        author: { username: 'user2', name: 'User 2' },
        comment: '.....'
      },
      {
        id: 'comment2',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....'
      }
    ]
  },
  {
    id: 'post2',
    author: { username: 'user2', name: 'User 2' },
    body: '......',
    comments: [
      {
        id: 'comment3',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....'
      },
      {
        id: 'comment4',
        author: { username: 'user1', name: 'User 1' },
        comment: '.....'
      },
      {
        id: 'comment5',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....'
      }
    ]
  }
  // and repeat many times
]
```

이를 정규화하면 다음과 같이 변경될 수 있다.

```js
{
    posts : {
        byId : {
            "post1" : {
                id : "post1",
                author : "user1",
                body : "......",
                comments : ["comment1", "comment2"]
            },
            "post2" : {
                id : "post2",
                author : "user2",
                body : "......",
                comments : ["comment3", "comment4", "comment5"]
            }
        },
        allIds : ["post1", "post2"]
    },
    comments : {
        byId : {
            "comment1" : {
                id : "comment1",
                author : "user2",
                comment : ".....",
            },
            "comment2" : {
                id : "comment2",
                author : "user3",
                comment : ".....",
            },
            "comment3" : {
                id : "comment3",
                author : "user3",
                comment : ".....",
            },
            "comment4" : {
                id : "comment4",
                author : "user1",
                comment : ".....",
            },
            "comment5" : {
                id : "comment5",
                author : "user3",
                comment : ".....",
            },
        },
        allIds : ["comment1", "comment2", "comment3", "commment4", "comment5"]
    },
    users : {
        byId : {
            "user1" : {
                username : "user1",
                name : "User 1",
            },
            "user2" : {
                username : "user2",
                name : "User 2",
            },
            "user3" : {
                username : "user3",
                name : "User 3",
            }
        },
        allIds : ["user1", "user2", "user3"]
    }
}
```

* 각각의 데이터는 자신만의 테이블을 가지도록 한다.<br/>(위에선 post, comments, users로 분리하였다.)

* 각 테이블들은 해당 테이블과 관련된 개별적인 아이템들을 하나의 객체 안에 저장한다.

* 각각의 아이템에 대한 참조는 ID를 통해 수행된다.

* 배열(`posts.allIds`) 안의 ID들은 **순서**를 나타낸다. 

<br/>

## Redux State Normalization

결론적으로 **Redux 상태 정규화는 Database의 정규화를 생각하면 편하다.**

어떤 애플리케이션이든 중복된 데이터 구조를 가지는 것은 당연하고 DB에서는 이를 정규화를 통해 해결한다. 예를 들어 다대다(Many to Many) 관계를 가지는 테이블 사이에 관계 테이블을 만들어 중첩되는 필드를 분리한다. 

이처럼 각각의 데이터를 각각의 테이블 구조로 만들고 내부의 데이터들은 ID배열을 가지고 참조하는 방식으로 구성하는 것이다.

이처럼 구조를 개선했을 때 **가장 큰 장점은 ID 값을 기반으로 참조를 하기 때문에 특정 데이터가 바뀌었을 때 상위 데이터들의 업데이트를 신경쓰지 않아도 되는 것**이다.

예를 들어, 댓글을 수정할 경우 `comments.byId.comment` 부분의 새로운 복사본만 필요로 할 것이다.

상태 정규화를 위해 주로 사용되는 라이브러리에는 [Normalizr](https://github.com/paularmstrong/normalizr)가 있다.

<br/>

PR Test

---

#### Reference

- [Structuring Reducers - Normalize State Shape](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
