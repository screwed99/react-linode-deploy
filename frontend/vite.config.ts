import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '..');
  const env = loadEnv(mode, envDir, '');
  
  const frontendPort = parseInt(env.FRONTEND_PORT) || 80;
  const apiHost = env.API_HOST || 'localhost';
  const apiPort = env.API_PORT || 8000;

  return {
    plugins: [
      react(),
      VitePWA({ 
        registerType: 'autoUpdate',
        manifest: {
          name: 'Rock App',
          short_name: 'Rock',
          description: 'A solid full-stack PWA',
          theme_color: '#242424',
          icons: [
              {
                  src: 'rock.svg', // References public/rock.svg
                  sizes: '192x192',
                  type: 'image/svg+xml'
              },
              {
                  src: 'rock.svg',
                  sizes: '512x512',
                  type: 'image/svg+xml'
              }
          ]
        }
      })
    ],
    server: {
      port: frontendPort,
      host: true,
      proxy: {
        '/api': {
          target: `http://${apiHost}:${apiPort}`,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})