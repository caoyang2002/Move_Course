# `Box<T>`堆对象分配
关于作者帅不帅，估计争议还挺多的，但是如果说`Box<T>`是不是Rust中最常见的智能指针，那估计没有任何争议。因为`Box<T>`允许你将一个值分配到堆上，然后在栈上保留一个智能指针指向堆上的数据。

之前我们在[所有权章节](https://course.rs/basic/ownership/ownership.html#栈stack与堆heap)简单讲过堆栈的概念，这里再补充一些。

## Rust中的堆栈
高级语言Python/Java等往往会弱化堆栈的概念，但是要用好C/C++/Rust，就必须对堆栈有深入的了解，原因是两者的内存管理方式不同: 前者有GC垃圾回收机制， 因此无需你去关心内存的细节。

栈内存从高位地址向下增长，且栈内存是连续分配的，一般来说**操作系统对栈内存的大小都有限制**，因此C语言中无法创建任意长度的数组。在Rust中, `main`线程的[栈大小是`8MB`](https://zhuanlan.zhihu.com/p/446039229)，普通线程是`2MB`，然后在函数调用时会在其中创建一个临时栈空间，调用结束后Rust会让这个栈空间里的对象自动进入`Drop`流程，最后栈顶指针自动移动到上一个调用栈顶，无需程序员手动干预，因而栈内存申请和释放是非常高效的。

与栈相反，堆上内存则是从低位地址向上增长，**堆内存通常只受物理内存限制**，而且通常是不连续的, 因此从性能的角度看，栈往往比对堆更高。

相比其它语言，Rust堆上对象还有一个特殊之处，它们都拥有一个所有者，因此受所有权规则的限制：当赋值时，发生的是所有权的转移(只需浅拷贝栈上的引用或智能指针即可)， 例如以下代码：
```rust
fn main() {
    let b = foo("world");
    println!("{}", b);
}

fn foo(x: &str) -> String {
    let a = "Hello, ".to_string() + x;
    a
}
```

在`foo`函数中，`a`是`String`类型，它其实是一个智能指针结构体，该智能指针存储在函数栈中，指向堆上的字符串数据。当被从`foo`函数转移给`main`中的`b`变量时，栈上的智能指针被复制一份赋予给`b`，而底层数据无需发生改变，这样就完成了所有权从`foo`函数内部到`b`的转移.

#### 堆栈的性能
很多人可能会觉得栈的性能肯定比堆高，其实未必。 由于我们在后面的性能专题会专门讲解堆栈的性能问题，因此这里就大概给出结论:

- 小型数据，在栈上的分配性能和读取性能都要比堆上高
- 中型数据，栈上分配性能高，但是读取性能和堆上并无区别，因为无法利用寄存器或CPU高速缓存，最终还是要经过一次内存寻址
- 大型数据，只建议在堆上分配和使用

总之栈的分配速度肯定比堆上快，但是读取速度往往取决于你的数据能不能放入寄存器或CPU高速缓存。 因此不要仅仅因为堆上性能不如栈这个印象，就总是优先选择栈，导致代码更复杂的实现。

## Box的使用场景
由于`Box`是简单的封装，除了将值存储在堆上外，并没有其它性能上的损耗。而性能和功能往往是鱼和熊掌，因此`Box`相比其它智能指针，功能较为单一，可以在以下场景中使用它:

- 特意的将数据分配在堆上
- 数据较大时，又不想在转移所有权时进行数据拷贝
- 类型的大小在编译期无法确定，但是我们又需要固定大小的类型时
- 特征对象，用于说明对象实现了一个特征，而不是某个特定的类型

以上场景，我们在本章将一一讲解，后面车速较快，请系好安全带。

## 使用`Box<T>`将数据存储在堆上
如果一个变量拥有一个数值`let a = 3`, 那变量`a`必然是存储在栈上的，那如果我们想要`a`的值存储在堆上就需要使用`Boxt<T>`: 
```rust
fn main() {
    let a = Box::new(3);
    println!("a = {}", a); // a = 3
    
    // 下面一行代码将报错
    // let b = a + 1; // cannot add `{integer}` to `Box<{integer}>`
}
```

这样就可以创建一个智能指针指向了存储在堆上的`5`，并且`a`持有了该指针。在本章的引言中，我们提到了智能指针往往都实现了`Deref`和`Drop`特征，因此：

- `println!`可以正常打印出`a`的值，是因为它隐式的调用了`Deref`对智能指针`a`进行了解引用
- 最后一行代码`let b = a + 1`报错，是因为在表达式中，我们无法自动隐式的执行`Deref`解引用操作, 你需要使用`*`操作符`let b = *a + 1`，来显式的进行解引用
- `a`持有的智能指针将在作用结束(`main`函数结束)时，被释放掉，这是因为`Box<T>`实现了`Drop`特征

以上的例子在实际代码中其实很少会存在，因为将一个简单的值分配到堆上并没有太大的意义。将其分配在栈上，由于寄存器、CPU缓存的原因，它的性能将更好，而且代码可读性也更好。


## Box::leak