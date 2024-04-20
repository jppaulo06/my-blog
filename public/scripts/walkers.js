const walkers = (p) => {

  /* ENVIRONMENT */

  const V_AXIS_MAX_MOD = 10;
  const T_MAX = 1000;
  const DELTA_T = 0.01;
  const MARGIN = 10;
  let walkersBackground;

  /* ESSENTIAL CLASSES */

  class WalkersBackground {
    time = 0;
    walkers = [];

    constructor() {
      this.walkersSize = this.updateWalkersSize();
      this.createWalkers();
    }

    draw() {
      if (this.time > T_MAX)
        frameRate(0);
      this.walkers.forEach(walker => walker.draw(this.time));
      this.time += DELTA_T;
    }

    reset() {
      this.walkers.length = 0;
      this.time = 0;
    }

    updateWalkersSize() {
      if (p.width > 1000)
        return p.width;
      else
        return p.width / 2;
    }

    createWalkers() {
      for (let i = 0; i < this.walkersSize; i++)
        this.walkers.push(new Walker(i));
    }
  }

  class Walker {
    constructor(offset) {
      this.offset = offset;
      this.x = p.random(p.width);
      this.reverse_x = 1;
      this.reverse_y= 1;
      this.vx = this.getAxisVelocity(this.offset);
      this.vy = this.getAxisVelocity(this.offset + 2);

      if (p.random(1) > 0.5)
        this.y = - p.random(MARGIN);
      else
        this.y = p.height + p.random(MARGIN);

      this.r = p.map(this.x, 0, p.width, 0, 255);
    }

    draw(time) {
      let transparency = p.map(p.min(time * 1000, T_MAX), 0, T_MAX, 0, 255);
      let weight = 2 / (1 + 2 * time);

      this.vx = (this.getAxisVelocity(time + this.offset)) / (1 + time) * this.reverse_x;
      this.vy = (this.getAxisVelocity(time + this.offset + 2)) / (1 + time) * this.reverse_y;

      if (this.x > p.width + MARGIN || this.x < -MARGIN)
        this.reverse_x *= -1;
      if (this.y > p.height + MARGIN || this.y < -MARGIN)
        this.reverse_y *= -1;

      p.strokeWeight(weight);
      p.stroke(this.r, 20, 100, transparency);
      p.line(this.x, this.y, this.x + this.vx, this.y + this.vy);

      this.x += this.vx;
      this.y += this.vy;
    }

    getAxisVelocity(time) {
      return V_AXIS_MAX_MOD * (p.noise(time) * 2 - 1);
    }
  }

  /* MAGIC FUNCTIONS */

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    walkersBackground = new WalkersBackground();
  }

  p.draw = function() {
    walkersBackground.draw();
  }

  p.windowResized = function() {
    walkersBackground.reset()
    p.setup();
  }
}

new p5(walkers, 'walkers');
