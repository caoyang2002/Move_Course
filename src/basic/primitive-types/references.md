# 引用

Move 有两种引用类型：不可变的 `&` 和可变的 `&mut`。

不可变引用是只读的，不能修改原始值（或其任何字段）。可变引用允许通过该引用进行修改。Move 的类型系统执行所有权规则，以防止引用错误。

有关引用规则的更多详细信息，请参阅 [结构体和资源](https://aptos.dev/en/build/smart-contracts/book/structs-and-resources)

## 引用操作符

Move 提供了用于创建和扩展引用以及将可变引用转换为不可变引用的操作符。在此处和其他地方，我们使用符号 `e: T` 表示“表达式 `e` 具有类型 `T`”。

| 语法          | 类型                               | 描述                         |
| ----------- | -------------------------------- | -------------------------- |
| `&e`        | `&T` ，其中 `e: T` 且 `T` 是非引用类型     | 创建对 `e` 的不可变引用             |
| `&mut e`    | `&mut T` ，其中 `e: T` 且 `T` 是非引用类型 | 创建对 `e` 的可变引用。             |
| `&e.f`      | `&T` ，其中 `e.f: T`                | 创建对结构体 `e` 的字段 `f` 的不可变引用。 |
| `&mut e.f`  | `&mut T` ，其中 `e.f: T`            | 创建对结构体 `e` 的字段 `f` 的可变引用。  |
| `freeze(e)` | `&T` ，其中 `e: &mut T`             | 将可变引用 `e` 转换为不可变引用。        |

`&e.f` 和 `&mut e.f` 操作符既可以用于创建对结构体的新引用，也可以用于扩展现有引用：

```move
script {
  fun example() {
    let s = S { f: 10 };
    let f_ref1: &u64 = &s.f; // works
    let s_ref: &S = &s;
    let f_ref2: &u64 = &s_ref.f; // also works
  }
}
```

只要两个结构体在同一个模块中，具有多个字段的引用表达式就可以工作：

```move
module 0x42::example {
  struct A { b: B }
  struct B { c : u64 }
 
  fun f(a: &A): &u64 {
    &a.b.c
  }
}
```

最后，请注意不允许引用的引用：

```move
script {
  fun example() {
    let x = 7;
    let y: &u64 = &x;
    let z: &&u64 = &y; // will not compile
  }
}
```

## 通过引用读写

可变引用和不可变引用都可以读取以生成所引用值的副本。

只有可变引用可以写入。写入 `*x = v` 会舍弃之前存储在 `x` 中的值，并将其更新为 `v`。

这两个操作都使用类似 C 的 `*` 语法。但是，请注意读取是一个表达式，而写入是一个必须出现在等号左侧的修改操作。

| 语法     | 类型                                | 描述                         |
| ---------- | ----------------------------------- | ----------------------------------- |
| `*e`       | `T` ，其中 `e` 是 `&T` 或 `&mut T`   | 读取 `e` 所指向的值    |
| `*e1 = e2` | `()` ，其中 `e1: &mut T` 且 `e2: T` | 使用 `e2` 更新 `e1` 中的值。 |

为了读取引用，底层类型必须具有 [`copy` 能力](https://aptos.dev/en/build/smart-contracts/book/abilities)，因为读取引用会创建值的新副本。此规则防止资源值的复制：

```move
module 0x42::coin {
  struct Coin {} // Note does not have copy
 
  fun copy_resource_via_ref_bad(c: Coin) {
      let c_ref = &c;
      let counterfeit: Coin = *c_ref; // not allowed!
      pay(c);
      pay(counterfeit);
  }
}
```

反之：为了写入引用，底层类型必须具有 [`drop` 能力](https://aptos.dev/en/build/smart-contracts/book/abilities)，因为写入引用会舍弃（或“释放”）旧值。此规则防止资源值的销毁：

```move
module 0x42::coin {
  struct Coin {} // Note does not have drop
 
  fun destroy_resource_via_ref_bad(ten_coins: Coin, c: Coin) {
      let ref = &mut ten_coins;
      *ref = c; // not allowed--would destroy 10 coins!
  }
}
```


## `freeze` 推断

在期望不可变引用的上下文中可以使用可变引用：

```move
script {
  fun example() {
    let x = 7;
    let y: &u64 = &mut x;
  }
}
```

这是因为在幕后，编译器会在需要的地方插入 `freeze` 指令。以下是更多 `freeze` 推断实际应用的示例：

```move
module 0x42::example {
  fun takes_immut_returns_immut(x: &u64): &u64 { x }

  // 在返回值上进行 `freeze` 推断
  fun takes_mut_returns_immut(x: &mut u64): &u64 { x }

  fun expression_examples() {
    let x = 0;
    let y = 0;
    takes_immut_returns_immut(&x); // 没有推断
    takes_immut_returns_immut(&mut x); // 推断为 `freeze(&mut x)`
    takes_mut_returns_immut(&mut x); // 没有推断

    assert!(&x == &mut y, 42); // 推断为 `freeze(&mut y)`
  }

  fun assignment_examples() {
    let x = 0;
    let y = 0;
    let imm_ref: &u64 = &x;

    imm_ref = &x; // 没有推断
    imm_ref = &mut y; // 推断为 `freeze(&mut y)`
  }
}
```

### 子类型

通过这种 `freeze` 推断，Move 类型检查器可以将 `&mut T` 视为 `&T` 的子类型。如上所示，这意味着在任何使用 `&T` 值的表达式中，也可以使用 `&mut T` 值。此术语用于错误消息中，以简洁地指示在提供 `&T` 的地方需要 `&mut T` 。例如

```move
module 0x42::example {
  fun read_and_assign(store: &mut u64, new_value: &u64) {
    *store = *new_value
  }
 
  fun subtype_examples() {
    let x: &u64 = &0;
    let y: &mut u64 = &mut 1;
 
    x = &mut 1; // 有效
    y = &2; // 无效!
 
    read_and_assign(y, x); // 有效
    read_and_assign(x, y); // 无效!
  }
}
```

将产生以下错误消息

```error
error:
 
    ┌── example.move:12:9 ───
    │
 12 │         y = &2; // invalid!
    │         ^ Invalid assignment to local 'y'
    ·
 12 │         y = &2; // invalid!
    │             -- The type: '&{integer}'
    ·
  9 │         let y: &mut u64 = &mut 1;
    │                -------- Is not a subtype of: '&mut u64'
    │
 
error:
 
    ┌── example.move:15:9 ───
    │
 15 │         read_and_assign(x, y); // invalid!
    │         ^^^^^^^^^^^^^^^^^^^^^ Invalid call of '0x42::example::read_and_assign'. Invalid argument for parameter 'store'
    ·
  8 │         let x: &u64 = &0;
    │                ---- The type: '&u64'
    ·
  3 │     fun read_and_assign(store: &mut u64, new_value: &u64) {
    │                                -------- Is not a subtype of: '&mut u64'
    │
```

目前唯一具有子类型的其他类型是 [元组](https://aptos.dev/en/build/smart-contracts/book/tuples)

## 所有权

即使存在相同引用的现有副本或扩展，可变引用和不可变引用始终可以被复制和扩展：

```move
script {
  fun reference_copies(s: &mut S) {
    let s_copy1 = s; // 可以
    let s_extension = &mut s.f; // 也可以
    let s_copy2 = s; // 仍然可以
    // ...
  }
}
```

对于熟悉 Rust 所有权系统的程序员来说，这可能令人惊讶，因为 Rust 会拒绝上述代码。Move 的类型系统在 [副本](https://aptos.dev/en/build/smart-contracts/book/variables#move-and-copy) 的处理上更宽松，但在写入之前确保可变引用的唯一所有权方面同样严格。

### 引用不能存储

引用和元组是唯一不能作为结构体字段值存储的类型，这也意味着它们不能存在于全局存储中。Move 程序终止时，在程序执行期间创建的所有引用都将被销毁；它们完全是临时的。对于没有 `store` [能力](https://aptos.dev/en/build/smart-contracts/book/abilities) 的类型的值，此不变量也适用，但请注意，引用和元组从一开始就根本不允许在结构体中。

这是 Move 和 Rust 的另一个区别，Rust 允许在结构体中存储引用。

目前，Move 不支持这一点，因为引用不能 [序列化](https://en.wikipedia.org/wiki/Serialization)，但每个 Move 值都必须可序列化。此要求来自 Move 的[持久全局存储](https://aptos.dev/en/build/smart-contracts/book/global-storage-structure)，它需要对值进行序列化，以便在程序执行之间持久保存它们。

可以想象一个更复杂、更具表现力的类型系统，它允许在结构体中存储引用并且禁止这些结构体存在于全局存储中。我们也许可以允许在没有 `store` [能力](https://aptos.dev/en/build/smart-contracts/book/abilities) 的结构体中存在引用，但这并不能完全解决问题：Move 有一个相当复杂的用于跟踪静态引用安全性的系统，并且类型系统的这一方面也必须扩展以支持在结构体中存储引用。简而言之，Move 的类型系统（特别是围绕引用安全性的方面）必须扩展以支持存储引用。但随着语言的发展，我们一直在关注。