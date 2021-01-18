# IPC(Inter Process Communication) 기법

프로세스는 서로 접근이 불가능하다. 프로세스는 커널만 접근할 수 있기 때문이다. 하지만 병렬처리가 필요하거나 서로 다른 프로세스 간의 상호작용이 필요할 수 있다. 예시를 떠올리기 힘들다면 서버-클라이언트 모델을 생각해보면 이해하기 쉽다. 서버와 클라이언트는 서로 다른 프로세스이지만 정보를 주고받아야 한다. 이걸 해결하는 방법이 IPC(Inter Process Communication; 프로세스 간 커뮤니케이션)이다.

### 들어가기 전에

가장 쉽게 IPC를 구현하는 방법으로 파일을 사용하는 방법이 있다. 하나의 파일에 필요한 자원이나 메세지를 입력하여 공유하는 것이다. 하지만 업데이트 상황을 감지하기 어렵고 저장 매체를 지속적으로 사용해야 하므로 하드웨어 인터럽트가 발생할 것이고 성능이 떨어질 것이다. 때문에 커널 공간을 이용한 기법들이 대부분이다.![프로세스2](https://github.com/Dae-Hwa/diagrams/blob/master/os/process/%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A42.png?raw=true)

모든 프로세스에는 커널 영역이 할당되어 있다. 똑같은 커널 영역을 사용하기 때문에 프로세스에 있는 커널 영역은 물리 메모리에 올라가 있는 하나의 커널 영역을 참조한다. 만약 프로세스 A와 B에서 커널 영역에 접근 하게 된다면 같은 영역에 접근하게 되는 것이다. 즉, 커널 영역을 사용할 수 있도록 [시스템 콜](https://ko.wikipedia.org/wiki/%EC%8B%9C%EC%8A%A4%ED%85%9C_%ED%98%B8%EC%B6%9C)을 제공한다면 IPC를 구현할 수 있다.

## IPC 기법

IPC에 대한 대표적인 접근방식은 아래와 같다.

> 항목은 [Inter-process communication - Wikipedia](https://en.wikipedia.org/wiki/Inter-process_communication#Approaches) 를 바탕으로 linux에서 사용할 수 있는 것들을 기준으로 선정했다.

- 파일(file)
- 공유 메모리(shared memory)
- 메세지 패싱(message passing)
    - 파이프(pipe)
    - 메세지 큐(message queue)
    - 시그널(signal)
    - 소켓(socket)
    - 세마포어(semaphore)

파일을 이용한 IPC 외에는 크게 두 가지 컨셉이 있다. 프로세스끼리 공유할 수 있는 메모리를 만들어 함께 접근하거나, 메세지를 주고받는 것(메세지 패싱)이다. 

> 참고 - https://www.geeksforgeeks.org/inter-process-communication-ipc/

### 공유 메모리(Shared Memory)

물리 메모리 공간에 변수처럼 사용할 수 있도록 공간을 만드는 것이다. key와 접근권한을 부여하여 등록하고 사용할 수 있다.

![공유메모리1.png](https://github.com/Dae-Hwa/diagrams/blob/master/os/ipc/%EA%B3%B5%EC%9C%A0%EB%A9%94%EB%AA%A8%EB%A6%AC1.png?raw=true)

#### 장점

- 메모리에 있는 것을 그대로 사용할 수 있기 때문에 속도가 빠르다. 
- 구현도 간단하다. 
- 여러 프로세스가 동시에 접근할 수 있다.

#### 단점

- 동기화(synchronize) 이슈가 생길 수 있다.
- 커널에서 설정된 용량에 종속적이다.
- 데이터를 읽어야 되는 시점을 알 수 없다.    
    > 사용자(consumer)가 어떤 데이터를 사용할지 직접 명시해야 하기 때문이다. 다른 방식은 메세지를 전달받기 때문에 해당 메세지에 해당하는 데이터를 읽으면 된다.

### 파이프(Pipe)

한 프로세스가 넣으면 다른 프로세스가 읽는 큐 형태의 구조이다. 하지만 방향이 고정되어있어 한 방향으로만 통신할 수 있다. 물탱크에서 관(파이프)을 통해 수도꼭지로 물이 나오는 것을 생각해보면 이해하기 쉽다. 즉, 파이프의 입력부분과 출력 부분이 정해지면 입력 부분이 구현된 프로세스에서는 입력만, 출력 부분이 구현된 프로세스에서는 출력만 가능하다. 또한, 읽기와 쓰기가 block 모드로 이루어지기 때문에 양방향으로 구현하더라도 반이중(half-duplex) 통신으로 동작한다. 반이중 통신의 대표적인 예로 무전기가 있는데 이와 유사하게 동작하는 것이다.

#### 장점

- 매우 간단하게 사용할 수 있다.

#### 단점

- 부모-자식 간에만 사용할 수 있다.
- 단방향(unidirection) 통신이다.
- 양방향(bidirection)으로 구현하여도 반이중 통신이다.

#### Named Pipe(후술 FIFO)

앞에서 살펴본 파이프는 엄밀히 따지면 익명 파이프(anonymous pipe)라고 불린다. 이 방식의 단점 중 부모-자식 프로세스에서만 사용할 수 있다는 것인데, FIFO는 그러한 단점을 해결하기 위한 것이다. 즉 관련 없는 프로세스들에서 파이프를 이용한 IPC를 구현하기 위해 사용할 수 있다.

> 서버-클라이언트 모델에 사용되는 방식이다.

### 메세지 큐(Message Queue)

key를 이용한 큐 방식이다. 선입선출 외에 지정한 key 중 가장 먼저 입력된 자료를 꺼낼 수 있다. 양방향으로 통신할 수 있다.![메세지큐1.png](https://github.com/Dae-Hwa/diagrams/blob/master/os/ipc/%EB%A9%94%EC%84%B8%EC%A7%80%ED%81%901.png?raw=true)

#### 장점

- 프로세스 간의 비동기(asynchronization) 통신이 가능하다.
- 키를 이용하면 권한이 있는 모든 프로세스에서 접근할 수 있다.    
    > 하지만 큐이기 때문에 동기화 이슈를 염려할 필요 없다.

#### 단점

- 대기열이 지나치게 길어지면 병목현상이 발생할 수 있다.

### 시그널(Signal)

커널 또는 프로세스에서 다른 프로세스에 어떤 이벤트가 발생했는지 알려주는 기법이다. 프로세스의 실행 종료 등을 알려준다. 프로세스에서 시그널을 재정의하면 시그널의 기본 동작과 다른 동작을 할 수 있다. 이를 이용하기 위해 유저 정의 시그널(리눅스의 경우 SIGUSR1, 2)을 제공한다.

> 시그널 무시, 시그널 블록(block), 핸들러에 정의된 동작 수행(콜백 함수처럼 동작한다)

시그널의 좀 더 자세한 동작 원리는 인터럽트가 종료되어 사용자 모드로 전환하는 시점에 pcb(process control block)에 있는 시그널과 관련된 자료구조의 상태를 확인하는 것이다. 이를 이용하여 다른 IPC 기법과 조합하여 사용할 수 있다. 데이터를 직접 전송할 수 없다는 단점이 있다.

### 소켓(Socket)

기본적으로 네트워크 통신을 위한 기술로 클라이언트와 서버 간의 요청과 응답을 처리하는 기술이다. 앞에서 파이프의 발전된 형태인 FIFO를 잠깐 살펴봤는데 소켓은 FIFO가 양방향으로 구성된 것과 흡사하다. 근본적으로 서로 다른 네트워크의 프로세스를 연결하는 기술이지만, [Unix Domain Socket(IPC socket)](https://en.wikipedia.org/wiki/Unix_domain_socket)을 이용하여 커널 내부의 커뮤니케이션에 사용할 수 있다. 

#### 장점

- 양방향으로 많은 데이터가 오고 가야 할때 유리하다.

#### 단점

- 프로그램의 규모가 작다면 오버헤드가 클 수 있다.

### 세마포어(Semaphore)

세마포어는 조금 특이하다. 원래는 동기화 이슈를 해결하기 위한 방법론 중 하나이기 때문이다. 동기화 이슈가 생기는(동시에 접근하면 안 되는) 부분을 임계 영역(critical section)이라고 한다. 여기에 대한 동시 접근을 막는 것을 상호배제(MUTial EXclusion; MUTEX)라고 하는데, 세마포어는 동시 접근 할 수 있는 프로세스의 개수를 정해놓는 기법이다.

```pseudocode
/**
 * S : 임계 영역에 동시에 진입할 수 있는 스레드 수
 *
 * P 
 *  - 임계 영역에 들어가기 전에 실행 가능 여부 판단(S가 0보다 작을 경우 실행 불가)
 *  - 실행 불가능 시 locking
 *  - 실행 가능하면 S--
 * V : 임계 영역에서 빠져나올 때 완료 체크(완료 시 S++)
 */

P(S) {
    while S <=0;
    S--;
}

V(S) {
    S++;
}
```

>   비효율성을 해결하기 위해 대기 큐를 적용할 수 있다. 주제에서 벗어나기 때문에 다음을 참고 - [세마포어 - 위키백과](https://ko.wikipedia.org/wiki/%EC%84%B8%EB%A7%88%ED%8F%AC%EC%96%B4#%EC%A0%81%EC%9A%A9)

실제 구현 시 특정 임계 영역을 정해놓고 세마포어가 사용 가능할 때까지 기다린다. 따지고 보면 임계 영역이 공유되는 영역이기 때문에 IPC로 이용할 수 있는 것이다. 

#### 장점

- 다른 동기화 방법보다 효율적이다.
- 임계 영역에 접근 가능한지 여부를 제공하기때문에 busy waiting을 사용하지 않아도 된다.    
    > busy waiting : 특정 자원이 사용가능한지 계속 확인하는 것으로 자원 낭비가 일어날 수 있다.

#### 단점

- 동기화에 대한 조건을 다뤄야하기 때문에 오류 없이 구현하기 까다롭다.

## 마치며

이외에도 여러 가지 IPC기법들이 있는데, 잘 생각해봐야 할 것은 위에서도 잠깐 언급되었지만 여러가지 IPC기법을 필요에 따라 조합하여 사용할 수 있다는 것이다. 따라서 구성하려는 시스템의 요구사항이 무엇인지 잘 파악해야 할 것이다.

본문에서는 리눅스를 기반으로 설명하였는데, 윈도우에서 사용되는 IPC가 궁금하다면 [Interprocess Communications - MSDN](https://docs.microsoft.com/ko-kr/windows/win32/ipc/interprocess-communications?redirectedfrom=MSDN)를 참고하자.

이외에 자세한 구현이 궁금하다면 [IPC - joinc](https://www.joinc.co.kr/w/Site/system_programing/Book_LSP/ch08_IPC#s-2.4), [Linux System V and POSIX IPC Examples](http://hildstrom.com/projects/ipc_sysv_posix/index.html)와 [Beej's Guide to Unix IPC](http://beej.us/guide/bgipc/html/single/bgipc.html) 에 잘 정리가 되어있다.

---

#### References

- [POSIX shared-memory API - GeeksforGeeks](https://www.geeksforgeeks.org/posix-shared-memory-api/)

- [Inter-process communication - Wikipedia](https://en.wikipedia.org/wiki/Inter-process_communication#Approaches) 

- [Interprocess Communications - MSDN](https://docs.microsoft.com/ko-kr/windows/win32/ipc/interprocess-communications?redirectedfrom=MSDN)

- [Linux System V and POSIX IPC Examples](http://hildstrom.com/projects/ipc_sysv_posix/index.html)

- [IPC - joinc](https://www.joinc.co.kr/w/Site/system_programing/Book_LSP/ch08_IPC#s-2.4)

- [파이프 (유닉스) - 위키백과](https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%B4%ED%94%84_(%EC%9C%A0%EB%8B%89%EC%8A%A4))

- [IPC  InterProcess Communication  프로세스 간 통신 - 정보통신기술용어해설](http://www.ktword.co.kr/abbr_view.php?m_temp1=302)

- [Beej's Guide to Unix IPC](http://beej.us/guide/bgipc/html/single/bgipc.html)
