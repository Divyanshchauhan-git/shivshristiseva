// vite.config.ts
import { defineConfig } from "file:///C:/Users/divya/OneDrive/shivshristiseva/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/divya/OneDrive/shivshristiseva/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { viteSingleFile } from "file:///C:/Users/divya/OneDrive/shivshristiseva/frontend/node_modules/vite-plugin-singlefile/dist/esm/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/divya/OneDrive/shivshristiseva/frontend/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [react(), ...mode === "preview" ? [viteSingleFile()] : []],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)) } },
  build: {
    outDir: mode === "preview" ? "dist-preview" : "dist",
    sourcemap: mode !== "preview",
    rollupOptions: mode === "preview" ? {} : {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          icons: ["lucide-react"]
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkaXZ5YVxcXFxPbmVEcml2ZVxcXFxzaGl2c2hyaXN0aXNldmFcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGRpdnlhXFxcXE9uZURyaXZlXFxcXHNoaXZzaHJpc3Rpc2V2YVxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZGl2eWEvT25lRHJpdmUvc2hpdnNocmlzdGlzZXZhL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgdml0ZVNpbmdsZUZpbGUgfSBmcm9tICd2aXRlLXBsdWdpbi1zaW5nbGVmaWxlJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJztcblxuLy8gYC0tbW9kZSBwcmV2aWV3YCBwcm9kdWNlcyBhIHNpbmdsZSBzZWxmLWNvbnRhaW5lZCBIVE1MIGZpbGUgKGhhc2ggcm91dGluZyxcbi8vIGlubGluZWQgYXNzZXRzKSBmb3Igc3RhdGljIGRlbW8gaG9zdGluZy4gVGhlIGRlZmF1bHQgYnVpbGQgaXMgYSBub3JtYWxcbi8vIGNvZGUtc3BsaXQgU1BBIGludGVuZGVkIHRvIHNpdCBiZWhpbmQgYSBDRE4gd2l0aCBoaXN0b3J5LUFQSSBmYWxsYmFjay5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCAuLi4obW9kZSA9PT0gJ3ByZXZpZXcnID8gW3ZpdGVTaW5nbGVGaWxlKCldIDogW10pXSxcbiAgcmVzb2x2ZTogeyBhbGlhczogeyAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSB9IH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBtb2RlID09PSAncHJldmlldycgPyAnZGlzdC1wcmV2aWV3JyA6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6IG1vZGUgIT09ICdwcmV2aWV3JyxcbiAgICByb2xsdXBPcHRpb25zOlxuICAgICAgbW9kZSA9PT0gJ3ByZXZpZXcnXG4gICAgICAgID8ge31cbiAgICAgICAgOiB7XG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAgICAgcmVhY3Q6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAgICAgICBpY29uczogWydsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFUsU0FBUyxvQkFBb0I7QUFDM1csT0FBTyxXQUFXO0FBQ2xCLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsZUFBZSxXQUFXO0FBSGdMLElBQU0sMkNBQTJDO0FBUXBRLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsU0FBUyxDQUFDLE1BQU0sR0FBRyxHQUFJLFNBQVMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBRTtBQUFBLEVBQ3BFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUMsRUFBRSxFQUFFO0FBQUEsRUFDNUUsT0FBTztBQUFBLElBQ0wsUUFBUSxTQUFTLFlBQVksaUJBQWlCO0FBQUEsSUFDOUMsV0FBVyxTQUFTO0FBQUEsSUFDcEIsZUFDRSxTQUFTLFlBQ0wsQ0FBQyxJQUNEO0FBQUEsTUFDRSxRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixPQUFPLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2hELE9BQU8sQ0FBQyxjQUFjO0FBQUEsUUFDeEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ1I7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
