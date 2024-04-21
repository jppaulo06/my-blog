const lorenz = (p) => {

  /* ENVIRONMENT */

  const lorenzDiv = document.getElementById('lorenz');

  const RHO = 28;
  const SIGMA = 10;
  const BETA = 8 / 3;
  const X0 = 0;
  const Y0 = 1;
  const Z0 = 1.05;
  const DELTA_T = 0.008;

  let lorenzHead;

  /* ESSENTIAL CLASS */

  class LorenzHead {
    constructor(offset) {
      this.x = X0;
      this.y = Y0;
      this.z = Z0;
      this.offset = offset;
    }

    draw() {
      const [new_x, new_y, new_z] = this.updateHeadPosition();

      p.scale(6);
      p.stroke(255);
      p.strokeWeight(0.2);

      const print_old_x = p.map(this.x, 0, 350, 0, p.width) + this.offset;
      const print_old_y = p.map(this.y, 0, 350, 0, p.width) + this.offset;

      const print_new_x = p.map(new_x, 0, 350, 0, p.width) + this.offset;
      const print_new_y = p.map(new_y, 0, 350, 0, p.width) + this.offset;

      p.line(print_old_x, print_old_y, print_new_x, print_new_y);

      this.x = new_x;
      this.y = new_y;
      this.z = new_z;
    }

    updateHeadPosition() {
      const old_x = this.x
      const old_y = this.y
      const old_z = this.z

      const dx = (SIGMA * (old_y - old_x)) * DELTA_T;
      const dy  = (old_x * (RHO - old_z) - old_y) * DELTA_T;
      const dz  = ((old_x * old_y) - (BETA * old_z)) * DELTA_T;

      return [this.x + dx, this.y + dy, this.z + dz];
    }
  }

  /* MAGIC FUNCTIONS */

  p.setup = function() {
    let width = lorenzDiv.offsetWidth;
    let height = lorenzDiv.offsetHeight;
    p.createCanvas(width, height);
    lorenzHead = new LorenzHead(width / 14);
  }

  p.draw = function() {
    lorenzHead.draw();
  }

  p.windowResized = function() {
    p.setup();
  }
}

new p5(lorenz, 'lorenz');
