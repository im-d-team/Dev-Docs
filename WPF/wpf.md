# WPF(Window Presentation Foundation)

## 목차  
[1. WPF](#1.-What-is-WPF?)  
[2. Resource](#2.-Resource)  
[3. Data Binding](#3.-Data-binding)  
[4. 프로젝트 활용](#4.-프로젝트-활용)  


## 1. What is WPF?

### 1) 정의
WPF는 마이크로소프트의 최신 GUI 프레임워크이다. 닷넷 프레임 워크를 기반에 둔다. Windows Presentation Foundation의 약자이다. (WPF, which stands for Windows Presentation Foundation, is Microsoft's latest approach to a GUI framework, used with the .NET framework.)
### 2) 구성 요소
XAML + CodeBehind  
- XAML은 eXtensible Application Markup Language의 약자로 마이크로소프트 XML의 한 형태이다.
- CodeBehind는 C# 또는 Visual Basic을 사용한다.  


## 2. Resource
### 1) StaticResource vs. DynamicResource
StaticResource는 XAML이 로드될 때 단 한 번 할당 된다. 동적으로 리소스를 변경할 수 없다. 반면 DynamicResource는 필요할 때마다 할당가능한 자원이다. 디자인(XAML) 시에 존재하지 않았던 리소스들을 CodeBehind 단(C#)에서 사용할 수 있다. 다음 코드의 ComboBoxItems, WindowBackgroundBrush는 각각 StaticResource, DynamicResource 이다.  
```xml
<!--testControl.xaml-->
<Window.Resources>
        <sys:String x:Key="ComboBoxTitle">Items:</sys:String>

        <x:Array x:Key="ComboBoxItems" Type="sys:String">
            <sys:String>Item #1</sys:String>
            <sys:String>Item #2</sys:String>
            <sys:String>Item #3</sys:String>
        </x:Array>

        <LinearGradientBrush x:Key="WindowBackgroundBrush">
            <GradientStop Offset="0" Color="Silver"/>
            <GradientStop Offset="1" Color="Gray"/>
        </LinearGradientBrush>
</Window.Resources>
```
### 2) Scope
resource의 scope는 1. Local -> 2. Window -> 3. Application 순으로 올라간다. 다음 세 개의 코드에서 `ComboBoxTitle`에 주목해 보자.

1. Local Resource
```xml
<!--testControl.xaml-->
<StackPanel Margin="10">
    <StackPanel.Resources>
        <sys:String x:Key="ComboBoxTitle">Items:</sys:String>
    </StackPanel.Resources>
    <Label Content="{StaticResource ComboBoxTitle}" />
</StackPanel>
```
StackPanel의 자식 계층인 Label에 `ComboBoxTitle`을 바인딩 하고 있다. Local Resource(여기서는 StackPanel.Resource)의 `ComboBoxTitle`와 바인딩 한다.  
2. Window Resource
```xml
<!--testControl.xaml-->
<Window x:Class="WpfTutorialSamples.WPF_Application.ExtendedResourceSample"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:sys="clr-namespace:System;assembly=mscorlib"
        Title="ExtendedResourceSample" Height="160" Width="300"
        Background="{DynamicResource WindowBackgroundBrush}">
    <Window.Resources>
        <sys:String x:Key="ComboBoxTitle">Items:</sys:String>
    </Window.Resources>
    <StackPanel Margin="10">
        <Label Content="{StaticResource ComboBoxTitle}" />
    </StackPanel>
</Window>
```
StackPanel의 자식 계층인 Label에 `ComboBoxTitle`을 바인딩 한다. StackPanel(여기서는 로컬) 자체에 `ComboBoxTitle`란 리소스가 없으므로 Window.Resource에 있는 `ComboBoxTitle`과 바인딩한다.  
3. Application Resource
```xml
<!--app.xaml-->
<Application x:Class="WpfTutorialSamples.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:sys="clr-namespace:System;assembly=mscorlib"
             StartupUri="WPF application/ExtendedResourceSample.xaml">
    <Application.Resources>
        <sys:String x:Key="ComboBoxTitle">Items:</sys:String>
    </Application.Resources>
</Application>
```
StackPanel의 자식 계층인 Label에 `ComboBoxTitle`을 바인딩 한다고 가정하자. StackPanel(여기서는 로컬) 자체에 `ComboBoxTitle`란 리소스가 없고 Window.Resource에 `ComboBoxTitle`란 리소스가 없을 때는 App.xaml에 있는 리소스를 탐색한다. 즉 Application.Resources 는 최상위 계층이다.  
### 3) Code-behind Resource
```xml
<!--App.xmal-->
<Application x:Class="WpfTutorialSamples.App"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:sys="clr-namespace:System;assembly=mscorlib"
             StartupUri="WPF application/ResourcesFromCodeBehindSample.xaml">
    <Application.Resources>
        <sys:String x:Key="strApp">Hello, Application world!</sys:String>
    </Application.Resources>
</Application>
```
```xml
<!--Window.xaml-->
<Window x:Class="WpfTutorialSamples.WPF_Application.ResourcesFromCodeBehindSample"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:sys="clr-namespace:System;assembly=mscorlib"
        Title="ResourcesFromCodeBehindSample" Height="175" Width="250">
    <Window.Resources>
        <sys:String x:Key="strWindow">Hello, Window world!</sys:String>
    </Window.Resources>
    <DockPanel Margin="10" Name="pnlMain">
        <DockPanel.Resources>
            <sys:String x:Key="strPanel">Hello, Panel world!</sys:String>
        </DockPanel.Resources>

        <WrapPanel DockPanel.Dock="Top" HorizontalAlignment="Center" Margin="10">
            <Button Name="btnClickMe" Click="btnClickMe_Click">Click me!</Button>
        </WrapPanel>

        <ListBox Name="lbResult" />
    </DockPanel>
</Window>
```
다음 코드에서 `lbResult`에 Local, Window, App 리소스를 붙이고 있다.
```csharp
using System;
using System.Windows;

namespace WpfTutorialSamples.WPF_Application
{
	public partial class ResourcesFromCodeBehindSample : Window
	{
		public ResourcesFromCodeBehindSample()
		{
			InitializeComponent();
		}

		private void btnClickMe_Click(object sender, RoutedEventArgs e)
		{
			lbResult.Items.Add(pnlMain.FindResource("strPanel").ToString());
			lbResult.Items.Add(this.FindResource("strWindow").ToString());
			lbResult.Items.Add(Application.Current.FindResource("strApp").ToString());
		}
	}
}

```
### 4) Resource Dictionary
[WPF Resource Dictionary 참고](https://docs.microsoft.com/ko-kr/windows/uwp/design/controls-and-patterns/resourcedictionary-and-xaml-resource-references)

## 3. Data binding
### 1) 정의 
Data Binding은 코드에서 UI 레이어로 데이터를 가져오는 데 선호되는 방식이다. ListBox를 구성할 때, 디자인단에서 수동으로 Control의 속성을 설정하거나 코드 단에서 loop를 돌려 item을 배치할 수도 있지만, 가장 깔끔한 방식은 Binding을 추가하는 것이다. Data binding은 WPF에서 큰 비중을 차지한다. 

### 2) 사용
```
{Binding Path=Text, ElementName=txtValue}
```
Path에는 Property명을, ElementName은 x:Key=? 의 이름을 사용한다. Binding에는 ElementName이라는 Property외에 [Source](https://www.wpf-tutorial.com/ko/502/%EB%8D%B0%EC%9D%B4%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9/data-binding-via-code-behind/), [UpdateSourceTrigger](https://www.wpf-tutorial.com/ko/37/%EB%8D%B0%EC%9D%B4%ED%84%B0-%EB%B0%94%EC%9D%B8%EB%94%A9/updatesourcetrigger-%EC%86%8D%EC%84%B1/) 등의 Property를 갖는다.

### 3) 예시
![image](https://user-images.githubusercontent.com/43839938/79631135-00fcd780-8192-11ea-926f-b5c6d493f6c9.png)  
`TextBox`의 `Text`와 `TextBlock`의 `Text`가 binding 되어 있다. 
```xml
<Window x:Class="WpfTutorialSamples.DataBinding.HelloBoundWorldSample"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="HelloBoundWorldSample" Height="110" Width="280">
    <StackPanel Margin="10">
		<TextBox Name="txtValue" />
		<WrapPanel Margin="0,10">
			<TextBlock Text="Value: " FontWeight="Bold" />
			<TextBlock Text="{Binding Path=Text, ElementName=txtValue}" />
		</WrapPanel>
	</StackPanel>
</Window>
```
## 4. 프로젝트 활용
https://www.slideshare.net/EUNJIHA4/wpf-232222167
#### Reference
- [What is WPF?](https://www.wpf-tutorial.com/about-wpf/what-is-wpf/)
- [Resource](https://www.wpf-tutorial.com/wpf-application/resources/)
- [Data binding](https://www.wpf-tutorial.com/data-binding/introduction/)
