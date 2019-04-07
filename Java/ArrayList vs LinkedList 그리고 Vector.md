# ArrayList vs LinkedList 그리고 Vector

`ArrayList`와 `LinkedList`는 `JCF(Java Collection Framework)`의 형태로 제공되며 `List` 인터페이스를 상속한다.

## ArrayList

`ArrayList`는 **데이터들이 순서대로 쭉 늘어선 배열의 형식**을 가지고 있으며 요소를 추가하거나 삭제 할 때는 이미 리스트의 크기가 정해져 있어서 **임시 배열을 생성해서 데이터를 복사**하는 방법을 사용한다.

![array_list](/assets/images/array_list.png)

`ArrayList`는 각 요소의 위치 값 즉, `index`를 가지고 있으므로 **해당 요소의 `index` 값을 통해 값에 접근**할 수 있다.

<br/>

## LinkedList

`LinkedList`는 각 노드의 앞과 뒤에 있는 **노드의 주솟값으로 연결**되어 있어서 요소를 추가하거나 삭제 할 때는 앞과 뒤쪽 노드의 주솟값만 바꿔주면 된다.

![linked_list](/assets/images/linked_list.png)

`LinkedList`는 **앞의 요소부터 차례대로 노드가 참조하고 있는 주소 값을 찾아가야 하므로** 검색이 느리다.

<br/>

> 즉, 데이터의 삽입, 삭제에 대한 처리가 많으면 `LinkedList`가 성능 상 유리하고 데이터의 검색 즉, 참조 처리가 많으면 `ArrayList`를 사용하는 것이 유리하다.

<br/>

## Vector

`Vector`의 기본적인 동작은 `ArrayList`와 동일하다. 하지만, 가장 큰 차이점은 동기화 처리에서 나온다.

**멀티쓰레드 환경에서 데이터의 동기화 처리는 중요한 부분**이다.<br/> `동기화`는 복수의 쓰레드로부터 데이터의 추가나 삭제가 일어났을 때 내부의 데이터는 안전하게 처리되도록 하는 것이다.

`Vector`의 경우 **무조건 동기화**처리를 한다. 즉, 싱글쓰레드 환경에서의 `Vector`는 `ArrayList`나 `LinkedList`보다 성능이 떨어진다.

사실, Java 1.2 버전 이상부터의 `Vector`는 이전 버전과의 호환을 위해서 많이 쓰인다. 동기화 처리가 필요환 환경에서는 `Collection.synchronizedCollection(Collection c)`나 `synchronized List, Map`을 사용하는 것이 성능상 더 유리하다.

<br/>
---

#### Reference

- [자료구조: Linked List 대 ArrayList](http://www.nextree.co.kr/p6506/)
- [ArrayList와 LinkedList의 차이](https://sung-studynote.tistory.com/49)
- [Java Vector와 ArrayList, LinkedList의 차이점](https://seeit.kr/36)

