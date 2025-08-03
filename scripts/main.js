const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const annCanvas = document.getElementById("annCanvas");
annCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const annCtx = annCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
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

    carCanvas.height = window.innerHeight;
    annCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.7); // move the carCanvas opposite to car direction
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    car.draw(carCtx,"blue");
    carCtx.restore();

    // rendering ann with help of the canvas context and car's brain
    Visualizer.drawNetwork(annCtx, car.brain);

    requestAnimationFrame(animate);
}