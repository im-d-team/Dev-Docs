# 5장 - CPU Scheduling

CPU 스케줄링은 다중 프로그램 운영체제의 기본이다. 운영체제는 CPU를 프로세스 간에 교환함으로서 컴퓨터를 보다 생산적으로 만든다.

스레드를 지원하는 운영체제에서는 실질적으로 운영체제는 프로세스가 아니라 커널 수준 스레드를 schedule 한다. 

프로세스 스케줄링과 스레드 스케줄링 용어는 상호 교환적으로 사용된다.

- 다양한 CPU 스케줄링 알고리즘을 설명
- 스케줄링 기준에 따라 CPU 스케줄링 알고리즘을 평가
- 멀티프로세서 및 멀티코어 스케줄링과 관련된 문제를 설명
- 다양한 실시간 스케줄링 알고리즘 설명
- Windows, Linux 및 Solaris 운영 체제에서 사용되는 스케줄링 알고리즘에 관해 설명
- 모델링 및 시뮬레이션을 적용하여 CPU 스케줄링 알고리즘을 평가
- 여러 가지 CPU 스케줄링 알고리즘을 구현하는 프로그램을 설계

## 5.1 Basic Concepts

multiprogramming의 목적은 CPU 이용률을 최대화하기 위해 항상 실행 중인 프로세스를 가지게 하는 데 있다. 

프로세스가 대기해야 할 경우, 운영체제는 CPU를 그 프로세스로부터 회수해 다른 프로세스에 할당한다. 이러한 패턴은 계속되며, 하나의 프로세스가 대기할 때마다 다른 프로세스가 CPU 사용을 양도받는다.

Scheduling은 기본적인 운영체제의 기능이다. 거의 모든 컴퓨터의 리소스는 사용 전에 schedule 되어있다. CPU 이용률을 최대화하는 것은 다중 프로세서 운영체제 설계의 핵심이 된다.

### 5.1.1 CPU-I/O Burst Cycle

![Figure 5.1 Altering sequence of CPU and I/O burst](https://user-images.githubusercontent.com/16266103/132116709-98da70ce-9a8b-4e0f-b853-ab9f2c93b760.png)

프로세스 실행은 CPU 실행과 I/O 대기의 사이클로 구성된다. 프로세스 실행은 CPU Burst로 시작된다. 뒤이어 I/O Burst가 발생한다. 결국 마지막 CPU Burst는 또 다른 I/O Burst가 뒤따르는 대신, 실행을 종료하기 위한 요청과 함께 끝난다.

입출력 중심의 프로그램은 짧은 CPU Burst를 많이 가질 것이다. CPU 지향 프로그램은 다수의 긴 CPU Burst를 가질 수 있다. CPU Burst들의 지속시간을 광범위하게 측정한 그래프는 CPU 스케줄링 알고리즘을 구현할 때 매우 중요하다.

### 5.1.2 CPU Scheduler

![Figure 5.2 Histogram of CPU-burst durations](https://user-images.githubusercontent.com/16266103/132116707-80989803-c290-4c5b-b3d1-d91c53497de5.png)

CPU가 유휴 상태가 될 때마다, 운영체제는 Ready Queue에 있는 프로세스 중에서 하나를 선택해서 실행해야 한다. 선택 절차는 CPU Scheduler에 의해 수행된다.

CPU Scheduler는 실행 준비가 되어 있는 메모리 내의 프로세스 중에서 선택하여, 이들 중 하나에게 CPU를 할당한다.

Ready Queue는 반드시 FIFO 방식의 큐가 아니어도 되고, 우선순위 큐, 트리 등으로 구현될 수 있다. 일반적으로 큐에 있는 레코드들은 프로세스의 PCBs(process control blocks)이다.

### 5.1.3 Preemptive and Nonpreemptive Scheduling

CPU-scheduling decisions는 다음의 네 가지 상황에서 발생할 수 있다.

1. 한 프로세스가 실행 상태에서 대기 상태로 전환될 때 (I/O 요청이나 자식 프로세스가 종료되기를 기다리기 위해 wait()를 호출)
2. 프로세스가 실행 상태에서 준비 완료 상태로 전환될 때 (인터럽트가 발생)
3. 프로세스가 대기 상태에서 준비 완료 상태로 전환될 때 (I/O의 완료)
4. 프로세스가 종료할 때

1, 4번의 경우, 스케줄링 측면에서의 선택이 불가(nonpreemptive)하다. 실행을 위해 새로운 프로세스(ready queue에 하나라도 존재할 경우)가 반드시 선택되어야 한다. 그러나 2, 3번은 선택의 여지가 있다.

상황 1, 4에서만 스케줄링이 발생할 경우, 우리는 이러한 스케줄링 방법을 비선점(nonpreemptive) 또는 협조적(cooperative)이라고 한다. 그렇지 않으면, 그것은 선점(preemptive)이라고 한다.

데이터가 다수의 프로세스에 의해 공유될 때 racing condition이 발생할 수 있다. 이럴 경우 mutex lock, monitor 등의 기법을 사용해서 racing condition을 피한다.

인터럽트는 어느 시점에서건 일어날 수 있고, 커널에 의해서 항상 무시될 수는 없기 때문에, 인터럽트에 의해서 영향을 받는 코드 부분은 반드시 동시 사용으로부터 보호되어야 한다.

### 5.1.4 Dispatcher

CPU 스케줄링 기능에 포함된 또 하나의 요소는 dispatcher 이다. dispatcher는 CPU 코어의 제어를 CPU 스케줄러가 선택한 프로세스에 주는 모듈이며, 다음과 같은 작업을 포함한다.

- 한 프로세스에서 다른 프로세스로 context switch
- 사용자 모드로 전환하는 일
- 프로그램을 다시 시작하기 위해 사용자 프로그램의 적절한 위치로 이동(jump) 하는 일

![Figure 5.3 The role of the dispatcher](https://user-images.githubusercontent.com/16266103/132116705-b47be689-8f65-4aea-be88-848dc0143c0d.png)

dispatcher는 모든 프로세스의 context switch시 호출되므로 가능한 한 빠르게 수행되어야 한다. dispatcher가 하나의 프로세스를 정지하고 다른 프로세스의 수행을 시작하는 데까지 소요되는 시간을 dispatch latency라고 한다.

context switch는 voluntary context switch와 nonvoluntary context switch로 나뉜다.

- voluntary context switch: 현재 사용 불가능한 자원을 요청했을 때 프로세스가 CPU 제어를 포기한 경우 발생
- nonvoluntary context switch: time slice가 만료되었거나 우선순위가 더 높은 프로세스에 의해 선점되는 경우와 같이 CPU를 빼앗겼을 때 발생