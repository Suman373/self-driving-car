const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const annCanvas = document.getElementById("annCanvas");
annCanvas.width = 350;
const carCtx = carCanvas.getContext("2d");
const annCtx = annCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N = 1; // for parallelization
const cars = generateCars(N);


const traffic = TRAFFIC_DATA?.map((tr)=> new Car(road.getLaneCenter(tr.lane),  tr.y, 30,50,"NPC",2, getRandomColor()));

let heroCar = cars[0];

if(localStorage.getItem('heroCarBrain')){
    // make all cars have hero brain
    for(let i=0;i<cars.length;i++){
        cars[i].brain = JSON.parse(localStorage.getItem('heroCarBrain'));
        if(i!==0){ // preserve the first car and mutate rest of the car's brain
            ANN.mutate(cars[i].brain,0.1);
        }
    }
}

function save(){
    localStorage.setItem('heroCarBrain',JSON.stringify(heroCar.brain));
}

function discard(){
    localStorage.removeItem('heroCarBrain');
}

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI",5));
    }
    return cars;
}

function toggleRays(){
    if(heroCar && heroCar.sensor){
        heroCar.sensor.toggleRays();
    }
}

animate();

function animate(time){
    // updating cars when simulating traffic
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders, []); // traffic cars will not interact with each other 
    }
   for(let i=0;i<cars.length;i++){
     cars[i].update(road.borders, traffic);
   }

   // main car with forward dir (min y value) => fitness function
   heroCar = cars.find((cr)=> cr.y === Math.min(...cars.map(c=>c.y)));


    carCanvas.height = window.innerHeight;
    annCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-heroCar.y+carCanvas.height*0.7); // move the carCanvas opposite to car direction
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.3;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    heroCar.draw(carCtx,"blue",true); // main car
    carCtx.restore();
    annCtx.lineDashOffset=-time/50;
    // rendering ann with help of the canvas context and car's brain
    Visualizer.drawNetwork(annCtx, heroCar.brain);

    requestAnimationFrame(animate);
}