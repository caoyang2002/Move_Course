# 整数

Move 支持六种无符号整数类型：`u8`、`u16`、`u32`、`u64`、`u128`和`u256`。这些类型的值的范围从 0 到一个取决于类型大小的最大值。

| 类型               | 值范围               |
| ---------------- | ----------------- |
| 无符号8位整数，`u8`     | 0 到 $2^8 - 1$     |
| 无符号16位整数，`u16`   | 0 到 $2^{16} - 1$  |
| 无符号32位整数，`u32`   | 0 到 $2^{32} - 1$  |
| 无符号64位整数，`u64`   | 0 到 $2^{64} - 1$  |
| 无符号128位整数，`u128` | 0 到 $2^{128} - 1$ |
| 无符号256位整数，`u256` | 0 到 $2^{256} - 1$ |

## 字面量

这些类型的字面值可以指定为一系列数字（例如，`112`）或十六进制字面量，例如 `0xFF`。字面量的类型可以作为后缀可选添加，例如 `112u8`。如果没有指定类型，编译器将尝试根据字面量使用的上下文推断类型。如果类型无法推断，它被假定为 `u64`。

数字字面量可以通过下划线分隔以进行分组和提高可读性（例如，`1_234_5678`，`1_000u128`，`0xAB_CD_12_35`）。

>[!NOTE] 重点
>
>如果字面量太大，超出了指定（或推断）的大小范围，将报告错误。

### 示例

```move
script {
  fun example() {
    // literals with explicit annotations;
    let explicit_u8 = 1u8;
    let explicit_u16 = 1u16;
    let explicit_u32 = 1u32;
    let explicit_u64 = 2u64;
    let explicit_u128 = 3u128;
    let explicit_u256 = 1u256;
    let explicit_u64_underscored = 154_322_973u64;
 
    // literals with simple inference
    let simple_u8: u8 = 1;
    let simple_u16: u16 = 1;
    let simple_u32: u32 = 1;
    let simple_u64: u64 = 2;
    let simple_u128: u128 = 3;
    let simple_u256: u256 = 1;
 
    // literals with more complex inference
    let complex_u8 = 1; // inferred: u8
    // right hand argument to shift must be u8
    let _unused = 10 << complex_u8;
 
    let x: u8 = 38;
    let complex_u8 = 2; // inferred: u8
    // arguments to `+` must have the same type
    let _unused = x + complex_u8;
 
    let complex_u128 = 133_876; // inferred: u128
    // inferred from function argument type
    function_that_takes_u128(complex_u128);
 
    // literals can be written in hex
    let hex_u8: u8 = 0x1;
    let hex_u16: u16 = 0x1BAE;
    let hex_u32: u32 = 0xDEAD80;
    let hex_u64: u64 = 0xCAFE;
    let hex_u128: u128 = 0xDEADBEEF;
    let hex_u256: u256 = 0x1123_456A_BCDE_F;
  }
}
```

## 操作符

### 算术

这些类型都支持相同的一组检查算术操作。对于所有这些操作，两个参数（左右操作数）*必须*是相同的类型。如果您需要在不同类型的值上进行操作，您将需要首先执行[强制转换](https://aptos.dev/en/build/smart-contracts/book/integers#casting)。同样，如果您期望操作的结果对于整数类型来说太大，那么在执行操作之前先执行一个[强制转换](https://aptos.dev/en/build/smart-contracts/book/integers#casting)到更大的大小。

所有的算术操作都会中止而不是以数学整数不会表现出的方式（例如，溢出、下溢、除以零）。

| 语法  | 操作   | 中止条件         |
| --- | ---- | ------------ |
| `+` | 加法   | 结果对于整数类型来说太大 |
| `-` | 减法   | 结果小于零        |
| `*` | 乘法   | 结果对于整数类型来说太大 |
| `%` | 模除   | 除数是 `0`      |
| `/` | 截断除法 | 除数是 `0`      |

### 位运算

整数类型支持以下位运算，这些操作将每个数字视为一系列单独的位，可以是 `0` 或 `1`，而不是数值整数。

位运算不会中止。

| 语法  | 操作  | 描述            |
| --- | --- | ------------- |
| `&` | 位与  | 对每个位进行布尔与操作   |
| \|  | 位或  | 对每个位进行布尔或操作   |
| `^` | 位异或 | 对每个位进行布尔互斥或操作 |


### 位位移

与位运算类似，每种整数类型都支持位位移。但与其他操作不同，右侧操作数（要移位的位数）必须*总是*是 `u8`，并且不需要与左侧操作数（要移位的数字）匹配。

如果移位的位数大于或等于 `u8`、`u16`、`u32`、`u64`、`u128` 和 `u256` 分别的 `8`、`16`、`32`、`64`、`128` 或 `256`，位位移可以中止。

| 语法 | 操作     | 中止条件                                                    |
| ---- | -------- | ---------------------------------------------------------- |
| `<<` | 左移位   | 要移位的位数大于整数类型的大小                             |
| `>>` | 右移位   | 要移位的位数大于整数类型的大小                             |

### 比较

整数类型是Move中*唯一*可以使用比较运算符的类型。两个参数需要是相同的类型。如果您需要比较不同类型的整数，您将需要[强制转换](https://aptos.dev/en/build/smart-contracts/book/integers#casting)其中一个。

比较操作不会中止。

| 语法 | 操作                  |
| ---- | --------------------- |
| `<`  | 小于                  |
| `>`  | 大于                  |
| `<=` | 小于或等于            |
| `>=` | 大于或等于            |

### 等式

像Move中所有具有[`drop`](https://aptos.dev/en/build/smart-contracts/book/abilities)能力的类型一样，所有整数类型都支持[“等于”](https://aptos.dev/en/build/smart-contracts/book/equality)和[“不等于”](https://aptos.dev/en/build/smart-contracts/book/equality)操作。两个参数需要是相同的类型。如果您需要比较不同类型的整数，您将需要[强制转换](https://aptos.dev/en/build/smart-contracts/book/integers#casting)其中一个。

等式操作不会中止。

| 语法 | 操作    |
| ---- | ------- |
| `==` | 等于    |
| `!=` | 不等于 |

有关更多详细信息，请参见[等式](https://aptos.dev/en/build/smart-contracts/book/equality)部分。

## 强制转换

一种大小的整数类型可以强制转换为另一种大小的整数类型。

>[!TIP] 提示
>
>整数是 Move 中唯一支持强制转换的类型。

强制转换**不会**截断。如果结果对于指定的类型来说太大，强制转换将中止。

| 语法         | 操作                       | 中止条件             |
| ---------- | ------------------------ | ---------------- |
| `(e as T)` | 将整数表达式 `e` 强制转换为整数类型 `T` | `e` 太大，无法表示为 `T` |

这里，`e` 的类型必须是 `8`、`16`、`32`、`64`、`128` 或 `256`，而 `T` 必须是 `u8`、`u16`、`u32`、`u64`、`u128` 或 `u256`。

例如：

- `(x as u8)`
- `(y as u16)`
- `(873u16 as u32)`
- `(2u8 as u64)`
- `(1 + 3 as u128)`
- `(4/2 + 12345 as u256)`

## 所有权

如同该语言中内置的其他标量值，整数值是可以被隐式复制的，这意味着它们可以在没有诸如 [`copy`](https://aptos.dev/en/build/smart-contracts/book/variables#move-and-copy) 这样的显式指令的情况下被复制。
