// 直接在全局作用域添加事件委托
document.addEventListener('click', function(event) {
  // 检查点击的是否是 toggle 按钮
  const toggle = event.target.closest('.toggle');
  if (!toggle) return;
  
  // 阻止默认行为
  event.preventDefault();
  event.stopPropagation();
  
  // 获取相关元素
  const chapterItem = toggle.parentElement;
  if (!chapterItem || !chapterItem.classList.contains('chapter-item')) {
      console.log('未找到正确的父元素');
      return;
  }
  
  // 记录操作到控制台
  console.log('点击了 toggle 按钮');
  console.log('章节项:', chapterItem);
  
  // 切换 expanded 类
  chapterItem.classList.toggle('expanded');
  
  // 获取并切换子列表的显示状态
  const nextElement = chapterItem.nextElementSibling;
  if (nextElement && nextElement.tagName.toLowerCase() === 'ol') {
      nextElement.style.display = 
          nextElement.style.display === 'none' ? 'block' : 'none';
      console.log('切换子列表显示状态:', nextElement.style.display);
  } else {
      console.log('没有找到子列表');
  }
  
  // 更新箭头旋转
  const arrow = toggle.querySelector('div');
  if (arrow) {
      arrow.style.transform = 
          chapterItem.classList.contains('expanded') ? 'rotate(90deg)' : '';
      console.log('更新箭头旋转');
  }
});

// 在页面加载时输出调试信息
document.addEventListener('DOMContentLoaded', function() {
  console.log('页面加载完成，开始初始化...');
  const items = document.querySelectorAll('.chapter-item');
  const toggles = document.querySelectorAll('.toggle');
  
  console.log('找到 chapter-item 数量:', items.length);
  console.log('找到 toggle 数量:', toggles.length);
  
  // 初始化子列表状态
  items.forEach((item, index) => {
      const nextEl = item.nextElementSibling;
      if (nextEl && nextEl.tagName.toLowerCase() === 'ol') {
          nextEl.style.display = 'none';
          console.log(`初始化第 ${index + 1} 个子列表为隐藏状态`);
      }
  });
});