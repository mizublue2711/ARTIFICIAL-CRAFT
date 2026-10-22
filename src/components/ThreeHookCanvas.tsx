import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHookCanvas({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 14);

    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse parallax tilt
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Material definitions
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x5322ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const slateMat = new THREE.MeshStandardMaterial({
      color: 0x121218,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true,
    });

    const cyanMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    // 1. Central "Craft vs Artificial" Dual Polyhedron Mesh
    const innerGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const outerGeo = new THREE.IcosahedronGeometry(4.5, 2);

    const innerMesh = new THREE.Mesh(innerGeo, slateMat);
    const outerMesh = new THREE.Mesh(outerGeo, wireframeMat);
    const accentMesh = new THREE.Mesh(innerGeo, cyanMat);
    accentMesh.scale.set(1.05, 1.05, 1.05);

    mainGroup.add(innerMesh);
    mainGroup.add(outerMesh);
    mainGroup.add(accentMesh);

    // 2. Futuristic Floating Grid Floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x5322ff, 0x27272a);
    gridHelper.position.y = -5;
    if (gridHelper.material instanceof THREE.Material) {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.4;
    }
    mainGroup.add(gridHelper);

    // 3. Node Points (Connected Nodes Matrix)
    const nodeCount = isMobile ? 60 : 140;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeScales = new Float32Array(nodeCount);

    for (let i = 0; i < nodeCount; i++) {
      const radius = 6 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      nodePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nodePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nodePositions[i * 3 + 2] = radius * Math.cos(phi);
      nodeScales[i] = Math.random() * 0.15 + 0.05;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.25,
      transparent: true,
      opacity: 0.8,
    });

    const nodesPoints = new THREE.Points(nodeGeo, nodeMat);
    mainGroup.add(nodesPoints);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const purplePointLight = new THREE.PointLight(0x5322ff, 12, 30);
    purplePointLight.position.set(5, 5, 5);
    scene.add(purplePointLight);

    const cyanPointLight = new THREE.PointLight(0x00e5ff, 8, 25);
    cyanPointLight.position.set(-5, -3, 4);
    scene.add(cyanPointLight);

    // Mouse Interaction / Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetMouseX = (x / container.clientWidth) * 2 - 1;
      targetMouseY = -(y / container.clientHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Rotate 3D meshes smoothly
      innerMesh.rotation.x = elapsedTime * 0.15;
      innerMesh.rotation.y = elapsedTime * 0.2;

      outerMesh.rotation.x = -elapsedTime * 0.1;
      outerMesh.rotation.y = elapsedTime * 0.12;

      accentMesh.rotation.x = elapsedTime * 0.18;
      accentMesh.rotation.z = elapsedTime * 0.1;

      nodesPoints.rotation.y = elapsedTime * 0.03;

      // Parallax group rotation
      mainGroup.rotation.y = mouseX * 0.3;
      mainGroup.rotation.x = -mouseY * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeo.dispose();
      outerGeo.dispose();
      nodeGeo.dispose();
      wireframeMat.dispose();
      slateMat.dispose();
      cyanMat.dispose();
      nodeMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full min-h-[300px] ${className}`} />;
}
