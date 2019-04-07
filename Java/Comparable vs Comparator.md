# Comparable vs Comparator

정렬을 위해서 사용하는 인터페이스들이다.<br/>
`Comparable` 인터페이스는 정렬 기준을 설정할 클래스가 `Comparable` 인터페이스를 직접 상속해 `compareTo` 메소드를 오버라이딩 해야한. <br/>반면, `Comparator`는 직접 구현해서 `Arrays.sort()`나 `Collections.sort()` 같은 정렬 메소드에 추가 인자로 넘겨 정렬 기준을 직접 설정해 줄 수 있다.

## Comparable

정렬 기능을 사용하기 위해서는 비교를 위한 메소드(`compareTo`)가 정의되어 있어야 한다.<br/>
자바에서 제공하는 자료형들은 **이미 해당 메소드가 정의되어 있지만, 사용자 정의 자료형의 경우에는 이를 따로 정의**해주어야 한다.<br/>
`Comparable` 인터페이스에 추상 메소드인 `compareTo` 메소드가 선언되어 있으며, 사용자 정의 자료형의 비교를 원하는 경우 `Comparable` 인터페이스를 상속받아 구현하면 된다. 

```java
package testtest;

import java.util.*;

public class test2 {
    public static void main(String[] args) {
        List<Point> pointList = new ArrayList<>();
        pointList.add(new Point(3, 5));
        pointList.add(new Point(5, 2));
        pointList.add(new Point(14, 23));
        pointList.add(new Point(7, 10));
        pointList.add(new Point(1, 9));
        pointList.add(new Point(1, 14));
        pointList.add(new Point(1, 7));
        pointList.add(new Point(-2, 23));
        pointList.add(new Point(12, 3));
        Collections.sort(pointList);
        
        for(Point p : pointList) {
        	System.out.println(p);
        }
    }
}

class Point implements Comparable<Point> {
    private int x, y;

	public Point(int x, int y) {
    	this.x = x;
    	this.y = y;
    }

    /**
     * compareTo() 구현
     *
     * 현재 객체 < 파라미터로 넘어온 객체: 음수 리턴
     * 현재 객체 == 파라미터로 넘어온 객체: 0 리턴
     * 현재 객체 > 파라미터로 넘어온 객체: 양수 리턴
     * 음수 또는 0이면 객체의 자리가 그대로 유지되며, 양수인 경우에는 두 객체의 자리가 바뀐다.
     */ 
    @Override
    public int compareTo(Point p) {
        if(this.x > p.x) {
            return 1; // x에 대해서는 오름차순
        } else if(this.x == p.x) { //x가 같을 경우
            if(this.y < p.y) { // y에 대해서는 내림차순
                return 1;
            }
        }
        return -1;
    }
    
    public String toString() {
    	return String.format("(%d, %d)", this.x, this.y);
    }

}

/*  실행결과
    (-2, 23)
    (1, 14)
    (1, 9)
    (1, 7)
    (3, 5)
    (5, 2)
    (7, 10)
    (12, 3)
    (14, 23)
*/
```

<br/>

## Comparator

**정렬 가능한 클래스(Comparable 인터페이스를 구현한 클래스)들의 기본 정렬 기준과 다르게 정렬 하고 싶을 때** 사용하는 인터페이스 

- 주로 익명 클래스로 이용
- 기본적인 정렬 방법인 오름차순 정렬을 내림차순으로 정렬할 때 많이 사용

```java
package testtest;

//Main
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.awt.Point;
import java.util.Comparator;

public class test2 {

	public static void main(String[] args) {
		List<Point> pointList = new ArrayList<>();
		pointList.add(new Point(30, 50));
		pointList.add(new Point(40, 30));
		pointList.add(new Point(20, 10));
		MyComparator myComparator = new MyComparator();
		Collections.sort(pointList, myComparator); //Collections.sort()나 Arrays.sort() 메서드에 커스텀된 Comparator 객체를 추가 인자로 넘긴다.
		
		for(Point p : pointList) {
			System.out.println(p.toString());
		}
	}
}

//MyComparotor 클래스(x 좌표를 기준으로 내림차순 적용)
class MyComparator implements Comparator<Point> {

    /**
     * compare() 구현
     *
     * 첫 번째 파라미터로 넘어온 객체 > 두 번째 파라미터로 넘어온 객체: 음수 리턴
     * 첫 번째 파라미터로 넘어온 객체 == 두 번째 파라미터로 넘어온 객체: 0 리턴
     * 첫 번째 파라미터로 넘어온 객체 < 두 번째 파라미터로 넘어온 객체: 양수 리턴
     * 음수 또는 0이면 객체의 자리가 그대로 유지되고 양수이면 두 객체의 자리가 변경된다
     * 비교하는 첫번째 객체의 위치에 따라 오름차순 내림차순으로 정렬할 수 있다
	 */
    @Override
	public int compare(Point p1, Point p2) {
		if (p1.x < p2.x) {
			return 1;
		}else if(p1.x > p2.x){ 
			return -1;
		}else {
			return 0;
		}
	}
}

//java.awt.Point[x=40,y=30]
//java.awt.Point[x=30,y=50]
//java.awt.Point[x=20,y=10]
```

```java
//익명 클래스 이용

import java.awt.Point;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Main {

	public static void main(String[] args) {
		Comparator<Point> myComparator = new Comparator<Point>() {
			  @Override
			  public int compare(Point p1, Point p2) { 
				  if (p2.x > p1.x) {
						return 1;
					}else if(p2.x < p1.x){ 
						return -1;
					}else {
						return 0;
					}
			  }
			};

			List<Point> pointList = new ArrayList<>();
			pointList.add(new Point(20, 10));
			pointList.add(new Point(40, 10));
			pointList.add(new Point(30, 10));
			Collections.sort(pointList, myComparator);
			
			for(Point m :pointList) {
				System.out.println(m.toString());
			}

	}

}
//java.awt.Point[x=40,y=10]
//java.awt.Point[x=30,y=10]
//java.awt.Point[x=20,y=10]
```

<br/>

---

#### Reference

- [[Java] Comparable와 Comparator의 차이와 사용법](https://gmlwjd9405.github.io/2018/09/06/java-comparable-and-comparator.html)
- [Comparable_Comparator](https://github.com/JHRla/SIST-TEAM01/blob/master/%EB%B0%9C%ED%91%9C%EC%9E%90%EB%A3%8C/Comparable_Comparator.md)

