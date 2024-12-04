## 建议 IDEA!

[IDEA](https://www.jetbrains.com/zh-cn/idea/buy/?section=discounts&billing=yearly) 有社区版（[IntelliJ IDEA Community](https://www.jetbrains.com/zh-cn/idea/download/?section=mac)），可以免费使用，

[RustRover](https://www.jetbrains.com/zh-cn/rust/buy/?section=personal&billing=yearly) 也可以，但是需要登录，IDEA 不需要登录

> 其他也可以使用 VSCode、Cursor 等，但是不推荐 zed，因为它没有任何 Move 语言相关的功能，包括语法高亮，（我尝试开发过 Zed 的 Move 插件，但是能力不够，社区对我的开发也好像不太有帮助，所以放弃了 ......）

本教程是基于 Aptos 制作的，所以后续的应用代码主要是 Move-Aptos，但是会附加介绍 Move-Sui、Move-Rooch 等。

## 安装 VSCode 的 Move 插件

在 VSCode 的左侧扩展目录里，搜索 `move syntax`,安装由 Damir Shamanaev 发布的插件 

> Sui 的插件，叫 `Move`，由 Mysten Labs 发布
>
> Rooch 似乎没有插件，可以用 `Move Language` 由 Move Language 发布

## 安装其它好用的插件

在此，再推荐大家几个好用的插件：

1. `Even Better TOML`，支持 .toml 文件完整特性
2. `Error Lens`, 更好的获得错误展示
3. `One Dark Pro`, 非常好看的 VSCode 主题
4. `CodeLLDB`, Debugger 程序

好了，至此，VSCode 的配置就已经全部结束，是不是很简单？下面让我们来用 `aptos` 创建一个 Rust 项目，然后用 VSCode 打开。
