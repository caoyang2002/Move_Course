# 源码解析

在这里，我们将从源码的角度一起探寻 Move 的编译原理，但是一想到我不太熟悉 Move 也几乎刚学 Rust，这件事就变得异常有趣。

## move-compile 中的 mian() 函数

`move-compile/bin/build.rs`文件中定义了一个 main() 函数为入口函数

`move-compile/bin/check`