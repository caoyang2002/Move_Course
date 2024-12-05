# 向量

`vector<T>` 是 Move 提供的唯一原始集合类型。`vector<T>` 是 `T` 的同构集合，可以通过在“末尾”推入或弹出值来增加或减少。

`vector<T>` 可以用任何类型 `T` 实例化。例如，`vector<u64>`、`vector<address>`、`vector<0x42::MyModule::MyResource>` 和 `vector<vector<u8>>` 都是有效的向量类型。

## 字面值

### 通用 `vector` 字面值

任何类型的向量都可以使用 `vector` 字面值创建。

| 语法                   | 类型                                                                      | 描述                       |
| -------------------- | ----------------------------------------------------------------------- | ------------------------ |
| `vector[]`           | `vector[]: vector<T>` ，其中 `T` 是任何单个非引用类型                                | 一个空向量                    |
| `vector[e1,..., en]` | `vector[e1,..., en]: vector<T>` ，其中 `e_i: T` ，使得 `0 < i <= n` 且 `n > 0` | 一个具有 `n` 个元素（长度为 `n`）的向量 |

在这些情况下，`vector` 的类型是推断出来的，要么从元素类型推断，要么从向量的使用情况推断。如果类型无法推断，或者只是为了更清晰，可以明确指定类型：

```move
vector<T>[]: vector<T>vector<T>[e1,..., en]: vector<T>
```


#### 示例向量字面值

```move
script {  
  fun example() {    
    (vector[]: vector<bool>);    
    (vector[0u8, 1u8, 2u8]: vector<u8>);    
    (vector<u128>[]: vector<u128>);    
    (vector<address>[@0x42, @0x100]: vector<address>);  
  }
}
```



### `vector<u8>` 字面值

在 Move 中，向量的一个常见用例是表示“字节数组”，用 `vector<u8>` 表示。这些值通常用于加密目的，例如公钥或哈希结果。这些值非常常见，因此提供了特定的语法以使值更具可读性，而不必使用 `vector[]`，其中每个单独的 `u8` 值都以数字形式指定。

目前有两种支持的 `vector<u8>` 字面值类型，**字节字符串**和**十六进制字符串**。

#### 字节字符串

字节字符串是以 `b` 为前缀的引号字符串字面值，例如 `b"Hello!\n"` 。

这些是允许转义序列的 ASCII 编码字符串。目前，支持的转义序列是：

| 转义序列   | 描述                     |
| ------ | ---------------------- |
| `\n`   | 换行（或换行符）               |
| `\r`   | 回车                     |
| `\t`   | 制表符                    |
| `\\`   | 反斜杠                    |
| `\0`   | 空值                     |
| `\"`   | 引号                     |
| `\xHH` | 十六进制转义，插入十六进制字节序列 `HH` |

#### 十六进制字符串

十六进制字符串是以 `x` 为前缀的引号字符串字面值，例如 `x"48656C6C6F210A"` 。

每个字节对，范围从 `00` 到 `FF`，都被解释为十六进制编码的 `u8` 值。因此，每个字节对对应于生成的 `vector<u8>` 中的单个条目。

#### 示例字符串字面值

```move
script {
  fun byte_and_hex_strings() {
    assert!(b"" == x"", 0);
    assert!(b"Hello!\n" == x"48656C6C6F210A", 1);
    assert!(b"\x48\x65\x6C\x6C\x6F\x21\x0A" == x"48656C6C6F210A", 2);
    assert!(
        b"\"Hello\tworld!\"\n \r \\Null=\0" ==
            x"2248656C6C6F09776F726C6421220A200D205C4E756C6C3D00",
        3
    );
  }
}
```

## 操作

通过 Move 标准库中的 `std::vector` 模块为 `vector` 提供了若干操作，如下所示。随着时间推移，可能会添加更多操作。关于 `vector` 的最新文档可在此处找到。

