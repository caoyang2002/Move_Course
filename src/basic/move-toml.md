# Move.toml 格式讲解

通过 `aptos move init` 创建的项目会默认配置 `Move.toml` 如下：

```toml
[package]
name = "test-move"
version = "1.0.0"
authors = []

[addresses]

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "testnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]
```

## `[package]` 包

`name = "test-move"`： 定义了包的名称为 "test-move"。
`version = "1.0.0"`：定义了包的版本号为 "1.0.0"。
`authors = []`： 定义了包的作者列表，当前为空。

## `[addresses]` 地址

定义了一个空的 "addresses" 部分，通常用于定义智能合约的账户地址。目前为定义。

可以使用键值对的形式定义

```toml
my_address = "0x12300example"
```

## `[dev-addresses]` 开发环境的地址

定义了一个空的 "dev-addresses" 部分，通常用于定义开发环境智能合约的账户地址。

可以使用键值对的形式定义

```toml
my_address = "0x12300example"
```

## `[dependencies.AptosFramework]` 依赖

`git = "https://github.com/aptos-labs/aptos-core.git"`： 指定了依赖 "AptosFramework" 的来源是一个 Git 仓库。

`rev = "testnet"`：指定了依赖的 Git 仓库的特定提交（revision）为 "testnet"。

`subdir = "aptos-move/framework/aptos-framework"`： 指定了依赖的子目录路径，表明 "AptosFramework" 位于仓库中的这个路径下。

