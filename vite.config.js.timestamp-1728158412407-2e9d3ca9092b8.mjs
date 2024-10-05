// vite.config.js
import { defineConfig } from "file:///C:/Users/shubh/OneDrive/Desktop/startup/BHARAT_LINKER/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/shubh/OneDrive/Desktop/startup/BHARAT_LINKER/node_modules/@vitejs/plugin-react-swc/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      // This allows access from your mobile device
      port: 5173,
      // Vite will run on this port to avoid conflict with your backend
      proxy: {
        "/socket.io": {
          target: isDevelopment ? "http://localhost:12000" : "https://chat-box-server-4k6v.vercel.app/",
          // Production backend
          changeOrigin: true,
          secure: !isDevelopment,
          ws: true
        }
      }
    },
    root: "."
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzaHViaFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHN0YXJ0dXBcXFxcQkhBUkFUX0xJTktFUlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc2h1YmhcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxzdGFydHVwXFxcXEJIQVJBVF9MSU5LRVJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3NodWJoL09uZURyaXZlL0Rlc2t0b3Avc3RhcnR1cC9CSEFSQVRfTElOS0VSL3ZpdGUuY29uZmlnLmpzXCI7XG4vLyBpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbi8vIGltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuXG4vLyBleHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuLy8gICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4vLyAgIGJ1aWxkOiB7XG4vLyAgICAgb3V0RGlyOiAnZGlzdCdcbi8vICAgfVxuLy8gfSk7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgaXNEZXZlbG9wbWVudCA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCc7XG5cbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiAnMC4wLjAuMCcsIC8vIFRoaXMgYWxsb3dzIGFjY2VzcyBmcm9tIHlvdXIgbW9iaWxlIGRldmljZVxuICAgICAgcG9ydDogNTE3MywgLy8gVml0ZSB3aWxsIHJ1biBvbiB0aGlzIHBvcnQgdG8gYXZvaWQgY29uZmxpY3Qgd2l0aCB5b3VyIGJhY2tlbmRcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvc29ja2V0LmlvJzoge1xuICAgICAgICAgIHRhcmdldDogaXNEZXZlbG9wbWVudFxuICAgICAgICAgICAgPyAnaHR0cDovL2xvY2FsaG9zdDoxMjAwMCcgIC8vIFlvdXIgbG9jYWwgYmFja2VuZCBzZXJ2ZXJcbiAgICAgICAgICAgIDogJ2h0dHBzOi8vY2hhdC1ib3gtc2VydmVyLTRrNnYudmVyY2VsLmFwcC8nLCAgLy8gUHJvZHVjdGlvbiBiYWNrZW5kXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHNlY3VyZTogIWlzRGV2ZWxvcG1lbnQsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9vdDogJy4nLFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBV0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sZ0JBQWdCLFNBQVM7QUFFL0IsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxjQUFjO0FBQUEsVUFDWixRQUFRLGdCQUNKLDJCQUNBO0FBQUE7QUFBQSxVQUNKLGNBQWM7QUFBQSxVQUNkLFFBQVEsQ0FBQztBQUFBLFVBQ1QsSUFBSTtBQUFBLFFBQ047QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
