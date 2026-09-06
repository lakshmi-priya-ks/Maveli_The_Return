import { LevelData, Platform, PlayerState } from '../types';

export class PhysicsEngine {
  private gravity = 1200; // px/s^2
  private maxFallSpeed = 700;
  private moveSpeed = 260;
  private jumpVelocity = -520;

  public updatePlayer(
    player: PlayerState,
    level: LevelData,
    input: { left: boolean; right: boolean; jump: boolean; down: boolean },
    dt: number,
    onHazardHit: () => void,
    onGoalReached: () => void
  ) {
    // Horizontal input
    let targetVx = 0;
    if (input.left && !input.right) {
      targetVx = -this.moveSpeed;
      player.facing = 'left';
    } else if (input.right && !input.left) {
      targetVx = this.moveSpeed;
      player.facing = 'right';
    }

    // Smooth horizontal acceleration
    const accel = player.grounded ? 18 : 10;
    player.vx += (targetVx - player.vx) * Math.min(1, accel * dt);

    // Apply gravity
    player.vy += this.gravity * dt;
    if (player.vy > this.maxFallSpeed) {
      player.vy = this.maxFallSpeed;
    }

    // Coyote timer & jump buffer
    if (player.grounded) {
      player.coyoteTimer = 0.12; // 120ms coyote time
    } else {
      player.coyoteTimer -= dt;
    }

    if (input.jump) {
      player.jumpBufferTimer = 0.12; // 120ms jump buffer
    } else {
      player.jumpBufferTimer -= dt;
    }

    // Execute jump
    if (player.jumpBufferTimer > 0 && player.coyoteTimer > 0) {
      player.vy = this.jumpVelocity;
      player.grounded = false;
      player.coyoteTimer = 0;
      player.jumpBufferTimer = 0;
    }

    // Update moving platforms positions first
    for (const p of level.platforms) {
      if (p.type === 'moving_horizontal' && p.startX !== undefined && p.endX !== undefined && p.speed) {
        p.x += (p.dx ?? 1) * p.speed;
        if (p.x >= p.endX) {
          p.x = p.endX;
          p.dx = -1;
        } else if (p.x <= p.startX) {
          p.x = p.startX;
          p.dx = 1;
        }
      } else if (p.type === 'moving_vertical' && p.startY !== undefined && p.endY !== undefined && p.speed) {
        p.y += (p.dy ?? 1) * p.speed;
        if (p.y >= p.endY) {
          p.y = p.endY;
          p.dy = -1;
        } else if (p.y <= p.startY) {
          p.y = p.startY;
          p.dy = 1;
        }
      }
    }

    // Update player positions
    const oldX = player.x;
    const oldY = player.y;

    player.x += player.vx * dt;
    player.y += player.vy * dt;

    // Boundary constraints
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > level.worldWidth) {
      player.x = level.worldWidth - player.width;
    }

    // Check if fallen below level boundary
    if (player.y > level.worldHeight + 50) {
      onHazardHit();
      return;
    }

    // Platform collisions
    player.grounded = false;
    const playerFeet = player.y + player.height;
    const oldPlayerFeet = oldY + player.height;

    for (const p of level.platforms) {
      // Hazard water / spikes
      if (p.type === 'hazard_water' || p.type === 'hazard_spikes') {
        const overlapX = player.x + player.width > p.x + 8 && player.x < p.x + p.w - 8;
        const overlapY = playerFeet > p.y + 12 && player.y < p.y + p.h;
        if (overlapX && overlapY) {
          onHazardHit();
          return;
        }
        continue;
      }

      // Solid ground or one-way semi-solid platforms (wood, boat, bridge, moving)
      const withinX = player.x + player.width > p.x + 4 && player.x < p.x + p.w - 4;
      if (withinX) {
        // Landing on top of platform
        if (oldPlayerFeet <= p.y + 10 && playerFeet >= p.y && player.vy >= 0) {
          player.y = p.y - player.height;
          player.vy = 0;
          player.grounded = true;

          // Carry player with moving platform
          if (p.type === 'moving_horizontal' && p.speed && p.dx) {
            player.x += p.dx * p.speed;
          } else if (p.type === 'moving_vertical' && p.speed && p.dy) {
            player.y += p.dy * p.speed;
          }
        }
      }
    }

    // Check Goal Area
    const g = level.goalArea;
    const atGoal =
      player.x + player.width > g.x &&
      player.x < g.x + g.w &&
      playerFeet > g.y &&
      player.y < g.y + g.h;

    if (atGoal) {
      onGoalReached();
    }

    // Update animations
    player.animTimer += dt;
    if (!player.grounded) {
      player.animState = player.vy < 0 ? 'jump' : 'fall';
    } else if (Math.abs(player.vx) > 15) {
      player.animState = 'walk';
    } else {
      player.animState = 'idle';
    }
  }
}
