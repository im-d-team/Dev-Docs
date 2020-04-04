# 기수 정렬(Radix Sort)

비교(comparison) 기반 정렬 알고리즘의 가장 낮은 복합도는 `O(nlogn)` 이다.

반면 계수 정렬(counting sort)은 선형 시간 정렬 알고리즘이다. 검색 대상의 범위가 1부터 k까지라고 할 때 `O(n+k)` 의 복합도를 가진다.

> [선형 시간(lineart time)](https://ko.wikipedia.org/wiki/%EC%84%A0%ED%98%95_%EC%8B%9C%EA%B0%84) : 계산 복잡도 이론에서 입력된 길이 n에 대하여 실행시간이 `O(n)` 이 되는 것
>
> 참고 : [계수 정렬](https://github.com/Im-D/Dev-Docs/blob/master/CS/Counting-sort.md)

하지만 대상의 범위 k가 n^2 보다 커질 경우 `O(n^2)` 이상의 복잡도를 가지게 된다. 이는 비교 기반 정렬 알고리즘보다 성능이 좋지 않다.

이런 경우 기수 정렬을 통해 선형 시간을 갖는 정렬을 할 수 있다. 

## 수행과정

기수 정렬은 각 자릿수마다  순차적으로 정렬하는 방식이다. 

10진수를 사용한다면 각 자릿수는 최소 0에서 최대 9까지의 값만 나올 수 있다.

따라서 각 자릿수 마다 계수 정렬을 실행한다면, 계수 정렬의 범위가 항상 9로 정해진다.

> 계수 정렬을 사용하기 때문에 부동 소수점은 정렬이 불가능하다.

수행과정은 다음과 같다.

```java
// 정렬 대상
int arr[] = {170, 45, 75, 90, 802, 24, 2, 66};
int max = 정렬 대상의 최대값
    
for (자릿수 = 1; max/자릿수 > 0; 자릿수 *= 10) {
	계수정렬 실행
} 
```

> 참고 :  [수행과정 - Radix Sort | GeeksforGeeks](https://youtu.be/nu4gDuFabIM?t=18)



자릿수의 개수만큼 반복해야하기 때문에 최고 자릿수가 `d` 일 때 기수 정렬의 시간 복잡도는 `O(dn)` 이다. 예를 들어, 가장 큰 수가 10000이라면, 최고 자릿수가 5이기 때문에 `O(5n)` 이 된다.

따라서 특정 조건을 만족하면 아주 빠른 알고리즘이지만, 자릿수 만큼의 저장 공간이 추가로 발생하기 때문에 공간 복잡도가 좋지 않다.

## 기수 정렬의 다른 방법

위에서 알아본 계수 정렬 방법은 일반적인 방법으로 가장 오른쪽 부터 시작하는 LSD radix sort이다. 반대로 가장 왼쪽 부터 시작하는 경우는 MSD라고 한다.

> LSD(Least Significant Digit; 최하위 자릿수)
>
> MSD(Most Significant Digit; 최대 자릿수)

LSD의 경우 stable하지만, MSD는 stable 하지 않다. 따라서 기수 정렬의 서브루틴으로 계수 정렬을 사용하기 위해서는 LSD를 사용해야한다.

LSD는 모든 자릿수를 정렬해야 정렬된 결과를 얻을 수 있지만, MSD의 경우 중간에 정렬이 완료될 수 있다. 하지만 이를 위해 추가적인 연산과정과 메모리가 필요하다. 자세한 사항은 다음을 참고하자.

> 참고 : [In-place MSD radix sort implementations - wikipedia](https://en.wikipedia.org/wiki/Radix_sort#In-place_MSD_radix_sort_implementations)

### 버킷 정렬(bucket sort)

이외에도 힙 혹은 버킷을 이용하여 기수 정렬을 구현하는 경우가 있다. 이는 버킷 정렬을 사용한다.

![bucketsort](../assets/images/bucket-sort.png)

버킷 정렬은 정렬 대상의 값들이 일정하게 분포되어 있을 때 효과적인 방법이다.

값의 분포에 따라 특정 범위를 지정한다. 이 때, 지정한 범위가 버킷이다.

범위에 해당되는 값들을 각 버킷에 담고 버킷 내의 값들을 정렬하는 방법이다.

이 때, 버킷 내의 값들은 버킷 정렬을 반복하여 적용시키거나, 다른 알고리즘을 사용하여 정렬한다.

이러한 원리를 이용하여 기수 정렬을 병렬 컴퓨팅에 적용하는 경우도 있는데 이는 다음을 참고하자

> 참고 
>
> - [Application to parallel computing - wikipedia](https://en.wikipedia.org/wiki/Radix_sort#Application_to_parallel_computing)
> - [Fastest sorting algorithm for distributed systems (Parallel Radix Sort) [Difficulty: Medium]](https://summerofhpc.prace-ri.eu/fastest-sorting-algorithm-for-distributed-systems-parallel-radix-sort-difficulty-medium/)

---

References

- [Bucket Sort - GeeksforGeeks](https://www.geeksforgeeks.org/bucket-sort-2/)
- [What are the differences between radix sort and bucket sort? - Quora](https://www.quora.com/What-are-the-differences-between-radix-sort-and-bucket-sort)
- [Radix Sort - BRILLIANT](https://brilliant.org/wiki/radix-sort/)
- [Radix sort - wikipedia](https://en.wikipedia.org/wiki/Radix_sort)
- [기수 정렬(Radix Sort) - tubuk.tistory.com](https://tubuk.tistory.com/16)

