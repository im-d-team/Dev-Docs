# 바인딩(Binding)
**바인딩**은 **이름**을 어떠한 **속성**과 **연결** 시키는 것이다. 더 나아가 바인딩은, 값들을 확정시켜 더 이상 **변경할 수 없는 상태**로 만든다. 또한, **메모리 번지를 연결** 시키는 것도 바인딩이다. 좀 더 정확하게 말하면 바인딩은 식별자(identifiers)를 개체(entity)와 결합(association; 연관)시키는 것이다. 

> bind는 묶다, 결속시키다 등의 뜻을 가지고 있는데, 고정, 구속, 속박 등과 같이 틀 안에 가둬 놓는 뉘앙스를 띈다.

> 이름을 연결하는 것이기 때문에 'Name binding' 이라고도 한다.

<br/>

## 바인딩 타임(Binding Time)

바인딩은 프로그램 실행 과정 중 어떤 단계에서 이루어지는지에 따라 역할이 달라진다. 이 때, 특정 단계에서 바인딩이 되는 순간을 바인딩 타임이라 한다. 

### 바인딩 타임의 종류

1. 언어 설계(정의) 시간(Language Design/Definition Time)
- 언어의 근본적인 요소를 결정
- 기본 제공 함수, 키워드의 기본 요소 등을 결정

    > e.g. int는 정수값을 나타내는 타입명, +는 덧셈 연산자를 나타내는 기호

2. 언어 구현 시간(Language Implementation Time)
- 언어 설계 시간에 정해진 각 유형들의 세부정보를 결정
- 타입의 크기, 파일 표현, 런타임 예외 등을 결정

    > e.g. java에서 int의 범위는 -2147483648 ~ 2147483647

3. 컴파일 타임(Compile Time)
- 원시 코드(source code)를 기계어로 매핑(mapping)
- 변수와 변수 타입을 연결(type binding)
4. 링크 타임(Link Time)
- 함수와 외부에서 참조된 객체(e.g. 라이브러리)의 유효성과 주소 검사 및 수정
5. 로드 타임(Load time; 적재 시간)
- 변수를 메모리에 할당(allocation) 하는 단계(주소 결정)
6. 런타임(Run Time/Execution Time; 실행 시간)
- 프로그램을 실행하는 단계

<br/>

## 변수의 바인딩

변수의 바인딩은 바인딩 타임에 따라 달라진다. 런타임 이전에 바인딩 된 것을 정적 바인딩(static binding), 런타임에 바인딩 되는 것을 동적 바인딩(dynamic binding)이라고 한다.

### 정적 바인딩(Static Binding)

정적 바인딩은 이른 바인딩(early binding)이라고 부르기도 한다. **컴파일 타임에 바인딩이 결정**되고, **바인딩이 변하지 않은 상태로 유지**되어야 정적 바인딩이다.
> e.g. 전역(static) 변수

### 동적 바인딩(Dynamic Binding)

동적 바인딩은 늦은 바인딩(late binding)이라고도 한다. 실행 파일을 만들 때에는 바인딩이 되지 않고 보류되었다가, **프로그램이 실행될 때 바인딩** 되는 것이다. 따라서 정적 바인딩에 비해 **유연**하며, 이를 이용해 OOP의 **다형성을 구현**할 수 있다.

하지만, 동적 바인딩은 메모리 위치 및 크기가 정해져있지 않아 정적 바인딩에 비해 비효율적이다. 또한, 바인딩에 필요한 메모리 번지를 저장할 포인터를 가지고 있어야 한다. 따라서 **정적 바인딩에 비해 자원 소모가 크다.**

### 자바(Java)에서...

자바는 동적 바인딩을 사용한다.
```java
class Child extends Parent{
    public String parentMethod(){
        return "Inheritance Method";
    }
}

class Parent{
    public String parentMethod(){
      return "parent Method";
    }
}

public class Test01{
  public static void main(String[] args) {
    // test01 - 타입 체크를 통과하여 컴파일이 되지만, 실제 값의 할당은 런타임에 이루어진다.
    try {
      String[] arr = new String[1]; // test01 - RuntimeException 
      arr[2] = "0";
    } catch (RuntimeException e) {
      System.out.println("test01 - RuntimeException ");
    }
    // test02 - 마찬가지로 컴파일시 타입 체크를 하지만, 실제 값이 할당되지 않는다.
    try {
      Child test02 = (Child)new Parent(); // test02 - RuntimeException 
    // 컴파일시에는 값이 타입에 정의된 내용의 범위 안에 있는지 판단한다.
      System.out.println("test02 - " + test02.parentMethod());
      System.out.println("test02 - " + test02.childMethod());
    } catch (RuntimeException e) {
      System.out.println("test02 - RuntimeException");
    }
    // test03 - 
    try {
      Parent childInstance = new Child();
      Parent parentInstance = new Parent();            
            
      System.out.println("test03 - " + childInstance.parentMethod()); 
      // test03 - Child Method
      System.out.println("test03 - " + parentInstance.parentMethod());
      // test03 - parent Method         
    } catch (RuntimeException e) {
      System.out.println("test03 - RuntimeException");
    }
  }
}
```
<br/>

## 타입 바인딩

 **타입 바인딩은 컴파일 타임에 이루어진다.** 타입이 결정 되는 것이기 때문에 타이핑(typing)이라고도 한다. **바인딩 대상(변수)의 타입이 고정적인지 유동적인지에 따라** 정적 타입 바인딩(static type binding)과 동적 타입 바인딩(dynamic type binding)으로 나뉜다.

### 정적 타입 바인딩(Static Type Binding; Static Typing)

정적 타입 바인딩은 'strongly typed' 되었다고 표현하기도 한다. **자료형을 한 번 선언하면 더 이상 변경할 수 없다.**

> e.g.
> 1. 자바나 C 등의 언어에서 선언 한 변수의 타입은 더 이상 변경 불가능하다.(명시적 선언)
> 2. 과거 포트란에서, 문자 i~n으로 시작하는 변수는 정수 이다.(묵시적 선언)

### 동적 타입 바인딩(Dynamic Type Binding; Dynamic Typing)

'weakly typed' 혹은 'loosely typed' 되었다고 표현하기도 한다. 동적 타입 바인딩은 **컴파일러가 데이터의 타입을 추론**한다. 사용하기 쉽다는 장점이 있지만, 타입 바인딩 시 타입 추론으로 인한 비용이 증가하고, 컴파일 중에 타입 에러가 발생하지 않는 단점이 있다.

> e.g. JavaScript나 python 등의 언어에서 변수 선언이 타입에 관계없이 통일되어 있다.

---

#### Reference

- [자바 :: 바인딩(binding)](https://m.blog.naver.com/PostView.nhn?blogId=reeeh&logNo=220716449491&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F)
- [Binding의 개념](https://twinw.tistory.com/58)
- [Link time - Wikipedia](https://en.wikipedia.org/wiki/Link_time)
- [정적 바인딩과 동적 바인딩](https://wookss-blog.tistory.com/6)
- [Name binding - Wikipedia](https://en.wikipedia.org/wiki/Name_binding)
- [Binding - 정보통신기술용어해설](http://www.ktword.co.kr/word/abbr_view.php?m_temp1=2670&m_search=%EB%B0%94%EC%9D%B8%EB%94%A9)