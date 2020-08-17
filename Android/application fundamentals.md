# 안드로이드 (Android)

Android 앱은 Kotlin, Java, C++ 언어를 사용하여 작성할 수 있습니다. Android SDK(Software Development Kit) 도구는 모든 데이터 및 리소스 파일과 함께 코드를 컴파일하여 하나의 **APK(Android PacKage)** 를 만듭니다. Android Package는 접미사가 .apk인 아카이브 파일입니다. 한 개의 APK 파일에는 Android 앱의 모든 콘텐츠가 들어 있으며, Android로 구동하는 기기가 앱을 설치할 때 바로 이 파일을 사용합니다.

Android 시스템은 **최소 권한의 원리( Principle of least privilege )** 를 구현합니다. 다시 말해, 각 앱은 기본적으로 자신의 작업을 수행하기 위해 **필요한 구성 요소에만 액세스 권한을 가지고 그 이상은 허용되지 않습니다.** 이렇게 하면 대단히 안전한 환경이 구성되어 앱이 시스템에서 권한을 부여받지 못한 부분에는 액세스할 수 없게 됩니다. 

앱이 다른 앱과 데이터를 공유하고 시스템 서비스에 액세스하는 방법은 여러 가지가 있습니다. 그 중에서 '권한'을 살펴보도록 하겠습니다. 앱은 사용자의 연락처, SMS 메시지, 마운트 가능한 저장소(SD 카드), 카메라, 블루투스를 비롯한 여러 가지 기기 데이터에 액세스할 '권한'을 요청할 수 있습니다. 사용자는 이러한 **권한(Permission)** 을 명시적으로 부여해야 합니다. 

> 권한(Permission) 부여하는 방법

