import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import vue from '@vitejs/plugin-vue'; // vue 插件
// import AutoImport from 'unplugin-auto-import/vite'; // 自动导入的 API 来源包
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'; // Ant Design Vue 解析器
import Components from 'unplugin-vue-components/vite'; // 自动导入 components 下面的组件
import { type ConfigEnv, defineConfig, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression'; // gzip
import { createHtmlPlugin } from 'vite-plugin-html'; // 自动注入 html
import viteCleanPlugin from 'vite-plugin-clean'; // 自动删除旧 dist
import { viteMockServe } from 'vite-plugin-mock'; // mock服务
// import importToCDN from 'vite-plugin-cdn-import'; // cdn 引入
// import viteImagemin from 'vite-plugin-imagemin'; // 图片压缩
import { visualizer } from 'rollup-plugin-visualizer'; // 打包分析
import tailwindcss from '@tailwindcss/vite'; // tailwindcss

// https://devtools.vuejs.org/getting-started/introduction
import vueDevTools from 'vite-plugin-vue-devtools'; // vue devtools

export default ({ command, mode }: ConfigEnv) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const {
    VITE_APP_TITLE,
    VITE_BASE_URL,
    VITE_APP_API_HOST,
    VITE_VERSION,
    VITE_PORT,
    VITE_DROP_CONSOLE,
    VITE_DROP_DEBUGGER,
    VITE_USE_MOCK,
    VITE_DELETE_ORIGIN_FILE
  } = env;
  const IS_PRODUCTION = ['production'].includes(mode);
  // 入口文件
  const ENTRY_FILE = '/src/main.ts';

  console.log(`🚀 command: ${command}`);
  console.log(`🚀 mode: ${mode}`);
  console.log('🚀 loadEnv: ', env);

  return defineConfig({
    root: root, // 项目根目录
    base: VITE_BASE_URL, // 网站地址前缀
    mode: IS_PRODUCTION ? 'production' : 'development',
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION)
    }, // 定义全局变量静态替换
    publicDir: 'public', // 静态资源文件夹
    server: {
      host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      port: parseInt(VITE_PORT),
      open: true, //是否自动打开浏览器
      cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
      hmr: true, // 开启热更新
      // 代理跨域：/api → 去掉前缀 → 转发到后端
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@views': resolvePath('src/views'),
        '@utils': resolvePath('src/utils')
      }
    },
    build: {
      target: 'modules', // 浏览器兼容目标，如es2015
      // target: 'es2015',
      outDir: 'dist', // 输出目录
      assetsDir: 'assets', // 静态资源目录
      chunkSizeWarningLimit: 2000,
      // assetsInlineLimit: 4096, // 资源内联阈值
      // cssCodeSplit: true, // 开启css拆分
      // sourcemap: false,
      // 消除打包大小超过 500kb 警告
      // chunkSizeWarningLimit: 2000,
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      // reportCompressedSize: false,
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: IS_PRODUCTION ? 'terser' : 'esbuild', // 压缩 boolean | 'terser' | 'esbuild' 默认esbuild
      // 在打包代码时移除 console.log、debugger 和 注释
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE === 'true', // 生产环境去除 console
          drop_debugger: VITE_DROP_DEBUGGER === 'true', // 生产环境去除 debugger
          pure_funcs: Object.keys(console) // 这里保留 console.error，其他如 log、warn、info 等都会被移除
            .filter(item => !['error'].includes(item))
            .map(item => `console.${item}`)
        }
      },
      // 自定义底层 Rollup 打包配置
      rollupOptions: {
        output: {
          // 自定义输出文件命名规则
          // sourcemap: mode !== 'production', // 开发环境启用，生产环境禁用
          // 动态导入（code-splitting）生成的 chunk 文件名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          // 入口文件（如 main.js）的输出文件名
          entryFileNames: 'assets/js/[name]-[hash].js',
          // 静态资源（如图片、字体、CSS 等）的输出文件名
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 手动分包：将常用第三方库单独打包成 vendor chunk，利于缓存和加载优化
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia', 'ant-design-vue']
            // vendor: ['@vueuse/core', 'nprogress', 'file-saver', 'await-to-js']
          }
        }
        // 外部化第三方库，避免打包重复 - CDN优化（所有环境都启用）
        // external: ['vue', 'vue-router', 'pinia', 'axios', 'dayjs', 'echarts', 'lodash']
      },
      // 动态 import() 中使用变量时的处理选项（如 import(`./views/${name}.vue`)）
      dynamicImportVarsOptions: {
        warnOnError: true, // 当解析动态导入变量失败时是否抛出警告（设为 true 可帮助排查问题）
        exclude: [], // 排除不参与动态分析的文件（glob 模式），默认为空
        include: ['src/views/**/*.vue'] // 仅包含这些路径下的文件进行动态导入分析（提高构建性能）
      }
    },

    plugins: [
      // 自定义插件：构建时更新version.json
      {
        name: 'update-version',
        // 在构建开始时执行
        buildStart() {
          // 仅在打包命令时执行（command为build）
          if (command !== 'build') return;
          const versionPath = path.resolve(root, 'public/version.json');
          try {
            // 读取现有的version.json文件
            const version = JSON.parse(readFileSync(versionPath, 'utf-8'));
            // 更新时间戳
            version.timestamp = Date.now();
            // 写回文件
            writeFileSync(versionPath, JSON.stringify(version, null, 2));
            console.log('✅ 已更新version.json的时间戳');
          } catch (error) {
            console.error('❌ 更新version.json失败:', error);
          }
        }
      },
      // 启用 Vue 3 的 Vite 插件，用于编译 .vue 单文件组件（SFC）
      vue(),
      // 启用 Vue DevTools 插件，便于在开发过程中使用 Vue 开发者工具进行调试
      vueDevTools(),
      // 启用 Tailwind CSS 的 Vite 插件，用于自动添加和优化 Tailwind CSS 类
      tailwindcss(),
      // 启动mock服务
      // 在 viteMockServe 配置中添加判断逻辑
      viteMockServe({
        supportTs: true,
        mockPath: 'src/mock', // mock 文件路径
        watchFiles: true, // 测试环境建议开启实时更新（修改 mock 文件后无需重启服务）
        logger: true, // 测试环境可开启日志，方便调试
        // 忽略某些路径，不进行 Mock 拦截
        ignore: /^\/api/,
        localEnabled: VITE_USE_MOCK === 'true', // 开发环境启用
        prodEnabled: VITE_USE_MOCK === 'true', // 生产环境也启用
        injectCode: `
          import { setupProdMockServer } from '@/mock';
          setupProdMockServer();
        `
      }),
      // 使用 createHtmlPlugin 动态生成或注入数据到 HTML 模板中
      createHtmlPlugin({
        minify: true,
        entry: ENTRY_FILE,
        // template: 'index.html',
        inject: {
          data: {
            // VITE_BASE_URL,
            title: VITE_APP_TITLE
            // cdnCss: isProduction ? cdn.css : [],
            // cdnJs: isProduction ? cdn.js : []
          }
        }
      }),
      // 配置自动删除旧 dist
      viteCleanPlugin({
        targetFiles: ['/dist'] // 要删除的目录/文件
      }),
      // 自动导入的 API 来源包
      // AutoImport({
      //   dts: 'src/types/auto-imports.d.ts', // 自动生成的类型声明文件路径
      //   imports: ['vue', 'vue-router', '@vueuse/core', 'pinia']
      // }),
      // 自动导入 components 下面的组件，无需 import 引入
      Components({
        dts: 'src/types/components.d.ts', //配置文件生成位置,默认情况下启用,如果为true,表示默认生成到根目录文件下,false为不生成该文件,这里我没有安装ts,生成ts文件发现并没有报错,测试打包发现也没有报错
        dirs: ['src/components'], // 指定组件位置,默认指定文件夹是src/components 自动导入的组件目录
        extensions: ['vue', 'tsx'], // 组件的有效文件扩展名
        deep: true, // 搜索子目录
        directoryAsNamespace: false,
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // 不引入样式
            resolveIcons: true // 自动引入图标
          })
        ]
      }),
      // 压缩gzip
      viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用插件
        algorithm: 'gzip', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        ext: '.gz', // 压缩后的文件名后缀
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240B = 10KB
        deleteOriginFile: VITE_DELETE_ORIGIN_FILE === 'true' // 压缩后是否删除原文件
      }),
      // CDN引入配置 - 所有环境都启用
      // importToCDN({
      //   modules: []
      // }),
      // 打包分析
      visualizer({
        emitFile: true,
        open: true, // 自动打开生成的分析报告
        gzipSize: true, // 显示 gzip 压缩后的大小
        brotliSize: true, // 显示 brotli 压缩后的大小
        filename: 'visualizer/stats.html' // 分析图生成的文件名及路径
      })
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        '@vueuse/core',
        'echarts',
        'lodash-es',
        '@ant-design/icons-vue',
        'ant-design-vue',
        'dayjs',
        'file-saver',
        'tailwindcss'
      ]
    },
    css: {
      // CSS预处理器的配置选项
      preprocessorOptions: {
        // 针对SCSS预处理器的具体配置
        scss: {
          // 指定SCSS编译器使用的API版本或类型。可选值有'modern-compiler'、'modern'或'legacy'
          // 'modern-compiler'通常表示使用更高效的现代编译器API，'legacy'则表示使用传统的编译器API。
          // 修复：Deprecation Warning：The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0
          api: 'modern-compiler'
          // 全局注入 SCSS 公共代码，无需在每个 SCSS 文件中手动@import/@use变量、混合器（mixin）
          // additionalData: `
          //   @use "@styles/variables.scss" as *; @use "@styles/mixin.scss" as *;
          // `
        }
      },
      // 配置 PostCSS 的插件
      postcss: {
        plugins: [
          {
            /**
             * 自定义PostCSS插件：移除CSS中的@charset声明
             * 作用：
             * 1. 解决部分老浏览器解析@charset + UTF-8字符时的兼容问题（如样式错乱）
             * 2. 现代浏览器默认以UTF-8解析CSS，无需显式声明@charset
             * 3. 精简CSS文件体积，避免不必要的字符编码声明
             */
            // 插件名称标识（PostCSS规范要求，用于调试和日志输出）
            postcssPlugin: 'internal:charset-removal',
            /**
             * 处理CSS的AtRule（@规则）
             * AtRule类型包括：@charset、@media、@import、@keyframes等
             */
            AtRule: {
              // 匹配并删除@charset规则（如@charset "UTF-8";）
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  });
};

function resolvePath(paths: string) {
  return path.resolve(__dirname, paths);
}
