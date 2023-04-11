import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
    plugins: [tsconfigPaths()],
});
// para vitest entender importações que configurei por padrao com @ no tsconfig
