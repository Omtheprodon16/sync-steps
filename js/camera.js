export class Camera {
  constructor(){
    this.x=0;
  }
  follow(targetX){
    const target = targetX - 450;

    // smooth camera movement
    this.x += (target - this.x) * 0.1;

    if(this.x < 0) this.x = 0;
  }
}