# 유니온 파인드(Union Find)

상호 배타적집합(disjoint-set) 이라고도 한다. 여러 노드 중 두 개의 노드씩 같은 집합으로 묶어가며 다른 노드가 같은 집합에 있는지 확인하는 그래프 알고리즘이다. 집합을 표현하기 위해 트리를 사용하며, 이를 위해 두 가지 연산을 한다.

​	노드 x와 y를 찾았다고 가정

-   Find : 노드 x가 어떤 집합에 포함되어 있는지 찾는 연산
-   Union : 노드 x가 포함된 집합과 노드 y가 포함된 집합을 합치는 연산

>   예시 문제 - [섬 연결하기(프로그래머스)](https://programmers.co.kr/learn/courses/30/lessons/42861)

## Union Find

### 부모 노드

트리를 이용하여 부모와 원소의 인덱스를 매핑한다. `parent[i]` 를 노드 `i` 의 부모 노드로 정의한다. 따라서 `parent[i] = i` 라면 루트 노드이다.

```java
for (int i = 0; i < MAX_SIZE; i++) {
    parent[i] = i;
}
```

>   초기 값으로 자기 자신을 부모 노드라고 정의해준다.

### Find

`parent[i] = i` 인 점을 이용해서 부모 노드를 찾을 때 까지 반복하여 탐색한다.

```java
int find(int x) {
    if (parent[x] == x) {
        return x;
    }
    
    return find(parent[x]);
}
```

>   예시
>
>   ```text
>   [0] : 1, [1] : 2, [2] : 2, [3] : 1
>   
>     [2]
>      |
>     [1]
>    ┌─┴─┐
>   [0] [3]
>   ```
>
>   위의 경우 루트 노드는 index와 value가 같은 [2]이다.

### Union

매개변수로 두 개의 노드를 받은 뒤 각 집합을 합쳐준다. `x` 를 `y` 에 합치든 `y` 에 `x` 를 합치든 똑같다. 

```java
void union(int x, int y) {
    int rootX = find(x);
    int rootY = find(y);
    parent[rootX] = rootY;
}
```



>   예시
>
>   ```text
>   [0] : 1, [1] : 2, [2] : 2, [3] : 1, [4] : 4
>   
>     [2]  [4]
>      |
>     [1]
>    ┌─┴─┐
>   [0] [3]
>   
>   union(2, 4);
>   
>   [0] : 1, [1] : 2, [2] : 4, [3] : 1, [4] : 4
>   
>     [4]
>      |
>     [2] 
>      |
>     [1]
>    ┌─┴─┐
>   [0] [3]
>   ```
>
>   위의 경우 루트 노드는 index와 value가 같은 [2]이다.

## 시간복잡도 개선

위에서 살펴본 방법의 시간복잡도는 `O(n)` 이다. 위의 예시는 최악의 케이스에 가까운데, `union`의 예시처럼 높이가 낮은 트리에 높은 트리가 자식 노드로 붙게 되면 해당 트리는 끊임없이 길어질 것이다. 이 때, `find` 가 최하위에 있는 자식부터 탐색을 할 경우 트리의 높이만큼 올라가며 탐색해야한다. 이를 해결하기 위해  **path compression** 과 **union by rank** 가 사용된다. 이 기법들을 적용하면 시간복잡도가 `O(log n)` 으로 개선된다.



### Path Compression

말 그대로 경로를 압축해주는 것인데, `find` 를 할 때, 루트 노드를 찾은 경우 루트 노드의 자식 노드로 현재 노드를 붙여준다.

```java
int find(int x) {
    if (parent[x] == x) {
        return x;
    }
    
    parent[x] = find(parent[x]); // 루트 노드를 찾으면 x의 부모를 루트로 바꿔준다.
    return parent[x];
}
```

>   예시
>
>   ```
>   [0] : 1, [1] : 2, [2] : 2, [3] : 1
>   
>     [2]
>      |
>     [1]
>    ┌─┴─┐
>   [0] [3]
>   
>   find(0);
>   
>   [0] : 2, [1] : 2, [2] : 2, [3] : 1
>   
>     [2]
>    ┌─┴─┐
>   [0] [1]
>        |
>       [3]
>   ```

### Union By Rank

말 그대로 순위에 따라 `union` 을 하는 것이다. 자식 노드의 개수에 따라 우선 순위를 매기고 합치는 것이다. 따라서 `rank` 배열을 따로 만들어준다.

```java
for (int i = 0; i < MAX_SIZE; i++) {
    rank[i] = i;
}
```

`rank` 를 이용하여 더 낮은 쪽에 합쳐준다.

```java
void union(int x, int y) {
    int rootX = find(x);
    int rootY = find(y);
    
    if (rootX == rootY) {
    // rootX와 rootY가 같다는 것은 같은 그룹이라는 뜻이다.
      return;
    }
  
    if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
        rank[rootY] += rank[rootX];
        return;
    }
    
    parent[rootY] = rootX;
    rank[rootX] += rank[rootY];
}
```

```text
[0] : 1, [1] : 2, [2] : 2, [3] : 1, [4] : 4

  [2]  [4]
   |
  [1]
 ┌─┴─┐
[0] [3]

union(2, 4);

[0] : 1, [1] : 2, [2] : 4, [3] : 1, [4] : 4

    [2] 
   ┌─┴─┐
  [1] [4]
 ┌─┴─┐
[0] [3]
```

## 공간복잡도 개선

하지만 위와 같은 방식은 똑같은 크기의 `parent` 와 `rank` 가 존재하여 메모리를 많이 차지한다. 이를 위해 부모노드와 순위를 함께 표시할 수 있다. `parent` 배열에 음수를 함께 넣어 부모 노드와 rank를 함께 저장하는 것이다.

예를 들어, `parent[2]` 의 값이 `-3` 일 경우 2번 노드를 포함하여 총 3개의 노드로 이루어진 트리라는 뜻이다.

>   자식의 수는 2개

또한 `parent[3]` 의 값이 5일 경우 3번 노드의 부모는 5번 노드라는 것이다.

쉽게 얘기하면 `parent[i] == i` 인 경우를 없애고 해당 경우에 트리의 노드 개수를 저장하는 것이다. 이외의 경우는 자식이 부모 노드를 가리킨다.

### 부모 노드

모두 -1 로 초기화해준다.  만약 `parent[i]` 가 0보다 작을 경우 `i` 는 루트 노드다.

```java
for (int i = 0; i < MAX_SIZE; i++) {
    parent[i] = -1;
}
```

### Find

기본적인 동작은 이전과 같고, 매개변수 `x` 가 루트 노드인지 판단할 때 0보다 작은지 판단한다.

```java
int find(int x) {
    if (parent[x] < 0) {
        return x;
    }
    
    parent[x] = find(parent[x]);
    return parent[x];
}
```

### Union

주의할 점은 마찬가지로 루트 노드의 값이 음수라는 점이다. 즉, 트리의 높이를 판단할 때 `parent[root]` 의 값이 음수이기 때문에 작을 수록 높은 트리이다. 직관적인 판단을 위해 -1씩 곱해줬다.

>   -1을 곱하지 않으면 높이 3인 트리의 루트 노드 `parent[x]` 는 -3, 높이 5인 루트 노드 `parent[y]` 는 -5가 되기 때문에 `parent[y]` 의 값이 더 높지만 판단을 거꾸로 해야 한다.

```java
void union(int x, int y) {
    int rootX = find(x);
    int rootY = find(y);

    if (rootX == rootY) {
        return;
    }

    if (parent[rootY] * -1 < parent[rootX] * -1 ) {
        parent[rootX] += parent[rootY];
        parent[rootY] = rootX;
        return;
    }

    parent[rootY] += parent[rootX];
    parent[rootX] = rootY;
}
```

## 마치며

단순한 집합 구성이나 사이클 판단 외에도 [최소 신장 트리(Minimum Spanning Tree; MST)](https://ratsgo.github.io/data%20structure&algorithm/2017/11/28/MST/) 를 얻는데 사용할 수 있다. 이 때는 단독으로 사용되지는 않고 [크루스칼 알고리즘](https://ko.wikipedia.org/wiki/%ED%81%AC%EB%9F%AC%EC%8A%A4%EC%BB%AC_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)의 사이클 판단에 사용된다.

---

#### References

-   [Disjoint Set (Or Union-Find) | Set 1 (Detect Cycle in an Undirected Graph)](https://www.geeksforgeeks.org/union-find/)
-   [Union-Find Algorithm | Set 2 (Union By Rank and Path Compression)](https://www.geeksforgeeks.org/union-find-algorithm-set-2-union-by-rank/)
-   [Union/Find and the Parent Pointer Implementation](https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/UnionFind.html)
-   [[Algorithm] 유니온 파인드(Union - Find)](https://ssungkang.tistory.com/entry/Algorithm-%EC%9C%A0%EB%8B%88%EC%98%A8-%ED%8C%8C%EC%9D%B8%EB%93%9CUnion-Find)
