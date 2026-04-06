# step log

## step 1

- 文件: `src/views/product/Index.vue`
- 改动目标: `sku` 属性改为下拉选择，提交时发送 `atrvId`
- 主要改动:
  - 将原 `attributeValueIdsInput` 文本输入改为按属性动态渲染下拉框（尺寸/颜色/网络）
  - 新增属性数据结构与选择状态（`selectedAtrvIds`）
  - 新增属性列表加载逻辑，优先走 `listAtrValue`，接口失败时回退到默认 JSON
  - 提交时将每个 `sku` 的选择值转换为 `attributeValueIds` 数组（即 `atrvId`）

## step 2

- 文件: `src/views/product/Index.vue`
- 改动目标: 图片改为手动上传，先暂存，提交时统一上传
- 主要改动:
  - 图片区域由“图片地址输入”改为 `a-upload` 选择本地文件
  - 选择文件后仅暂存（`pendingFile`），并显示文件名和本地预览，不自动上传
  - 点击提交时调用 `uploadFile` 逐张上传，拿到 URL 后再组装 `images` 提交商品
  - 新增图片清空、删除、重置、页面卸载时的预览 URL 释放逻辑，避免内存泄漏

## step 3

- 文件: `src/views/product/Index.vue`
- 需求: 提交时改为调用 `src/api/productController.ts` 的 `addProduct`
- 结果: 已满足，无需改动
  - 当前已从 `@/api/productController` 引入 `addProduct`
  - 当前提交逻辑为 `const res = await addProduct(payload)`

## step 4

- 文件: `src/views/product/Index.vue`
- 改动目标: 修复提交时 `attributeValueIds` 丢失导致属性值未入参的问题
- 主要改动:
  - `selectedAtrvIds` 的值类型扩展为 `number | string | undefined`，兼容下拉组件返回字符串 id 的场景
  - `getSelectedAttributeValueIds` 增加字符串数字解析、有效 id 过滤与去重，避免属性值被误过滤
  - `normalizeSkus` 保留条件改为“`skuCode/skuName` 或 `attributeValueIds` 任一存在即提交”，修复仅选择属性值时 SKU 被过滤的问题

## step 5

- 文件: `src/views/product/Index.vue`
- 改动目标: 兼容“官方示例”和“实际返回”两种属性数据格式，确保选择中文后提交对应 id
- 主要改动:
  - 新增属性数据归一化函数，统一兼容 `atrId/atrName/atrValue` 与 `id/name/value` 等字段
  - 支持 `atrValue` 为数组或 JSON 字符串两种形态，统一映射为下拉 `label/value`
  - 清理提交链路中的调试 `console.log`，避免干扰排查

## step 6

- 文件: `src/views/product/Index.vue`
- 改动目标: 按要求改为 `listAtrValue` 返回数据直接 `v-for` 渲染，不做任何额外处理
- 主要改动:
  - 删除属性数据归一化相关函数与类型
  - `fetchAtrValueList` 成功后直接 `atrValueLst.value = res.data ?? []`

## step 7

- 文件: `src/views/product/Index.vue`
- 改动目标: 修复提交 payload 缺失 `attributeValueIds`
- 主要改动:
  - 属性值下拉的 `value` 改为字符串 id，避免 `Long` 大整数在前端被安全整数判断过滤
  - `getSelectedAttributeValueIds` 改为保留数字字符串（并去重），不再做 `safeInteger` 丢弃
  - 组装 sku 时始终写入 `attributeValueIds` 字段

## step 8

- 文件: `src/views/product/Index.vue`
- 改动目标: 将 sku 图片从手动输入 URL 改为本地选择上传
- 主要改动:
  - sku 图片字段由 `a-input` 改为 `a-upload`，支持选择本地图片、显示文件名和本地预览
  - 新增 sku 图片暂存状态（`pendingImageFile`）与预览 URL 管理
  - 提交时为每个有效 sku 调用 `uploadFile` 上传图片，再将返回 URL 写入 `skus`
  - 补充 sku 图片清空、删除、重置和页面卸载时的预览 URL 释放逻辑

## step 9

- 文件: `src/views/product/List.vue`
- 改动目标: 新增商品列表页，先用假数据支撑分页查询、编辑、删除
- 主要改动:
  - 新增商品列表页面，内置本地 mock 数据
  - 增加查询表单，支持按商品名称/编码、分类、状态筛选
  - 使用 `a-table` 实现分页展示，并支持切换每页条数、快速跳页
  - 增加编辑弹窗和删除确认，便于后续替换为真实接口

- 文件: `src/router/index.ts`
- 改动目标: 挂载商品列表路由
- 主要改动:
  - 新增 `/product/list` 路由指向商品列表页
  - 将原商品新增页路由命名调整为 `ProductCreate`

- 文件: `src/layouts/BasicLayout.vue`
- 改动目标: 增加商品列表菜单入口
- 主要改动:
  - 侧边栏新增“商品列表”入口
  - 调整选中态逻辑，区分商品列表和商品添加两个页面

## step 10

- 文件: `src/views/product/Index.vue`
- 改动目标: 将卖点从文本输入改为可维护多个 `label/value` 对象
- 主要改动:
  - 卖点区域改为动态表单，支持新增、删除多组 `label` 和 `value`
  - 新增卖点数组状态与归一化逻辑，过滤全空项并校验 `label/value` 必须同时填写
  - 提交时将卖点数组通过 `JSON.stringify` 转成字符串后写入 `payload.feature`
  - 重置表单时恢复为一条空卖点输入行
