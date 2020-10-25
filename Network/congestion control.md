# congestion control(혼잡 제어)

저번 시간에는 송신 측과 수신 측의 데이터 처리 속도를 해결하기 위해 쓰이는 `flow control`에 대해 조사를 하였다.

이번 시간에는 `congestion control`에 대해 조사를 해보았다.

`congestion control`이란 송신 측의 데이터 전달과 네트워크의 **데이터 처리 속도 차이**를 해결하기 위한 기법이다. 

송신 측의 데이터는 지역망이나 인터넷으로 연결된 대형 네트워크를 통해 전달된다. 이러한 네트워크상의 라우터가 항상 한가로운 것은 아니기 때문에 데이터가 급격히 몰릴 경우 문제가 발생한다.

만약, 한 라우터에 데이터가 몰릴 경우(=혼잡할 경우) 라우터는 자신에게 온 데이터를 모두 처리할 수 없다. 그렇다면 송신 측에서 데이터를 다시 재전송을 하게 되고 혼잡을 가중해 오버플로우가 발생해 데이터 손실을 야기시킨다.

따라서, 이러한 네트워크의 혼잡을 피하고자 송신 측에서 보내는 데이터의 전송 속도를 강제로 줄이는 것을 혼잡제어라 한다.

흐름 제어는 송신 측과 수신 측 사이의 전송속도를 다루는 데에 반해 혼잡제어는 호스트와 라우터를 포함한 보다 넓은 관점에서의 전송 문제를 다루게 된다.

혼잡 제어 알고리즘에는 네 가지가 있다.

1. AIMD (Additive/Multicative Decrease)
2. Slow start (느린 시작)
3. Fast Retransmit (빠른 재전송)
4. Fast Recovery (빠른 회복)

하나씩 살펴보기 전에 `MSS`에 대해 알고 넘어가야 한다.

## 혼잡 윈도우 크기 초기화하기
통신을 하는 중간에는 `ACK`가 유실된다거나 타임아웃이 난다거나 하는 등의 정보를 사용하여 네트워크의 혼잡 상황을 유추할 수 있지만, 
통신을 시작하기 전에는 그런 정보가 하나도 없기 때문에 혼잡 윈도우 크기를 정하기가 조금 애매하다. 여기서 등장하는 것이 바로 `MSS(Maximum Segment Size)`이다. 

`MSS`는 한 세그먼트에 최대로 보낼 수 있는 데이터의 양을 나타내는 값인데, 대략 다음과 같은 계산을 통해 구할 수 있다.
> MSS = MTU - (IP헤더길이+IP옵션길이) - (TCP헤더길이+TCP옵션길이)

여기서 `MTU(Maximum Transmission Unit)` **한번 통신할 때 보낼 수 있는 최대 단위를 의미한다.**

즉, `MSS`는 한번 전송할 때 보낼 수 있는 최대 단위가 정해져 있는 상황에서 IP 헤더, TCP 헤더 등 데이터가 아닌 부분을 전부 발라내고 **데이터를 담을 수 있는 공간**이 얼마나 남았는지를 나타내는 것이다.

