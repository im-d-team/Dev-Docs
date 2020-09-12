# Notion API를 이용해서 Meta html만들기

오늘은 간단하게 이직을 하고 두 달이 되고 나서 겪었던 일을 바탕으로 진행했던 개인적인 프로젝트에 대해서 이야기를 하려고 한다.

## 배경

- 서비스를 운영하면서 Into 페이지에 설정된 Meta 태그를 바꾸는 경우가 2달에 1번 발생한다.
- Meta 태그를 변경하게 되면 현재 구조에서는 다시 빌드하도록 신경써주어야 한다.
- Meta 태그 변경은 프론트엔드 개발자가 임의로 바꾸는 것이 아닌 마케팅을 위해 변경한다.

## 해결하고 싶은 부분

- 빌드 시점에 변경 사항을 자동으로 반영하고 싶다.
- 마케팅과 개발자가 변경되는 Meta 태그 정보를 주고 받지 않아도 반영되고 싶다.
- 개발자보다는 Meta 태그를 어떻게 설정하면 좋은 지 더 잘 알고 있는 마케터가 Meta 태그 코드를 작성할 수 있게 하고 싶다.

위와 같이 생각하고 있던 중 현재 회사가 사용하는 도구 중 Notion을 이용하면 좋은 프로젝트가 될 수 있겠다는 생각으로 진행했다.

'**먼저 Notion을 어떻게 사용할 것인가**' 다. Notion이라는 도구는 회사 내에서 모든 사람이 사용하는 도구로 **글을 작성하거나 DataBase**로 사용한다. 그렇다면 Meta 정보는 Notion에 작성하고, Meta 정보는 API로 가져오면 될 것 같다.

글을 작성할 당시 Notion에서는 별도의 API를 지원하지 않는다. 그래서 직접 조사를 해야 했다.

Notion은 웹을 지원한다(실제로는 앱도 웹이다.). 개발자 도구를 열어 'Network' 탭을 열고 **XHR** 통신이 어떻게 이루어지는지 알아보자.

우리가 찾아야 하는 정보는 아래와 같다.

- API
- Request Data
- Cookie(로그인 정보)
- Response

![chrome dev tool](https://user-images.githubusercontent.com/24274424/92750428-01f10880-f3c2-11ea-87d9-dab87306bca4.png)

이제 우리가 작성할 Meta 태그에 대한 정보를 Notion에 적으면 Notion API로 변경된 데이터를 가져올 수 있지 않을까? 라는 생각을 했다.

Notion에 Meta 태그만 작성할 공간을 DataBase 페이지로 만들었다. 그리고 해당 페이지의 데이터는 어떻게 가져오는지 API를 실행해보자.

우리가 만든 DataBase 형식은 `queryCollection` API를 사용해서 가져오는 것을 확인했다.

![response data](https://user-images.githubusercontent.com/24274424/92750942-82b00480-f3c2-11ea-95d6-faf24ca9a9f7.png)

Chrome 개발자 도구로 더 자세히 살펴보니 payload 부분에 아래와 같은 양식으로 호출하는 것을 확인했다. 좀 더 커스텀을 하면 정말 원하는 데이터만 가져올 수 있겠지만 이번에는 아래의 형식을 그래도 사용하기로 했다.

```json
{ 
    collectionId: ""
    collectionViewId: ""
    loader: {
        type: "table", 
        limit: 70, 
        searchQuery: "", 
        userTimeZone: "Asia/Seoul", 
        loadContentCover: true
    }
    limit: 70
    loadContentCover: true
    searchQuery: ""
    type: "table"
    userTimeZone: "Asia/Seoul"
    query: {
        aggregations: [
            {property: "title", aggregator: "count"}
        ]
    }
    aggregations: [{property: "title", aggregator: "count"}]
}
```

여기서 중요하게 생각한 것은 `collectionId`와 `collectionViewId`다. 각각은 Unique한 키로 원하는 데이터를 가져오기 위한 PK이다. Notion에서는 이 2개의 키로 원하는 페이지 데이터를 찾아서 가져오는 것이다.

또한 해당 API에 권한이 있는지 확인은 어떻게 하는지가 중요했다. API 요청에 대한 주소, 메서드, Payload는 알았지만 실제로 권한이 없으면 소용없다.

Notion이 PC 앱을 지원하면서 내부적으로 웹을 사용하는데 자동 로그인이 유지되는 것을 보니 어딘가 로그인 정보를 유지할 것이라고 생각했다. 

실제로 개발자 도구에서 cookie를 보게 되면 다양한 정보가 담기는 것을 확인할 수 있다.

```js
axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

간단한 코드로 위에서 찾은 API를 호출해서 잘 가져오는 것을 확인했다.

이제 Notion에 작성할 Meta 데이터 양식에 대해서 알아보고 형식을 만들어야했다. 마케터 분들이 작성한 데이터들이 `html` 형식에 맞게 구성되고 파일로 만들 수 있도록 하는게 목표이다.

현재 `head` 태그 안에 들어가는 모든 Tag를 조사하여, Column으로 Name, Type, MetaType, Contents 항목들을 만들었다.

- Name : Tag Name
- Type : Tag Type
- MetaType : Type이 Meta일 경우 선택하는 항목으로 name과 property 중 하나이다.
- Contents : 실제 값

![notion col name](https://user-images.githubusercontent.com/24274424/92750264-dd952c00-f3c1-11ea-9a43-1aeb0f10782a.png)


![notion meta data](https://user-images.githubusercontent.com/24274424/92750134-bfc7c700-f3c1-11ea-84fa-fde8a37474a2.png)

모두 정리했다.

생각보다 깔끔하게 정리가 됐다. 이렇게 구성하게 되면 추후에 새로운 태그가 추가될 경우 한 줄을 추가하고 입력하면 된다.

[이제 실제로 테스트를 해보자.](https://github.com/SeonHyungJo/metatag-generator-for-notion)

이제 이 과정을 빌드할 때 같이 해주면 된다. 우리가 기본적으로 사용하는 `npm script`는 `npm run build`다. 우리는 이 Meta 태그 파일을 빌드 시점 이전에 실행해서 만들고, 만들어진 결과물을 이용해서 같이 빌드를 하는 것을 원한다. 이에 `npm run prebuild` 시점에 Meta 파일을 만들도록 추가하였다.