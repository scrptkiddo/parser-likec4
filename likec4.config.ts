import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'parser-likec4',
  title: 'LikeC4 Architecture Diagrams',
  exclude: [
    'node_modules/**',
    'dist/**',
    '.git/**'
  ],
  // Configure consistent layout behavior
  layout: {
    // Use consistent spacing and layout settings
    direction: 'TopBottom', 
    rankSep: 1.5,
    nodeSep: 1.2
  }
})