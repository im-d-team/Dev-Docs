![Servlet동작과정](/assets/images/server_side.png)  

# Web Server
## 기능
1. Web Server는 클라이언트에서 HTTP 요청을 받은 후, 반환될 페이지의 정적인 컨텐츠를 처리해준다. 정적인 컨텐츠는 Web Server가 주어진 파일 경로를 따라갔을 때 반환되는 컨텐츠로, 항상 동일한 컨텐츠가 반환된다. 그 예로는 HTML, CSS, Javascript 파일 등이 있다. 
2. Web Server가 처리하지 못하는 동적 컨텐츠들은 Web Server의 요청에 따라 WAS (Web application Server)로 넘어간다. 동적 컨텐츠는 인자에 따라 반환되는 컨텐츠가 달라지는데, JSP, Servlet이 여기에 속한다.    

<br/>  
  

## 종류
Apach Server, IIS, nginx 등

<br/>  

# Web Application Server
WAS는 위에서도 언급했듯이 JSP, Servlet 등을 처리하기 위해 쓰인다. JSP와 Servlet은 자바를 기반으로한 웹 프로그래밍 언어이기 때문에 thread로 요청을 처리한다. (반면 CGI는 프로세스로 요청을 처리한다.)

## JSP 처리
JSP파일은 먼저 Servlet Class 형태의 java 소스 파일로 변환된다. 

![ServletClass](/assets/images/servletClass.png) 

이 java 파일 안에는 다음의 메소드가 정의되어 있다. 
```java
public void _jspInit() {
  }

public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
    throws java.io.IOException, javax.servlet.ServletException { 

} 

public void _jspDestroy() {
}


```
* `_.jspInit()` 메소드  
  jsp 파일이 최초로 요청되거나, 코드가 수정된 후 요청된 경우에만 실행되는 메소드이다. jsp의 인스턴스 변수를 초기화하며 Servlet을 메모리에 로딩한다. 만약 같은 페이지에 대한 요청이 있으면, 이미 변환된 Servlet 파일이 서비스된다. 
* `_.jspService()` 메소드  
  java의 `main()` 메소드 역할을 한다. ` _.jspInit()`메소드가 실행된 후 요청된 jsp 파일의 jsp 태그 및 HTML이 메소드에 삽입된다. 이 메소드는 서버가 Servlet에 요청을 전달할 때마다 실행된다.
* `_.jspDestroy()` 메소드  
  서블릿 파일을 종료하고 메모리에서 파괴하는 메소드로, Tomcat이 종료될 때 실행된다.

<br/>  
  
## Servlet 처리
Servlet을 처리하기 위해 대부분 `GenericServlet` 클래스나 `HttpServlet` 클래스를 상속한다.   

![서블릿아키텍처](/assets/images/servletArchitecture.png)

### GenericServlet Override
`GenericServlet`은 `Servlet`을 구현한 클래스로, `GenericServlet`을 오버라이딩할 때에는 `Servlet`의 `service()` 메소드를 구현해야 한다. 이 메소드는 `GET`방식과 `POST`방식을 모두 처리한다. 파라미터로는 `ServletRequest`와 `ServletResponse`를 받는다.
```java
public class HelloServlet extends GenericServlet{

	private static final long serialVersionUID = 1L;

	@Override
	public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
	
		try {
			String name = req.getParameter("name");
			int age = Integer.parseInt(req.getParameter("age"));
		
			String msg = "이름 : " + name + " / 나이 : " + age;
			
			res.setContentType("text/html; charset=UTF-8");
			
			PrintWriter out = res.getWriter();
			
			out.print("<html>");
			out.print("<body>");
			out.print(msg);
			out.print("</body>");
			out.print("</html>");
			
		} catch(Exception e) {
			getServletContext().log("erros");
		}
	}
}
```
 
<br/>  
  
### HttpServlet Override
`HttpServlet`은 `GenericServlet`을 상속받은 클래스로 HTTP환경에 최적화되어 있다. `GenericServlet`의 `service()`는 이미 구현되어 있기 때문에 여기서 직접 `service()`메소드를 구현할 필요가 없다. 대신 파라미터 `HttpServletRequest`의 메소드 타입이 `GET`이면 `doGet()`메소드를 타고, `POST`이면 `doPost()` 메소드를 타기 때문에 `doGet()`과 `doPost()`를 구현해야한다.

```java
@WebServlet("/demo")
public class DemoServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// GET 방식 처리
		RequestDispatcher rd = req.getRequestDispatcher("/WEB-INF/views/demo/write.jsp");
		rd.forward(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// POST 방식 처리
		req.setCharacterEncoding("utf-8");
		
		String name = req.getParameter("name");
		
		resp.setContentType("text/html;charset=utf-8");
		PrintWriter out = resp.getWriter();
		
		out.print("<html>");
		out.print("<body>");
		out.print(name);
		out.print("</body>");
		out.print("</html>");
	}
}
```
 
<br/>  
  
## 종류
Tomcat, Jeus 등이 있다.    


<br/>  

----
#### Reference
[JSP 동작원리 및 변환 방식](http://egloos.zum.com/rebirth/v/481080)   
[서블릿의 기본](https://m.blog.naver.com/PostView.nhn?blogId=yswon72&logNo=51544546&proxyReferer=https%3A%2F%2Fwww.google.com%2F)  
[서블릿 문법](https://levin01.tistory.com/595)  
[Web Server와 WAS의 차이와 웹 서비스 구조](https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html)