import * as THREE from 'three';
import type { CRDVisualStyle } from '../styles/StyleRegistry';

export interface SatellitePosition {
  style: CRDVisualStyle;
  position: THREE.Vector3;
  angle: number;
}

export function calculateSatellitePositions(styles: CRDVisualStyle[], radius: number): SatellitePosition[] {
  const positions: SatellitePosition[] = [];
  const angleStep = (Math.PI * 2) / styles.length;

  styles.forEach((style, index) => {
    const angle = index * angleStep;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    positions.push({
      style,
      position: new THREE.Vector3(x, 0, z),
      angle
    });
  });

  return positions;
}

export function findClosestSatellite(
  cardRotation: THREE.Euler,
  satellitePositions: SatellitePosition[],
  maxAngle: number = Math.PI / 6
): CRDVisualStyle | null {
  // Calculate card's forward direction
  const cardDirection = new THREE.Vector3(0, 0, -1);
  const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(cardRotation);
  cardDirection.applyMatrix4(rotationMatrix);

  // Project to XZ plane
  cardDirection.y = 0;
  cardDirection.normalize();

  // Find closest satellite
  let closestSatellite = null;
  let minAngle = Math.PI;

  satellitePositions.forEach(({ style, position }) => {
    const satelliteDirection = position.clone().normalize();
    const angleDiff = Math.abs(cardDirection.angleTo(satelliteDirection));
    
    if (angleDiff < minAngle) {
      minAngle = angleDiff;
      closestSatellite = style;
    }
  });

  return minAngle < maxAngle ? closestSatellite : null;
}