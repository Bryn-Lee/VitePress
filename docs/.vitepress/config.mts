import { defineConfig } from 'vitepress'
import AutoNavPlugin from 'vitepress-auto-nav-sidebar'
import { withMermaid } from 'vitepress-plugin-mermaid'

const { nav, sidebar } = AutoNavPlugin({
  ignoreFolders: ["node_modules", "assets", "public", ".vitepress", "attachments", ".obsidian", "utils"], // 需要排除的一些目录
  ignoreFiles: ['index'], // 需要排除的一些文件
  dirPrefix: '',
  filePrefix: '',
  showNavIcon:false,
  showSideIcon:false,
  isCollapse: true,
  collapsed: false,
  singleLayerNav:false,
  hiddenFilePrefix: '.',
  customParentFolderName: '目录'
})

export default withMermaid(defineConfig({
  title: "Unicenter Docs",
  description: "账户中心文档",
  markdown: {
    config: (md) => {
      // 创建 markdown-it 插件
      md.use((md) => {
        const defaultRender = md.render
        md.render = function (...args) {

          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          defaultContent = defaultContent
                .replace(/NOTE/g, '提醒')
				.replace(/INFO/g, '信息')
				.replace(/TIP|IMPORTANT/g, '提示')
				.replace(/WARNING|CAUTION/g, '警告')
				.replace(/DANGER/g, '危险')
          // 返回渲染的内容
          return defaultContent
        }
      })
    }
  },
//  lastUpdated: true, 
  themeConfig: {
    nav:nav,
    sidebar:sidebar,
	outline: {
      level: [1, 4],
    },
	outlineTitle: '大纲',
	docFooter: { // 自定义上下页名
      prev: '上一篇', next: '下一篇'
    },
	    //上次更新时间
//    lastUpdated: {
//      text: '上次更新时间',
//      formatOptions: {
//        dateStyle: 'short', // 可选值full、long、medium、short
//        timeStyle: 'medium' // 可选值full、long、medium、short
//      },
//    },
    logo: '/logo.svg',
    search: {
      provider: "local",
      options: {
        miniSearch: {
          options: {
            /* ... */
          },
          searchOptions: {
            /* ... */
          },
        },
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "没有找到结果",
            resetButtonTitle: "清除搜索条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    }
  
  }
})
)