![MTU](https://user-images.githubusercontent.com/43868540/95658420-2ffa7180-0b55-11eb-8913-594d8438ac87.PNG)
> 우리집 컴퓨터의 MTU값.

MTU 기본값으로 `1500 bytes`가 설정되어 있는 것을 확인 할 수 있다. OSX는 기본적으로 `MTU`를 `1500 bytes`로 설정한다.

이때 TCP와 IP의 헤더크기가 각각 `20bytes`라고 하면 MSS는 `1500-40=1460bytes`가 되는 것이다.

## AIMD
`AIMD (Additive/Multicative Decrease)` 방식은 우리 말로 직역하면 **합 증가/곱 감소 방식**이라는 뜻이다.

즉, 네트워크에 아직 별문제가 없어 전송 속도를 더 빠르게 하기 위해서 `cwnd`를 **1씩 증가**시킨다. 하지만 중간에 데이터가 유실되거나 응답이 오지 않는 등의 혼잡 상태가 감지되면 `cwnd`를 **반**으로 줄인다.
>  cwnd란 혼잡 윈도우 크기로 송신 측에 있는 윈도우 크기이다. 

늘어날 때는 `cwnd+1`, 줄어들 때는 `cwnd*0.5`이다.

이렇게 늘어날 때는 선형적으로 조금씩 늘어나고 줄어들 때는 반으로 확 줄어드는 `AIMD`의 특성때문에 혼잡 윈도우 크기를 그래프로 그려보면 다음과 같은 톱니 모양이 나타난다.

<img width="608" alt="AIMD" src="https://user-images.githubusercontent.com/43868540/94355427-eb83c600-00be-11eb-83aa-cf7377e5df8c.png">

- [출처 evan-moon.github](https://evan-moon.github.io/2019/11/26/tcp-congestion-control/)

그러나 `AIMD`의 문제점은 네트워크 대역이 많이 남아도는 상황에도 윈도우 크기를 너무 조금씩 늘리면서 접근한다는 것이다.

그런 이유로 `AIMD`은 네트워크의 모든 대역을 활용하여 제대로 된 속도로 통신하기까지 시간이 조금 걸린다. 

## Slow Start
요즘 네트워크의 발전으로 인해 네트워크의 혼잡 상황이 발생하는 빈도가 많이 줄어들었다. 이에 따라 혼잡이 발생하지도 않았는데 제대로 속도를 내는 데까지 오래 걸리는 `AIMD` 방식의 단점이 점점 부각되었다. 이를 해결하기 위해 `Slow Start`의 개념이 등장한다. 

`Slow Start`는 기본적인 원리는 `AIMD`와 비슷하다. 윈도우 크기를 증가시킬 때는 지수적으로 증가시키다가 손실 이벤트(혼잡)가 있으면 윈도우 크기를 `1`로 줄여버리는 방식이다.

이 방식은 보낸 데이터의 `ACK`가 도착할 때마다 윈도우 크기를 증가시키기 때문에 처음에는 윈도우 크기가 조금 느리게 증가할지 몰라도, 시간이 가면 갈수록 `ACK`의 수도 늘어나기 때문에 윈도우 크기가 점점 빠르게 증가한다는 특징이 있다.

![slow start](https://user-images.githubusercontent.com/43868540/95658695-502b3000-0b57-11eb-9ebc-5a05d5d725ba.PNG)
> [출처 evan-moon.github](https://evan-moon.github.io/2019/11/26/tcp-congestion-control/)

`slow start`의 차트를 확인해보면 `AIMD`보다는 급격하게 윈도우 크기가 커지고 급격하게 `1`로 감소하는 것을 확인해 볼 수 있다. 

하지만 윈도우 크기가 기하급수적으로 늘어나면 제어가 힘들어지고 네트워크의 혼잡 또한 빈번하게 발생하게 된다. 그럴 때마다 계속 윈도우 사이즈를 `1`로 줄이는 것이 효율적이지 않을 것이다.
따라서 빠르게 값을 증가시키는 것보다는 `AIMD`보다는 빠르게, 조금씩 증가시키는 편이 훨씬 안전할 것이다. 

이때 나오는 개념이 `Slow start 임계점`이다.

### Slow start 임계점(ssthresh)
`ssthresh`는 쉽게 말하면 `여기까지만 Slow Start를 사용하겠다.`라는 의미를 가진다. 

![ssthresh](https://user-images.githubusercontent.com/43868540/95659718-ec583580-0b5d-11eb-9a11-6fd269d690c4.PNG)
> [출처 evan-moon.github](https://evan-moon.github.io/2019/11/26/tcp-congestion-control/)

`Slow Start` 상태에서는 확인 응답(ack)를 받을 때마다 가용 폭을 `1MSS`부터 `1MSS`씩 증가시킨다. `MSS`가 늘어나면 그에 따라 확인 응답(ack)도 늘어나는데, 그 늘어난 확인 응답이 `MSS`도 또다시 증가시키기 때문에 결국에는 기하급수적으로 늘어나는 지수적 증가가 된다.

이런 지수적 증가는 Timeout에 의한 손실 이벤트(혼잡)가 있으면 끝나게 되는데, 가장 보수적으로 `cwnd`값을 다시 `1`로 줄이게 된다.

그래서 특정한 임계점(Threshold)을 정해놓고, 임계점을 넘어가게 되면 `AIMD` 방식을 사용하여 선형적으로 윈도우 크기를 증가시킨다. 그래서 이 임계점을 칭하는 단어가 `ssthresh(Slow Start Threshold)`인 것이다.

송신 측은 본격적인 통신이 시작하기 전에 `ssthresh` 값을 자신의 혼잡 윈도우의 절반 크기인 `0.5 MSS`으로 초기화하고, 통신을 시작한다.

## Fast Retransmit
빠른 재전송은 TCP의 혼잡 조절에 추가된 정책이다. 저번 시간에 배웠듯이 수신 측에서 보내는 `ACK` 패킷은 다음 받을 패킷의 순번을 실어서 보내게 된다.

하지만 송신 측에서 패킷을 보내다가 손실되게 되면 수신 측에서는 `ACK` 패킷에 유실된 패킷의 번호를 담아서 보내게 된다.
송신 측은 순번이 중복된 `ACK` 패킷을 받게 되고, 중복된 순번의 패킷을 3개 연속으로 받으면 재전송을 하게 된다. 

같은 순번의 패킷을 3개 연속으로 받으면 혼잡임을 감지하고 `cwnd`를 줄이게 된다.

![Fast Transmit](https://user-images.githubusercontent.com/43868540/95826607-83470c80-0d6d-11eb-9f58-8bcaf0704e42.PNG)
> [출처 movefast.tistory](https://movefast.tistory.com/36) 

## Fast Recovery
빠른 회복은 `Slow Start`로 인해 `cwnd`를 `1MSS`로 떨어뜨리게 된다면 다시 데이터의 흐름 속도를 회복하는데 오래 걸릴 것이다. 
그렇기 때문에 빠르게 회복하기 위해 두 가지의 방법이 쓰인다.

**1. TCP Tahoe**

`TCP Tahoe`는 `Slow Start`를 사용한 혼잡 제어 정책의 초기 버전으로, `빠른 재전송` 기법이 처음으로 도입된 방법이다. `Tahoe`는 처음에는 `Slow Start`를 사용하여 자신의 윈도우 크기를 지수적으로 빠르게 증가시키다가 `ssthresh`를 만난 이후부터는 `AIMD`에서 사용하는 합 증가 방식을 사용하여 선형적으로 윈도우 크기를 증가시킨다. 그러다가 `ACK Duplicated`나 `Timeout` 즉, 손실이벤트가 발생하면 네트워크에 혼잡이 발생했다고 판단하고, `ssthresh`와 자신의 `cwnd`를 무조건 **`1MSS`로 줄이고**, `slow Start` 단계로 들어간다.

**2. TCP Reno**

`Tahoe` 이후에 나온 버전으로 **손실의 종류**에 따라 `cwnd`를 수정하는 방식이 다르다. 우선, **3개의 중복 ACK에 의한 손실이 발생**하면 `cwnd` 크기를 `1MSS`로 줄이는게 아니라 현재 **cwnd 크기의 절반**으로 줄인 다음 `1MSS`씩 선형으로 증가를 시킨다. 하지만 만약 **타임아웃에 의한 손실**이라면 `Tahoe`와 마찬가지로 **`1MSS`로 초기화** 되고 `Slow Start`를 진행한다.

![congestion control](https://user-images.githubusercontent.com/43868540/95659402-ba45d400-0b5b-11eb-8561-5ee1718ec8f1.PNG)
 > 출처 [blog.naver](http://blog.naver.com/PostView.nhn?blogId=sjc02183&logNo=221686794605&parentCategoryNo=&categoryNo=55&viewDate=&isShowPopularPosts=false&from=postView)
 
위 그림을 보면 9라운드부터 타호와 리노의 모양이 달라지는 것을 확인할 수 있다.

손실 발생 시, `TCP Tahoe`는  `1MSS`로 떨어진다. 반면에 `TCP Reno`는 중복 ack가 3개 발생했을 때는 절반으로,  타임아웃으로 인한 패킷 손실이면 `1MSS`로 떨어진다.

----
#### Reference
- [TCP의 혼잡제어](https://evan-moon.github.io/2019/11/26/tcp-congestion-control/)
- [혼잡제어](https://ko.wikipedia.org/wiki/%ED%98%BC%EC%9E%A1_%EC%A0%9C%EC%96%B4)
