import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { DesignElement } from '../../pages/DesignEditor';

interface Advanced3DPreviewProps {
  elements: DesignElement[];
  backgroundColor: string;
  canvasWidth?: number;
  canvasHeight?: number;
  modelType?: 'procedural' | 'gltf';
  modelPath?: string;
}

export const Advanced3DPreview: React.FC<Advanced3DPreviewProps> = ({
  elements,
  backgroundColor,
  canvasWidth = 600,
  canvasHeight = 450,
  modelType = 'procedural',
  modelPath
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>();
  const mugRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create texture from canvas elements with real QR codes
  const createDesignTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Clear canvas with background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / canvasWidth;
    const scaleY = canvas.height / canvasHeight;

    // Render each element onto the texture
    elements.forEach(element => {
      ctx.save();
      
      const centerX = (element.x + element.width / 2) * scaleX;
      const centerY = (element.y + element.height / 2) * scaleY;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation || 0) * Math.PI / 180);
      
      if (element.flipX) ctx.scale(-1, 1);
      if (element.flipY) ctx.scale(1, -1);
      
      const scaledWidth = element.width * scaleX;
      const scaledHeight = element.height * scaleY;

      switch (element.type) {
        case 'text':
          ctx.fillStyle = element.color || '#000000';
          ctx.font = `${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${(element.fontSize || 16) * scaleX}px ${element.fontFamily || 'Arial'}`;
          ctx.textAlign = element.textAlign as CanvasTextAlign || 'center';
          ctx.textBaseline = 'middle';
          
          if (element.textShadow) {
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }
          
          ctx.fillText(element.content || '', 0, 0);
          break;

        case 'image':
          if (element.src) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.globalAlpha = element.opacity || 1;
              ctx.drawImage(img, -scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight);
              if (textureRef.current) {
                textureRef.current.needsUpdate = true;
              }
            };
            img.src = element.src;
          }
          break;

        case 'shape':
          ctx.fillStyle = element.color || '#0066cc';
          ctx.globalAlpha = element.opacity || 1;
          
          switch (element.shape) {
            case 'circle':
              ctx.beginPath();
              ctx.arc(0, 0, Math.min(scaledWidth, scaledHeight) / 2, 0, Math.PI * 2);
              ctx.fill();
              break;
            case 'rectangle':
            default:
              ctx.fillRect(-scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight);
              break;
          }
          break;

        case 'qr':
          // Use real QR code API
          const qrSize = Math.min(scaledWidth, scaledHeight);
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${Math.round(qrSize)}x${Math.round(qrSize)}&data=${encodeURIComponent(element.content || 'https://example.com')}`;
          
          const qrImg = new Image();
          qrImg.crossOrigin = 'anonymous';
          qrImg.onload = () => {
            ctx.fillStyle = element.backgroundColor || '#ffffff';
            ctx.fillRect(-scaledWidth/2, -scaledHeight/2, scaledWidth, scaledHeight);
            ctx.drawImage(qrImg, -qrSize/2, -qrSize/2, qrSize, qrSize);
            if (textureRef.current) {
              textureRef.current.needsUpdate = true;
            }
          };
          qrImg.src = qrUrl;
          break;
      }
      
      ctx.restore();
    });

    return new THREE.CanvasTexture(canvas);
  };

  // Enhanced procedural mug creation
  const createProceduralMug = () => {
    const group = new THREE.Group();

    // Enhanced mug body
    const mugProfile = [];
    const segments = 48;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * 3.5 - 1.75;
      
      let radius;
      if (t < 0.05) {
        radius = 0.7 + (t * 6);
      } else if (t > 0.92) {
        radius = 1.15 + (t - 0.92) * 0.8;
      } else {
        radius = 1.0 + Math.sin(t * Math.PI * 0.8) * 0.08;
      }
      
      mugProfile.push(new THREE.Vector2(radius, y));
    }

    const bodyGeometry = new THREE.LatheGeometry(mugProfile, 64);
    
    // Create texture from design elements
    const designTexture = createDesignTexture();
    if (designTexture) {
      designTexture.wrapS = THREE.RepeatWrapping;
      designTexture.wrapT = THREE.ClampToEdgeWrapping;
      designTexture.repeat.set(1, 1);
      textureRef.current = designTexture;
    }

    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 80,
      specular: 0x444444,
      map: designTexture
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Enhanced handle
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

    // Inner cavity
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

    // Rim
    const rimGeometry = new THREE.TorusGeometry(1.2, 0.04, 12, 48);
    const rimMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe8e8e8,
      shininess: 120
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = 1.65;
    rim.castShadow = true;
    group.add(rim);

    return group;
  };

  // Future: Load GLTF model
  const loadGLTFModel = async (path: string) => {
    setIsLoading(true);
    try {
      // Future implementation with GLTFLoader
      console.log('GLTF loading would be implemented here:', path);
      setIsLoading(false);
      return createProceduralMug();
    } catch (error) {
      console.error('Error loading GLTF model:', error);
      setIsLoading(false);
      return createProceduralMug();
    }
  };

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
    camera.position.set(5, 4, 7);

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
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(12, 12, 8);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x87ceeb, 0.4);
    rimLight.position.set(-8, 8, -8);
    scene.add(rimLight);

    // Create mug based on model type
    const createMug = async () => {
      if (modelType === 'gltf' && modelPath) {
        return await loadGLTFModel(modelPath);
      } else {
        return createProceduralMug();
      }
    };

    createMug().then(mug => {
      mugRef.current = mug;
      scene.add(mug);
      camera.lookAt(mug.position);
    });

    // Ground plane
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

    // Animation
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      time += 0.008;
      
      if (mugRef.current) {
        mugRef.current.rotation.y += 0.006;
        mugRef.current.position.y = Math.sin(time * 1.5) * 0.03;
      }
      
      camera.position.x = 5 + Math.sin(time * 0.4) * 0.3;
      camera.position.y = 4 + Math.cos(time * 0.2) * 0.2;
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
  }, []);

  // Update texture when elements change
  useEffect(() => {
    if (mugRef.current && textureRef.current) {
      const newTexture = createDesignTexture();
      if (newTexture) {
        mugRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
            if (child.material.map) {
              child.material.map.dispose();
              child.material.map = newTexture;
              child.material.needsUpdate = true;
            }
          }
        });
        textureRef.current = newTexture;
      }
    }
  }, [elements, backgroundColor]);

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
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};