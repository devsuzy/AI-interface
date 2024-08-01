import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    envDir: './src/environments'
  })
}

/*
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"),
  }
  // resolve: {
  //   alias: [
  //     { find: "@", replacement: path.resolve(__dirname, "src") },
  //   ],
  // },
});
*/
