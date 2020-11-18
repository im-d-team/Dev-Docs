# Bomb Lab(1)

Bomb Lab은 Carnegie Mellon University의 시스템 프로그래밍 과제인 Lab 시리즈 중 하나이다. 과제에는 bomb라는 바이너리 파일이 제공된다. 과제의 목적은 gdb를 이용해 해당 파일을 리버스 엔지니링 하여 총 6단계의 문구를 찾아 폭탄을 해체하는 것이다. 과제의 특성상 어셈블리를 분석해야 하기 때문에 문제를 해결하는 과정에서 어셈블리와 친숙해질 수 있다.

해당 문서에서 사용되는 어셈블리는 [AT&T 문법](http://doc.kldp.org/KoreanDoc/html/Assembly_Example-KLDP/Assembly_Example-KLDP.html)을 따른다.

## 사전지식

### 어셈블리의 구성

`[Label]: [operator]  [operand1], [operand2] # [comment]`

`L1: mov %eax, %ebx # comment`

`L1:`은 기계어 코드로 번역되지 않고 분기 명령(jmp) 등에서 참조될 때에 번지의 계산에 사용된다. `mov`는 operand2의 값을 operand1에 할당할 때 사용한다.

operand 앞에 붙는 기호 중 `$`는 상수, `%`는 레지스터를 나타낸다.

### 어셈블리 명령어

- AT&T 방식에서는 `[instruction] [src], [dest]` 인 것을 감안하고 참고해야 한다. (LEA, MOVE 등)

![](https://t1.daumcdn.net/cfile/tistory/23112B4256B1A00D0E)

![](https://t1.daumcdn.net/cfile/tistory/214A7D3654B3CA5E25)

![](https://t1.daumcdn.net/cfile/tistory/2331033C54B3CA810C)

![](https://t1.daumcdn.net/cfile/tistory/2562654F54B3CAA308)

> 출처: https://securityfactory.tistory.com/153

### 주소지정 방식

- AT&T 어셈블리는 `instruction src, dest` 형태로 구성된다.

- 즉시 지정 방식
  - `mov $0x1, %eax`: eax에 1을 할당하는 것처럼 값을 직접 대응시키는 방식이다.
- 레지스터 지정방식
  - `mov %esp, %ebp`: 레지스터 ebp에 레지스터 esp의 값을 할당하는 방식이다.
- 직접 주소 지정방식
  - `mov &0x127f, %eax `: 주소 0x127f에 있는 값을 eax에 할당하는 것처럼 메모리의 주소를 직접 지정해서 할당하는 방식이다.
- 레지스터 간접 주소 지정방식(괄호 안의 값)
  - `mov (%ebx), %eax`: ebx의 값을 주소로 하여 간접적으로 eax 레지스터에 할당하는 방식이다.
- 베이스 상대 주소 지정방식
  - `mov 0x4(%esi), %eax`: esi레지스터에서 4 Byte를 더한 주소의 값을 eax 레지스터에 할당하는 방식이다.

### 범용 레지스터

- 레지스터의 첫 글자는 32bit에서 E, 64bit에서 R로 사용된다. 해당 문서에서는 64bit를 기준으로 작성하였다.

- 데이터 레지스터
  - RAX(Accumulator): 곱셈, 나눗셈 등 각종 연산에 많이 사용되는 변수이다. 주로 return 값을 저장한다.
  - RBX(Base): 목적이 없는 레지스터이다. 공간이 필요할 때 메모리 주소 지정 시 사용한다.
  - RCX(Count): for 문에서 i 역할을 한다. ECX는 미리 값을 정해놓고 0이 될 때까지 진행한다. 변수로 사용해도 무방하다.
  - RDX(Data): 각종 연산에 쓰이는 변수이다. 나눗셈에서 EAX와 함께 사용한다. 부호 확장 명령 등에 사용한다.
- 인덱스 레지스터
  - RSI(Source Index), RDI(Destination Index): 문자열이나 각종 반복 데이터를 처리하거나 메모리를 옮기는 데 사용한다. 각각 Source의 주소와 Destination의 주소를 가리킨다.
- 포인터 레지스터
  - RSP(Stack Pointer): Stack의 상위 주소(최종점)를 가리키는 레지스터이다.
  - RBP(Base Pointer): Stack의 Base 주소를 가리키는 레지스터이다. ESP를 대신해 스택에 저장된 함수의 파라미터 지역 변수의 주소를 가리키는 용도로 사용된다.
- 상태 레지스터
  - RIP(Instruction Pointer): 실행할 명령의 주소를 가리키는 레지스터이다. 각각의 명령이 실행될 때, EIP에 CPU가 현재 실행하고 있는 주소가 저장된다.

## GDB

### 기본 명령어

- `run`: 프로그램을 실행한다. break point가 걸려있다면 break point까지 실행한다.
- `continue`: break point가 걸려있는 경우 다음 break point까지 실행한다.
- `break`: break point를 지정한다. b로 줄여 쓸 수 있다.
- `display $eax`: EAX(accumulator)를 보여주는 역할을 한다.
- `ni`: next instruction의 약자다. 즉 다음 명령어로 넘어간다는 것을 의미한다. 함수 안으로 진입하지 않는다.
- `si`: ni와 동일하게 다음 명령어로 넘어간다는 것을 의미한다. 함수 안으로 들어갈 수 있다.
- `b explode_bomb`: 폭탄 터져서 점수를 잃지 않도록 방지하는 역할을 한다.
- `x/[출력 횟수] [출력 형식] [출력 단위] [출력 위치]`: 메모리 상태와 내용을 확인할 수 있다.
  - 출력 형식: t(2), o(8), d, u(10), x(16), c, f, a, s(string), i
  - 출력 단위: b(1 Byte), h(2 Byte), w(4 Byte), g(8 Byte)
- `disas [함수명]`: 함수의 어셈블리 코드 출력
- `disas [시작 주소] [끝 주소]`: 주소 범위의 어셈블리 코드 출력
- `p $[레지스터 명]`: 레지스터값 확인
- `i r`: info registers를 줄여 쓴 것이다. 레지스터값 전체를 한 번에 확인할 수 있다.

### TUI(Text User Interface)

- gdb에서 디버깅 정보들을 분리된 창에서 상시로 확인할 수 있게 해준다.
- Source file, Assembly, register info, gdb command 총 4가지 종류의 정보를 띄울 수 있다.

- `tui enable`: TUI를 활성화한다. 혹은  gdb를 실행할 때 `--tui` 옵션을 줘서 실행시킬 수도 있다.
- `layout asm`: Assembly 디버깅 정보를 표시하는 TUI를 활성화 한다.

## bomb 파일 분석

`gdb bomb` 명령어로 bomb 파일을 gdb를 이용해 분석해보도록 하자.

### main

```shell
(gdb) disas main
Dump of assembler code for function main:
   0x000000000000116a <+0>:	push   %rbx
   0x000000000000116b <+1>:	cmp    $0x1,%edi
   0x000000000000116e <+4>:	je     0x126c <main+258>
   0x0000000000001174 <+10>:	mov    %rsi,%rbx
   0x0000000000001177 <+13>:	cmp    $0x2,%edi
   0x000000000000117a <+16>:	jne    0x12a1 <main+311>
   0x0000000000001180 <+22>:	mov    0x8(%rsi),%rdi
   0x0000000000001184 <+26>:	lea    0x17d9(%rip),%rsi        # 0x2964
   0x000000000000118b <+33>:	callq  0xfc0 <fopen@plt>
   0x0000000000001190 <+38>:	mov    %rax,0x203519(%rip)        # 0x2046b0 <infile>
   0x0000000000001197 <+45>:	test   %rax,%rax
   0x000000000000119a <+48>:	je     0x127f <main+277>
   0x00000000000011a0 <+54>:	callq  0x17d8 <initialize_bomb>
   0x00000000000011a5 <+59>:	lea    0x183c(%rip),%rdi        # 0x29e8
   0x00000000000011ac <+66>:	callq  0xee0 <puts@plt>
   0x00000000000011b1 <+71>:	lea    0x1870(%rip),%rdi        # 0x2a28
   0x00000000000011b8 <+78>:	callq  0xee0 <puts@plt>
   0x00000000000011bd <+83>:	callq  0x1af2 <read_line>
   0x00000000000011c2 <+88>:	mov    %rax,%rdi
   0x00000000000011c5 <+91>:	callq  0x12c4 <phase_1>
   0x00000000000011ca <+96>:	callq  0x1c36 <phase_defused>
   0x00000000000011cf <+101>:	lea    0x1882(%rip),%rdi        # 0x2a58
   0x00000000000011d6 <+108>:	callq  0xee0 <puts@plt>
   0x00000000000011db <+113>:	callq  0x1af2 <read_line>
   0x00000000000011e0 <+118>:	mov    %rax,%rdi
   0x00000000000011e3 <+121>:	callq  0x12e4 <phase_2>
   0x00000000000011e8 <+126>:	callq  0x1c36 <phase_defused>
   0x00000000000011ed <+131>:	lea    0x17a9(%rip),%rdi        # 0x299d
   0x00000000000011f4 <+138>:	callq  0xee0 <puts@plt>
   0x00000000000011f9 <+143>:	callq  0x1af2 <read_line>
   0x00000000000011fe <+148>:	mov    %rax,%rdi
   0x0000000000001201 <+151>:	callq  0x1353 <phase_3>
   0x0000000000001206 <+156>:	callq  0x1c36 <phase_defused>
   0x000000000000120b <+161>:	lea    0x17a9(%rip),%rdi        # 0x29bb
   0x0000000000001212 <+168>:	callq  0xee0 <puts@plt>
   0x0000000000001217 <+173>:	callq  0x1af2 <read_line>
   0x000000000000121c <+178>:	mov    %rax,%rdi
   0x000000000000121f <+181>:	callq  0x1440 <phase_4>
   0x0000000000001224 <+186>:	callq  0x1c36 <phase_defused>
   0x0000000000001229 <+191>:	lea    0x1858(%rip),%rdi        # 0x2a88
   0x0000000000001230 <+198>:	callq  0xee0 <puts@plt>
   0x0000000000001235 <+203>:	callq  0x1af2 <read_line>
   0x000000000000123a <+208>:	mov    %rax,%rdi
   0x000000000000123d <+211>:	callq  0x14af <phase_5>
   0x0000000000001242 <+216>:	callq  0x1c36 <phase_defused>
   0x0000000000001247 <+221>:	lea    0x177c(%rip),%rdi        # 0x29ca
   0x000000000000124e <+228>:	callq  0xee0 <puts@plt>
   0x0000000000001253 <+233>:	callq  0x1af2 <read_line>
   0x0000000000001258 <+238>:	mov    %rax,%rdi
   0x000000000000125b <+241>:	callq  0x14f5 <phase_6>
   0x0000000000001260 <+246>:	callq  0x1c36 <phase_defused>
   0x0000000000001265 <+251>:	mov    $0x0,%eax
   0x000000000000126a <+256>:	pop    %rbx
   0x000000000000126b <+257>:	retq
   0x000000000000126c <+258>:	mov    0x20341d(%rip),%rax        # 0x204690 <stdin@@GLIBC_2.2.5>
   0x0000000000001273 <+265>:	mov    %rax,0x203436(%rip)        # 0x2046b0 <infile>
   0x000000000000127a <+272>:	jmpq   0x11a0 <main+54>
   0x000000000000127f <+277>:	mov    0x8(%rbx),%rcx
   0x0000000000001283 <+281>:	mov    (%rbx),%rdx
   0x0000000000001286 <+284>:	lea    0x16d9(%rip),%rsi        # 0x2966
   0x000000000000128d <+291>:	mov    $0x1,%edi
   0x0000000000001292 <+296>:	callq  0xfb0 <__printf_chk@plt>
   0x0000000000001297 <+301>:	mov    $0x8,%edi
   0x000000000000129c <+306>:	callq  0xfe0 <exit@plt>
   0x00000000000012a1 <+311>:	mov    (%rsi),%rdx
   0x00000000000012a4 <+314>:	lea    0x16d8(%rip),%rsi        # 0x2983
   0x00000000000012ab <+321>:	mov    $0x1,%edi
   0x00000000000012b0 <+326>:	mov    $0x0,%eax
   0x00000000000012b5 <+331>:	callq  0xfb0 <__printf_chk@plt>
   0x00000000000012ba <+336>:	mov    $0x8,%edi
   0x00000000000012bf <+341>:	callq  0xfe0 <exit@plt>
End of assembler dump.
```

main 함수를 disassemble 하면 메인 함수는 총 6개 phase로 구성된 것을 확인할 수 있다. break point 없이 run 명령어를 실행하면 문자열을 입력받는 상태가 된다. 여기서 제대로 된 문자열을 입력해야만 폭탄이 터지지 않는다. 이 과정을 6번 거쳐 제대로 된 문자열을 입력하면 폭탄을 해체할 수 있다.

각 phase함수들을 disassemble 하여 어셈블리를 분석하거나 적절하게 break point를 건 뒤 단서를 찾아 폭탄을 해체할 수 있는 입력값들을 발견할 수 있다.

과제는 진행 상황에 따라 웹(score board)을 통해 실시간으로 점수를 확인할 수 있다. 각 phase를 처음 통과할 때 점수를 얻는다. 각 phase에 잘못된 문자열을 입력하여 폭탄이 터지면 터질 때마다 일정 점수를 잃는다.

폭탄이 터져 점수를 잃는 것을 방지하기 위해서는 `b explode_bomb` 명령어를 사용하여 break point를 걸고 시작하면 된다.

### phase_1

`disas phase_1` 명령어로 첫 번째 phase 함수의 어셈블리 코드를 출력할 수 있다. 그 결과는 아래와 같다.

```shell
(gdb) disas phase_1
Dump of assembler code for function phase_1:
   0x00000000000012c4 <+0>:	sub    $0x8,%rsp
   0x00000000000012c8 <+4>:	lea    0x17dd(%rip),%rsi        # 0x2aac
   0x00000000000012cf <+11>:	callq  0x1771 <strings_not_equal>
   0x00000000000012d4 <+16>:	test   %eax,%eax
   0x00000000000012d6 <+18>:	jne    0x12dd <phase_1+25>
   0x00000000000012d8 <+20>:	add    $0x8,%rsp
   0x00000000000012dc <+24>:	retq
   0x00000000000012dd <+25>:	callq  0x1a75 <explode_bomb>
   0x00000000000012e2 <+30>:	jmp    0x12d8 <phase_1+20>
End of assembler dump.
```

먼저 `phase_1` 함수는 `+11`에서  ` strings_not_equal` 함수를 호출함을 확인할 수 있다.  `+16`의 test 명령은  %eax를 AND 연산한다. 즉 %eax의 값이 0인지, 1인지를 판별하는 것이다. `+18`에서 jne(Jump If Not Equal) 명령은 `+16`이 1(Equal)인 경우 `+20`으로 넘어가고 0(Not Equal)인 경우 `+25`로 넘어가 `explode_bomb` 함수가 호출되어 폭탄이 터지게 된다.

그렇다면 `strings_not_equal` 함수는 어떻게 구성되어 있을까?  `disas strings_not_equal`로 확인해보면 아래와 같다.

```shell
(gdb) disas strings_not_equal
Dump of assembler code for function strings_not_equal:
   0x0000000000001771 <+0>:	push   %r12
   0x0000000000001773 <+2>:	push   %rbp
   0x0000000000001774 <+3>:	push   %rbx
   0x0000000000001775 <+4>:	mov    %rdi,%rbx
   0x0000000000001778 <+7>:	mov    %rsi,%rbp
   0x000000000000177b <+10>:	callq  0x1754 <string_length>
   0x0000000000001780 <+15>:	mov    %eax,%r12d
   0x0000000000001783 <+18>:	mov    %rbp,%rdi
   0x0000000000001786 <+21>:	callq  0x1754 <string_length>
   0x000000000000178b <+26>:	mov    $0x1,%edx
   0x0000000000001790 <+31>:	cmp    %eax,%r12d
   0x0000000000001793 <+34>:	je     0x179c <strings_not_equal+43>
   0x0000000000001795 <+36>:	mov    %edx,%eax
   0x0000000000001797 <+38>:	pop    %rbx
   0x0000000000001798 <+39>:	pop    %rbp
   0x0000000000001799 <+40>:	pop    %r12
   0x000000000000179b <+42>:	retq
   0x000000000000179c <+43>:	movzbl (%rbx),%eax
   0x000000000000179f <+46>:	test   %al,%al
   0x00000000000017a1 <+48>:	je     0x17ca <strings_not_equal+89>
   0x00000000000017a3 <+50>:	cmp    0x0(%rbp),%al
   0x00000000000017a6 <+53>:	jne    0x17d1 <strings_not_equal+96>
   0x00000000000017a8 <+55>:	add    $0x1,%rbx
   0x00000000000017ac <+59>:	add    $0x1,%rbp
   0x00000000000017b0 <+63>:	movzbl (%rbx),%eax
   0x00000000000017b3 <+66>:	test   %al,%al
   0x00000000000017b5 <+68>:	je     0x17c3 <strings_not_equal+82>
   0x00000000000017b7 <+70>:	cmp    %al,0x0(%rbp)
   0x00000000000017ba <+73>:	je     0x17a8 <strings_not_equal+55>
   0x00000000000017bc <+75>:	mov    $0x1,%edx
   0x00000000000017c1 <+80>:	jmp    0x1795 <strings_not_equal+36>
   0x00000000000017c3 <+82>:	mov    $0x0,%edx
   0x00000000000017c8 <+87>:	jmp    0x1795 <strings_not_equal+36>
   0x00000000000017ca <+89>:	mov    $0x0,%edx
   0x00000000000017cf <+94>:	jmp    0x1795 <strings_not_equal+36>
   0x00000000000017d1 <+96>:	mov    $0x1,%edx
   0x00000000000017d6 <+101>:	jmp    0x1795 <strings_not_equal+36>
End of assembler dump.
```

비교할 문자열과 입력받은 문자열이 같은지를 확인하는 과정이다. 그렇다면 어셈블리 코드상에서 비교할 문자열이 있는 부분을 찾으면 된다. `b string_not_equal`과 `r`을 실행한 뒤 `layout asm`으로 TUI 환경을 enable 시키고 `ni` 명령어로 한 줄씩 확인해보았다.

![](https://user-images.githubusercontent.com/16266103/97117767-47d31780-1749-11eb-97ab-37041e56b5bd.png)

`x/s` 명령어로 %rdi와 %rsi의 메모리의 내용을 string 형식으로 출력해보았다.  %rdi 레지스터에는 `phase_1` 함수를 실행했을 때 입력했던 값이 들어가 있고 %rsi 레지스터에는 프로그램이 가지고 있는 문자열인 `Wow! Brazil is big`이 들어가 있는 것을 확인 할 수 있었다. bomb 실행 후 `phase_1` 입력값에 해당 문자열을 넣어보았는데 `phase_2`로 넘어가는 것에 성공하였다.

### phase_2

`disas phase_2` 명령어로 두 번째 phase 함수의 어셈블리 코드를 출력해보았다.

```shell
(gdb) disas phase_2
Dump of assembler code for function phase_2:
   0x00000000000012e4 <+0>:	push   %rbp
   0x00000000000012e5 <+1>:	push   %rbx
   0x00000000000012e6 <+2>:	sub    $0x28,%rsp
   0x00000000000012ea <+6>:	mov    %fs:0x28,%rax
   0x00000000000012f3 <+15>:	mov    %rax,0x18(%rsp)
   0x00000000000012f8 <+20>:	xor    %eax,%eax
   0x00000000000012fa <+22>:	mov    %rsp,%rsi
   0x00000000000012fd <+25>:	callq  0x1ab1 <read_six_numbers>
   0x0000000000001302 <+30>:	cmpl   $0x0,(%rsp)
   0x0000000000001306 <+34>:	jne    0x130f <phase_2+43>
   0x0000000000001308 <+36>:	cmpl   $0x1,0x4(%rsp)
   0x000000000000130d <+41>:	je     0x1314 <phase_2+48>
   0x000000000000130f <+43>:	callq  0x1a75 <explode_bomb>
   0x0000000000001314 <+48>:	mov    %rsp,%rbx
   0x0000000000001317 <+51>:	lea    0x10(%rbx),%rbp
   0x000000000000131b <+55>:	jmp    0x1326 <phase_2+66>
   0x000000000000131d <+57>:	add    $0x4,%rbx
   0x0000000000001321 <+61>:	cmp    %rbp,%rbx
   0x0000000000001324 <+64>:	je     0x1337 <phase_2+83>
   0x0000000000001326 <+66>:	mov    0x4(%rbx),%eax
   0x0000000000001329 <+69>:	add    (%rbx),%eax
   0x000000000000132b <+71>:	cmp    %eax,0x8(%rbx)
   0x000000000000132e <+74>:	je     0x131d <phase_2+57>
   0x0000000000001330 <+76>:	callq  0x1a75 <explode_bomb>
   0x0000000000001335 <+81>:	jmp    0x131d <phase_2+57>
   0x0000000000001337 <+83>:	mov    0x18(%rsp),%rax
   0x000000000000133c <+88>:	xor    %fs:0x28,%rax
   0x0000000000001345 <+97>:	jne    0x134e <phase_2+106>
   0x0000000000001347 <+99>:	add    $0x28,%rsp
   0x000000000000134b <+103>:	pop    %rbx
   0x000000000000134c <+104>:	pop    %rbp
   0x000000000000134d <+105>:	retq
   0x000000000000134e <+106>:	callq  0xf00 <__stack_chk_fail@plt>
End of assembler dump.
```

`phase_2` 함수는 `+25`에서 `read_six_numbers` 함수를 호출한다. 이름으로 여섯 개의 숫자를 입력받는다고 유추해볼 수 있다. `b read_six_number`로 해당 함수에 break point를 건 뒤 `r`로 실행해보자. 이때 `b explode_bomb`를 미리 실행해서 폭탄이 터지지 않도록 하는 것을 잊지 않도록 한다.

```shell
(gdb) disas read_six_numbers
Dump of assembler code for function read_six_numbers:
   0x0000555555555ab1 <+0>:	sub    $0x8,%rsp
   0x0000555555555ab5 <+4>:	mov    %rsi,%rdx
   0x0000555555555ab8 <+7>:	lea    0x4(%rsi),%rcx
   0x0000555555555abc <+11>:	lea    0x14(%rsi),%rax
   0x0000555555555ac0 <+15>:	push   %rax
   0x0000555555555ac1 <+16>:	lea    0x10(%rsi),%rax
   0x0000555555555ac5 <+20>:	push   %rax
   0x0000555555555ac6 <+21>:	lea    0xc(%rsi),%r9
   0x0000555555555aca <+25>:	lea    0x8(%rsi),%r8
   0x0000555555555ace <+29>:	lea    0x12b4(%rip),%rsi        # 0x555555556d89
   0x0000555555555ad5 <+36>:	mov    $0x0,%eax
   0x0000555555555ada <+41>:	callq  0x555555554fa0 <__isoc99_sscanf@plt>
   0x0000555555555adf <+46>:	add    $0x10,%rsp
   0x0000555555555ae3 <+50>:	cmp    $0x5,%eax
   0x0000555555555ae6 <+53>:	jle    0x555555555aed <read_six_numbers+60>
   0x0000555555555ae8 <+55>:	add    $0x8,%rsp
   0x0000555555555aec <+59>:	retq
   0x0000555555555aed <+60>:	callq  0x555555555a75 <explode_bomb>
End of assembler dump.
```

`+7`부터 `+29`까지 베이스 상대 주소 지정방식으로 값을 읽어오고 있음을 알 수 있다. 해당 값의 내용을 확인해보기 위해 `ni`와 `x/d $rip+0x12b4`명령어로 무슨 내용인지를 확인해보았다.

![](https://user-images.githubusercontent.com/16266103/97119113-6b01c500-1751-11eb-8d02-979e4d264d53.png)

그 결과 6개의 숫자를 스페이스로 구분해서 받는다는 것을 확인할 수 있었다. 또한 `+41`을 보면 `<__isoc99_sscanf@plt>`로 무엇인가를 입력받는다는 것을 확인할 수 있다. `+53`은 jle(Jump Less or Equal)이며 `+50`의 cmp명령어에서 비교된 5($0x5)보다 작은 수들임을 알 수 있다. 즉, 5보다 작은 6개의 숫자를 스페이스로 구분하는 형식의 값을 입력해야 하는 것이다.

단서를 얻었으니 `phase_2` 함수를 분석해보자. `+30`의 cmpl명령어는 값이 0($0x0)인지를 판별한다. `+34`의 jne(Jump If Not Equal)는 0인경우 `+43`으로 넘어가 `explode_bomb`를 실행하게 된다. 즉, 첫 번째 값은 0임을 유추할 수 있다.

첫 번째 값을 맞혀 `+36`으로 넘어가면 이번엔 cmpl 명령어로 두 번째 값이 1인지를 검사한다. 따라서 두 번째 값은 1임을 알 수 있다.

 `+41`에서 je(Jump If Equal)명령어로 1인 경우 `+48`로 넘어가게 되며 mov명령어로rbx 레지스터에 rsp 레지스터의 값이 복사된다. `+51`에서 rbp 레지스터에 rbx 레지스터의 주소 값이 복사된다. 따라서 세 번째 값은 1이 된다.

jmp 명령어를 통해 `+66`으로 이동 후 eax 레지스터에 rbx 레지스터의 값이 복사된다. 그 후 eax 레지스터의 값과 rbx 레지스터의 값을 더하고 cmp 명령어로 현재 rbx 레지스터의 값과 eax 값이 같은지 확인 후 같으면 `+57`로 보낸다. 즉 네 번째 값은 2가 된다.

여기까지 진행해보면 피보나치 수열의 규칙을 찾을 수 있다. `0 1 1 2 3 5`를 `phase_2` 함수의 입력값으로 넣게 되면 `phase_3`으로 넘어갈 수 있다.

`phase_3` ~ `phase_6` 에 입력될 올바른 문자열을 찾는 방법에 대해서는 다음에 작성하게 될 Bomb Lab(2) 문서에서 설명해보려고 한다.