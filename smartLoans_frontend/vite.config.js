import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    testTimeout: 10000,
    coverage: {
      provider: 'v8',  // or 'istanbul' (experimental)
      reporter: ['text', 'html', 'json', 'lcov'], // Generate different report formats
      exclude: ['node_modules/', 'dist/', 'tests/', 'vitest.config.js'], // Exclude irrelevant files
      all: true, // Include files even if not tested
    },
  },
})