앱은 앱 매니페스트에 <uses-permission> 태그를 포함하여 필요한 권한을 추가해야 합니다. 예를 들어 **SMS 메시지를 보내야 하는 앱** 은 [매니페스트(manifest)](https://developer.android.com/guide/topics/manifest/manifest-intro?hl=ko)에 다음 줄이 있어야 합니다.
```xml
<manifest ... >
    <uses-permission android:name="android.permission.SEND_SMS"/> <!-- SMS 메시지 권한 추가 -->
    ...
</manifest>
```


# 앱 기본요소 (Application Fundamentals)

- **Manifests**: 구성 요소를 선언하고 앱에 필수적인 기기 특징을 선언할 수 있는 매니페스트 파일.
- **App components**: 앱을 정의하는 핵심 프레임워크 구성 요소.
- **Resource**: 앱 코드로부터 별도로 분리되어 있으며 앱이 다양한 기기 구성에 맞게 자신의 동작을 안정적으로 최적화할 수 있도록 하는 리소스.

## 1. Manifests
모든 앱 프로젝트는 프로젝트 소스 세트의 루트에 **AndroidManifest.xml** 파일(정확히 이 이름)이 있어야 합니다. 매니페스트 파일은 Android 앱에서 필요한 모든 구성요소, Android 빌드 도구, Android 운영체제 및 Google Play에 앱에 관한 필수 정보를 설명합니다. 정리하면 다음과 같습니다.

- Package: 앱의 패키지 이름(일반적으로 코드의 네임스페이스와 일치)
- App Components: 앱의 구성 요소(모든 Activity, Service, Broadcast Receiver, Content Provider 포함)
- Permission: 앱이 시스템 또는 다른 앱의 보호된 부분에 액세스하기 위해 필요한 권한
- 앱에 필요한 하드웨어 및 소프트웨어 기능


매니페스트 파일의 추가적인 역할은 다음을 참고해주세요. 
- [매니페스트 파일](https://developer.android.com/guide/components/fundamentals?hl=ko#Manifest)
- [앱 매니페스트 개요](https://developer.android.com/guide/topics/manifest/manifest-intro?hl=ko)

## 2. App components
앱 구성 요소(App components)는 Android 앱의 필수적인 기본 구성 요소입니다. 각 구성 요소는 **시스템이나 사용자가 앱에 들어올 수 있는 진입점**입니다. **다른 구성 요소에 종속되는 구성 요소**도 있습니다. 각 유형은 **뚜렷한 목적**을 수행하고 **각자 나름의 수명 주기**가 있어 구성 요소의 생성 및 소멸 방식을 정의합니다.

### 1) Activities
액티비티는 사용자와 상호작용하기 위한 진입점입니다. 이것은 **사용자 인터페이스를 포함한 화면 하나**를 나타냅니다. 여러 액티비티가 함께 작동하여 앱에서 짜임새 있는 사용자 환경을 구성하는 것은 사실이지만, **각자 서로 독립**되어 있습니다. 액티비티 하나를 `Activity` 클래스의 하위 클래스로 구현합니다. 

#### Activity Stack 구조
<img src="https://user-images.githubusercontent.com/43839938/82186432-cff4fb80-9925-11ea-9d15-4dba92eea159.png" width="450" height="180">

#### Activity Life Cycle
<img src="https://user-images.githubusercontent.com/43839938/82185881-e3ec2d80-9924-11ea-8de3-c3db8422bc9a.png" width="350" height="450">

### 2) Services
Service는 **백그라운드**에서 오래 실행되는 작업을 수행할 수 있는 애플리케이션 구성 요소이며 **사용자 인터페이스를 제공하지 않습니다.**

- [포그라운드] 사용자가 다른 앱에 있는 동안에 *백그라운드에서 음악을 재생*한다.
- [백그라운드] 사용자와 액티비티 간의 상호작용을 차단하지 않고 *네트워크를 통해 데이터를 가져온다*.
- [바인드] 다른 구성 요소(예: 액티비티)가 서비스를 시작한 다음 실행되도록 두거나 자신에게 *바인딩*하여 상호작용한다. (라이브 배경화면, 알림 리스너, 화면 보호기, 입력 메서드, 접근성 서비스 및 여러 가지 기타 핵심 서비스 기능)

시작된 서비스는 작업이 완료될 때까지 해당 서비스를 계속 실행하라고 **시스템**에 지시합니다. 

```xml
<manifest ... >
  ...
  <application ... >
      <service android:name=".ExampleService" />
      ...
  </application>
</manifest>
```

##### 서비스는 Service 하위 클래스로 구현됩니다. 
##### 참고: Android 5.0(API 레벨 21) 이상을 대상으로 하는 앱의 경우 `JobScheduler` 클래스를 사용하여 작업을 예약하세요.

### 3) Broadcast receivers
Broadcast Receiver는 **시스템이 정기적인 사용자 플로우 밖에서 이벤트를 앱에 전달하도록 지원하는 구성 요소**로, 앱이 시스템 전체의 브로드캐스트 알림에 응답할 수 있게 합니다.


### 4) Content providers
콘텐츠 제공자는 파일 시스템, SQLite 데이터베이스, 웹상이나 앱이 액세스할 수 있는 다른 모든 영구 저장 위치에 저장 가능한 앱 데이터의 공유형 집합을 관리합니다. 다른 앱은 콘텐츠 제공자를 통해 해당 데이터를 쿼리하거나, 콘텐츠 제공자가 허용할 경우에는 수정도 가능합니다. 


구성 요소 유형 네 가지 중 세 가지 **(Activities, Services, Broadcast Receiver)** 는 **인텐트라는 비동기식 메시지로 활성화**됩니다. 인텐트는 런타임에서 각 구성 요소를 서로 바인딩합니다. 이것은 일종의 메신저라고 생각하면 됩니다. 즉 구성 요소가 어느 앱에 속하든 관계없이 다른 구성 요소로부터 작업을 요청하는 역할을 합니다.


## 3. Resource

리소스는 코드에서 사용하는 추가 파일과 정적인 콘텐츠입니다. 예를 들어 비트맵, 레이아웃 정의, 사용자 인터페이스 문자열, 애니메이션 지침 등이 있습니다.

이미지나 문자열과 같은 앱 리소스는 항상 코드에서 외부화해야 합니다. 그래야 이들을 독립적으로 유지관리할 수 있습니다. 특정 기기 구성에 대한 대체 리소스도 제공해야 합니다. 이것은 특별하게 명명한 리소스 디렉토리에 그룹화하는 방법을 씁니다. Android는 런타임에 현재 구성을 근거로 적절한 리소스를 사용합니다. 예를 들어 여러 가지 화면 크기에 따라 여러 가지 UI 레이아웃을 제공하거나 언어 설정에 따라 각기 다른 문자열을 제공하고자 할 수 있습니다.

앱 리소스를 외부화하면 프로젝트 R 클래스에서 발생하는 리소스 ID로 액세스할 수 있습니다. 

자세한 내용은 다음을 참고해주세요.
- [앱 리소스 개요](https://developer.android.com/guide/topics/resources/providing-resources?hl=ko#top_of_page)

## 4. Intent
Intent는 **메시징 객체**로, **다른 앱 구성 요소로부터 작업을 요청하는 데 사용**할 수 있습니다. 기본적인 사용 사례는 크게 세 가지로 나눌 수 있습니다.
- Starting an activity
- Starting a service
- Delivering a broadcast

### 유형

- **명시적 인텐트**는 인텐트를 충족하는 애플리케이션이 무엇인지 지정합니다. 이를 위해 대상 앱의 패키지 이름 또는 완전히 자격을 갖춘 구성 요소 클래스 이름을 제공합니다. 명시적 인텐트는 일반적으로 앱 안에서 구성 요소를 시작할 때 씁니다. 시작하고자 하는 액티비티 또는 서비스의 클래스 이름을 알고 있기 때문입니다. 예를 들어, 사용자 작업에 응답하여 새로운 액티비티를 시작하거나 백그라운드에서 파일을 다운로드하기 위해 서비스를 시작하는 것 등이 여기에 해당됩니다.
- **암시적 인텐트**는 특정 구성 요소의 이름을 대지 않지만, 그 대신 수행할 일반적인 작업을 선언하여 다른 앱의 구성 요소가 이를 처리할 수 있도록 해줍니다. 예를 들어 사용자에게 지도에 있는 한 위치를 표시하고자 하는 경우, 암시적 인텐트를 사용하여 해당 기능을 갖춘 다른 앱이 지정된 위치를 지도에 표시하도록 요청할 수 있습니다.
    <img src="https://user-images.githubusercontent.com/43839938/82185232-de421800-9923-11ea-8086-8b6086c75c14.png" width="450" height="180">

#### 암시적 인텐트 수신하기
앱이 수신할 수 있는 암시적 인텐트가 어느 것인지 알리려면, <intent-filter> 요소를 사용하여 각 앱 구성 요소에 대해 하나 이상의 인텐트 필터를 매니페스트 파일에 선언합니다. 각 인텐트 필터는 인텐트의 작업, 데이터 및 카테고리를 기반으로 어느 유형의 인텐트를 수락하는지 지정합니다. **시스템은 인텐트가 인텐트 필터 중 하나를 통과한 경우에만 암시적 인텐트를 앱 구성 요소에 전달합니다.**

> 예를 들어 데이터 유형이 텍스트인 경우 ACTION_SEND 인텐트를 수신할 인텐트 필터가 있는 액티비티 선언은 다음과 같습니다.
```xml
<activity android:name="ShareActivity">
    <intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="text/plain"/>
    </intent-filter>
</activity>
```
> 소셜 공유 앱의 매니페스트 파일 예시
```xml
<activity android:name="MainActivity">
    <!-- This activity is the main entry, should appear in app launcher -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>

<activity android:name="ShareActivity">
    <!-- This activity handles "SEND" actions with text data -->
    <intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="text/plain"/>
    </intent-filter>
    <!-- This activity also handles "SEND" and "SEND_MULTIPLE" with media data -->
    <intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <action android:name="android.intent.action.SEND_MULTIPLE"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="application/vnd.google.panorama360+jpg"/>
        <data android:mimeType="image/*"/>
        <data android:mimeType="video/*"/>
    </intent-filter>
</activity>
```

### Reference
* [애플리케이션 기본 항목](https://developer.android.com/guide/components/fundamentals?hl=ko)