`vector` 通过 Move 标准库中的 `std::vector` 模块提供了若干操作，如下所示。随着时间的推移，可能会添加更多操作。关于 `vector` 的最新文档可在 [此处](https://github.com/aptos-labs/aptos-core/blob/main/aptos-move/framework/move-stdlib/doc/vector.mdx#0x1_vector) 找到。

| 函数       | 描述                                                  | 是否会引发异常？           |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------ |
| `vector::empty<T>(): vector<T>`                              | 创建一个可以存储 `T` 类型值的空向量     | 从不                                      |
| `vector::is_empty<T>(): bool`                                | 如果向量 `v` 没有元素则返回 `true`，否则返回 `false`  | 从不                                      |
| `vector::singleton<T>(t: T): vector<T>`                      | 创建一个大小为 1 且包含 `t` 的向量                     | 从不                                      |
| `vector::length<T>(v: &vector<T>): u64`                      | 返回向量 `v` 的长度                          | 从不                                      |
| `vector::push_back<T>(v: &mut vector<T>, t: T)`              | 将 `t` 添加到 `v` 的末尾                                    | 从不                                      |
| `vector::pop_back<T>(v: &mut vector<T>): T`                  | 移除并返回 `v` 中的最后一个元素                    | 如果 `v` 为空                            |
| `vector::borrow<T>(v: &vector<T>, i: u64): &T`               | 返回索引 `i` 处的 `T` 的不可变引用        | 如果 `i` 不在范围内                    |
| `vector::borrow_mut<T>(v: &mut vector<T>, i: u64): &mut T`   | 返回索引 `i` 处的 `T` 的可变引用           | 如果 `i` 不在范围内                    |
| `vector::destroy_empty<T>(v: vector<T>)`                     | 删除 `v`                                                   | 如果 `v` 不为空                        |
| `vector::append<T>(v1: &mut vector<T>, v2: vector<T>)`       | 将 `v2` 中的元素添加到 `v1` 的末尾                  | 从不                                      |
| `vector::reverse_append<T>(lhs: &mut vector<T>, other: vector<T>)` | 将 `other` 向量中的所有元素以在 `other` 中出现的相反顺序推送到 `lhs` 向量中 | 从不                                      |
| `vector::contains<T>(v: &vector<T>, e: &T): bool`            | 如果 `e` 在向量 `v` 中，则返回 `true`。否则，返回 `false` | 从不                                      |
| `vector::swap<T>(v: &mut vector<T>, i: u64, j: u64)`         | 交换向量 `v` 中索引为 `i` 和 `j` 的元素 | 如果 `i` 或 `j` 不在范围内             |
| `vector::reverse<T>(v: &mut vector<T>)`                      | 原地反转向量 `v` 中元素的顺序 | 从不                                      |
| `vector::reverse_slice<T>(v: &mut vector<T>, l: u64, r: u64)` | 原地反转向量 `v` 中 `[l, r)` 范围内元素的顺序 | 从不                                      |
| `vector::index_of<T>(v: &vector<T>, e: &T): (bool, u64)`     | 如果 `e` 在向量 `v` 中且位于索引 `i` 处，则返回 `(true, i)`。否则，返回 `(false, 0)` | 从不                                      |
| `vector::insert<T>(v: &mut vector<T>, i: u64, e: T)`         | 在位置 `0 <= i <= length` 插入一个新元素 `e`，使用 `O(length - i)` 时间 | 如果 `i` 不在范围内                    |
| `vector::remove<T>(v: &mut vector<T>, i: u64): T`            | 移除向量 `v` 中索引为 `i` 的元素，并移动所有后续元素。这是 `O(n)` 操作且保留向量中元素的顺序 | 如果 `i` 不在范围内                    |
| `vector::swap_remove<T>(v: &mut vector<T>, i: u64): T`       | 将向量 `v` 中索引为 `i` 的元素与最后一个元素交换，然后弹出该元素，这是 `O(1)` 操作，但不保留向量中元素的顺序 | 如果 `i` 不在范围内                    |
| `vector::trim<T>(v: &mut vector<T>, new_len: u64): u64`      | 将向量 `v` 修剪为较小的大小 `new_len` 并按顺序返回被移除的元素 | 如果 `new_len` 大于 `v` 的长度 |
| `vector::trim_reverse<T>(v: &mut vector<T>, new_len: u64): u64` | 将向量 `v` 修剪为较小的大小 `new_len` 并以相反的顺序返回被移除的元素 | 如果 `new_len` 大于 `v` 的长度 |
| `vector::rotate<T>(v: &mut vector<T>, rot: u64): u64`        | `rotate(&mut [1, 2, 3, 4, 5], 2) -> [3, 4, 5, 1, 2]` 原地操作，返回分割点，例如在此示例中为 3 | 从不                                      |
| `vector::rotate_slice<T>(v: &mut vector<T>, left: u64, rot: u64, right: u64): u64` | 在原地旋转 `[left, right)` 范围内的切片，其中 `left <= rot <= right`，返回分割点 | 从不                                      |

示例

```move
script {
  use std::vector;

  fun example() {
    let v = vector::empty<u64>();
    vector::push_back(&mut v, 5);
    vector::push_back(&mut v, 6);

    assert!(*vector::borrow(&v, 0) == 5, 42);
    assert!(*vector::borrow(&v, 1) == 6, 42);
    assert!(vector::pop_back(&mut v) == 6, 42);
    assert!(vector::pop_back(&mut v) == 5, 42);
  }
}
```
### 销毁和复制向量
`vector<T>` 的某些行为取决于元素类型 `T` 的能力。例如，包含没有 `drop`能力的元素的向量不能像上面示例中的 `v` 那样被隐式舍弃 —— 它们必须使用 `vector::destroy_empty` 显式销毁。

请注意，除非 `vec` 包含零个元素，否则 `vector::destroy_empty` 将在运行时导致程序终止：

```move
script {
  fun destroy_any_vector<T>(vec: vector<T>) {
    vector::destroy_empty(vec) // 删除此行将导致编译器错误
  }
}
```

但对销毁包含具有 `drop` 的元素的向量不会发生错误：

```move
script {
  fun destroy_droppable_vector<T: drop>(vec: vector<T>) {
    // 有效！
    // 无需明确执行任何操作来销毁向量
  }
}
```

同样，除非元素类型具有 `copy`，否则向量不能被复制。换句话说，当且仅当 `T` 具有 `copy` 时，`vector<T>` 才具有 `copy` 。

有关更多详细信息，请参阅关于类型能力和泛型的部分。
on [type abilities](https://aptos.dev/en/build/smart-contracts/book/abilities) and [generics](https://aptos.dev/en/build/smart-contracts/book/generics).

## 所有权

如上文所述，只有当元素可以被复制时，`vector` 值才能被复制。