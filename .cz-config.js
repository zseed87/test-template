'use strict';
module.exports = {
  types: [
    {value: 'build',    name: 'build: 主要目的是修改项目构建系统(例如 webpack，server 的配置等)的提交'},
    {value: 'ci',    name: 'ci: 主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交'},
    {value: 'docs',     name: 'docs: 文档更新'},
    {value: 'feat',     name: 'feat: 新增功能或文件'},
    {value: 'update',     name: 'update: 修改功能或文件'},
    {value: 'del',     name: 'del: 删除文件'},
    {value: 'merge',     name: 'merge: 合并文件'},
    {value: 'fix',      name: 'fix: bug 修复，有tpad缺陷请直接把缺陷标题作为subject（主题）提交'},
    {value: 'perf',     name: 'perf: 性能优化'},
    {value: 'refactor', name: 'refactor: 重构(既不是增加feature，也不是修复bug)'},
    {value: 'style',    name: 'style: 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)'},
    {value: 'test',     name: 'test: 新增测试用例或是更新现有测试'},
    {value: 'revert',   name: 'revert: 回滚某个更早之前的提交'},
    {value: 'chore',    name: 'chore: 不属于以上类型的其他类型'},
  ],
  scopes: [
    {name: 'components'},
    {name: 'hooks'},
    {name: 'layouts'},
    {name: 'models'},
    {name: 'pages'},
    {name: 'router'},
    {name: 'store'},
    {name: 'tests'},
    {name: 'util'},
  ],
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选: empty为不选，custom为自定义):',
    // used if allowCustomScopes is true
    // customScope: 'Denote the SCOPE of this change:',
    subject: '短说明:\n',
    // body: '请输入详细描述，使用"|"换行(可选)：\n',
    // breaking: '非兼容性说明 (可选):\n',
    // footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)'
  },
  allowCustomScopes: true,
  // allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'breaking', 'footer'],
  // limit subject length, commitlint默认是72
  subjectLimit: 72
};