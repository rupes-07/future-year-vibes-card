import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  isActive: boolean;
  onAnimationComplete: () => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ isActive, onAnimationComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationTimeRef = useRef<number>(0);
  const animationDurationRef = useRef<number>(10); // 10 seconds animation

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0F1729);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 25;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Clear previous content
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Add point lights with different colors for a futuristic feel
    const pointLight1 = new THREE.PointLight(0x4361EE, 2, 50);
    pointLight1.position.set(-10, 5, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00F5FF, 2, 50);
    pointLight2.position.set(10, -5, -10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xBA34EB, 2, 50);
    pointLight3.position.set(0, 10, -5);
    scene.add(pointLight3);

    // Add a responsive resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      // Dispose of Three.js objects
      if (objectsRef.current) {
        objectsRef.current.forEach(obj => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(mat => mat.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Animation control based on isActive prop
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    if (isActive) {
      // Reset animation time
      animationTimeRef.current = 0;
      
      // Clear existing objects
      if (objectsRef.current.length > 0) {
        objectsRef.current.forEach(obj => sceneRef.current?.remove(obj));
        objectsRef.current = [];
      }
      
      // Remove existing particles
      if (particlesRef.current) {
        sceneRef.current.remove(particlesRef.current);
        particlesRef.current = null;
      }
      
      // Create new 3D objects for 2082
      createObjects();
      createParticles();
      
      // Start animation
      if (frameIdRef.current === null) {
        animate();
      }
    } else {
      // Stop animation
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    }
    
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [isActive]);

  // Create 3D objects representing 2082
  const createObjects = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const digits = [2, 0, 8, 2];
    const spacing = 5;
    const startX = -spacing * 1.5;
    
    // Create 3D digits
    digits.forEach((digit, index) => {
      // Custom geometries for each digit
      let geometry;
      const digitSize = 3;
      
      switch (digit) {
        case 2:
          // Create a "2" shape using a custom approach
          // Base shape for "2"
          const twoGroup = new THREE.Group();
          
          // Top horizontal bar
          const topBar = new THREE.Mesh(
            new THREE.BoxGeometry(digitSize, digitSize/4, 1),
            new THREE.MeshBasicMaterial()
          );
          topBar.position.y = digitSize/2;
          twoGroup.add(topBar);
          
          // Curved part (using cylinder)
          const curve = new THREE.Mesh(
            new THREE.CylinderGeometry(digitSize/2, digitSize/2, 1, 32, 1, false, Math.PI, Math.PI),
            new THREE.MeshBasicMaterial()
          );
          curve.rotation.z = Math.PI/2;
          curve.position.set(digitSize/2, 0, 0);
          twoGroup.add(curve);
          
          // Bottom horizontal bar
          const bottomBar = new THREE.Mesh(
            new THREE.BoxGeometry(digitSize, digitSize/4, 1),
            new THREE.MeshBasicMaterial()
          );
          bottomBar.position.y = -digitSize/2;
          twoGroup.add(bottomBar);
          
          // Use a simple box for development
          geometry = new THREE.BoxGeometry(digitSize, digitSize * 1.5, 1);
          break;
          
        case 0:
          // Create a "0" using a torus (ring) geometry
          geometry = new THREE.TorusGeometry(digitSize/2, digitSize/4, 16, 32);
          break;
          
        case 8:
          // Create an "8" using two stacked torus geometries
          const eightGroup = new THREE.Group();
          
          // Top circle
          const topCircle = new THREE.Mesh(
            new THREE.TorusGeometry(digitSize/3, digitSize/6, 16, 32),
            new THREE.MeshBasicMaterial()
          );
          topCircle.position.y = digitSize/3;
          eightGroup.add(topCircle);
          
          // Bottom circle
          const bottomCircle = new THREE.Mesh(
            new THREE.TorusGeometry(digitSize/3, digitSize/6, 16, 32),
            new THREE.MeshBasicMaterial()
          );
          bottomCircle.position.y = -digitSize/3;
          eightGroup.add(bottomCircle);
          
          // Use a sphere for simplicity
          geometry = new THREE.SphereGeometry(digitSize/1.5, 32, 16);
          break;
          
        default:
          geometry = new THREE.BoxGeometry(digitSize, digitSize * 1.5, 1);
      }
      
      // Create materials with different colors for each digit
      const materials = [
        new THREE.MeshPhongMaterial({ 
          color: 0x4361EE,
          emissive: 0x4361EE,
          emissiveIntensity: 0.2,
          specular: 0xffffff,
          shininess: 100
        }),
        new THREE.MeshPhongMaterial({ 
          color: 0x00F5FF,
          emissive: 0x00F5FF,
          emissiveIntensity: 0.2,
          specular: 0xffffff,
          shininess: 100
        }),
        new THREE.MeshPhongMaterial({ 
          color: 0xBA34EB,
          emissive: 0xBA34EB,
          emissiveIntensity: 0.2,
          specular: 0xffffff,
          shininess: 100
        }),
        new THREE.MeshPhongMaterial({ 
          color: 0x5FFBF1,
          emissive: 0x5FFBF1,
          emissiveIntensity: 0.2,
          specular: 0xffffff,
          shininess: 100
        })
      ];
      
      // Use the material for this index
      const material = materials[index];
      
      // Create mesh
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position the digits
      mesh.position.x = startX + index * spacing;
      mesh.position.y = -100; // Start below view
      mesh.position.z = -10; // Position behind quotes
      
      // Add to scene and track
      scene.add(mesh);
      objectsRef.current.push(mesh);
    });
  };

  // Create particle system for background effects
  const createParticles = () => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Create particles
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x4361EE);
    const color2 = new THREE.Color(0x00F5FF);
    const color3 = new THREE.Color(0xBA34EB);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Color - randomly assign one of our three theme colors
      const colorChoice = Math.floor(Math.random() * 3);
      const color = colorChoice === 0 ? color1 : (colorChoice === 1 ? color2 : color3);
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;
  };

  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    
    // Update animation time
    const deltaTime = 0.016; // ~60fps
    animationTimeRef.current += deltaTime;
    
    // Calculate animation progress (0 to 1)
    const progress = Math.min(animationTimeRef.current / animationDurationRef.current, 1);
    
    // Digit animation
    objectsRef.current.forEach((obj, index) => {
      // Move digits up from below view
      if (progress < 0.3) {
        const targetY = 0;
        const startY = -100;
        obj.position.y = startY + (targetY - startY) * (progress / 0.3);
      }
      
      // Rotate digits after they arrive
      if (progress >= 0.3 && progress < 0.6) {
        const rotationProgress = (progress - 0.3) / 0.3;
        obj.rotation.y = Math.PI * 2 * rotationProgress;
      }
      
      // Float digits after rotation
      if (progress >= 0.6) {
        const floatProgress = (progress - 0.6) / 0.4;
        obj.position.y = Math.sin(floatProgress * Math.PI * 2) * 0.5;
        
        // Move digits to form a backdrop behind the quotes
        obj.position.z = -15; // Position further back when quotes are shown
        
        // Slow continuous rotation
        obj.rotation.y += 0.01;
        obj.rotation.x += 0.005;
      }
    });
    
    // Particle animation
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
    }
    
    // Camera movement
    if (progress < 0.5) {
      camera.position.z = 25 - progress * 10;
    } else {
      camera.position.z = 20 + Math.sin(progress * Math.PI) * 2;
    }
    
    // Render scene
    renderer.render(scene, camera);
    
    // Continue animation if not complete
    if (progress < 1) {
      frameIdRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      onAnimationComplete();
      // Continue a subtle animation
      frameIdRef.current = requestAnimationFrame(animateIdle);
    }
  };
  
  // Idle animation after main sequence completes
  const animateIdle = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    
    // Gentle floating and rotation for digits
    objectsRef.current.forEach((obj, index) => {
      obj.rotation.y += 0.005;
      obj.position.y = Math.sin(Date.now() * 0.001 + index) * 0.3;
      
      // Keep digits visible behind the quotes
      obj.position.z = -15 + Math.sin(Date.now() * 0.0003 + index) * 2;
    });
    
    // Subtle particle movement
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }
    
    // Gentle camera movement
    camera.position.z = 20 + Math.sin(Date.now() * 0.0005) * 1;
    
    // Render scene
    renderer.render(scene, camera);
    
    // Continue idle animation
    frameIdRef.current = requestAnimationFrame(animateIdle);
  };

  return <div ref={mountRef} className="fixed inset-0 w-full h-full z-40" />;
};

export default ThreeScene;
