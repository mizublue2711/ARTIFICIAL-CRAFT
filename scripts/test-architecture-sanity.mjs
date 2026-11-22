import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 [1/5] Running TypeScript compilation check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript: 0 errors.');
} catch (e) {
  console.error('❌ TypeScript compilation failed!');
  process.exit(1);
}

console.log('🔍 [2/5] Checking for illegal global overflow traps (App.tsx / main tag)...');
const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
if (appTsx.includes('overflow-x-hidden') || appTsx.includes('overflow-hidden')) {
  console.error('❌ Violation: Global <main> in src/App.tsx contains overflow classes that kill CSS position:sticky!');
  process.exit(1);
}
console.log('✅ Root layout scroll context is clean (no global overflow-hidden).');

console.log('🔍 [3/5] Checking for un-portaled full-screen modals...');
const blueprintTsx = fs.readFileSync('src/components/BlueprintLibrary.tsx', 'utf8');
const footerTsx = fs.readFileSync('src/components/Footer.tsx', 'utf8');
if (!blueprintTsx.includes('createPortal') || !footerTsx.includes('createPortal')) {
  console.error('❌ Violation: Modals must be wrapped in createPortal(..., document.body) to prevent transform clipping!');
  process.exit(1);
}
console.log('✅ Modals are safely anchored to document.body via React Portals.');

console.log('🔍 [4/5] Checking for vertical wheel interception...');
const carouselTsx = fs.readFileSync('src/components/home/WorkflowCarousel3D.tsx', 'utf8');
if (!carouselTsx.includes('Math.abs(e.deltaX) <= Math.abs(e.deltaY)')) {
  console.error('❌ Violation: WorkflowCarousel3D.tsx is missing vertical scroll pass-through condition!');
  process.exit(1);
}
console.log('✅ Wheel listeners cleanly release vertical scroll to window.');

console.log('🔍 [5/5] Checking WebGL & Canvas Viewport Culling...');
const filesRequiringCulling = [
  'src/components/playground/Monolith3DNode.tsx',
  'src/components/ParticleCanvas.tsx',
  'src/components/home/HeadlessSwarmSection.tsx',
  'src/components/ThreeHookCanvas.tsx',
];

for (const file of filesRequiringCulling) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('useInViewport')) {
    console.error(`❌ Violation: ${file} is missing useInViewport hook!`);
    process.exit(1);
  }
}
console.log('✅ All 4 WebGL/Canvas engines are guarded by useInViewport.');

console.log('\n🎉 ALL ARCHITECTURAL IMMUNIZATION GATES PASSED! READY FOR MOTION SCAFFOLDING.');
