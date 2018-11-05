/* Vec2 object constructor function 
 * Author: Steven Yi
 */

const Vec2 = (x, y) => {
  return {
    x, y,
    translate(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    subtract(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },
    mul(v) {
      this.x *= v;
      this.y *= v;
      return this;
    },
    rotate(theta) {
      let newX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
      this.y = this.x * Math.sin(theta) + this.y * Math.cos(theta);
      this.x = newX;
      return this;
    },
    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    copy() {
      return Vec2(this.x, this.y);
    }
  };
}
