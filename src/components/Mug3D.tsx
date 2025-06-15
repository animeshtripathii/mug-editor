import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface Mug3DProps {
  gltfPath?: string; // Optional GLTF model path
}

const Mug3D: React.FC<Mug3DProps> = ({ gltfPath }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>();
  const mugRef = useRef<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to load GLTF model (future implementation)
  const loadGLTFModel = async (path: string) => {
    setIsLoading(true);
    try {
      // Future: Use GLTFLoader here
      // const loader = new GLTFLoader();
      // const gltf = await loader.loadAsync(path);
      // return gltf.scene;
      console.log('GLTF loading would be implemented here:', path);
      setIsLoading(false);
      return createProceduralMug(); // Fallback for now
    } catch (error) {
      console.error('Error loading GLTF model:', error);
      setIsLoading(false);
      return createProceduralMug();
    }
  };

  // Create procedural mug geometry
  const createProceduralMug = () => {
    const group = new THREE.Group();

    // Enhanced mug body with better proportions
    const mugProfile = [];
    const segments = 32;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * 3.5 - 1.75; // Taller mug
      
      let radius;
      if (t < 0.05) {
        // Bottom curve - more rounded
        radius = 0.7 + (t * 6);
      } else if (t > 0.92) {
        // Top rim - slight flare
        radius = 1.15 + (t - 0.92) * 0.8;
      } else {
        // Main body with subtle curves
        radius = 1.0 + Math.sin(t * Math.PI * 0.8) * 0.08;
      }
      
      mugProfile.push(new THREE.Vector2(radius, y));
    }

    const bodyGeometry = new THREE.LatheGeometry(mugProfile, 48); // Higher resolution
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 80,
      specular: 0x444444,
      transparent: true,
      opacity: 0.95
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Enhanced handle with better curve
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.25, 1.0, 0),
      new THREE.Vector3(1.7, 0.8, 0),
      new THREE.Vector3(1.85, 0.2, 0),
      new THREE.Vector3(1.85, -0.2, 0),
      new THREE.Vector3(1.7, -0.8, 0),
      new THREE.Vector3(1.25, -1.0, 0)
    ]);

    const handleGeometry = new THREE.TubeGeometry(handleCurve, 32, 0.09, 12, false);
    const handleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 80,
      specular: 0x444444
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.castShadow = true;
    group.add(handle);

    // Inner cavity with better depth
    const innerProfile = mugProfile.map(point => 
      new THREE.Vector2(Math.max(0.1, point.x - 0.12), point.y + 0.08)
    );
    const innerGeometry = new THREE.LatheGeometry(innerProfile, 32);
    const innerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a1a,
      shininess: 100,
      side: THREE.BackSide
    });
    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    inner.position.y = 0.05;
    group.add(inner);

    // Coffee/liquid surface with foam effect
    const liquidGeometry = new THREE.CircleGeometry(0.95, 32);
    const liquidMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8b4513,
      shininess: 120,
      transparent: true,
      opacity: 0.9,
      reflectivity: 0.3
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 1.4;
    group.add(liquid);

    // Foam on top
    const foamGeometry = new THREE.CircleGeometry(0.85, 32);
    const foamMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5f5dc,
      transparent: true,
      opacity: 0.8
    });
    const foam = new THREE.Mesh(foamGeometry, foamMaterial);
    foam.rotation.x = -Math.PI / 2;
    foam.position.y = 1.42;
    group.add(foam);

    // Enhanced rim with metallic look
    const rimGeometry = new THREE.TorusGeometry(1.2, 0.04, 12, 48);
    const rimMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe8e8e8,
      shininess: 120,
      specular: 0x666666
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = 1.65;
    rim.castShadow = true;
    group.add(rim);

    // Base ring for stability
    const baseGeometry = new THREE.TorusGeometry(0.8, 0.03, 8, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf0f0f0,
      shininess: 60
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.7;
    base.castShadow = true;
    group.add(base);

    return group;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera with better positioning
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 4, 7);

    // Enhanced renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(12, 12, 8);
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

    // Rim light for better definition
    const rimLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
    rimLight.position.set(-8, 8, -8);
    scene.add(rimLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, -5, 5);
    scene.add(fillLight);

    // Create or load mug
    const createMug = async () => {
      if (gltfPath) {
        return await loadGLTFModel(gltfPath);
      } else {
        return createProceduralMug();
      }
    };

    createMug().then(mug => {
      mugRef.current = mug;
      scene.add(mug);
      camera.lookAt(mug.position);
    });

    // Enhanced ground plane
    const planeGeometry = new THREE.PlaneGeometry(25, 25);
    const planeMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xf1f5f9,
      transparent: true,
      opacity: 0.7
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2.5;
    plane.receiveShadow = true;
    scene.add(plane);

    // Floating particles for atmosphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 80;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Enhanced animation
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      time += 0.008;
      
      if (mugRef.current) {
        // Smooth rotation with slight wobble
        mugRef.current.rotation.y += 0.006;
        mugRef.current.position.y = Math.sin(time * 1.5) * 0.03;
        mugRef.current.rotation.x = Math.sin(time * 0.8) * 0.02;
      }
      
      // Animate particles
      if (particlesMesh) {
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
      }
      
      // Dynamic camera movement
      camera.position.x = 5 + Math.sin(time * 0.4) * 0.3;
      camera.position.y = 4 + Math.cos(time * 0.2) * 0.2;
      camera.position.z = 7 + Math.sin(time * 0.3) * 0.2;
      
      if (mugRef.current) {
        camera.lookAt(mugRef.current.position);
      }
      
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
  }, [gltfPath]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading 3D model...</p>
          </div>
        </div>
      )}
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '384px' }}
      />
    </div>
  );
};

export default Mug3D;