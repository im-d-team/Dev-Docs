# JSON과 XML
저번 시간에 [soap api](https://github.com/im-d-team/Dev-Docs/blob/master/Network/SOAP%20API.md)를 정리하면서 데이터 형식에는 `JSON 형식`과 `XML 형식`이 있다고 들었다. 

둘의 차이와 파싱하는 법을 정리를 해보았다.

## XML이란?
XML은 EXtensible Markup Language의 약자로, HTML과 매우 비슷한 문자 기반의 마크업 언어이다.
XML 태그는 HTML 태그처럼 미리 정의되어 있지 않고, 사용자가 직접 정의할 수 있다.

### XML 문법
![xml문법](https://user-images.githubusercontent.com/43868540/86515903-730ebf80-be57-11ea-83fd-85a2c1afb8aa.PNG)

[출처 myeonguni.tistory](https://myeonguni.tistory.com/1087)
- xml 선언부가 있으며 인코딩 방식과 버전을 기입한다.
- `element`는 시작과 종료 태그로 한 쌍이 되어야 한다.
- 요소의 시작 태그와 끝 태그 사이에 들어있는 텍스트는 `element content`라고 부르고 그냥 데이터이다.
- XML 태그는 대소문자 구분이 있다. 

### XML 장점
- 작성하기가 **간편**하다.(tag구조)
- 사람이 읽기가 쉽다. 즉, 정보들이 의미하는 바를 한눈에 보기 좋다.

### XML 단점
- tag 때문에 실 데이터에 비해 문서의 양이 필요 이상으로 많아진다.
- 배열 형식이나 반복 구조의 경우 불필요한 데이터가 계속해서 나타난다. 결국 파싱이 힘들어지고 속도는 느려진다.

## JSON
JSON은 JavaScript Object Notation의 약자로, 데이터를 저장하거나 전송할 때 많이 사용되는 데이터 교환 형식이다. 최근에는 JSON이 용량이 더 작아서 XML을 대체에서 데이터 전송 등에 많이 사용한다. 

### JSON 문법
![JSON 문법](https://user-images.githubusercontent.com/43868540/86515808-a9980a80-be56-11ea-9269-a15c597bda1f.PNG)

[출처 surim014.log](https://velog.io/@surim014/JSON%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80)
- json 형식은 자바스크립트 객체와 마찬가지로 `key/value`가 존재할 수 있으며 key 값이나 문자열은 항상 쌍따옴표를 이용하여 표기해야 한다. 
- 일반 자바스크립트의 객체처럼 원하는 만큼 중첩시켜서 사용할 수도 있다.
- json 형식에서는 null, number, string, array, object, boolean을 사용할 수 있다.

### JSON 장점
- 내용이 **함축적**으로 최소한의 정보만을 가지고 있다.
- **최소한의 정보**만 가지고 있기 때문에 속도는 그만큼 빨라진다.
- 파싱이 매우 **간편**하고 사용하기 쉽다.

### JSON 단점
- 내용이 함축적이다 보니 내용의 의미 파악하기 힘들다.
- **적은 규격의 데이터 전송**에 적합한 방식이기 때문에 XML보다는 빠르지만 대용량급 데이터 송수신엔 부적합하다.

## XML parse
XML 파싱하는 방법에는 DOM, SAX, PULL 이렇게 총 3가지가 있는데 그중 pull 파싱을 사용하였다.

`XmlPullParser`가 안드로이드에서 XML을 파싱하는 효율적이고 유지관리가 쉬운 방법이라 알려져 있어 사용하였다.

각 파싱에 대한 간단한 설명은 [이곳](http://sunphiz.me/wp/archives/298)을 참고하길 바란다.

**test2.xml**
``` xml
<?xml version="1.0" encoding="utf-8"?>
<CONTACT>
    <NO>1</NO>
    <NAME>제갈은</NAME>
    <PHONE>010-2614-6938</PHONE>
    <OVER20>true</OVER20>
</CONTACT>
```
마찬가지로 assets 폴더 안에 `test2.xml` 파일을 생성해준다.

**activity_main.xml**
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    tools:context=".MainActivity">

    <TableLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:stretchColumns="1">

        <TableRow
            android:layout_width="match_parent"
            android:layout_height="match_parent">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:textSize="24sp"
                android:text="No" />

            <EditText
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginLeft="20dp"
                android:textSize="24sp"
                android:id="@+id/editTextNo"/>
        </TableRow>

        <TableRow
            android:layout_width="match_parent"
            android:layout_height="match_parent">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:textSize="24sp"
                android:text="Name" />

            <EditText
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginLeft="20dp"
                android:textSize="24sp"
                android:id="@+id/editTextName"/>
        </TableRow>

        <TableRow
            android:layout_width="match_parent"
            android:layout_height="match_parent">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:textSize="24sp"
                android:text="Phone" />

            <EditText
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginLeft="20dp"
                android:textSize="24sp"
                android:id="@+id/editTextPhone"/>
        </TableRow>

        <TableRow
            android:layout_width="match_parent"
            android:layout_height="match_parent">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:textSize="24sp"
                android:text="Over20" />

            <CheckBox
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginLeft="20dp"
                android:textSize="24sp"
                android:id="@+id/checkBoxOver20"
                android:text="Over 20 years?"/>
        </TableRow>

    </TableLayout>

</LinearLayout>
```
화면을 구성해 줄 TextView와 CheckBox, EditText 등을 생성한다. 

**MainActivity.java**
``` java
package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.AssetManager;
import android.os.Bundle;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    final int STEP_NONE = 0 ;
    final int STEP_NO = 1 ;
    final int STEP_NAME = 2 ;
    final int STEP_PHONE = 3 ;
    final int STEP_OVER20 = 4 ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        AssetManager am = getResources().getAssets();
        InputStream is = null;

        try {
            int no = -1;
            String name = null;
            String phone = null;
            boolean isOver20 = false;

            // XML 파일 스트림 열기
            is = am.open("test2.xml");

            // XML 파서 초기화
            XmlPullParserFactory parserFactory = XmlPullParserFactory.newInstance();
            XmlPullParser parser = parserFactory.newPullParser();

            // XML 파서에 파일 스트림 지정.
            // XML 파서에는 openFile()과 같은, 직접적으로 XML 파일을 여는 함수가 존재하지 않는다. 대신 파서가 처리할 입력 스트림을 지정하는 setInput() 함수가 존재한다.
            parser.setInput(is, "UTF-8");
            
            int eventType = parser.getEventType();     
            int step = STEP_NONE ;
            while (eventType != XmlPullParser.END_DOCUMENT) {                   // XML파일의 끝에 도달할 때까지
                if (eventType == XmlPullParser.START_DOCUMENT) {                // XML파일의 처음 시작했을 때 
                    // XML 데이터 시작
                } else if (eventType == XmlPullParser.START_TAG) {              // element의 시작태그를 만났을 때
                    String startTag = parser.getName();
                    if (startTag.equals("NO")) {
                        step = STEP_NO;
                    } else if (startTag.equals("NAME")) {
                        step = STEP_NAME;
                    } else if (startTag.equals("PHONE")) {
                        step = STEP_PHONE;
                    } else if (startTag.equals("OVER20")) {
                        step = STEP_OVER20;
                    } else {
                        step = STEP_NONE;
                    }
                } else if (eventType == XmlPullParser.END_TAG) {                // element의 종료태그를 만났을 때 
                    String endTag = parser.getName();                           // 태그를 파싱
                    if ((endTag.equals("NO") && step != STEP_NO) ||
                            (endTag.equals("NAME") && step != STEP_NAME) ||
                            (endTag.equals("PHONE") && step != STEP_PHONE) ||
                            (endTag.equals("OVER20") && step != STEP_OVER20)) {
                        // TODO : error
                    }
                    step = STEP_NONE;
                } else if (eventType == XmlPullParser.TEXT) {
                    String text = parser.getText();                             //태그 안에 데이터 값 얻기
                    if (step == STEP_NO) {
                        try {
                            no = Integer.parseInt(text);
                        } catch (Exception e) {
                            no = 0;
                        }
                    } else if (step == STEP_NAME) {
                        name = text;
                    } else if (step == STEP_PHONE) {
                        phone = text;
                    } else if (step == STEP_OVER20) {
                        isOver20 = Boolean.parseBoolean(text);
                    }
                }

                eventType = parser.next();                                       //다음 element로..
            }

            if (no == -1 || name == null || phone == null) {
                // ERROR : XML is invalid.
            } else {

                EditText editTextNo = (EditText) findViewById(R.id.editTextNo);
                editTextNo.setText(Integer.toString(no));

                EditText editTextName = (EditText) findViewById(R.id.editTextName);
                editTextName.setText(name);

                EditText editTextPhone = (EditText) findViewById(R.id.editTextPhone);
                editTextPhone.setText(phone);

                CheckBox checkBoxOver20 = (CheckBox) findViewById(R.id.checkBoxOver20);
                checkBoxOver20.setChecked(isOver20);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
xml 데이터를 파싱할 때는 루프를 돌면서 XML 요소(element)를 파싱하는 방법을 사용한다. 

위에 코드에서 볼 수 있듯이 while 루프 내에서 `next()` 함수를 호출하면서 element가 무엇인지 판단하고 파싱하는 것이다.

해당 실 데이터(text)가 어떤 태그의 데이터인지 판단하기 위해 `step`이라는 변수를 이용하여 태그를 저장하고 검사하였다. 

- 태그를 파싱했을 때 태그의 이름을 가져올 때는 `getName()`을 사용한다.
- 태그를 파싱했을 때 텍스트의 내용을 가져올 때는 `getText()`를 사용한다.

위에 코드에서 속성에 대한 설명은 아래 사진을 참고하길 바란다.

<img width="443" alt="XMLparser속성" src="https://user-images.githubusercontent.com/43868540/86525423-ddf4e080-bec1-11ea-8350-452b48180759.png">
<img width="313" alt="xmlparse 속성2" src="https://user-images.githubusercontent.com/43868540/86525524-2bbe1880-bec3-11ea-84a9-f6385d7c7044.png">

[출처 codedragon.tistory](https://codedragon.tistory.com/6755)

### 결과화면
<img width="419" alt="xmlparse" src="https://user-images.githubusercontent.com/43868540/86514641-4efab080-be4e-11ea-9efb-311c2c7ed013.png">

## JSON parse
**test.json**
``` json
[
  {"name":  "제갈은", "msg":  "경기도 안산", "birthday": {"month":  3, "day":  23}},
  {"name":  "심세영","msg":  "경기도 안양", "birthday": {"month": 6,"day": 19}}
]
```
assets 폴더 안에 jsons 폴더를 생성한다. 만든 jsons 폴더 안에 test.json을 생성한다.

**activity_main.xml**
``` xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    tools:context=".MainActivity">

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="json parse"
        android:onClick="clickBtn"/>
    <TextView
        android:id="@+id/tv"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:padding="8dp"/>

</LinearLayout>
```
Button과 TextView를 화면에 추가해주었다. TextView에는 tv라는 id를 부여해주었다.

**MainActivity.java**
``` java
package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.AssetManager;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class MainActivity extends AppCompatActivity {

    TextView tv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        tv = findViewById(R.id.tv);
    }
    public void clickBtn(View view) {

        //json 파일 읽어와서 분석하기

        //assets폴더의 파일을 가져오기 위해
        //창고관리자(AssetManager) 얻어오기
        AssetManager assetManager = getAssets();

        //assets/ test.json 파일 읽기 위한 InputStream
        try {
            InputStream is = assetManager.open("jsons/test.json");  
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader reader = new BufferedReader(isr);

            StringBuffer buffer = new StringBuffer();
            String line = reader.readLine();
            while (line != null) {
                buffer.append(line + "\n");
                line = reader.readLine();
            }

            String jsonData = buffer.toString();

            //json 데이터가 하나의 배열일 때
            //jsonObject 객체 생성
//            JSONObject jsonObject= new JSONObject(jsonData);
//            String name= jsonObject.getString("name");
//            String msg= jsonObject.getString("msg");
//
//            tv.setText("이름 : "+name+"\n"+"메세지 : "+msg);

            //json 데이터가 []로 시작하는 여러 배열일때..
            //JSONArray 객체 생성
            JSONArray jsonArray = new JSONArray(jsonData);

            String s = "";

            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jo = jsonArray.getJSONObject(i);

                String name = jo.getString("name");
                String msg = jo.getString("msg");
                JSONObject flag = jo.getJSONObject("birthday");
                int aa = flag.getInt("month");
                int bb = flag.getInt("day");

                s += name + " : " + msg + ", 생일 :  " + aa + "월" + bb + "일\n";
            }
            tv.setText(s);

        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }
}
```

json 파싱은 기본적으로 `JSONObject`와 `JSONArray`으로 json을 파싱할 수 있다.

데이터가 하나의 배열일 때는 `JSONObject`를 사용하고 여러 배열일 때는 `JsonArray`를 사용한다. 

`JSONArray`를 사용할 때는 for문을 사용해 `JSONObject`를 하나씩 생성해 값을 가져온다. 

### 결과 화면
<img width="431" alt="jsonparse" src="https://user-images.githubusercontent.com/43868540/86513605-89604f80-be46-11ea-91d9-30d9d99a6acf.png">

---

#### Reference
- [JSON과 XML](http://tcpschool.com/json/json_intro_xml)
- [XML 구조](https://usroom.tistory.com/entry/XML%EC%9D%98-%EB%AC%B8%EB%B2%95)
- [XML과 JSON의 장단점](https://usbs.tistory.com/entry/XML-JSON-%EA%B0%84%EB%8B%A8%ED%95%9C-%EB%B9%84%EA%B5%90-%EB%B6%84%EC%84%9D)
- [XML 파싱](https://recipes4dev.tistory.com/137)
- [JSON 파싱](https://lcw126.tistory.com/101)
