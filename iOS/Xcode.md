iOS Series를 시작해보려 한다. iOS 개발 툴인 Xcode의 전반적인 내용을 먼저 살펴보자.

## Xcode 12
> macOS Big Sur에서 멋지게 표현되도록 완전히 새롭게 디자인된 Xcode 12는 내비게이터를 위해 맞춤 설정 가능한 서체 크기, 간소화된 코드 완성 및 새로운 문서 탭을 제공합니다. Xcode 12는 기본적으로 Apple 실리콘 기반 Mac을 지원하도록 범용 앱을 빌드합니다. 일반적으로 코드를 한 줄도 변경할 필요가 없습니다. [참고](https://developer.apple.com/kr/xcode/)


2020년에 등장한 Xcode 12이다. Apple Silicon(Apple이 설계한 프로세서)도 지원하고 macOS Big Sur에 최적화되게 바뀌었다.

## Xcode 시작

### Create a project

![https://images.velog.io/images/eunjiha/post/898fb262-e3cf-4ab7-9e44-1aa069d9b386/image.png](https://images.velog.io/images/eunjiha/post/898fb262-e3cf-4ab7-9e44-1aa069d9b386/image.png)

Language는 `Swift`와 `Objective-C` User Interface에는 `SwiftUI`와 `Storyboard`가 있다.

### About the main window

![https://images.velog.io/images/eunjiha/post/db15f93e-b6d9-469e-9c44-904799b6ada9/image.png](https://images.velog.io/images/eunjiha/post/db15f93e-b6d9-469e-9c44-904799b6ada9/image.png)

## Xcode 상세보기

프로젝트를 생성하고 나서 제일 상위 항목을 클릭하면 [프로젝트이름].xcodeproj 가 열린다.

`PROJECT` / `TARGETS` 에 관한 설정을 할 수 있는 곳이다.

![https://images.velog.io/images/eunjiha/post/7ca1092d-ba5c-45bc-bb0e-e667508d09ad/image.png](https://images.velog.io/images/eunjiha/post/7ca1092d-ba5c-45bc-bb0e-e667508d09ad/image.png)

`PROJECT`와 `TARGETS`의 차이는 [이곳](https://stackoverflow.com/questions/1642710/xcode-project-settings-vs-target-settings) 에 잘 설명되어 있다. `PROJECT` 내부에 여러 `TARGETS`이 생기는 구조이다. 요약하면, 회사에 여러 조직이 있다고 생각하면 되겠다. 회사 전반적으로 다뤄야 하는 공통 규칙들은 `PROJECT`에서 하고, `TARGETS`은 `PROJECT` 의 규칙을 상속 받게 된다. 개별적으로 커스터마이징 하고 싶거나 각 조직들의 속성을 부여하려면 `TARGETS`에 가서 설정해주면 된다. 참고로, 실제 PRODUCT가 되는 것은 `TARGET`이다.

이제 `PROJECT`, `TARGETS`의 몇 가지 속성들을 간단하게 살펴보자. 두 개 모두 공통으로 갖고 있는 속성도 있고, `TARGETS`만 갖고 있는 속성도 있다.

### 💡 xcodeproj

#### 1) General

identity, signing, deployment options와 같이 가장 일반적으로 설정해야 하는 항목들이다.

![https://images.velog.io/images/eunjiha/post/cfbe90ec-017c-4331-8669-5773c6775bf9/image.png](https://images.velog.io/images/eunjiha/post/cfbe90ec-017c-4331-8669-5773c6775bf9/image.png)

##### **Indentity** [(참고)](https://help.apple.com/xcode/mac/current/#/devba7f53ad4)

[Bundle Identifier](https://help.apple.com/xcode/mac/current/#/deve70ea917b)는 프로그램 식별자이다.

![https://images.velog.io/images/eunjiha/post/a4f4c81b-9baf-4139-aadb-758a9c6257a4/image.png](https://images.velog.io/images/eunjiha/post/a4f4c81b-9baf-4139-aadb-758a9c6257a4/image.png)

##### **Deployment Info** [(참고)](https://help.apple.com/xcode/mac/current/#/deve69552ee5)

![https://images.velog.io/images/eunjiha/post/a7ede1e7-1c55-4b5f-82ad-4562354ee7f9/image.png](https://images.velog.io/images/eunjiha/post/a7ede1e7-1c55-4b5f-82ad-4562354ee7f9/image.png)

##### **App Icons and Launch Images** [(참고)](https://help.apple.com/xcode/mac/current/#/dev4b0ebb1bb)

![https://images.velog.io/images/eunjiha/post/f41e1d23-e7cf-4605-ae25-2141c5188382/image.png](https://images.velog.io/images/eunjiha/post/f41e1d23-e7cf-4605-ae25-2141c5188382/image.png)

##### **Supported Intents** [(참고)](https://developer.apple.com/documentation/sirikit/creating_an_intents_app_extension)

가령, 어떤 App이 SiriKit와 상호작용을 하려면 Intents가 필요하다. 이럴 경우 Supported Intents에 추가해줘야 한다.

##### **Frameworks, Libraries, and Embedded Content** [(참고)](https://help.apple.com/xcode/mac/current/#/dev51a648b07)

![https://images.velog.io/images/eunjiha/post/67af6b6e-c442-4342-b918-19c572f2b77a/image.png](https://images.velog.io/images/eunjiha/post/67af6b6e-c442-4342-b918-19c572f2b77a/image.png)

요즘에는 COCOAPODS 라는 의존성 관리도구를 통해서 자동으로 라이브러리를 연동해준다.

##### **Development Assets**

PRODUCT에는 넣지 않고 DEVELOPMENT 단계에서만 쓰고 싶은 Assets들을 넣을 수 있는 곳이다.

[(참고) WWDC19 Mastering Xcode Previews](https://developer.apple.com/videos/play/wwdc2019-233/?time=984)

#### 2) Signing & Capabilities

[(참고),](https://help.apple.com/xcode/mac/current/#/dev60b6fbbc7) [(참고)](https://developer.apple.com/documentation/xcode/adding_capabilities_to_your_app)

##### **Signing**

Team, Bundle Identifier, Provisioning Profile 등을 설정하는 곳이다. 앱 배포, 다른 서비스(In-App Purchase 등) 사용 시에 반드시 필요하다.

![https://images.velog.io/images/eunjiha/post/a7dbe385-1695-4262-85e8-fbc25076d614/image.png](https://images.velog.io/images/eunjiha/post/a7dbe385-1695-4262-85e8-fbc25076d614/image.png)

##### **Capabilities**

push notifications, Apple Pay와 같은 Apple의 앱 서비스를 구성하는 기능을 추가할 수 있다. 다음은 Capabilities List 일부이다.

![https://images.velog.io/images/eunjiha/post/a674aa9f-acb6-413a-a211-6b215010b495/image.png](https://images.velog.io/images/eunjiha/post/a674aa9f-acb6-413a-a211-6b215010b495/image.png)

#### 3) Build Settings

[(참고)](https://help.apple.com/xcode/mac/current/#/dev382dac089)

> Customize options that affect the behavior of the build system while building your project. See Build settings reference.

빌드 되는 방법을 설정하는 곳이다.

![https://images.velog.io/images/eunjiha/post/36500ac3-b3fa-4d84-8167-e4fb4f7f8380/image.png](https://images.velog.io/images/eunjiha/post/36500ac3-b3fa-4d84-8167-e4fb4f7f8380/image.png)

#### 4) Build Phases

[(참고)](https://help.apple.com/xcode/mac/current/#/dev50bab713d)

> Edit and reorder tasks performed by the build system while building your project, such as running a script, copying files, or linking to frameworks.

빌드 시 수행하는 작업들을 설정하는 곳이다. 소스 코드 컴파일(Compile sources), PRODUCT에 리소스 복사(Copy bundle resources) 등이 있다.

![https://images.velog.io/images/eunjiha/post/eaebfe0b-33f6-4304-9ddf-d197d6d35641/image.png](https://images.velog.io/images/eunjiha/post/eaebfe0b-33f6-4304-9ddf-d197d6d35641/image.png)

### 💡 Info.plist

[(참고)](https://developer.apple.com/documentation/bundleresources/information_property_list)

Information Property List의 줄임말로 Bundle을 설명해주는 key-value 쌍들의 집합이다. Build 되기 전에 필요한 정보들이다. 

![https://images.velog.io/images/eunjiha/post/a7178322-2d17-4edf-893c-d986920ad098/image.png](https://images.velog.io/images/eunjiha/post/a7178322-2d17-4edf-893c-d986920ad098/image.png)

내부 구성요소들은 executable type이나 platform에 따라서 매우 다양하기 때문에 그 때 그 때 익혀두는 것이 좋겠다.

몇 가지만 살펴보면 Bundle identifier($(PRODUCT_BUNDLE_IDENTIFIER))같이 빌드 타임에 결정되는 값도 있고 Launch screen 이나 Main Storyboard처럼 Xcode가 파일을 만들 때 자동으로 설정하는 값들도 있다. 맨 윗 부분의 [Localizaion](https://help.apple.com/xcode/mac/current/#/deve2bc11fab)은 다양한 언어에 대응할 수 있는 방안이다. Localizaion을 설정하면 각 국의 언어에 맞게 App을 사용할 수 있다.

권한을 설정할수도 있고(사진 / 전화번호부) https 설정, font설정 등을 할 수도 있다.

### 💡 Assets.xcassets - icon, image, color

[(참고)](https://help.apple.com/xcode/mac/current/#/dev10510b1f7)

icon, image, color, data 등의 Assets을 추가할 수 있다.

![https://images.velog.io/images/eunjiha/post/8524211b-3585-4015-8fbb-2800f12d3ff5/image.png](https://images.velog.io/images/eunjiha/post/8524211b-3585-4015-8fbb-2800f12d3ff5/image.png)

AppIcon의 경우 [이곳](https://appicon.co/#app-icon)을 이용하면 최대 사이즈 이미지 한 장으로 각 사이즈에 맞는 이미지를 추출해준다.

![https://images.velog.io/images/eunjiha/post/30b81efb-e4e0-43e0-bf79-bc22473a2c31/image.png](https://images.velog.io/images/eunjiha/post/30b81efb-e4e0-43e0-bf79-bc22473a2c31/image.png)

### 💡 Interface - Storyboard, SwiftUI

Storyboard와 SwiftUI를 비교하기 전에, Code로 짠다느니 XIB를 쓴다느니 헷갈리는 개념들이 많아 먼저 정리해보자

#### XIB? Storyboard? Code?

[iOS User Interfaces: Storyboards vs. NIBs vs. Custom Code](https://www.toptal.com/ios/ios-user-interfaces-storyboards-vs-nibs-vs-custom-code)
이 글에 대한 번역본이 많았는데, 모두 잘 번역된 [첫번째](http://suho.berlin/engineering/ios/ios-storyboard-nibxib-code/), 표로 정리 잘 되어 있는 [두번째](https://ozofweird.tistory.com/130) 를 참고하자.

간단히 비교해보자면 View Controller와 유기적으로 구성되어 있는 Storyboard는 전체 흐름을 보고 싶을 때 좋다. XIB( 혹은 NIB, XIB가 결국 NIB으로 변환된다.)은 재사용할만한 셀들을 구성한다. Code는 다이나믹한 UI를 구성해야 할 때 용이하다.

#### Storyboard란?

Storyboard는 iOS 5 부터 도입된 개념으로, 기존의 XIB파일이 View 1개만 할당해서 사용할 수 있었던 것과 달리 하나의 Storyboard 파일에서 여러 View를 생성하고 그들의 관계를 통해 App의 전체 Flow를 보여줄 수 있다. View 간의 연결선은 Segue라 부르고 이를 통해 View 간의 관계 설정을 할 수 있다. Storyboard는 XIB 파일과 병행해서 쓸 수도 있다. 두 개 모두 XML을 기반으로 한다. 위에서 언급했던 것처럼 XIB 파일이 필요한 경우는 XIB와 병행해서 사용하면 된다. 

![https://koenig-media.raywenderlich.com/uploads/2019/08/Storyboards-1_1-650x462.png](https://koenig-media.raywenderlich.com/uploads/2019/08/Storyboards-1_1-650x462.png)

#### [SwiftUI](https://developer.apple.com/documentation/swiftui)란?

공식 홈페이지에는 다음과 같이 정리되어 있다.

![https://images.velog.io/images/eunjiha/post/ede4aff7-518c-42d0-91b8-4d41b0ef6321/image.png](https://images.velog.io/images/eunjiha/post/ede4aff7-518c-42d0-91b8-4d41b0ef6321/image.png)

- 명령적 구문이 아닌 선언적 구문을 사용한다.
- [SwiftUI](https://developer.apple.com/documentation/swiftui)는 모든 플랫폼을 통합하여 UI를 짤 수 있다.
- 디자인 도구, 라이브 모드는 [WWDC20 - Introduction to SwiftUI](https://developer.apple.com/videos/play/wwdc2020/10119/) 영상을 통해 직접 보시라.

개인적으로 [이 글](https://post.naver.com/viewer/postView.nhn?volumeNo=21490246&memberNo=6384148) 덕에 매우 구체적으로 이해할 수 있었다. 다음 두 문장으로 요약할 수 있겠다.

> 더 쉽고, 빠른 통합 개발 환경 구축
A를 B화 시키는 것이 아니라, A는 A답게, B는 B답게.

iOS 앱은 UIKit 프레임워크, macOS 앱은 AppKit 프레임워크을 통해 개발한다. 아이폰의 성공에 많은 iOS 앱 개발자가 생겼으나 이들이 macOS 앱을 개발하려면 AppKit을 새로 배워야 했다.

이를 해소한 것이 `SwiftUI`이다. `SwiftUI`덕에 기본적으로는 UIKit, AppKit를 통합하여 개발할 수 있게 됐고 더 나아가 iOS 개발 그룹은 iOS 앱뿐만 아니라 각 기기에 최적화한 iPad App, macOS app, watchOS, tvOS을 모두 개발할 수 있는 토대를 마련했다.

각 기기에 최적화되었다는 것은 각 기기의 특색에 맞게 개발된다는 것을 의미한다.

- 가장 기본적인 iOS
- 분할 보기, 애플 펜슬 등을 지원하는 iPad
- 손목에 맞게 최적화 되어 있는 watchOS
- 화면 터치는 안되지만 터치패드, 분할, 터치바 등이 있는 macOS

각 기기의 사용자 인터페이스에 걸맞은 경험을 극대화하여 같은 기능을 하는 앱인데도 다른 경험을 제공할 수 있다.

React Native나 Flutter가 안드로이드, iOS를 모두 개발할 수 있도록 했다면
SwiftUI는 Apple 생태계 내에서 통합 개발 환경을 구축하는 것이다.

그런데 SwiftUI는 최신 버전의 OS만 지원한다. [이곳](https://developer.apple.com/documentation/swiftui)을 참고하자.


### 💡 AppDelegate, SceneDelegate

[WWDC19 - Architecting Your App for Multiple Windows](https://developer.apple.com/videos/play/wwdc2019/258)

App에는 하나의 window 개념만 존재했는데, iOS 13 버전 부터는 Multi window가 가능해지면서 window 개념이 -> scence 개념으로 바뀌었다. App Delegate에서 갖고 있던 UI Lifecycle이 Scene Delegate로 넘어갔고 App Delegate는 기존의 Process Lifecycle에 새로운 Session Lifecycle이 생겨났다. 이 부분에 대해서는 다음 문서에 자세하게 알아보자.

![https://images.velog.io/images/eunjiha/post/de5ca988-14bc-49e9-b453-40136a425b0d/image.png](https://images.velog.io/images/eunjiha/post/de5ca988-14bc-49e9-b453-40136a425b0d/image.png)

![https://images.velog.io/images/eunjiha/post/b5cc246c-9bcf-4089-9cf4-8c0e4609fc7f/image.png](https://images.velog.io/images/eunjiha/post/b5cc246c-9bcf-4089-9cf4-8c0e4609fc7f/image.png)

### 🪴 Reference

- [Xcode Help](https://help.apple.com/xcode/mac/current/#/)
- [Apple Developer](https://developer.apple.com/kr/)