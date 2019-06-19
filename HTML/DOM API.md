# DOM API
DOM은 프로그래밍 언어가 자신에 접근하고 수정할 수 있는 방법을 제공하는데, 제공된 프로퍼티와 메소드의 집합을 **DOM API**라고 한다. DOM API는 대체로 자바스크립트 객체로 제공되며, 다음의 자바스크립트 API로 DOM의 요소를 조작할 수 있다.

<br/>

## 요소 접근
* [getElementById](#getelementbyid)
* [getElementsByClassName](#getelementsbyclassname)
* [querySelector와 querySelectorAll](#queryselector-&-queryselectorall)

### getElementById
```html
<p id="getId">getId</p>

<script>
    document.getElementById("getId");
</script>
```
id 속성값으로 Element node를 하나 선택한다.   
> (출력값) `<p id="getId">getId</p>`

### getElementsByClassName
```html
<p class="getClass">class1</p>
<p class="getClass">class2</p>
<p class="getClass">class3</p>
<p class="getClass">class4</p>

<script>
    document.getElementsByClassName("getClass");
</script>
```
> (출력값) `HTMLCollection(4) [p.getClass, p.getClass, p.getClass, p.getClass]`

class 속성값으로 모든 Element node를 선택한다.   
선택된 node들은 `HTMLCollection`으로 반환된다.
`HTMLCollection`은 **유사배열**이며, **실시간으로 node의 변경이 반영**된다. 따라서 다음과 같은 특징을 갖는다.

* 배열 메소드를 사용할 수 없다.
    ```js
    var classes = document.getElementsByClassName("getClass");
    classes.forEach(el => el.innerText = "changed");
    //에러발생
    ```
* `length` 속성과 `index`를 사용할 수 있다.
* 클래스 변동시 반복문 사용에 유의해야한다.
    ```js
    var classes = document.getElementsByClassName("getClass");
    for(let i = 0; i<classes.length; ++i){
        classes[i].className = "changed";
    }
    ```
    예상대로라면 `classes[0]`부터 `classes[3]`까지 요소들의 className이 바뀌었을 것 같지만 실제로는 `classes[0]`과 `classes[2]`의 className만 바뀐다. 이유는 다음과 같다.
    1. `i=0`일 때 `classes.length = 4`이고 `classes[0]`은 `HTMLCollection`의 첫번째 요소를 가리킨다. className이 변경된 후 `HTMLCollection`에 node의 변경이 실시간으로 적용된다. 즉, `HTMLCollection`의 첫번째 요소가 사라져 `length`와 `index`가 다음과 같이 변경된다.  
    ![HTMLCollection](/assets/images/HTMLCollection.png)
    2. 따라서 `i=1`일 때 `classes.length = 3`이 되고 `classes[1]`는 이전 `HTMLCollection`의 세번째 요소를 가리키게 된다. 
    3. 또 다시 node의 변경이 적용되어 `classes.length = 2`가 되어 반복문이 종료된다.   
    
    이 문제를 해결하기 위해 다음 방법들을 쓸 수 있다.  
    * 반복문을 역방향으로 돌린다. 
        ```js
        var classes = document.getElementsByClassName("getClass");
        for(let i=classes.length-1; i >= 0; --i){
            classes[i].className = "changed";
        }
        ```
    * HTMLCollection을 배열로 변경한다.
        ```js
        var classes = document.getElementsByClassName("getClass");
        var arrClass = [...classes]; 
        for(let i=0; i < arrClass.length; ++i){
            arrClass[i].className = "changed";
        }
        ```

### querySelector & querySelectorAll
`querySelector`와 `querySelectorAll`를 이용하면 `#`, `.`, `input[type=text]` 등과 같은 css 선택자로 요소에 접근할 수 있다.   
`querySelectorAll`은 가져온 모든 요소를 **NodeList**로 가져온다. `NodeList`는 `HTMLCollection`과 달리 **node의 변동이 실시간으로 적용되지 않는다.** 

<br/>

## 요소 탐색
* 노드탐색  
    parentNode  
    childNode, firstChild, lastChild   
    previousSibling, nextSibling 등
* 요소탐색   
    children, firstElementChild, lastElementChild  
    previousElementSibling, nextElementSibling 등


노드 탐색 시 주의해야할 점은 요소간의 공백도 텍스트 노드로 취급한다는 것이다. 따라서 탐색결과가 기대와 다를 수 있다. 
```HTML
<ul>
    <li id="a" class="1"></li>  
    <li id="b" class="2"></li>
    <li class="3"></li>
</ul>
```
즉, `li.a`의 `nextSibling`으로 `li.b`를 기대했지만 공백이 반환될 수도 있다. 이런 상황을 피하기 위해 위의 요소 탐색을 할 수 있다.   
또한 여러 요소가 반환되는 경우 노드 탐색은 `NodeList`로, 요소 탐색 `HTMLCollection`으로 반환된다. 

<br/>

## 요소 조작 - classList

`classList`에는 다음과 같은 메소드가 있다. 
```js
var target = document.getElementById("target");
target.classList.add('added');
target.classList.remove('added');
target.classList.contains('added'); //boolean 반환
target.classList.replace('target', 'changed');
target.classList.toggle('active');
```
특히 다음과 같이 `toggle`을 사용하는 경우, `add`와 `remove`를 일일이 해줄 필요가 없기 때문에 매우 편리하다.



<br/>

---
#### Reference
[문서 객체 모델(Document Object Model)](https://poiemaweb.com/js-dom)
