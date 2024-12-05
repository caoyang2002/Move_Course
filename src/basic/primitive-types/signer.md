# 签名者

`signer` 是 Move 内置的资源类型。`signer` 是一种 [能力](https://en.wikipedia.org/wiki/Object-capability_model)，允许持有者代表特定的 `address` 行事。您可以将原生实现视为：

```move
module 0x1::signer {  
	struct signer has drop {
		a: address 
	}
}
```

`signer` 有点类似于 Unix 中的 [UID](https://en.wikipedia.org/wiki/User_identifier)，因为它代表通过 Move 之外的代码（例如，通过检查加密签名或密码）进行对用户身份的验证。

## 与 `address` 的比较

Move 程序可以使用地址字面值在没有特殊权限的情况下创建任何 `address` 值：

```move
script {
  fun example() {
    let a1 = @0x1;
    let a2 = @0x2;
    //... 以及其他所有可能的地址  
  }
}
```

然而，`signer` 值是特殊的，因为它们不能通过字面值或指令创建——只能由 Move VM 创建。在 VM 运行具有 `signer` 类型参数的脚本之前，它将自动创建 `signer` 值并将它们传递到脚本中：

```move
script {
    use std::signer;
    fun main(s: signer) {
        assert!(signer::address_of(&s) == @0x42, 0);
    }
}
```

如果此脚本是从除 `0x42` 以外的任何地址发送的，则该脚本将以代码 `0` 中止。

只要 `signer` 是任何其他参数的前缀，Move 脚本就可以有任意数量的 `signer`。换句话说，所有的 `signer` 参数都必须排在前面：

```move
script {
    use std::signer;
    fun main(s1: signer, s2: signer, x: u64, y: u8) {
        // ...
    }
}
```

这对于实现 **多签脚本** 非常有用，这些脚本可以以多个参与方的权威进行原子操作。例如，上述脚本的扩展可以在 `s1` 和 `s2` 之间执行原子货币交换。

## 5.2 `signer` 操作符

`std::signer` 标准库模块为 `signer` 值提供了两个实用函数：

| 函数                                    | 描述                                                  |
| ------------------------------------------- | ------------------------------------------------------------ |
| `signer::address_of(&signer): address`      | 返回此 `&signer` 所封装的 `address`。              |
| `signer::borrow_address(&signer): &address` | 返回对此 `&signer` 所封装的 `address` 的引用。 |

此外，`move_to<T>(&signer, T)` [全局存储操作符](https://aptos.dev/en/build/smart-contracts/book/global-storage-operators) 需要一个 `&signer` 参数，以便在 `signer.address` 的账户下发布资源 `T`。这确保只有经过身份验证的用户才能选择在其 `address` 下发布资源。

## 5.3 所有权

与简单的标量值不同，`signer` 值不可复制，这意味着它们不能通过任何操作进行复制，无论是通过显式的 [`copy`](https://aptos.dev/en/build/smart-contracts/book/variables#move-and-copy) 指令还是通过 [解引用 `*`](https://aptos.dev/en/build/smart-contracts/book/references#reading-and-writing-through-references)。

