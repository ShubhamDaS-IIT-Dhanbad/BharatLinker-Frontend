
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist'
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // This allows access from your mobile device
      port: 5173, // Vite will run on this port to avoid conflict with your backend
      proxy: {
        '/socket.io': {
          target: isDevelopment
            ? 'http://localhost:12000'  // Your local backend server
            : 'https://chat-box-server-4k6v.vercel.app/',  // Production backend
          changeOrigin: true,
          secure: !isDevelopment,
          ws: true,
        },
      },
    },
    root: '.',
  };
});
