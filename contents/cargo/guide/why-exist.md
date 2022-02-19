# 为何会有Cargo
根据之前学习的知识，Rust 有两种类型的包: `lib` 包和二进制包，前者是俗称的依赖包，用于被其它包所引入，而后者是一个应用服务，可以编译成二进制可执行文件进行运行。

包是通过 Rust 编译器 `rustc` 进行编译的:
```rust
$ rustc hello.rs
$ ./hello
Hello, world!
```

上面我们直接使用 `rustc` 对二进制包 `hello.rs` 进行编译，生成二进制可执行文件 `hello`，并对其进行运行。

上面的方式虽然简单，但是有几个问题：

- 必须要指定文件名编译，当 package 复杂后，这种编译方式也随之更加复杂
- 如果要指定编译参数，情况将更加复杂

最关键的是，外部依赖库的引入也将是一个大问题。大部分实际的项目都有不少依赖包，而这些依赖包又间接的依赖了新的依赖包，在这种复杂情况下，如何管理依赖包及其版本也成为一个相当棘手的问题。

正是因为这些原因，与其使用 `rustc` ，我们可以使用一个强大的包管理工具来解决问题：欢迎 `Cargo` 闪亮登场。

## Cargo 
`Cargo` 解决了之前描述的所有问题，同时它保证了每次重复的构建都不会改变上一次构建的结果，这背后是通过完善且强大的依赖包版本管理来实现的。

总之，`Cargo` 为了实现目标，做了四件事：

- 引入两个元数据文件，包含 `package` 的方方面面信息: `Cargo.toml` 和 `Cargo.lock`
- 获取和构建 `package` 的依赖，例如 `Cargo.toml` 中的依赖包版本描述，以及从 `crates.io` 下载包
- 调用 `rustc` (或其它编译器) 并使用的正确的参数来构建 `package`，例如 `cargo build`
- 引入一些惯例，让 `package` 的使用更加简单

毫不夸张的说，得益于 `Cargo` 的标准化，只要你使用它构建过一个项目，那构建其它使用 `Cargo` 的项目，也将不存在任何困难。