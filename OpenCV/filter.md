# 영상처리 Filtering

## Filtering

영상에서의 filtering이란 원하는 성분을 추출하는 과정을 의미한다.
이미지도 음성 신호처럼 주파수로 표현이 가능하다.
일반적으로 고주파는 밝기의 변화가 많은 곳, 즉 경계선 영역에서 나타나며, 일반적인 배경은 저주파로 나타난다. 이것을 바탕으로 고주파를 제거하면 Blur처리가 되며, 저주파를 제거하면 대상의 영역을 확인할 수 있다.

### 용도

- 특정한 feature를 뽑아낼 때 전처리 혹은 후처리
- 노이즈 제거
- down or up scaling
 
## Convolution

![convolution](https://user-images.githubusercontent.com/43839951/84584138-d77fc580-ae3b-11ea-9bdd-d1ca2107e4bb.JPG)

- Convolution이란 시스템 출력을 구할 때 사용하는 하나의 '연산'으로 입력함수와 시스템 함수를 이용하여 출력값을 계산하는 연산을 의미.
- 영상 신호 처리 관점에서의 Convolution은
가중치(weight)을 갖는 mask(kernal)를 이용하여 영상처리를 하는 것을 의미. 입력영상에 mask를 씌운 다음 각 픽셀과 마스크를 곱한 값들의 합을 출력영상으로 만드는 것을 의미.

![영상처리 convolution](https://user-images.githubusercontent.com/43839951/84584032-b36fb480-ae3a-11ea-9884-ab445ae4d97a.JPG)


오리 이미지(input)에 2차원 행렬(mask)을 convolution 해주었다면 오리 사진이 행렬의
개수만큼 복사되어 출력(output)된다.

### 용도 

1. 블러링: 영상에서 화소값이 급격하게 변하는 부분들을 감소시켜 점진적으로 변하게 함으로써 영상이 전체적으로 부드러운 느낌이 나게 하는 기술. 이웃 화소들을 평균화 하는것. 


2. 샤프닝: 영상에 에지를 날카롭게 표현


3. 노이즈 제거
## low-pass filter(LPF)

- 노이즈제거나 blur처리에 사용된다.
- 고주파영역을 제거함으로써 노이즈를 제거하거나 경계선을 흐리게 할 수 있다
- 저주파 통과 필터링은 신호 성분 중 저주파 성분은 통과시키고 고주파 성분은 차단하는 필터이다. 잡음을 제거하거나 흐릿한 영상을 얻을 때 주로 사용되는 필터이다. 고주파 성분을 제거하므로 고주파 차단 필터라고도 한다. 저주파 통과 필터링의 마스크는 모든 계수가 양수이고 전체 합이 1인 마스크가 사용된다. 저주파 통과 필터 마스크는 다음과 같은 형태이다.

## 이미지 블러링 

- LPF 커널을 이미지에 적용하여 달성

- 이미지 블러링은 노이즈 제거를 수행하는데 유용

## 블러링 기술

#### Mean filtering

- kernel 안의 모든 값을 같게 하여 계산
- kernel 안의 모든 값의 합은 1이 되도록 지정


![meanFilter](https://user-images.githubusercontent.com/43839951/84584041-ddc17200-ae3a-11ea-9e68-b8a2f78ec9c0.JPG)

#### gaussian filtering

![image](https://user-images.githubusercontent.com/43839951/84584581-1f551b80-ae41-11ea-9951-95c88811ebd1.png)
- Gaussian함수를 이용한 Kernel을 적용 
- 가중치를 이용하여 필터 생성 중심에 있는 픽셀에 높은 가중치 부여함

#### median filtering


- kernel window와 pixel의 값들을 정렬한 후에 중간값을 선택하여 적용
- 픽셀값들을 주변 픽셀들의 중간값으로 대체하다보니, 한 픽셀씩 연관성없이 바뀌어 있는 salt&pepper 노이즈를 제거하는데 매우 탁월
  
  
  


![median필터링](https://user-images.githubusercontent.com/43839951/84584050-f16cd880-ae3a-11ea-93db-d46c92021956.JPG)

kernel window을 적용시킨 결과가 위의 그림과 같다고  할 때, 행렬의 값들을
크기순으로 정렬 하면 33,54,67,84,102,163,189,212,224이다.이중에 중간값인 102가 중앙값으로 결정 된다.(중앙에 있는 189가 102로 변경)

#### bilateral filtering

 경계선을 유지하면서 Gaussian Blur처리를 해주는 방법
 Gaussian 필터를 적용하고, 또 하나의 Gaussian 필터를 주변 pixel까지 고려하여 적용하는 방식입니다.

 ### 예시

- 원본

![org](https://user-images.githubusercontent.com/43839951/84584195-31808b00-ae3c-11ea-9717-be83369e41cd.JPG)

- Gaussian blur

![blur](https://user-images.githubusercontent.com/43839951/84584204-4f4df000-ae3c-11ea-990f-ad96fd5c8bef.JPG)


- median blur


![median](https://user-images.githubusercontent.com/43839951/84584216-68ef3780-ae3c-11ea-85eb-17c140eccc7e.JPG)

- bilateral blur

![bilateral](https://user-images.githubusercontent.com/43839951/84584221-77d5ea00-ae3c-11ea-85c8-5abd5416c65e.JPG)

#### Reference

[mean / gaussian filter](https://preventionyun.tistory.com/31)

[Convolution & Correlation 이해하기](https://www.popit.kr/%EB%94%AE%EB%9F%AC%EB%8B%9D%EC%98%81%EC%83%81%EC%B2%98%EB%A6%AC-convolution-correlation-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0/)

[Image Smoothing](https://opencv-python.readthedocs.io/en/latest/doc/11.imageSmoothing/imageSmoothing.html)
