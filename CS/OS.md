# Operating System

## **3장 - Processes**

운영체제의 주요 관심사는 사용자 프로그램 실행이지만 커널 내부가 아닌 사용자 공간에서 가장 잘 수행되는 다양한 시스템 작업도 고려되어야 한다. 따라서 시스템은 프로세스 모음, 사용자 코드 실행, 운영체제 코드 실행으로 구성된다. 이 장에서는 프로세스의 개념, 운영 체제에서 프로세스의 표현 방식 및 작동 방식에 대해 설명한다.

### **3.1 Process Concept**

**3.1.1 The Process**

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

**3.1.2 Process State**

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

**3.1.3 Process Control Block**

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

**3.1.4 Threads**

- 프로세스가 실행될 때 1개의 스레드를 포함하고 있다.
- 스레드를 사용하면 하나의 프로세스에서 여러개의 작업을 실행할 수 있다.
- PCB에 프로그램 카운터 및 스레드 정보(메모리 한계, 레지스터 정보 등)를 가지게끔 해야한다.
- 다음 챕터인 4장에서 스레드와 동시성에 대해서 자세하게 다룬다.