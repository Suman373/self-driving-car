const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50, "KEYS");
const traffic = [
    new Car(road.getLaneCenter(1), 0, 30, 50, "NPC", 2),
];


animate();

function animate(){
    // updating cars when simulating traffic
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders, []); // npc car must interact with simulated cars, so no traffic 
    }
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7); // move the canvas opposite to car direction
    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx,"red");
    }
    car.draw(ctx,"blue");
    ctx.restore();
    requestAnimationFrame(animate);
}