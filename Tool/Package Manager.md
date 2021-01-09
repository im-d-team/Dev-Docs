# Package Manager

javascript의 npm, java의 maven, gradle, php의 composer, python의 pip등 외부 라이브러리를 관리하기 위해서 사용했던 Package Manager에 대해 알아보자.

## Package Manager란 무엇인가?

패키지 관리자(Package Manager)란 프로젝트 환경을 구축하고 외부 라이브러리를 쉽게 사용할 수 있도록 관리해주는 툴이다. 하나의 서비스를 만드려고 할 때, A부터 Z까지 모든 것을 구현하는 것이 아니라 이미 잘 구현되어 있는 라이브러리가 있다면 그것을 프로젝트에 가져다 쓰면 된다. 반대로 내가 만든 프로젝트를 "Package"화 해서 다른 사람들을 위해 공유할 수도 있다.

## 대표적인 Package Manager

### 1. Python

**Managers**: `pip` / `conda`

**Repository**: `PyPI`

pip, conda는 Python에서 사용할 수 있는 Package Manager이다. 이 둘은 비슷한 개념으로 많이 사용되는데 명확하게는 서로 다른 목적을 가지고 있다. 다음 표를 살펴보자. 자세한 설명은 [이곳](https://www.anaconda.com/blog/understanding-conda-and-pip)을 참고하면 된다.

![Comparison of conda and](https://user-images.githubusercontent.com/43839938/103164402-2c21e580-484e-11eb-9892-320d23658459.png)


pip는 python에서만 사용할 수 있는 반면 conda는 어떤 언어에든 사용할 수 있다.

또 하나의 핵심 차이는 두 개 모두 각 프로젝트 단위로 라이브러리를 설치하도록 하는 '가상환경' 을 사용할 수 있지만 접근 방식이 조금 다르다는 점이다. conda의 경우 '가상환경'이 내장되어 있지만, pip는 virtualenv등을 따로 설치해서 사용해야 한다.

> '가상환경'에 대해서는 [이곳](https://medium.com/@dan_kim/%ED%8C%8C%EC%9D%B4%EC%8D%AC-%EC%B4%88%EC%8B%AC%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-pip-%EA%B7%B8%EB%A6%AC%EA%B3%A0-virtualenv-%EC%86%8C%EA%B0%9C-a53512fab3c2)을 살펴보자.

`conda`와 `pip`를 결합해서 사용하는 경우도 존재한다. `conda` 의 Repository인 [Anaconda](https://www.anaconda.com/)에서는 데이터 과학, 기계 학습 등 AI 프레임워크를 포함한 1,500개 이상의 패키지를 제공하기 때문에 `conda`를 사용한다. 그럼에도 `pip`와 결합해서 사용하는 이유는 Anaconda에서 제공하지 않는 다른 패키지들이 [PyPI](https://pypi.org/)(Python Package Index)에 무수히 많기 때문이다. 

### 2. Java

**Managers**: `Maven`, `Gradle`

**Repository**: `Maven Central`

 Java의 Package Managers는(Build Tool이라고도 불린다.) [`Maven`](https://maven.apache.org/), [`Gradle`](https://gradle.org/)이 있다. `Maven`은 pom.xml을 이용한 정형화된 빌드 시스템이다. `Gradle`은 `Maven`의 단점을 보완하고자 나온 것인데 `Gradle` 공식 사이트에 이 둘에 대한 차이점이 잘 설명되어 있다. [이곳](https://gradle.org/maven-vs-gradle/)을 참고하자. `Maven`과 비교했을 때 `Gradle`의 대표적인 장점은 다음과 같다.

**1. XML로 정의하기 어려웠던 동적인 요소를 Groovy 스크립트로 표현한다.** 
> Maven, Gradle 문법 차이
1) `Maven`의 pom.xml 예시

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
       <modelVersion>4.0.0</modelVersion>

       <groupId>com.example</groupId>
       <artifactId>demo-maven</artifactId>
       <version>0.0.1-SNAPSHOT</version>
       <packaging>jar</packaging>

       <name>demo-maven</name>
       <description>Demo project for Spring Boot</description>

       <parent>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-parent</artifactId>
          <version>1.5.4.RELEASE</version>
          <relativePath/> <!-- lookup parent from repository -->
       </parent>

       <properties>
          <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
          <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
          <java.version>1.8</java.version>
       </properties>

       <dependencies>
          <dependency>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-starter</artifactId>
          </dependency>

          <dependency>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-starter-test</artifactId>
             <scope>test</scope>
          </dependency>
       </dependencies>

       <build>
          <plugins>
             <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
             </plugin>
          </plugins>
       </build>

    </project>
    ```

2) `Gradle`의 build.gradle 예시 - `Gradle`역시 `Maven Central`을 레포지토리로 한다.

```groovy
    buildscript {
        ext {
            springBootVersion = '1.5.4.RELEASE'
        }
        repositories {
            mavenCentral()
        }
        dependencies {
            classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
        }
    }

    apply plugin: 'java'
    apply plugin: 'idea'
    apply plugin: 'org.springframework.boot'

    version = '0.0.1-SNAPSHOT'
    sourceCompatibility = 1.8

    repositories {
        mavenCentral()
    }

    dependencies {
        compile('org.springframework.boot:spring-boot-starter')
        testCompile('org.springframework.boot:spring-boot-starter-test')
    }
    ```
    
**2. 빌드 시 속도가 더 빠르다.**(`Gradle`은 캐시를 사용하기 때문에 반복해서 빌드하게 되면 차이가 더 커진다.) 

 Java의 Repository(Maven Central)에는 개인이 만든 Package를 추가하는 과정이 [복잡하다](https://jojoldu.tistory.com/161). 따라서 Nexus와 같은 사설 Repository를 [사용하기도](https://dev-youngjun.tistory.com/105) 한다.

### 3. JavaScript

**Manager**: `npm`

**Repository**: `npm`

[`npm`](https://www.npmjs.com/)(Node Package Manager)은 JavaScript의 Package Manager이다. 이는 세계에서 가장 큰 소프트웨어 Repository이기도 하다. npm은 jQuery, Bootstrap, React, Angular 등과 같은 인기 있는 Package들을 갖고 있다. Github 저장소를 npm과 연결하면 자신의 프로젝트를 npm에 등록할 수도 있다. JavaScript 프론트엔드든 Node.js 백엔드든 어떤 환경에서도 npm Package를 동시에 사용할 수 있다.

### 4. PHP

**Manager**: `Composer`

**Repository**: `Packagist`

PHP의 Package Manager는 [`Composer`](https://getcomposer.org/), Repository는 [`Packagist`](https://packagist.org/)이다. npm 과 마찬가지로 Github에 Packagist를 연결하면 해당 레포지토리에 원활하게 배포할 수 있다.

## Try it!

Package Manager, Repository를 통해서 여러 외부 라이브러리들을 사용해보았다면, 이제 여러분이 만들어 볼 차례다!

종속성, 패키지 이름, 작성자, 태그 / 키워드 및 버전 번호 등을 지정해서 Package를 만들고 Repository에 등록해보자. 다른 사람들이 여러분들의 라이브러리를 사용한다는 것, 얼마나 아름다운가? 이로써 개발자는 Package를 사용하고 구현하는 방법에 대해 생각할 수 있고 더 나은 재사용 가능한 Package를 생성할 수 있도록 생각을 넓혀 줄 것이다. 파이팅!

### Reference

- [What is a package manager and why should you use one?](https://blog.idrsolutions.com/2018/07/what-is-a-package-manager-and-why-should-you-use-one/)
- [Understanding Conda and Pip](https://www.anaconda.com/blog/understanding-conda-and-pip)
- [Maven vs Gradle](https://bkim.tistory.com/13)
