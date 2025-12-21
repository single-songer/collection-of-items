// 初始化 marked（启用安全模式）
marked.setOptions({
  sanitize: false, // 注意：仅用于本地，生产环境需xss 过滤
  breaks: true,
  highlight: function (code,lang) {
    // 简易高亮（可替换为Prism.js）
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
const markdownInput = document.getElementById('markdown-input');
const preview = document.querySelector('.preview');
const themeToggle = document.getElementById('theme-toggle');
const exportBtn = document.getElementById('export-btn');
function renderPreview(){
  const markdown = markdownInput.value;
  preview.innerHTML = marked.parse(markdown);
  localStorage.setItem('blog-draft', markdown);
}

function toggleTheme(){ 
  const isDark = document.body.classList.contains('dark-theme');
  document.body.classList.toggle('dark-theme', !isDark);
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function exportHTML(){
  const title = prompt('请输入文章标题：', '我的博客');
  const content = preview.innerHTML;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
    body{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;line-height: 1.6;max-width: 800px;margin:40px auto;padding:0 20px; 
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .pre{
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }
      .code{
        font-family: "Fira Code", monospace;
      }
    </style>
  </head>
  <body>
    ${content}
  </body>
  </html>
  </html>
  `
  // 下载文件
  const bolb = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(bolb);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function init(){
  const saveDraft = localStorage.getItem('blog-draft');
  if(saveDraft){
    markdownInput.value = saveDraft;
    renderPreview();
  }
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme){
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
  }
}
// 事件绑定
markdownInput.addEventListener('input', renderPreview);
themeToggle.addEventListener('click', toggleTheme);
exportBtn.addEventListener('click', exportHTML);
init()