# 인터페이스 분리 원칙(Interface Segregation Principle)

인터페이스 분리 원칙은 클라이언트는 자신이 사용하지 않는 메서드에 의존하면 안된다는 것이다. 만약 인터페이스가 거대하여 많은 기능을 담고 있다면 해당 인터페이스는 높은 응집도를 갖기 힘들다. 클래스의 인터페이스가 가진 함수들을 그룹화 하여 나눌 수 있다면 해당 인터페이스를 사용하는 클라이언트도 여러 개다. 

쉽게 말해, 인터페이스 내부의 함수들의 그룹을 구분할 수 있다면, 해당 인터페이스에 여러 가지 책임이 혼재되어 있는 상태라는 것이다. 이 경우 하나의 인터페이스를 여러 개의 클라이언트에서 사용하지만, 사용하는 기능은 클라이언트별로 한정적일 것이다.

따라서 인터페이스 분리 원칙은 하나의 클래스에 여러 개의 책임을 가진 인터페이스를 사용해야 하는 경우에 관한 이야기이다. 이 때, 클라이언트는 구현된 객체 대신 응집력 있는 인터페이스를 가진 추상 기본 클래스에 의존해야 한다. 이러한 추상 기본 클래스를 '인터페이스', '프로토콜' 또는 '서명(signiture)' 이라고 한다.

## 예시

전역한 한국인은 예비군을 가게 된다.

```java
class Korean {
    public void participateReserveForcesTraining() {
        // 예비군 훈련 참여
    };
}
```

하지만 모든 남자가 예비군 훈련에 가는 것은 아니다. 전역을 한 사람 대상이다. 전역을 했다는 상태값을 나타내도록 간단히 수정해보면 아래와 같을 것이다.

```java
abstract class Korean {
    public abstarct boolean isDischarged();
}

class DischargedKoraen extends Korean {
    @Override
    public boolean isDischarged() {
        return true;
    }
    
    public void participateReserveForcesTraining() {
        // 예비군 훈련 참여
    };
}

class ReserveForcesTrainingClient {
    public void doReserveForcesTraining(Korean korean) {
        if(KoreanPerson.isDischarged()) {
            ((DischargedKorean) korean).participateReserveForcesTraining();
        }
    }
}
```

이 경우 상위 클래스와 하위 클래스가 다른 동작을 한다. 리스코프 치환 원칙을 위배한다. 이를 해결해보면 다음과 같을 것이다.

```java
interface Korean {
    boolean isDischarged();
    void participateReserveForcesTraining(boolean discharged);
}

class DischargedKoraen implements Korean {
    @Override
    public boolean isDischarged() {
        return true;
    };
    
    @Override
    public void participateReserveForcesTraining(boolean discharged) {
        if(discharged) {
            // ...
        }
    };
}

class ReserveForcesTrainingClient {
    public void doReserveForcesTraining(Korean korean) {
        korean.participateReserveForcesTraining(korean.isDischarged());
    }
}
```

이렇게 고칠 경우 `Korean` 의 다른 케이스에서도 반드시 예비군 훈련에 관한 구현이 포함되어야 한다.

```java
class NonDischargedKoraen implements Korean {
    @Override
    public boolean isDischarged() {
        return false;
    };
    
    @Override
    public void participateReserveForcesTraining(boolean discharged) {
        throw new UnsupportedOperationException("전역하지 않은 사람은 예비군 훈련에 참여할 수 없습니다.");
    };
}
```

이런 경우, 인터페이스가 오염되었다고 말한다. 또한, 위 예제는 기능이 적기 때문에 인터페이스가 비대해 보이지 않다. 하지만 만약 `Korean` 인터페이스에서 추상화된 모든 기능을 제공할 경우 실제 구현 클래스는 메소드 중 일부분만 사용하지만 거대한 인터페이스의 모든 기능을 재정의해야 할 것이다.

이런 경우 인터페이스 분리를 해주어 해결할 수 있는 것이다.

>   위 경우 개방-폐쇄 원칙도 위반하였을 가능성이 높다. 예비군에 관한 조건이 변경될 경우 `Korean` 을 구현한 모든 클래스가 변경되어야 할 것이기 때문이다.

```java
class Korean {
    // ...
}

interface Discharged {
    void participateReserveForcesTraining();
}

class DischargedKoraen extends Korean implements Discharged {
    @Override
    public void participateReserveForcesTraining() {
        // ...
    };
}

class ReserveForcesTrainingClient {
    public void doReserveForcesTraining(Discharged dischargedPerson) {
        dischargedPerson.participateReserveForcesTraining();
    }
}
```

`Korean`에 대한 일반화가 이루어졌으며, 전역자에 대한 책임도 분리되었다. 예비군 훈련을 담당하는 클라이언트는 전역에 관한 메세지를 전달할 수 있는 인스턴스만 사용할 수 있도록 강제되었다.  만약, 전역을 한 것과 동시에 여러 개의 책임이 추가된 사람에 대한 객체를 구현하더라도, 전역을 했다는 인터페이스만 구현하게 되면 예비군 훈련에 참가할 수 있게 된다.

```java
class DischaregedKoreanStudent extends Korean implements Discharged, Student {
    @Override
    public void participateReserveForcesTraining() {
        // 학생 예비군으로 참여
    }    
    // ...
}
```

## 마치며

하나의 거대한(일반화된) 인터페이스보다 여러 개의 구체적인 인터페이스가 낫다는 것이 인터페이스 분리 원칙의 핵심이다. 단일 책임 원칙과 서로 상충하는 개념처럼 보일 수 있다. 단일 책임 원칙에서는 클래스에서 하나의 책임만 담당해야 한다고 하지만, 인터페이스 분리 원칙은 하나의 클래스에서 여러 개의 책임을 갖는 경우가 있음을 인정하는 것이기 때문이다.

하지만 이는 두가지 원칙의 관점이 다르기 때문인데, 단일 책임 원칙은 도메인(실행 대상)의 관점에서 책임을 나누지만, 인터페이스 분리 원칙은 클라이언트(실행하는 곳)의 관점에서 책임을 나누기 때문이다. 예를 들어 단일 책임 원칙은 해당 클래스 내부에서 여러 책임이 발생하는 것이 문제가 되는 것이다. 인터페이스 분리 원칙 또한 해당 클래스 내부에서 사용하지 않는 클래스를 재정의 해야 한다는 점이 문제지만, 이를 다시 생각해보면 클라이언트에 노출되면 안되는 메소드가 노출되는 것이 문제점이다. 이와 같이 생각해보면 큰 혼동 없이 이를 구분할 수 있을 것이다.

---

#### References

-   [The Interface Segregation Principle - Robert C. Martin](https://drive.google.com/file/d/0BwhCYaYDn8EgOTViYjJhYzMtMzYxMC00MzFjLWJjMzYtOGJiMDc5N2JkYmJi/view)

-   [객체지향 개발 5대 원리: SOLID - NEXTREE](http://www.nextree.co.kr/p6960/)

