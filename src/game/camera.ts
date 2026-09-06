export class Camera {
  public x = 0;
  public y = 0;
  public viewportWidth = 800;
  public viewportHeight = 600;
  private lerpSpeed = 0.1;

  constructor(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
  }

  public resize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  }

  public update(targetX: number, targetY: number, worldWidth: number, worldHeight: number) {
    // Center target with look-ahead
    const desiredX = targetX - this.viewportWidth * 0.45;
    const desiredY = targetY - this.viewportHeight * 0.65;

    this.x += (desiredX - this.x) * this.lerpSpeed;
    this.y += (desiredY - this.y) * this.lerpSpeed;

    // Clamp to world bounds
    const maxX = Math.max(0, worldWidth - this.viewportWidth);
    const maxY = Math.max(0, worldHeight - this.viewportHeight);

    if (this.x < 0) this.x = 0;
    if (this.x > maxX) this.x = maxX;
    if (this.y < 0) this.y = 0;
    if (this.y > maxY) this.y = maxY;
  }
}
