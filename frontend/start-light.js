#!/usr/bin/env node

// Script de inicio ligero para evitar problemas de memoria
process.env.NODE_OPTIONS = '--max-old-space-size=1024';
process.env.VITE_LEGACY_BUILD = 'false';

const { spawn } = require('child_process');

console.log('🚀 Iniciando Seiki Chat Frontend (modo ligero)...');
console.log('💾 Límite de memoria: 1GB');
console.log('⚡ Optimizaciones activadas');

const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=1024',
    VITE_LEGACY_BUILD: 'false'
  }
});

child.on('error', (err) => {
  console.error('❌ Error al iniciar:', err);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`📦 Proceso terminado con código: ${code}`);
  process.exit(code);
});

// Manejo de señales para limpiar recursos
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidor...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo servidor...');
  child.kill('SIGTERM');
});

