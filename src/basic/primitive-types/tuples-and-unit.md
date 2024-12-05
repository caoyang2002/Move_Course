# 元组和单元

Move 并不像人们从其他具有元组作为一等值的语言中所期望的那样完全支持元组。然而，为了支持多个返回值，Move 具有类似元组的表达式。这些表达式在运行时不会产生具体的值（字节码中没有元组），因此它们非常有限：它们只能出现在表达式中（通常在函数的返回位置）；它们不能绑定到局部变量；它们不能存储在结构体中；并且元组类型不能用于实例化泛型类型。

同样，单元 `()` 是 Move 源语言创建的一种基于表达式的类型。单元值 `()` 在运行时不会产生任何值。我们可以将 `unit()` 视为一个空元组，并且适用于元组的任何限制也适用于单元。

考虑到这些限制，语言中存在元组可能会让人感到奇怪。但是在其他语言中，元组最常见的用例之一是允许函数返回多个值。一些语言通过强制用户编写包含多个返回值的结构体来设法解决这个问题。然而，在 Move 中，您**不能在结构体中放置引用**。这就要求 Move 支持多个返回值。这些多个返回值在字节码级别都被压入栈中。在源代码级别，这些多个返回值使用元组表示。


## 字面量 
元组是通过括号内由逗号分隔的表达式列表创建的。

| 语法             | 类型                                                                    | 描述                                  |
| -------------- | --------------------------------------------------------------------- | ----------------------------------- |
| `()`           | `(): ()`                                                              | 单元，空元组，或元组的元数为 0 的元组                |
| `(e1,..., en)` | `(e1,..., en): (T1,..., Tn)` ，其中 `e_i: Ti` ，使得 `0 < i <= n` 且 `n > 0` | 一个 `n` 元组，元数为 `n` 的元组，具有 `n` 个元素的元组 |

请注意，`(e)` 没有类型 `(e): (t)` ，换句话说，不存在只有一个元素的元组。如果括号内只有一个元素，括号仅用于消除模糊性，没有其他特殊含义。 有时，具有两个元素的元组被称为“对”，具有三个元素的元组被称为“三元组”。

### 示例

```move
module 0x42::example {
  // 这三个函数都是等价的

  // 当未提供返回类型时，默认为 `()`
  fun returns_unit_1() { }

  // 在空表达式块中有一个隐式的 () 值
  fun returns_unit_2(): () { }

  // `returns_unit_1` 和 `returns_unit_2` 的显式版本
  fun returns_unit_3(): () { () }


  fun returns_3_values(): (u64, bool, address) {
    (0, false, @0x42)
  }
  fun returns_4_values(x: &u64): (&u64, u8, u128, vector<u8>) {
    (x, 0, 1, b"foobar")
  }
}
```

## 操作

目前对元组唯一能做的操作是解构。

### 解构

对于任何大小的元组，它们都可以在 `let` 绑定或赋值中进行解构。

例如：

```move
module 0x42::example {
  // 这三个函数是等价的
  fun returns_unit() {}
  fun returns_2_values(): (bool, bool) { (true, false) }
  fun returns_4_values(x: &u64): (&u64, u8, u128, vector<u8>) { (x, 0, 1, b"foobar") }
 
  fun examples(cond: bool) {
    let () = ();
    let (x, y): (u8, u64) = (0, 1);
    let (a, b, c, d) = (@0x0, 0, false, b"");
 
    () = ();
    (x, y) = if (cond) (1, 2) else (3, 4);
    (a, b, c, d) = (@0x1, 1, true, b"1");
  }
 
  fun examples_with_function_calls() {
    let () = returns_unit();
    let (x, y): (bool, bool) = returns_2_values();
    let (a, b, c, d) = returns_4_values(&0);
 
    () = returns_unit();
    (x, y) = returns_2_values();
    (a, b, c, d) = returns_4_values(&1);
  }
}
```

