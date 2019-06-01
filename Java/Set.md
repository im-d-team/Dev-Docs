# Iterable
![Collection_Hierarchies](/assets/images/Collection_Hierarchies.png)

주요 컬렉션 인터페이스에는 `List<E>`, `Set<E>`, `Queue<E>` 그리고 `Map<K,V>`가 있다.    
`List<E>`, `Set<E>`, `Queue<E>`의 최상위 인터페이스는 `Collection<E>`이고, `Collection<E>`은 `Iterable<T>`를 구현한다. `Iterable`은 컬렉션에 대한 반복자로, `Iterable<T>`을 구현한 클래스 객체는 `hasNext()`, `next()`, `for-each Loop` (향상된 for문)등을 사용할 수 있다. 
```java
public class test {
	public static void main(String[] args) {
		List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

		//for-each Loop
		for(Integer i : list) {
			System.out.printf("%d ", i);
		}

		//hasNext(), next();
		Iterator<Integer> it = list.iterator();
		
		while(it.hasNext()){
			System.out.printf("%d ", it.next());
		}
	}
}
```
  
<br/>  

# Set
1. 중복을 허용하지 않는다.
2. 동기화를 지원하지 않는다. 
3. null도 저장된다.

## HashSet
HashSet은 **HashTable**에 원소를 저장한다. HashTable은 해시값으로 데이터를 매핑하기 때문에 작은 크기의 메모리로 데이터를 관리할 수 있다. 또한 데이터에 해시값으로 접근해 모든 데이터를 살피지 않고 검색과 삽입/삭제 등을 빠르게 할 수 있다. 따라서 성능면에서는 HashSet이 가장 우수하다.  

![HashTable](/assets/images/HashTable.png) 

HashSet은 내용이 같은지 비교하는 `equals()`와 객체가 같은지 비교하는 `hashcode()`를 이용해 삽입되는 요소의 중복을 체크한다.
	
<br/>

## LinkedHashSet
LinkedHashSet은 **HashTable**과 **LinkedList**를 구현한 클래스로, HashSet의 문제점인 순서의 불명확성을 제거한 방법이다. LinkedHashSet에 삽입한 순서대로 저장된다.

<br/>

## TreeSet
TreeSet은 삽입한 요소들의 값들을 정렬해서 반환해준다. TreeSet은 Comparable 인터페이스의 `compareTo()`나 Comparator 인터페이스의 `compare()`메소드를 이용해 값을 정렬하기 때문에, 사용자가 생성한 객체를 정렬하고자 하는 경우에는 Comparable 인터페이스나 comparator인터페이스를 구현한 클래스로 객체를 생성해야한다. 

> 참고) Im-D/Dev-Docs [Comparable vs Comparator
](https://github.com/Im-D/Dev-Docs/blob/master/Java/Comparable%20vs%20Comparator.md) 

```java
public class Person implements Comparable<Person>{
	private int age;
	
	Person(int age){
		this.age = age;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	@Override
	public String toString() {
		return "나이 : " + this.getAge();
	}

	@Override
	public int compareTo(Person o) {
		// 오름차순
		return this.age - o.age;
	}
}
```
```java
public class test2 {
	public static void main(String[] args) {
		Set<Person> set = new TreeSet<Person>();

		set.add(new Person(14));
		set.add(new Person(12));
		
		for(Person p : set) {
			System.out.println(p.toString());
		}
	}
}
```

---
#### Reference  

[해싱, 해시함수, 해시테이블](https://ratsgo.github.io/data%20structure&algorithm/2017/10/25/hash/)