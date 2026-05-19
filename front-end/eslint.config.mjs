// 从 URL 和路径模块中导入必要的功能
import fs, { readFileSync } from 'fs';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// 从 ESLint 插件中导入推荐配置
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';

// 使用 import.meta.url 获取当前模块的路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 .auto-import.json 文件的内容，并将其解析为 JSON 对象
// const autoImportConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.auto-import.json'), 'utf-8'));
// 读取 .auto-import.json 文件的内容，并将其解析为 JSON 对象
// let autoImportConfig = { globals: {} }; // 默认空配置
// // 异步读取 .auto-import.json 并添加错误处理
// (async () => {
//   try {
//     const filePath = path.resolve(process.cwd(), './.auto-import.json');
//     const data = await fs.readFile(filePath, 'utf8');
//     autoImportConfig = JSON.parse(data);
//   } catch (err) {
//     console.warn('未能加载 .auto-import.json:', err.message);
//   }
// })();

export default [
  // 指定文件匹配规则
  {
    // files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  // prettier 配置
  eslintPluginPrettierRecommended,
  // 指定全局变量和环境
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        NodeJS: 'readonly',
        __APP_VERSION__: 'readonly' // 定义 Vite 注入的全局变量
      }
    }
  },
  // 扩展配置
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // 自定义规则
  {
    // 针对所有 JavaScript、TypeScript 和 Vue 文件应用以下配置
    files: ['**/*.{js,mjs,cjs,ts,vue}'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // 确保这一行存在
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        // 合并从 autoImportConfig 中读取的全局变量配置
        // ...autoImportConfig.globals,
        // TypeScript 全局命名空间
        Api: 'readonly',
        Form: 'readonly'
      }
    },
    // env: {
    //   browser: true,
    //   node: true,
    //   es6: true,
    //   'vue/setup-compiler-macros': true
    // },
    // plugins: ['@typescript-eslint', 'vue', 'import', 'unused-imports'],
    plugins: {
      'import': importPlugin,
      'unused-imports': unusedImports,
      '@typescript-eslint': typescript, // 新增：注册@typescript-eslint插件
      'vue': pluginVue, // 新增：全局注册vue插件
      'prettier': eslintPluginPrettier
    },
    // extends: [
    //   './.auto-import.json', // 必须放在最前面
    //   'plugin:vue/vue3-recommended',
    //   'plugin:@typescript-eslint/recommended',
    //   'plugin:vue/vue3-essential',
    //   'plugin:import/recommended',
    //   'plugin:prettier/recommended',
    //   'eslint:recommended'
    // ],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    /**
     * "off" 或 0    ==>  关闭规则
     * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
     * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
     */
    rules: {
      // 你可以在这里覆盖或扩展规则
      // eslint (http://eslint.cn/docs/rules)
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': ['error', {}, { usePrettierrc: true }], // 使用 Prettier 格式化规则
      'quotes': ['error', 'single'], // 使用单引号
      'semi': ['error', 'always'], // 语句强制分号结尾
      'strict': 'error', //使用严格模式
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'prefer-const': 'warn', // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
      'no-undef': 'error', //不能有未定义的变量
      'no-unused-vars': 'off', // 禁止定义未使用的变量
      'no-unused-expressions': 'warn', // 禁止出现未使用过的表达式
      'no-use-before-define': 'off', // 禁止在 函数/类/变量 定义之前使用它们
      'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'export' }], // 在导出语句前必须有一个空行
      'eqeqeq': ['error', 'always'], // 必须使用全等 === !==
      'array-bracket-spacing': ['error', 'never'], // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
      'array-element-newline': 'off', // 强制数组元素间出现换行
      'sort-imports': [
        'error',
        {
          ignoreCase: true, // 排序时不区分大小写
          ignoreDeclarationSort: true, // 不检查多个 import 语句的顺序
          ignoreMemberSort: false // 检查单个 import 中成员的顺序
        }
      ], // 强制模块内的 import 排序

      // typeScript (https://typescript-eslint.io/rules)
      '@typescript-eslint/no-unused-vars': [
        'warn'
        // {
        //   argsIgnorePattern: '^_', // 忽略以 `_` 开头的参数
        //   varsIgnorePattern: '^_' // 忽略以 `_` 开头的变量
        // }
      ], // 禁止定义未使用的变量
      '@typescript-eslint/no-unused-expressions': 'warn', // 禁止出现未使用过的表达式
      '@typescript-eslint/no-use-before-define': 'warn', // 在定义变量之前禁止使用
      '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
      '@typescript-eslint/ban-ts-comment': 'error', // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
      '@typescript-eslint/no-inferrable-types': 'off', // 可以轻松推断的显式类型可能会增加不必要的冗长
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间
      '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 类型
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 要求在导出的函数和类的公共类方法上显式返回和参数类型
      '@typescript-eslint/ban-types': 'off', // 禁止使用特定类型
      '@typescript-eslint/no-var-requires': 'off', // 允许使用 require() 函数导入模块
      '@typescript-eslint/no-empty-function': 'off', // 禁止空函数
      '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)
      '@typescript-eslint/no-require-imports': 'off',

      // vue (https://eslint.vuejs.org/rules)
      'vue/no-undef-properties': 'error', // 禁止允许未定义的属性
      'vue/no-unused-vars': 'warn', // 禁止定义未使用的变量
      'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效
      'vue/v-slot-style': 'error', // 强制执行 v-slot 指令样式
      'vue/no-mutating-props': 'error', // 不允许改变组件 prop
      'vue/custom-event-name-casing': ['warn', 'kebab-case'], // 为自定义事件名称强制使用 kebab-case
      'vue/html-closing-bracket-newline': 'off', // 在标签的右括号之前要求或禁止换行
      'vue/attribute-hyphenation': 'error', // 对模板中的自定义组件强制执行属性命名样式：my-prop="prop"
      'vue/attributes-order': 'error', // vue api使用顺序，强制执行属性顺序
      'vue/no-v-html': 'off', // 禁止使用 v-html
      'vue/singleline-html-element-content-newline': 'off', // 关闭单行元素内容换行检查，交给 Prettier 处理
      'vue/require-default-prop': 'warn', // 该规则要求非必需 prop 必须有默认值
      'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always', // 对空元素要求自闭合
            normal: 'always', // 对普通元素不要求自闭合
            component: 'always' // 对组件要求自闭合
          },
          svg: 'never', // svg 标签要求自闭合
          math: 'always' // math 标签要求自闭合
        }
      ], // 这条规则用于强制 Vue 模板中的标签自闭合风格

      'import/newline-after-import': 'error', // 导入语句后必须有一个换行符
      'import/order': [
        'error',
        {
          'newlines-between': 'ignore', // 控制每组之间是否换行，'always'：每组之间必须有空行 'never'：不允许有空行 'always-and-inside-groups'：组内也要求空行 'ignore'：不限制空行
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'], // 定义 import 的分组顺序
          'alphabetize': {
            order: 'asc', // 按字母升序排序, 'ignore', 'asc', 'desc'
            caseInsensitive: false // 排序时区分大小写
          } // 对每组内的 import 成员进行字母排序
        }
      ],
      'import/no-unresolved': 'off', // 检查所有导入路径是否能被解析（即是否存在对应的文件）
      'import/namespace': 'off', // 确保从命名空间导入（import * as X from 'x'）时，使用的变量名确实存在于模块导出中
      'import/named': 'off', // 确保你在 import { name } 中引用的命名导出项，在模块中确实存在
      'import/no-named-as-default': 'off', // 防止将具名导出当作默认导出导入
      'import/no-duplicates': 'off', // 禁止重复的 import 语句

      'unused-imports/no-unused-imports': 'error', // 自动删除未使用的导入
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_', // 忽略 _ 开头的变量
          args: 'after-used', // 函数参数中只警告未使用的命名参数
          argsIgnorePattern: '^_' // 忽略 _ 开头的函数参数
        }
      ]
    }
  },
  // 新增：仅对非Vue的TS/JS文件设置TS解析器
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
    }
  },
  // vue 规则
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser, // 专门用于 .vue 文件
      parserOptions: {
        parser: tsParser, // 使用 TypeScript 解析器解析 <script> 部分
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    }
  },
  // 忽略文件
  {
    ignores: [
      'node_modules',
      'scripts',
      'dist',
      'public',
      'docs',
      'bin',
      'src/assets/**',
      'src/mock/**',
      'src/utils/console.ts',
      'src/**/*.js',
      '.vscode/**',
      '.idea',
      '.husky',
      '.local',
      '*.sh',
      '*.md',
      '*.woff',
      '*.ttf',
      '.prettierrc.cjs',
      '.stylelintrc.cjs',
      'eslint.config.mjs',
      'vite.config.ts',
      'stats.html'
    ]
  }
];
