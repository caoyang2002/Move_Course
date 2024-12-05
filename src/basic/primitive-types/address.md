# 地址

`address` 是 Move 中的一个内置类型，用于表示全局存储中的地址（有时称为账户）。`address` 值是一个 256 位（32 字节）的标识符。可以在指定的地址存储两个东西：[模块](https://aptos.dev/en/build/smart-contracts/book/modules-and-scripts) 和 [资源](https://aptos.dev/en/build/smart-contracts/book/structs-and-resources)。

尽管在底层 `address` 是一个 256 位整数，但 Move 的地址故意是不透明的 —— 它们不能通过整数创建，也不支持算术运算，并且不能被修改。即使可能有有趣的程序会使用这样的功能（例如，C 语言中的指针运算有着类似的作用），但 Move 不允许这种动态行为，因为它从一开始就被设计为支持静态验证。

您可以使用运行时地址值（`address` 类型的值）访问该地址的资源。您**不能**通过运行时的地址值访问模块。

## 地址及其语法

地址有两种类型，命名地址的或数字地址（字面量）。命名地址的语法遵循 Move 中任何命名标识符的规则。数字地址的语法不限于十六进制编码的值，任何有效的 [`u256` 数值](https://aptos.dev/en/build/smart-contracts/book/integers) 都可以用作地址值，例如，`42`、`0xCAFE` 和 `2021` 都是有效的数字地址字面值。

为了区分地址何时在表达式上下文中使用，使用地址的语法根据其使用的上下文而有所不同：

- 当地址用作表达式时，地址必须以 `@` 字符为前缀，即  [`@<数字值>`](https://aptos.dev/en/build/smart-contracts/book/integers) 或 `@<命名地址标识符>`。
- 在表达式上下文之外，地址可以不写前面的 `@` 字符，即  [`<数字值>`](https://aptos.dev/en/build/smart-contracts/book/integers) 或 `<命名地址标识符>`。

>[!TIP] 提示 
>一般来说，您可以将 `@` 视为将地址从命名空间转换为表达式的运算符。

## 命名地址

命名地址是一个功能，允许在使用地址的任何位置使用标识符代替数字值，而不仅仅是在值级别。命名地址在 Move 包中作为顶级元素（在模块和脚本之外）声明和绑定，或作为参数传递给 Move 编译器。

命名地址仅存在于源语言级别，并将在字节码级别完全替换为其值。因此，模块和模块成员**必须**通过模块的命名地址访问，而不是通过在编译期间分配给命名地址的数字值访问，例如，`use my_addr::foo` 与 `use 0x2::foo` 不等价，即使 Move 程序是使用 `my_addr` 设置为 `0x2` 进行编译的。这一区别在 [模块和脚本](https://aptos.dev/en/build/smart-contracts/book/modules-and-scripts) 部分有更详细的讨论。

### 示例

```move
script {
  fun example() {
    let a1: address = @0x1; // 简写表示 0x0000000000000000000000000000000000000000000000000000000000000001
    let a2: address = @0x42; // 简写表示 0x0000000000000000000000000000000000000000000000000000000000000042
    let a3: address = @0xDEADBEEF; // 简写表示 0x00000000000000000000000000000000000000000000000000000000DEADBEEF
    let a4: address = @0x000000000000000000000000000000000000000000000000000000000000000A;
    let a5: address = @std; // 将命名地址 `std` 的值赋给 `a5`
    let a6: address = @66;
    let a7: address = @0x42;
  }
}

module 66::some_module {   // 不在表达式上下文中，所以不需要 @
    use 0x1::other_module; // 不在表达式上下文中，所以不需要 @
    use std::vector;       // 可以使用命名地址作为命名空间项目时使用其他模块
    ...
}

module std::other_module {  // 可以使用命名地址作为命名空间项目来声明模块
    ...
}
```

## 全局存储操作

`address` 值的主要目的是与全局存储操作进行交互。

`address` 值与 `exists`、`borrow_global`、`borrow_global_mut` 和 `move_from` [操作](https://aptos.dev/en/build/smart-contracts/book/global-storage-operators) 一起使用。

唯一不使用 `address` 的全局存储操作是 `move_to`，它使用 [`signer`](https://aptos.dev/en/build/smart-contracts/book/signer)。

## 所有权

如同该语言中内置的其他标量值，`address` 值是可以被隐式复制的，这意味着它们可以在没有诸如 [`copy`](https://aptos.dev/en/build/smart-contracts/book/variables#move-and-copy) 这样的显式指令的情况下被复制。
