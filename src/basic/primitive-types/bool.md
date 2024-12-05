# 布尔


`bool` 是 Move 中用于布尔 `true` 和 `false` 值的基本类型。

## 字面值

`bool` 的字面值要么是 `true` 要么是 `false`。

## 操作符

### 逻辑

`bool` 支持三种逻辑操作：

| 语法   | 描述    | 等效表达式                              |
| ---- | ----- | ---------------------------------- |
| `&&` | 短路逻辑与 | `p && q` 等效于 `if (p) q else false` |
| \|   | 短路逻辑或 | p  \|  q 等效于 `if (p) true else q`  |
| `!`  | 逻辑非   | `!p` 等效于 `if (p) false else true`  |

### 控制流

`bool` 值在 Move 的几个控制流结构中使用：

- [`if (bool) {... }`](https://aptos.dev/en/build/smart-contracts/book/conditionals)
- [`while (bool) {.. }`](https://aptos.dev/en/build/smart-contracts/book/loops)
- [`assert!(bool, u64)`](https://aptos.dev/en/build/smart-contracts/book/abort-and-assert)

## 所有权

与该语言内置的其他标量值相同，布尔值是可以隐式复制的，这意味着它们可以在没有诸如 [`copy`](https://aptos.dev/en/build/smart-contracts/book/variables#move-and-copy) 这样的显式指令的情况下被复制。

