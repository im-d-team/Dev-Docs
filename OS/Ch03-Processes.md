# **3장 - Processes**

운영체제의 주요 관심사는 사용자 프로그램 실행이지만 커널 내부가 아닌 사용자 공간에서 가장 잘 수행되는 다양한 시스템 작업도 고려되어야 한다. 따라서 시스템은 프로세스 모음, 사용자 코드 실행, 운영체제 코드 실행으로 구성된다. 이 장에서는 프로세스의 개념, 운영 체제에서 프로세스의 표현 방식 및 작동 방식에 대해 설명한다.

## **3.1 Process Concept**

### **3.1.1 The Process**

- 프로세스는 메모리에 실행중인 프로그램이다.
  - 프로그램은 디스크에 저장된 명령 목록을 의미하므로 프로세스와 다르다.
  - 동일한 프로그램을 실행한다고 하더라도 텍스트섹션은 동일하지만 데이터, 힙 및 스택 섹션은 다르다.
  - 프로세스는 코드의 실행환경일 수 있는데 Java 코드는 JVM으로 프로세스로 실행되는 것이 그 예이다.

![Process in Memory](https://user-images.githubusercontent.com/16266103/113502908-ddc96480-9569-11eb-8c03-395b27bbdfbe.png)

>  출처: Operating System Concepts 10th Edition

- 프로세스 메모리 레이아웃은 일반적으로 여러 섹션으로 나뉘며 아래와 같다.
  - Text section : 프로그램 코드
  - Data section : 전역 변수
  - Heap section : 동적으로 할당되는 메모리
  - Stack section : 함수의 매개변수, 복귀 주소와 로컬 변수 등
- 텍스트 및 데이터 섹션의 크기는 고정이지만 스택이나 힙 섹션은 프로그램 실행 중 동적으로 축소 및 증가할 수 있다.
  - 함수를 호출할 때마다 함수 매개 변수, 로컬 변수 및 반환 주소를 포함하는 activation record가 스택에 push된다. 컨트롤이 함수에서 반환되면 activation record가 스택에서 pop 된다.
  - 메모리가 동적으로 할당될 때 힙이 증가하고 메모리가 시스템에 반환되면 힙이 축소된다. 운영체제는 힙 섹션과 스택 섹션이 겹치지 않도록 해준다.

### **3.1.2 Process State**

![Diagram of Process State](https://user-images.githubusercontent.com/16266103/113502910-e1f58200-9569-11eb-8f7b-92f772757083.png)

>  출처: Operating System Concepts 10th Edition

- 프로세스가 실행되면 상태가 변경된다. 프로세스의 상태는 부분적으로 해당 프로세스의 현재 활동에 의해 정의된다.
- 프로세스는 아래의 상태들을 따른다.
  - New : 프로세스 생성
  - Running : 명령어 실행
  - Waiting : 프로세스가 어떤 사건(I/O 등)이 일어나기를 기다림
  - Ready : 프로세스가 처리기에 할당되기를 기다림
  - Terminated : 프로세스 실행 종료
- 운영체제에 따라 상태의 이름이 다를 수 있다. 한 번에 하나의 프로세스만 프로세서의 코어에서 실행할 수 있다는 것을 알아야 한다.

### **3.1.3 Process Control Block**

![Process Control Block (PCB)](https://user-images.githubusercontent.com/16266103/113502912-e6219f80-9569-11eb-90e1-3600f56a6cdf.png)

>  출처: Operating System Concepts 10th Edition

- 각 프로세스는 OS에 의해 PCB(Process Control Block 혹은 Task Control Block)로 표현된다.
- PCB는 아래의 정보들을 가지고 있다.
  - Process state : New, Running, Waiting, Ready, Terminated
  - Program counter : 프로세스가 다음에 실행할 명령어의 주소를 가리킴
  - CPU registers : CPU가 요청을 처리하는 데이터의 임시저장 공간
  - CPU-scheduling information : 프로세스 우선순위, 스케쥴 큐에 대한 포인터 및 다른 스케쥴 Parameter에 관한 정보
  - Memory-management information : Base, Limit Register의 정보 혹은 Segment Table에 관한 정보
  - Accounting information : CPU가 사용된 양과 시간, 시간 제한, 프로세스 번호
  - I/O status information : 해당 프로세스에 할당된 I/O 장치의 리스트 및 Open된 파일에 대한 정보
- PCB는 accounting data와 함께 프로세스를 시작하거나 다시 시작하는데 필요한 데이터의 저장소 역할을 한다.

![CPU Switch From Process to Process](https://user-images.githubusercontent.com/16266103/113502913-e9b52680-9569-11eb-9948-fb572168d98b.png)

>  출처: Operating System Concepts 10th Edition

- 위 그림은 Context Switch에 대해서 설명하고 있다.
- 프로세스가 실행되고 있는 상황에서 interrupt 요청으로 다음 우선 순위의 프로세스가 실행되어야 할 때 기존 프로세스의 상태 또는 레지스터의 값(Context)를 저장하고 CPU가 다음 프로세스를 수행하도록 새로운 프로세서의 상태 또는 레지스터 값(Context)를 교체하는 작업을 Context Switch라고 한다.
- Context는 CPU가 해당 프로세스를 실행하기 위한 정보들이며 PCB에 저장된다.
  - 정보: 프로세스 상태, 프로그램 카운터, 레지스터, 프로세스 번호 등
- Context Switch가 잦아지면 그 순간 CPU는 작업을 못하기 때문에 오버헤드가 발생한다.
- Context Switch가 발생하는 interrupt는 아래와 같다.
  - I/O request
  - time slice expired
  - fork a child
  - wait for an interrupt
  - ...
- Context Switch를 하는 주체는 OS 스케쥴러이다.

### **3.1.4 Threads**

- 프로세스가 실행될 때 1개의 스레드를 포함하고 있다.
- 스레드를 사용하면 하나의 프로세스에서 여러개의 작업을 실행할 수 있다.
- PCB에 프로그램 카운터 및 스레드 정보(메모리 한계, 레지스터 정보 등)를 가지게끔 해야한다.
- 다음 챕터인 4장에서 스레드와 동시성에 대해서 자세하게 다룬다.

## **3.2 Process Scheduling**

**Process Scheduling**은 CPU core에서 다음에 실행할 프로세스를 선택하는 것이다.

**목표는?**

- 최대 CPU 사용률로 process를 실행하는 것.
- 프로세스를 CPU core로 빠르게 전환하는 것.

현재 메모리에 있는 프로세스 수를 **The Degree of Multiprogramming** 라고 한다.

일반적으로 대부분의 프로세스는 I/O bound process와 CPU bound process로 설명된다.

**I/O Bound VS CPU Bound**

- I/O bound process : 연산보다 I/O에 더 시간이 들어가는 프로세스. CPU burst가 작다.
- CPU bound process : 연산에 주로 시간이 들어가는 프로세스. CPU burst가 크다.

> **CPU burst** : 프로세스에서 CPU 사용 구간.

### **3.2.1 Scheduling Queues**

주요 process scheduling queue로 **Ready Queue**와 **Wait Queue**가 있다.

![The ready queue and wait queues.](https://user-images.githubusercontent.com/24274424/114288650-e01d4880-9aac-11eb-9624-ff263682b9aa.png)

>  출처: Operating System Concepts 10th Edition

- Ready Queue
  - 주 메모리에 상주하며 실행 준비, 대기중인 모든 프로세스 집합
- Wait Queue
  -  이벤트를 기다리는 프로세스 세트 (ex. I/O)

프로세스는 다양한 대기열 간에 마이그레이션(migration) 된다.

![Queueing-diagram representation of process scheduling.
](https://user-images.githubusercontent.com/24274424/114288711-e4e1fc80-9aac-11eb-8c16-a15ce03d850a.png)

>  출처: Operating System Concepts 10th Edition

- 프로세스는 I/O Request 후 I/O Wait queue로 이동한다.
- 프로세스는 새로운 자식 프로세스를 생성한 다음 자식의 종료를 기다리는 동안 Wait queue에서 대기한다.
- 프로세스는 Interrupt의 결과로 core에서 강제로 제거되거나 시간 만료된 후 Ready queue에 다시 들어갈 수 있다.

위 두 경우에서 프로세스는 결국 Wait 상태에서 Ready 상태로 전환된 다음 다시 Ready queue로 간다. 프로세스는 종료될 때까지 이 주기는 계속된다.

### **3.2.2 CPU Scheduling**

프로세스는 lifetime 동안 Ready queue와 많은 Wait queue 사이를 옮겨다닌다.

CPU Scheduler 역할은 Ready queue에 있는 프로세스 중 하나를 CPU Core에 할당하는 것이다.

프로세스에게 CPU를 강제로 제거하고 다른 프로세스가 실행되도록 예약할 수 있는 디자인이다. 이러한 디자인으로 CPU scheduler는 100μs마다 실행한다(무조건 정해진 시간이 있는 건 아니다).

#### **Swapping**

Swapping이라는 중간 형태의 스케줄링을 가진다. 핵심 아이디어는 메모리에서 프로세스를 제거하여 **The Degree of Multiprogramming**(메모리상 프로세스의 수)를 줄이는 것이다.

- 프로세스를 메모리에서 디스크로 **swapped out**하여 현재 상태 저장
- 디스크에서 메모리로 **swapped in**하여 상태 복원한다.

Swapping은 일반적으로 메모리가 *오버커밋*되어 해제되어야하는 경우에만 필요한다(추가적으로 9장에서 자세히 설명).

> OverCommitted(오버커밋) : 실제 메모리 총량을 넘는 메모리를 요구를 허용하는 것.

### **3.2.3 Context Switch**

![CPU Switch From Process to Process](https://user-images.githubusercontent.com/16266103/113502913-e9b52680-9569-11eb-9948-fb572168d98b.png)

>  출처: Operating System Concepts 10th Edition

*1.2.1절* Interrupt에서는 OS가 현재 작업에서 CPU core를 바꿔 커널 루틴을 실행하게된다. Interrupt가 발생하면, 실행중인 프로세스와 현재 Context를 저장해 해당 Context를 복원하여 기본적으로 프로세스를 일시정지 이후로 다시 시작한다.

- CPU가 다른 프로세스로 전환 할 때 시스템은 이전 프로세스의 상태를 저장하고 Context 스위치를 통해 새 프로세스에 대해 저장된 상태를 load해야 한다.
- PCB에 프로세스의 Context 표시한다.
  - Context는 PCB에 표시되며 정보들은 [3.1.3 Process Control Block](#3.1.3-Process-Control-Block)에서 확인 가능하다.
- Context Switching 시간은 Pure Overhead다. 전환하는 동안 시스템이 유용한 작업을 하지 않는다.
  - OS와 PCB가 복잡할수록 Context 전환이 길어진다.
- 하드웨어 지원에 따라 시간이 달라진다.
  - 일부 하드웨어는 CPU 당 여러 레지스터 세트(한 번에 로드되는 여러 Context)를 제공한다.
- 운영체제가 복잡할수록 Context Switching 중에 수행해야하는 작업의 양도 많아진다.

### MULTITASKING IN MOBILE SYSTEMS

#### **IOS**

- 모바일 장치에 제약으로 인해 IOS 초기 버전은 사용자 애플리케이션 멀티테스킹을 제공하지 못했다. 다른 모든 사용자 응용 프로그램이 일시중지된 동안 하나만 실행되었다.
- 운영체제 작업은 멀티태스킹이 가능했다.
- IOS 4부터 사용자 애플리케이션에 제한된 형태의 멀티태스킹을 제공하면서 단일 foreground 애플리케이션이 여러 background 애플리케이션과 동시에 실행될 수 있게 되었다.
- 모바일 장치용 하드웨어가 **더 큰 메모리 용량**, **다중 처리 코어** 및 **더 긴 배터리 수명**을 제공하기 시작하면서 IOS의 후속 버전은 더 적은 제한으로 멀티태스킹을 위한 더 풍부한 기능을 지원한다.
- 예를 들어, iPad 태블릿의 더 큰 화면에서는 분할 화면으로 알려진 기술인 두 개의 foreground 앱을 동시에 실행할 수 있다.

#### **Android**

- Android는 예전부터 멀티 태스킹을 지원했으며, background에서 실행할 수 있는 애플리케이션 유형에 제한을 두지 않았다.
- 애플리케이션이 background에서 처리해야하는 경우 애플리케이션은 background 프로세스를 대신하여 service를 사용한다.
- 스트리밍 오디오 응용 프로그램을 생각해보면, 응용 프로그램이 background로 이동하는 경우 service는 background 응용 프로그램을 대신하여 오디오 장치 드라이버에 오디오 데이터를 계속 보낸다.
- 실제로 background 응용 프로그램이 일시 중단된 경우에도 service 계속 실행된다. service에는 사용자 인터페이스가 없고 메모리 사용량이 적으므로 모바일 환경에서 멀티 태스킹을 위한 효율적인 기술을 제공한다.

<details>
<summary> 질문(2021.04.11) </summary>
  
- Pure Overhead에 대해서
- 레지스터가 빨라요? 메모리가 빨라요?
  - 레지스터요.
- 아래의 경우는 다른가
  - 모든 프로세스는 CPU에 올라가 있다가 wait 갔다가 ready를 간다.
- 심각한 오류에 빠지면 어떻게 되나.
  - 리부팅이 될 거 같다.
- 블루스크린
  - 데드락 같은 상태
- Wait queue를 거치지 않는 경우가 있나.
  - 바로 갈 수 있다.
- Swapping
  - 물리적인 메모리가 안 나올때 + 죽이고 싶지 않을 때 디스크로 옮기고 메모리를 확보.
- Swapping 문제가 없나?
  - 속도가 느릴 수 있다.
  - 휘발성 비휘발성 관련 문제는 없다.
  - 디스크 수명에 영향을 준다.
  - 메모리에 압축을 해놓고 프로세스를 실행할 때 압축을 풀어서 사용한다.
</details>

## **3.3 Operations on Processes**

대부분의 시스템에서 프로세스는 동시에 실행될 수 있고, 이들은 동적으로 생성되거나 삭제될 수 있다. 따라서 시스템은 프로세스의 생성, 삭제에 관한 매커니즘을 제공할 수 있어야한다.

### **3.3.1 Process Creation**

- 시스템의 실행 과정에서 프로세스는 여러 개의 새 프로세스를 생성할 수 있다. 부모 프로세스는 자식 프로세스를 생성하게 되고, 이 과정을 거쳐 프로세스 트리를 형성할 수 있다.
- 일반적으로 프로세스는 고유한 번호인 Process Indentifier(PID)를 통해 식별되고 관리된다.
- PID는 [PCB](#3.1.3-Process-Control-Block)에 들어있다.
![fork, exec flow chart](https://user-images.githubusercontent.com/24209005/115135028-44617e80-a050-11eb-9171-3e539e0c8cde.png)

>  출처: Operating System Concepts 10th Edition

- `fork()`시스템 콜을 호출하면 부모 프로세스는 본인과 동일한 자식 프로세스를 생성한다.
- 자식 프로세스는 `exec()`시스템 콜을 통해 본인의 메모리 공간을 새로운 프로그램으로 대체한다.
- 부모 프로세스는 `wait()`시스템 콜을 호출하고 자식 프로세스가 종료될 때까지 기다린다.

해당 그림은 `fork&exec` 방식의 프로세스 생성 방식으로 모든 경우에 대해 제네릭한 경우는 아니다.

- `fork&exec` 방식의 생성 방식: 동일한 문맥이 아니라 다른 문맥의 프로그램을 실행시키고 싶을 때 exec를 실행시키면 문맥이 바뀐다.
  - 부모 프로세스 fork 후, 자식에서 새로운 프로그램 실행
- 윈도우는 부모프로세스에서 자식 프로세스가 실행시킬 프로그램을 미리 결정한다. 즉, 생성 시점부터 결정이 된 상태가 된다.
  - 부모에서 자식에서 실행시킬 프로그램 지정 후, 자식 생성

#### A Tree of Processes in Linux

![Process Tree](https://user-images.githubusercontent.com/24209005/115135057-6529d400-a050-11eb-980c-44008257e38f.png)

>  출처: Operating System Concepts 10th Edition

- 프로세스는 계층 구조를 갖는다는게 중요하다. 즉, 하나의 부모 프로세스가 여러 개의 자식 프로세스를 가진다.

#### C Program Forking Separate Process

```c
#include <sys/types.h>
#include <stdio.h>
#include <unistd.h>

int main()
{
  pid_t pid;

  /* fork a child process */
  pid = fork();

  if (pid < 0) { /* error occurred */
    fprintf(stderr, "Fork Failed");
    return 1;
  }
  else if (pid == 0) { /* child process */
    execlp("/bin/ls", "ls", NULL);
  }
  else { /* parent process */
    /* parent will wait for the child to complete */
    wait(NULL);
    printf("Child Complete");
  }

  return 0;
}
```

>  소스 코드 출처: Operating System Concepts 10th Edition

- `fork()`시스템 콜은 부모 프로세스에겐 자식 프로세스의 PID를, 자식 프로세스에겐 0을 반환한다.
- 그리고 반환된 pid 값을 통해 자식 프로세스의 `exec()`시스템 콜 호출 여부와 부모 프로세스의 `wait()`시스템 콜 호출 여부를 결정한다.
- 부모 프로세스와 자식 프로세스는 동시에 동작한다.

### **3.3.2 Process Termination**

일반적인 프로세스의 종료 과정은 다음과 같다.

- 자식 프로세스는 종료 시에 `exit()`시스템 콜을 호출한다.
- 자식 프로세스에서 부모 프로세스로 상태 데이터와 PID를 반환한다.
- 프로세스의 리소스는 시스템에 의해 할당 해제됩니다.

또 다른 방법으로 부모 프로세스는 `abort()`시스템 콜을 호출하여 자식 프로세스의 실행을 종료할 수 있다. 이와 같이 종료하는 경우는 다음과 같다.

- 자식 프로세스가 할당 된 리소스를 초과했을 때
- 자식 프로세스에게 할당 된 작업이 더 이상 불필요할 때
- 부모 프로세스가 종료되었을 때

부모 프로세스는 `wait()`시스템 콜을 통해 자식 프로세스의 종료를 기다리게 되는데 이 때 종료 된 프로세스는 부모 프로세스에게 상태 정보와 PID를 반환한다. 이 때 다음과 같은 문제가 발생할 수 있다.

#### Zombie Process

![Zombie Process](https://user-images.githubusercontent.com/24209005/115135108-b0dc7d80-a050-11eb-84ef-3f10ab21bd04.png)

좀피 프로세스는 대기중인 부모 프로세스가 없는 경우 `wait()`시스템 콜을 호출하지 않은 경우)에 해당된다. 즉, 부모 프로세스가 자식 프로세스의 종료 상태를 회수하지 않았을 경우 자식 프로세스는 좀비 프로세스가 된다. 부모 프로세스가 좀비 프로세스의 종료상태를 `wait()`시스템 콜을 통해 회수하게 되면 좀비 프로세스는 제거된다.

커널의 입장에서는 부모 프로세스가 자식의 반환값을 알 때 까지 이 정보를 저장해야 할 의무가 있다. 자식 프로세스가 종료된 이후에 부모 프로세스가 자식 프로세스의 상태를 알고 싶을 수 있기 때문에 커널은 자식 프로세스가 종료되더라도 최소한의 정보(프로세스 ID, 프로세스 종료 상태 등)를 가지고 있게 된다. 이게 회수가 안 되면 커널에는 자식 프로세스의 상태 값과 PID를 가진 상태로 남아있는데 이것이 좀비 프로세스라고 보면 된다. 따라서 `wait()`로 자식의 상태 값을 회수하기 전까지는 좀비 프로세스 상태이다.

단, 좀비 프로세스가 존재한다는 것이 반드시 나쁜 것은 아니다. 왜냐하면 프로세스가 종료되면 반드시 좀비 프로세스의 과정을 한 번은 거치게 된다. 그 이유는 [3.1.2 Process State](#3.1.2-Process-State)의 `Running`, `Waiting`, `Ready` 상태의 flow를 보면 이해할 수 있다.

- `Running` 상태의 부모 프로세스에서 `wait()`시스템 콜을 호출하면 부모 프로세스는 `Waiting`상태로 접어든다.
- 자식 프로세스가 죽으면 커널은 `Waiting`상태에 있는 부모 프로세스를 `Ready` 상태로 변환하고 `Ready Queue`에 집어넣는다.
- `Ready Queue`에 있던 부모 프로세스가 `Running`상태로 바뀌기 전까지는 자식 프로세스가 좀비 프로세스일 수 밖에 없다.

#### Orphan Process

![Orphan Process pt 자료](https://user-images.githubusercontent.com/24209005/115135117-c0f45d00-a050-11eb-9beb-3a72cdb6ce7b.png)

`wait()`시스템 콜을 호출하지 않고 부모 프로세스가 종료 된 경우 해당 프로세스는 고아 프로세스가 된다. 즉, 부모 프로세스가 자식 프로세스보다 먼저 종료되면 자식 프로세스는 고아 프로세스가 된다.

부모 프로세스가 자식 프로세스보다 먼저 종료되면 init 프로세스가 자식 프로세스 새로운 부모 프로세스가 된다.
종료되는 프로세스가 발생할 때 커널은 이 프로세스가 누구의 부모 프로세스인지 확인한 후, 커널이 자식 프로세스의 PPID를 init 프로세스의 PID(1)로 바꾼다. 이는 프로세스가 트리 구조를 가지기 때문에 가능하다.

#### 3.3.2.1 Android Process Hierarchy

모바일 환경에 자원 제약이 있기 때문에 모바일 OS는 기존 프로세스를 종료해야 할 수 있다.
이에 따라 안드로이드에서는 프로세스를 우선 순위를 가장 높은 것부터 가장 낮은 것까지 분류하고 있다.

- Foreground Process: 현재 동작되고 있으며 스크린에서 보여지는 프로세스
- Visible Process: 직접적으로 보여지지는 않지만 Foreground Process에 참조하고 있는 프로세스
- Service Process: 백그라운드에서 동작하며 사용자에게 노출되는 프로세스 (ex. 음악 듣기: 백그라운드에 있는데 사용자가 인지할 수 있다)
- Background Process: 백그라운드에서 동작하지만 사용자에게 노출되지 않는 프로세스(ex. 푸쉬 알람 대기)
- Empty Process: 이외의 비활성화된 모든 프로세스

<details>
<summary> 질문(2021.04.18) </summary>
  
- PID는 PCB에 들어있다.
  - 맞다. 리눅스의 경우 C 구조체 안에 들어있다.
- 3.3.1의 fork, exec flow chart 그림은 모든 경우에 대한 제네릭한 경우는 아니다.
  - fork/exec 방식의 생성 방식: 동일한 문맥이 아니라 다른 문맥의 프로그램을 실행시키고 싶을 때 exec를 실행시키면 문맥이 바뀐다.(부모 -> 자식에 복사, 자식에서 새로운 프로그램 실행)
  - 윈도우는 부모프로세스에서 자식 프로세스가 실행시킬 프로그램을 미리 결정한다. 즉, 생성 시점부터 결정이 된 상태가 된다.(부모에서 자식에서 실행시킬 프로그램 지정 -> 자식 생성)
- 트리 그림 중요한가?
  - 계층 구조를 갖는다는게 중요(하나의 부모와 여러개의 자식 프로세스)
  - 고아프로세스 이해에 도움이 된다(고아가 된 후에 부모 프로세스 PID=1로 바꿔주는 것이기 때문에)
- wait를 하지 않았을 경우 좀비프로세스가 되는것인가
  - 커널의 입장에서는 부모 프로세스가 자식의 반환값을 알 때 까지 이 정보를 저장해야 할 의무가 있다. 자식이 어떻게 죽었는지 알아야 하기 때문에(부모가 자식의 상태를 회수 할 때 까지 커널에 저장된다. 이게 회수가 안 되면 커널에 찌꺼기 상태로 남아있는 좀비 프로세스가 된다)
  - 따라서 wait로 자식의 status를 회수하기 전까지는 좀비 프로세스 상태이다.
  - 좀비가 존재한다는 것이 반드시 나쁜 것은 아니다.
    - 반드시 좀비가 한 번은 된다.
      - 러닝에서 웨이트를 호출하면 부모는 웨이팅 상태
      - 자식이 죽으면 커널은 웨이팅 상태에 있는 부모 프로세스를 레디 상태로 변환, 레디 큐에 집어넣음
      - 레디큐에 있다가 러닝 상태로 바뀔때까지는 자식 프로세스가 좀비일 수 밖에 없다.
- 서비스 프로세스와 백그라운드 프로세스의 차이?
  - 서비스 : 음악 듣기(백그라운드에 있는데 사용자가 인지할 수 있다)
  - 백그라운드 : 푸쉬 알람 대기
- 모바일에서 프로세스 관리의 핵심은 자원 제약이 있을 경우 우선순위가 낮은 것을 제거해가며 자원을 확보하는 방식을 사용한다는 것

</details>