有关更多详细信息，请参阅 [Move 变量](https://aptos.dev/en/build/smart-contracts/book/variables)。

## 子类型化

与引用一起，元组是 Move 中唯一具有[子类型化](https://en.wikipedia.org/wiki/Subtyping)的其他类型。元组具有子类型化，仅在它们与引用（以协变形式）具有子类型化关系的意义上。

例如：

```move
script {
  fun example() {
    let x: &u64 = &0;
    let y: &mut u64 = &mut 1;

    // (&u64, &mut u64) 是 (&u64, &u64) 的子类型
    // 因为 &mut u64 是 &u64 的子类型
    let (a, b): (&u64, &u64) = (x, y);

    // (&mut u64, &mut u64) 是 (&u64, &u64) 的子类型
    // 因为 &mut u64 是 &u64 的子类型
    let (c, d): (&u64, &u64) = (y, y);

    // 错误！(&u64, &mut u64) 不是 (&mut u64, &mut u64) 的子类型
    // 因为 &u64 不是 &mut u64 的子类型
    let (e, f): (&mut u64, &mut u64) = (x, y);
  }
}
```

## 所有权

如上所述，元组值在运行时实际上并不存在。并且由于这个原因，目前它们不能存储到局部变量中（但很可能这个功能很快就会到来）。因此，目前元组只能被移动，因为复制它们首先需要将它们放入局部变量中。


测试代码

```move
module base::test{

    #[test_only]
    use std::string;
    #[test_only]
    use std::debug::print;
    /// false
const EFALSE:u64 = 1;

    #[test]
    fun test_assignment(){
        let  test_assignment = string::utf8(b"########################## test assignment ##########################");
        print(&test_assignment);
        let arithmetic = string::utf8(b"----- Assignment 'string' to str, expeced string -----");
        print(&arithmetic);
        let str = string::utf8(b"string");
        print(&str);

        let arithmetic = string::utf8(b"----- Assignment '10' to num, expeced 10 -----");
        print(&arithmetic);
        let num = 10;
        print(&num);

        let arithmetic = string::utf8(b"----- Assignment 'true' to bool, expeced true -----");
        print(&arithmetic);
        let flag = true;
        print(&flag);

    }
    #[test]
    fun test_comparison(){
        let  test_calc = string::utf8(b"########################## test comparison ##########################");
        print(&test_calc);

        let comparison = string::utf8(b"----- Comparison (2 > 3) expected false -----");
        print(&comparison);
        let result = (2 > 3);
        print(&result);

        // assert!( !result,EFALSE);
        let comparison = string::utf8(b"----- Comparison (2 < 3) expected true -----");
        print(&comparison);
        let result = (2 < 3);
        print(&result);

        let comparison = string::utf8(b"----- Comparison (8 <= 3) expected false -----");
        print(&comparison);
        let result = (8 <= 3);
        print(&result);

        let comparison = string::utf8(b"----- Comparison (8 >= 3) expected false -----");
        print(&comparison);
        let result = (8 <= 3);
        print(&result);

        let comparison = string::utf8(b"----- Comparison (2 == 3) expected false -----");
        print(&comparison);
        let result = (2 == 3);
        print(&result);
    }
    #[test]
    fun test_calc() {
        let  test_calc = string::utf8(b"########################## test calc ##########################");
        print(&test_calc);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 + 5) expected 22-----");
        print(&arithmetic);
        let result = ( 17 + 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 - 5) expected 12----- [don't (4 - 17), ERROR: Subtraction overflow]");
        print(&arithmetic);
        let result = ( 17 - 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 * 5) expected 85-----");
        print(&arithmetic);
        let result = ( 17 * 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 / 5) expected 3-----");
        print(&arithmetic);
        let result = ( 17 / 5);
        print(&result);
        let num = 5;
        print(&num);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 % 5) expected 2-----");
        print(&arithmetic);
        let result = ( 17 % 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 | 5) expected 21 [OR]-----");
        print(&arithmetic);
        let result = ( 17 | 5);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  1  0  0  0  1  ---- 17
        //   0  0  0  0  0  1  0  1  ---- 5
        //   0  0  0  1  0  1  0  1  --- 21
        // 0 OR 0 = 0
        // 0 OR 1 = 1
        // 1 OR 0 = 1
        // 1 OR 1 = 1

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 & 5) expected 1 [AND]-----");
        print(&arithmetic);
        let result = ( 17 & 5);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  1  0  0  0  1  ---- 17
        //   0  0  0  0  0  1  0  1  ---- 5
        //   0  0  0  0  0  0  0  1  ---- 1
        // 0 OR 0 = 0
        // 0 OR 1 = 0
        // 1 OR 0 = 0
        // 1 OR 1 = 1

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 ^ 5) expected 20 [XOR]-----");
        print(&arithmetic);
        let result = ( 17 ^ 5);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  1  0  0  0  1  ---- 17
        //   0  0  0  0  0  1  0  1  ---- 5
        //   0  0  0  1  0  1  0  0  ---- 20
        // 0 XOR 0 = 0
        // 0 XOR 1 = 1
        // 1 XOR 0 = 1
        // 1 XOR 1 = 0

        let arithmetic = string::utf8(b"----- Arithmetic !( 17 < 5) expected true [NOT]-----");
        print(&arithmetic);
        let result = !( 17 < 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( true && false) expected false [Logical AND] -----");
        print(&arithmetic);
        let result = ( true && false);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( true || false) expected true [Logical OR] -----");
        print(&arithmetic);
        let result = ( true || false);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic (11 << 2) expected 44 [Left Shift] -----");
        print(&arithmetic);
        let result:u8 = ( 11 << 2);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  0  1  0  1  1  ---- 11
        //                        ^  ----
        //                  ^  0  0  ---- 2 shift
        //   0  0  1  0  1  1  0  0  ---- 44

        let arithmetic = string::utf8(b"----- Arithmetic (11 >> 2) expected 2 [Right Shift] -----");
        print(&arithmetic);
        let result:u8 = ( 11 >> 2);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  0  1  0  1  1          ---- 11
        //                        ^          ----
        //   0  0  0  0  0  0  1  0  1  1    ---- 2 shift
        //   0  0  0  0  0  0  1  0          ---- 2

        // -------------

    }
}
```



```move
module 0x42::example {
	 #[test_only]
    use std::string;
    #[test_only]
    use std::debug::print;
    /// false
	const EFALSE:u64 = 1;

    #[test]
    fun test_assignment(){
        let  test_assignment = string::utf8(b"#translate");
        print(&test_assignment);
    }
    

  fun examples(cond: bool) {
    let () = ();
    let (x, y): (u8, u64) = (0, 1);
    let (a, b, c, d) = (@0x0, 0, false, b"");

    () = ();
    (x, y) = if (cond) (1, 2) else (3, 4);
    (a, b, c, d) = (@0x1, 1, true, b"1");
  }

  fun examples_with_function_calls() {
    let () = returns_unit();
    let (x, y): (bool, bool) = returns_2_values();
    let (a, b, c, d) = returns_4_values(&0);

    () = returns_unit();
    (x, y) = returns_2_values();
    (a, b, c, d) = returns_4_values(&1);
  }
}
```
