# Build Tool

빌드하는데 도와주는 도구들은 종류도 다양하고 기능도 다양하다. 현재 가장 많은 기능을 지원하면서 많은 곳에서 사용되는 **Webpack**이 있다.

Webpack 이전에 많이 사용되던 빌드 도구로는 Gulp와 Grunt가 있다. 

## Grunt

![image](https://user-images.githubusercontent.com/24274424/63153384-2658a500-c049-11e9-9c9c-0c962b7ba815.png)

위에 보이는 돼지? 가 바로 Grunt의 마크이다.
메인 타이틀이 돼지인 이유는 Grunt 단어 뜻에 있다.

> (돼지처럼) 꿀꿀 거리다(거리는 소리), 불평의 소리
> 꿀꿀거리다, 불평하다, 좋지 않은

Github에서 Grunt는
> The JavaScript Task Runner 

라고 설명을 하고 있다.

간단히 풀어서 말을 하면 Minify, Compile, Unit Test, Lint 등 주기적인 task들을 자동으로 수행하기 위해 사용되는 도구로 Javascript Task runner이다.

기본적으로 task들을 만들어 작동하며, 사용자 지정 task들을 수행하기 위해 Command Line Interface를 사용한다. 

Grunt는 Node.js로 작성되어 있으며, npm을 통해 배포된다.

2019년 8월 기준으로, Grunt 생태계에 6,000개 이상의 플러그인을 사용할 수 있다고 한다.

### 예제

```js
module.exports = function(grunt) {

  // Task configuration
  grunt.initConfig({
    taskName1: 'Task1 Configuration',
    taskName2: 'Task2 Configuration'
  });

  // Loads plugins
  grunt.loadNpmTasks('pluginName1');
  grunt.loadNpmTasks('pluginName2');

  // Custom tasks
  grunt.registerTask('customTaskName1', 'Custom task description', function(taskParameter) {
    // Custom statements
  });

  // Combining multiple tasks to a single task
  grunt.registerTask('customTaskName2', ['taskName1', 'customTaskName1']);
  // Default task - runs if task name is not specified
  grunt.registerTask('default', ['customTaskName2']);

};
```

> [Grunt에서 사용하는 Gruntfile.js](https://github.com/gruntjs/grunt/blob/master/Gruntfile.js)
> [grunt-cli](https://github.com/gruntjs/grunt-cli/blob/master/bin/grunt)

### grunt-eslint로 task 살펴보기

```js
'use strict';
const chalk = require('chalk');
const eslint = require('eslint');

module.exports = grunt => {
	grunt.registerMultiTask('eslint', 'Validate files with ESLint', function () {
		const options = this.options({
			outputFile: false,
			quiet: false,
			maxWarnings: -1,
			failOnError: true,
		});

		if (this.filesSrc.length === 0) {
			grunt.log.writeln(chalk.magenta('Could not find any files to validate'));
			return true;
		}

		const formatter = eslint.CLIEngine.getFormatter(options.format);

		if (!formatter) {
			grunt.warn(`Could not find formatter ${options.format}`);
			return false;
		}

		const engine = new eslint.CLIEngine(options);

		let report;
		try {
			report = engine.executeOnFiles(this.filesSrc);
		} catch (error) {
			grunt.warn(error);
			return false;
		}

		if (options.fix) {
			eslint.CLIEngine.outputFixes(report);
		}

		let results = report.results;

		if (options.quiet) {
			results = eslint.CLIEngine.getErrorResults(results);
		}

		const output = formatter(results);

		if (options.outputFile) {
			grunt.file.write(options.outputFile, output);
		} else if (output) {
			console.log(output);
		}

		const tooManyWarnings = options.maxWarnings >= 0 && report.warningCount > options.maxWarnings;

		if (report.errorCount === 0 && tooManyWarnings) {
			grunt.warn(`ESLint found too many warnings (maximum: ${options.maxWarnings})`);
		}

		return options.failOnError ? report.errorCount === 0 : 0;
	});
};

```

## Gulp

![image](https://user-images.githubusercontent.com/24274424/63156272-4ab78000-c04f-11e9-94fd-ce717e80045e.png)

Gulp의 마크는 마치 콜라를 떠올리는 모양이다.
단어의 뜻을 살펴보면 

> 꿀꺽꿀꺽\[꿀떡꿀떡\] 마시다, 쭉 들이켜다

이다.

Fractal Innovations과 Github 오픈 소스 커뮤니티의 오픈 소스 Javascript 툴킷으로, 프론트엔드 웹 개발의 **스트리밍 빌드 시스템**으로 사용된다.

> The streaming build system

Gulp는 steaming build system을 표방하고 있다. 즉, Node의 스트리밍 기능으로 이득을 얻은 빌드 시스템이다.

현재 2019년 08월을 기준으로 4,000개 이상의 플러그인을 사용할 수 있다.

> **Streaming에 대해서**
> 
> Node.js는 이벤트 루프에 기반한 비동기 I/O를 제공하고 있다.
>  
> 파일 시스템에서 읽기/쓰기 작업을 할 때나 HTTP 요청을 전달할 때 Node.js는 노드는 응답을 기다리는 동안 다른 이벤트들을 처리할 수 있는데, 이를 non-blocking I/O 라고 부른다. 
> 
> Stream은 이보다는 더 확장된 개념으로 메모리 버퍼와 대역폭을 절약할 수 있는 이벤트 기반의 I/O 인터페이스를 제공하는 것을 말한다.
> 
> 예를 들어, 스트림은 대용량 파일의 파일 같은 경우, 파일 전체를 모두 로드하기 전에 메모리 버퍼를 절약하기 위해 무엇인가 다른 일을 빠르게 처리할 수 있다.
> 
> 그래서 우리는 파일이 전체로 로드될 때까지 기다릴 필요 없이 파일을 일부를 쓰거나 어떤 처리를 할 수 있다.

### 예제

```js
const { src, dest, parallel } = require('gulp');
const pug = require('gulp-pug');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');

function html() {
  return src('client/templates/*.pug')
    .pipe(pug())
    .pipe(dest('build/html'))
}

function css() {
  return src('client/templates/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
}

function js() {
  return src('client/javascript/*.js', { sourcemaps: true })
    .pipe(concat('app.min.js'))
    .pipe(dest('build/js', { sourcemaps: true }))
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.default = parallel(html, css, js);
```

### Grunt와 Gulp의 차이점

Gulp와 Grunt의 하는 일은 같지만 만들어내는 방식이 다르다. Grunt는 package.json처럼 json형식으로 설정을 선언하여 사용한다. 즉, 설정 파일 기반이다. 이와 다르게 Gulp는 nodeJS의 스트림 기능을 이용하여 Javascript 코드를 사용한다.

Gulp는 동시에 여러 작업을 처리할 수 있지만, Grunt는 일반적으로 한 번에 하나의 작업만 처리한다.

## Webpack

Gulp와 Grunt가 Task Runner인 것과 다르게 Webpack은 이름부터 남다르다. Webpack은 `Module Bundler` 혹은 `Package Bundler` 라고 불린다. 

Module 개념은 다른 글을 통해서 알 수 있다.

> [Module](./Module.md) <br/>
> Module Bundler : 각각의 모듈들의 의존성을 파악하여 번들(묶는다)해주는 것.

Webpack 사이트에 들어가면 자신을 이렇게 설명하고 있다.

> webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.

Webpack은 `Module Bundler`이다. 주된 목적은 브라우저에서 사용하기 위해 JavaScript 파일을 번들링 하는 것이지만, 거의 모든 리소스 또는 리소스를 변환, 번들링 또는 패키징 할 수 있다.


### 모듈과 의존성

Javascript는 커다란 소스를 나눠 편하게 개발하고 유지 보수하기 위해 모듈이라는 추상적인 개념을 사용한다. 마치 이는 Java의 Class와 비슷하다. 이렇게 모듈 방식으로 코딩하고 거기에 모듈별로 파일까지 나누어 개발하면 편하다. 

모듈과 파일이 분기된 개념은 보통은 nodeJS에서 많이 사용한다.

모듈화된 각각의 파일들은 서로의 의존성을 가진다. 의존성이란 쉽게 말해 `import * from './index'` 구문이다. 현재 파일에서 다른 파일을 가져와서 사용하게 되면 서로 의존성이 생긴다.

브라우저상에서는 이러한 의존성을 표현하기가 어렵다. 특히 `HTTP/1.1`을 사용해야 하는 환경이라면 더욱더 힘들다. `HTTP/2.0`의 경우 한 번의 요청에 여러 파일을 받아올 수 있지만 1.1의 경우는 의존성을 통해 여러 파일이 필요하게 된다면 너무 많은 네트워크 자원을 소모하게 된다.

많은 의존성으로 엮인 JS 파일들을 단순히 하나의 JS 파일로 압축해서 만들면 좋을까? 요청(request) 한 번에 그 압축파일 하나만 주면 땡! 하게 말이다. 

그게 Webpack이다. 꼭 하나는 아니다. 라이브러리 / 핵심 소스를 나누어 파일을 두 개로 분기할 수도 있다. 요점은 다양한 파일들을 번들(bundle)해서 네트워크 비용을 최소화하여 파일을 번들한다! 라는 것이다.

결국 Gulp나 Grunt처럼 필요한 자동화 기능까지 더해 빌드해 주는 것이 바로 Webpack이다.

### 더 나아가

Webpack은 위에서 언급했듯이 단순히 Javascript의 의존성을 파악하여 번들하는 것만이 아니라, 모든 리소스(javascript, css, image, font, 심지어 typescript, coffeescript, less, sass 등)에 대한 dependancy graph를 생성하여 빌드를 한다. 요즘처럼 SPA를 구현하게 되면 이러한 의존성은 꼬리에 꼬리를 물고 Graph(Tree) 형태로 만들어지게 되는데 이것을 번들링 하여 하나 또는 그 이상의 파일로 만들어주는 것이 `Module Bundler`의 역할이다.

## 결론

Grunt, Gulp 모두 task runner라는 공통점이 있다.

Gulp나 Grunt는 단순 자동화 작업을 하는 데 사용된다. 그러나 Webpack의 경우 Javascript의 각 모듈 혹은 파일, 심지어는 다양한 리소스들까지 의존성을 파악하여 묶어주기 때문에 엄청나게 큰 차이점을 보인다.

따라서 현재 코드가 모듈화된 코드가 아니 거나, 다양한 의존성을 다루어야 하는 작업이 아니라면 Gulp나 Grunt도 충분히 좋은 빌드 도구가 될 수 있다. 프로젝트 규모가 커지거나, Javascript를 모듈화하여 코딩하거나, 무거워질 수밖에 없는 프레임워크를 사용하는 프로젝트 등에는 Webpack이 훨씬 더 좋은 도구가 될 것이다.

---

#### Reference

- [Grunt](https://github.com/gruntjs/grunt)
- [Gulp](https://github.com/gulpjs/gulp)
- [Grunt 관련 플러그인들](https://www.npmjs.com/search?q=keywords:gruntplugin)
- [Node Stream 관련 참고자료](https://github.com/FEDevelopers/tech.description/wiki/Node.js-Stream-%EB%8B%B9%EC%8B%A0%EC%9D%B4-%EC%95%8C%EC%95%84%EC%95%BC%ED%95%A0-%EB%AA%A8%EB%93%A0-%EA%B2%83)
- [Webpack](https://github.com/webpack/webpack)