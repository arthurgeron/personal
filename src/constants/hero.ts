// Hero component constants

// Default canvas dimensions
export const CANVAS_DIMENSIONS = {
  WIDTH: window ? window.innerWidth : 1200,
  HEIGHT: window ? window.innerHeight : 800,
};

// Particle system configuration
export const PARTICLE_CONFIG = {
  CONNECTION_DISTANCE: 150,
  GRID_SIZE: 150,
  MOBILE_THRESHOLD: 768,
  MOBILE_PARTICLE_COUNT: 75,
  DESKTOP_PARTICLE_COUNT: 150,
  MIN_PARTICLE_SIZE: 1,
  MAX_PARTICLE_SIZE: 4,
  MIN_PARTICLE_OPACITY: 0.2,
  MAX_PARTICLE_OPACITY: 0.7,
  PARTICLE_SPEED_RANGE: 0.5,
  FRAME_THROTTLE_MS: 33, // ~30fps for mobile
}; 