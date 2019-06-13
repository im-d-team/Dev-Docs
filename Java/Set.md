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
			System.out.printf("%d ", it.next()	);
		}
	}
}
```
  
<br/>  

# Set
1. 중복을 허용하지 않는다. 
2. 동기화를 지원하지 않는다. 

	[참고 ) Collection Synchronization](https://madplay.github.io/post/java-collection-synchronize)

## HashSet
### 중복확인
```java
public class Test {
	public static void main(String[] args) {
		Set<String> set = new HashSet<String>();
		String str = "java";
		
		//중복 허용 X
		System.out.println(set.add(str));
		System.out.println(set.add(str));
		
		//해시코드 확인
		System.out.println(set.hashCode());
		System.out.println(str.hashCode());  
	}
}

//true
//false 
//3254818
//3254818
```
HashSet은 요소의 중복을 체크하기 위해 `hashCode()`를 호출해 반환된 해시값으로 검색할 범위를 결정한 뒤, 해당 범위 내의 요소들을 `equals()`로 비교한다. 다만, 객체를 생성할 때에는 다음과 같이 같은 값을 갖는 인스턴스를 만들어도 서로 다른 해시코드가 반환되기 때문에 같은 값을 갖는 인스턴스들이 중복되어 저장될 수 있다. 따라서 객체를 저장할 때에는 `hashcode()`와 `equals()`를 오버라이딩 해주어야한다. 
```java
public class Test {
	public static void main(String[] args) {
		Set<Person> set = new HashSet<Person>();
		Person p1 = new Person("Kim", 10);
		Person p2 = new Person("Kim", 10);
		
		//중복 허용 
		System.out.println(set.add(p1));
		System.out.println(set.add(p2));
		
		//해시코드 확인
		System.out.println(p1.hashCode());
		System.out.println(p2.hashCode());
	}
}

//true
//true
//2018699554
//1311053135
```
`hashcode()`와 `equals()` 오버라이딩
```java
public class Person {
	private String name;
	private int age;
	
	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}

	@Override
	public int hashCode() {
		return (name + age).hashCode();
	}
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Person) {
	           Person temp = (Person)obj;
	           return this.name.equals(temp.name) && (this.age == temp.age);
	    } else {
	           return false;
	    }
    }
}
```  
<br/>

### HashTable
HashSet은 **HashTable**에 원소를 저장한다. HashTable은 해시값으로 데이터를 매핑하기 때문에 작은 크기의 메모리로 데이터를 관리할 수 있다. 또한 데이터에 해시값으로 접근하기 때문에 모든 데이터를 살피지 않고 검색과 삽입/삭제 등을 빠르게 할 수 있다. 따라서 성능면에서는 HashSet이 가장 우수하다.  

![HashTable](/assets/images/HashTable.png) 
	
<br/>

## LinkedHashSet
LinkedHashSet은 **HashTable**과 **LinkedList**를 구현한 클래스로, HashSet의 문제점인 순서의 불명확성을 제거한 방법이다. LinkedHashSet에 삽입한 순서대로 저장된다.
```java
//HashSet
public class Test {
	public static void main(String[] args) {
		Set<Person> set = new HashSet<Person>();
		Person p1 = new Person("Kim", 10);
		Person p2 = new Person("Lee", 12);
		Person p3 = new Person("Choi", 14);
		Person p4 = new Person("Park", 16);
		Person p5 = new Person("Kang", 18);
		
		set.add(p1);
		set.add(p2);
		set.add(p3);
		set.add(p4);
		set.add(p5);
		
		for(Person p : set) {
			System.out.println(p.toString());
		}
	}
}
/*
name : Choi / age : 14
name : Lee / age : 12
name : Kang / age : 18
name : Kim / age : 10
name : Park / age : 16
*/
```
```java
//LinkedHashSet
public class Test {
	public static void main(String[] args) {
		Set<Person> set = new LinkedHashSet<Person>();
		Person p1 = new Person("Kim", 10);
		Person p2 = new Person("Lee", 12);
		Person p3 = new Person("Choi", 14);
		Person p4 = new Person("Park", 16);
		Person p5 = new Person("Kang", 18);
		
		set.add(p1);
		set.add(p2);
		set.add(p3);
		set.add(p4);
		set.add(p5);
		
		for(Person p : set) {
			System.out.println(p.toString());
		}
	}
}
/*
name : Kim / age : 10
name : Lee / age : 12
name : Choi / age : 14
name : Park / age : 16
name : Kang / age : 18
*/
```
<br/>

## TreeSet
TreeSet은 삽입한 요소들의 값들을 정렬해서 반환해준다. TreeSet은 Comparable 인터페이스의 `compareTo()`나 Comparator 인터페이스의 `compare()`메소드를 이용해 값을 정렬하기 때문에, 사용자가 생성한 객체를 정렬하고자 하는 경우에는 Comparable 인터페이스나 comparator인터페이스를 구현한 클래스로 객체를 생성해야한다. 

> 참고 ) Im-D/Dev-Docs [Comparable vs Comparator
](https://github.com/Im-D/Dev-Docs/blob/master/Java/Comparable%20vs%20Comparator.md) 

```java
public class Person implements Comparable<Person>{
	private int age;
	
	Person(int age){
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


[Set 컬렉션 클래스](http://tcpschool.com/java/java_collectionFramework_set)
