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
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4, 3, 6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Add rim light for better definition
    const rimLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Create realistic mug geometry
    const createMug = () => {
      const group = new THREE.Group();

      // Mug body using lathe geometry for smooth curves
      const mugProfile = [];
      const segments = 32;
      
      // Create a realistic mug profile
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = t * 3 - 1.5; // Height from -1.5 to 1.5
        
        let radius;
        if (t < 0.1) {
          // Bottom curve
          radius = 0.8 + (t * 2);
        } else if (t > 0.9) {
          // Top rim
          radius = 1.1 + (t - 0.9) * 0.2;
        } else {
          // Main body with slight taper
          radius = 1.0 + Math.sin(t * Math.PI) * 0.1;
        }
        
        mugProfile.push(new THREE.Vector2(radius, y));
      }

      const bodyGeometry = new THREE.LatheGeometry(mugProfile, 32);
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 60,
        specular: 0x222222
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Mug handle with better shape
      const handleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, 0.8, 0),
        new THREE.Vector3(1.6, 0.6, 0),
        new THREE.Vector3(1.7, 0, 0),
        new THREE.Vector3(1.6, -0.6, 0),
        new THREE.Vector3(1.2, -0.8, 0)
      ]);

      const handleGeometry = new THREE.TubeGeometry(handleCurve, 20, 0.08, 8, false);
      const handleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 60,
        specular: 0x222222
      });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.castShadow = true;
      group.add(handle);

      // Inner cavity
      const innerProfile = mugProfile.map(point => 
        new THREE.Vector2(Math.max(0.1, point.x - 0.1), point.y + 0.1)
      );
      const innerGeometry = new THREE.LatheGeometry(innerProfile, 32);
      const innerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2c3e50,
        shininess: 80,
        side: THREE.BackSide
      });
      const inner = new THREE.Mesh(innerGeometry, innerMaterial);
      inner.position.y = 0.05;
      group.add(inner);

      // Coffee/liquid surface
      const liquidGeometry = new THREE.CircleGeometry(0.9, 32);
      const liquidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8b4513,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });
      const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
      liquid.rotation.x = -Math.PI / 2;
      liquid.position.y = 1.2;
      group.add(liquid);

      // Rim highlight
      const rimGeometry = new THREE.TorusGeometry(1.15, 0.03, 8, 32);
      const rimMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe8e8e8,
        shininess: 100
      });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.position.y = 1.4;
      rim.castShadow = true;
      group.add(rim);

      return group;
    };

    const mug = createMug();
    scene.add(mug);

    // Ground plane with better material
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xf1f5f9,
      transparent: true,
      opacity: 0.6
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Add some floating particles for visual interest
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 50;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.3
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.lookAt(mug.position);

    // Animation with more dynamic movement
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Rotate the mug with slight bobbing motion
      mug.rotation.y += 0.008;
      mug.position.y = Math.sin(time * 2) * 0.05;
      
      // Animate particles
      if (particlesMesh) {
        particlesMesh.rotation.y += 0.002;
        particlesMesh.rotation.x += 0.001;
      }
      
      // Subtle camera movement
      camera.position.x = 4 + Math.sin(time * 0.5) * 0.2;
      camera.position.y = 3 + Math.cos(time * 0.3) * 0.1;
      camera.lookAt(mug.position);
      
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