# Composite 패턴

## Composite 패턴이란?

- 기존 객체를 `재사용`하여 복합 객체를 구성하는 패턴이다
- 새로운 객체를 구성할 때, 새로운 기능을 모두 작성하는 대신에 이미 존재하는 객체들을 기능을 복합적으로 엮어 처리 할 수 있다
- 트리 구조, 즉 `재귀적인 구조`로 구성하여 `전체-부분(Whole-part)`의 관계를 표현한다
- 단일 객체들을 한 곳에 모아서 효율을 강화하는 것에 목적을 둔다

> **Decorator** 패턴: 특정 객체에 기능을 덧붙여 주는 디자인 패턴

**Composite** 패턴: 기존 객체들을 통해 복합 객체를 만들어 내는 디자인 패턴

## Composite 패턴의 구성요소

![uml](https://user-images.githubusercontent.com/43839951/82133981-1581cd80-982d-11ea-923b-97bb4cbb12d6.JPG)

(1) Component


- 객체들의 집합 내에 들어있는 모든 객체들에 대한 인터페이스를 정의


- 인터페이스/ 추상 클래스로 정의되며 모든 객체들에게 공통되는 메소드를 정의해야 함


(2) Leaf


- 단일 객체의 행동을 정의

- 다른 객체에 대한 참조를 가질 수 없음

- Composite에서 지원하는 기능을 구현


(3) Composite


- 단일 객체를 가질 수 있는 구성요소의 행동을 정의


- 복합 객체와 단일 객체의 기능 모두 구현

## 예시

### Entry
```Java
public abstract class Entry {
	
	public abstract String getName();
	public abstract int getSize(); 
	public abstract Entry add();

	public void printList() {
		printList("");
	}

	protected abstract void printList(String prefix);

	public String toString() { // 문자열 표현
		return getName();
	}
}
```
### Directory
```java
public class Directory extends Entry {
	private String name;

	// 디렉토리 엔트리의 집합
	private Vector directory = new Vector(); 
	
	public Directory(String name) {
		this.name = name;
	}

	public String getName() { 
		return name;
	}

	public int getSize() {
		int size = 0;

		// 자신이 가지고 있는 모든 엔트리에 대해서, getSize( )호출하여 더한다.
		Iterator it = directory.iterator();
		while (it.hasNext()) {

			Entry entry = (Entry) 
			it.next();
			
			// entry가 디렉토리인 경우에는, 다시 이 디렉토리의 getSize( )가 재귀적으로 호출된다. 
			size += entry.getSize(); 
		}
		return size;
	}

	public Entry add(Entry entry) {

		//Entry(File 또는 Directory 객체)를 벡터에 저장
		directory.add(entry);

		return this;
	}

	protected void printList(String prefix) {

		 // 엔트리의 일람
		System.out.println(prefix + "/" + this);

		// 자신이 가지고 있는 모든 엔트리에 대해서, printList( )호출한다.
		Iterator it = directory.iterator();

		while (it.hasNext()) {
			Entry entry = (Entry) it.next();
			entry.printList(prefix + "/" + name);
		}
	}
}
```

### File
```java
public class File extends Entry {
	private String name;

	private int size;

	public File(String name, int size) {
		this.name = name;
		this.size = size;
	}

	public String getName() {
		return name;
	}

	public int getSize() {
		return size;
	}

	protected void printList(String prefix) {
		System.out.println(prefix + "/" + this);
	}
}

```
### Main
```java
     public static void main(String[] args) {
       
            Directory rootdir = new Directory("Dev-Docs");

            Directory CSS = new Directory("CSS");
            rootdir.add(CSS);

            Directory Javascript = new Directory("Javascript");
            rootdir.add(Javascript);

            File Ajax = new File("Ajax.md", 100);
            Javascript.add(Ajax);
            
            File WebToMobile = new File("WebToMobile.md", 100);
            CSS.add(WebToMobile);
            File Observer = new File("Observer.md", 100);
            
            Javascript.add(Observer);
            
            rootdir.printList();

            System.out.println("");
            System.out.println("CSS = " + CSS.getSize() + " size");     
            System.out.println("Javascript = " + Javascript.getSize() + " size");     
    }
```
### Result
```
/Dev-Docs/CSS
/Dev-Docs/CSS/WebToMobile.md
/Dev-Docs/Javascript
/Dev-Docs/Javascript/Ajax.md
/Dev-Docs/Javascript/Observer.md

CSS = 100 size
Javascript = 200 size
```
## Composite 패턴의 사용

- 객체들 간 계층 구조가 있을 경우

- 클라이언트가 단일 객체와 복합 객체를 구분하지 않고 동일한 형태로 사용하고자 경우

- 단일 객체와 복합 객체를 같은 방법으로 취급하는 방식으로 , 개별적인 객체들과 복합 객체의 처리 방법 차이가 없을 경우

## 패턴의 장단점

### 장점:

- 복합 객체를 사용하고 있는지, 단일 객체를 사용하고 있는지에 대해서 신경 쓰지 않아도 되므로 클라이언트를 단순화시킬 수 있다

- 복합 객체를 하나의 단일화된 객체처럼 취급 할 수 있으므로 "일괄적인 관리(반복 잡업 등)"시 편리하다

- 개별 객체들을 조합하여 동작이 다른 여러 복합 객체들을 만들어 낼 수 있어 확장성이 뛰어나다

- 기존의 코드를 수정하지 않아도 새로운 종류의 컴퓨넌트 객체를 추가하기 쉽다

### 단점:

- 설계를 일반화시켜 특정 Component 객체로만 Composite 객체를 구성하고 싶을 경우에 문제가 발생 할 수 있다.
Composite 패턴에서 Component 클래스의 모든 하위 클래스 객체는 동일하게 Composite 객체를 구성하기 위한 요소로 사용 될 수 있기 때문이다

## 논의점

Composite 패턴에서는 `1) 계층구조를 관리하는 일` `2) 하위 객체와 관련된 작업을 처리하는 일`의 2가지 역할을 하고 있는데, 이는 단일 역할 원칙에 위배되는 것이 아닌가?
- Composite 패턴은 단일 역할 원칙을 깨는 대신에 투명성을 확보 할 수 있는 패턴이라고 할수 있다. 투명성(transparency)란 추상 클래스에 하위 객체 관리, Leaf의 기능을 모두 넣음으로써 클라이언트에서 일괄적인 처리가 가능하도록 만든 효과를 말한다.



#### Reference


[DesignPattern : 컴포지트 (Composite)](http://egloos.zum.com/EireneHue/v/979992)


[헤드퍼스트 디자인 패턴: 11. 컴포지트 패턴](https://plposer.tistory.com/29)


[[디자인 패턴 7편] 구조 패턴, 컴퍼지트(Composite)](https://dailyheumsi.tistory.com/193)

