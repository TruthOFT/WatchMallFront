import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: "src/components.d.ts",
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 设置 @ 指向 src 目录
    },
  },
});
