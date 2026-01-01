import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  // 1. 后端接口文档地址（必填）
  input: 'http://localhost:8080/api/v3/api-docs', 
  // 2. 生成代码存放位置
  output: 'src/api',
  // 3. 使用的请求库，Vue 3 推荐用 axios
  client: 'axios',
});