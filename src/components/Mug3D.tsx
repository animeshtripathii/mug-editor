
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Mug3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create mug geometry
    const createMug = () => {
      const group = new THREE.Group();

      // Mug body (cylinder)
      const bodyGeometry = new THREE.CylinderGeometry(1, 1.1, 2, 32);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 30
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Mug handle
      const handleGeometry = new THREE.TorusGeometry(0.6, 0.1, 8, 16, Math.PI);
      const handleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 30
      });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.position.set(1.2, 0, 0);
      handle.rotation.z = Math.PI / 2;
      handle.castShadow = true;
      group.add(handle);

      // Mug interior
      const interiorGeometry = new THREE.CylinderGeometry(0.9, 0.95, 1.8, 32);
      const interiorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6,
        shininess: 50
      });
      const interior = new THREE.Mesh(interiorGeometry, interiorMaterial);
      interior.position.y = 0.1;
      group.add(interior);

      return group;
    };

    const mug = createMug();
    scene.add(mug);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf1f5f9,
      transparent: true,
      opacity: 0.8
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    scene.add(plane);

    camera.lookAt(mug.position);

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Rotate the mug slowly
      mug.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '384px' }}
    />
  );
};

export default Mug3D;
