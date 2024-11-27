import { Vector2 as vec2, MathUtils as mu, Clock } from "three";

console.clear();

class Particles {
  constructor(){
    this.maxDistance = 50;
    this.minDistance = 10;
    this.distanceWidth = this.maxDistance - this.minDistance;
    this.items = Array.from({length: 200}, () => {return {
      pos: new vec2(),
      dir: new vec2(),
      currDist: 0,
      fill: false,
      color: 0
    }});
    
    this.init();
  }
  init(){
    this.items.forEach(item => {
      this.setRandDir(item.dir);
      item.currDist = Math.random();
      item.fill = Math.random() < 0.5;
      item.color = Math.random() * 40 + 300;
      item.radius = Math.random() * 2.5 + 0.5;
    })
  }
  setRandDir(v){
    let a = Math.PI * 2 * Math.random();
    v.set(Math.cos(a), Math.sin(a));
  }
  draw(t){
    this.items.forEach(item => {
      item.currDist += t;
      if (item.currDist > 1){
        item.currDist %= 1;
        this.setRandDir(item.dir);
      }
      let currDist = item.currDist * this.distanceWidth;
      item.pos.copy(item.dir).setLength(currDist + this.minDistance);
      
      let a = mu.smoothstep(currDist, 0, 5) - mu.smoothstep(currDist, this.distanceWidth - 20, this.distanceWidth);
      ctx.fillStyle = `hsla(${item.color}, 100%, 50%, ${a})`;
      ctx.strokeStyle = `hsla(${item.color}, 100%, 75%, ${a})`;
      ctx.lineWidth = u(0.25);
      ctx.beginPath();
      ctx.arc(u(item.pos.x), u(item.pos.y), u(item.radius), 0, Math.PI * 2);
      if(item.fill){ctx.fill();}
      ctx.stroke();
    });
  }
}

class Face{
  constructor(){
    this.colors = ["#08f", "#f20", "#864"];
    this.lineWidth = 1.5;
    
    this.glassPosition = new vec2();
  }
  
  draw(){
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let s = 1;
    // glasses
    this.glassesContour(22, 20, 25, this.lineWidth, this.colors[0], true);
    this.glassesContour(22, 20, 25, this.lineWidth * 0.25, "#aff");
    
    // lips
    let gp = this.glassPosition;
    ctx.lineWidth = u(this.lineWidth);
    gp.set(0, 28)
    this.lipsContour(gp, 30, 13, u(this.lineWidth), this.colors[1], true);
    this.lipsContour(gp, 30, 13, u(this.lineWidth * 0.25), "#ffa");

  }
  
  glassesContour(x, y, w, thickness, color, glow){
    ctx.lineWidth = u(thickness);
    ctx.strokeStyle = color;
    ctx.save();
      if (glow) {
        ctx.shadowBlur = u(3);
        ctx.shadowColor = color;
      }
      let gp = this.glassPosition;
      gp.set(-x, -y);
      this.glassContour(gp, w, glow);
      gp.set(x, -y);
      this.glassContour(gp, w, glow);
      ctx.beginPath();
      ctx.arc(0, u(-14.5), u(7), Math.PI * 1.25, Math.PI * 1.75, false);
      ctx.stroke();
    ctx.restore();
  }
  
  glassContour(p, w, glow){ //pos, width
    ctx.save();
      ctx.beginPath();
      ctx.translate(u(p.x), u(p.y));
      ctx.rotate(Math.PI * 0.25);
      ctx.roundRect(-u(w * 0.5), -u(w * 0.5), u(w), u(w), u(2));
      if (glow){
        let grd = ctx.createLinearGradient(0, -u(w * 0.5), 0, u(w * 0.5));
        grd.addColorStop(0, "#08f");
        grd.addColorStop(1, "#048");
        ctx.fillStyle = grd;
        ctx.fill();
      }
      ctx.stroke();
    ctx.restore();
  }
  
  lipsContour(p, w, h, thick, clr, glow){
    ctx.save();
      
      ctx.strokeStyle = clr;
      ctx.lineWidth = thick;
      if (glow) {
        ctx.shadowBlur = u(3);
        ctx.shadowColor = clr;
      }
      ctx.translate(u(p.x), u(p.y));
      ctx.beginPath();
      ctx.moveTo(-u(w * 0.5), u(1));
      ctx.bezierCurveTo(
        -u(w * 0.25), -u(h * 0.25), 
        -u(w * 0.20), -u(h * 0.75),
        0, -u(h * 0.375)
      );
      ctx.bezierCurveTo(
        u(w * 0.20), -u(h * 0.75),
        u(w * 0.25), -u(h * 0.25),
        u(w * 0.5), u(1)
      )
      ctx.bezierCurveTo(
        u(w * 0.4), u(h * 0.1),
        u(w * 0.25), u(h * 0.5),
        0, u(h * 0.4)
      )
      ctx.bezierCurveTo(
        -u(w * 0.25), u(h * 0.5),
        -u(w * 0.4), u(h * 0.1),
        -u(w * 0.5), u(1)
      )
      if (glow){
        let grd = ctx.createLinearGradient(0, -u(w * 0.5), 0, u(w * 0.5));
        grd.addColorStop(0, "#f00");
        grd.addColorStop(1, "#200");
        ctx.fillStyle = grd;
        ctx.fill();
      }
      ctx.stroke();
    ctx.restore();
  }
}

let c = cnv;
let ctx = c.getContext("2d");
let unit = 0;
let u = val => unit * val;

let resize = () => {
  let minVal = Math.min(innerWidth, innerHeight) * 0.95;
  c.width = c.height = minVal;
  unit = minVal * 0.01;
  
  c.style.border = `${u(1)}px solid #84f`;
  c.style.borderRadius = `${u(15)}px`;
}
window.addEventListener("resize", resize);
resize();

let face = new Face();
let particles = new Particles();

let clock = new Clock();

(function draw(){
  requestAnimationFrame(draw);
  let t = clock.getDelta();
  ctx.save();
  
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.translate(u(50), u(50));

    particles.draw(t * 0.5);
    face.draw();
  
  ctx.restore();
  
})();