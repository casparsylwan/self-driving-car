function createCars(){
    cars = [];
    for(let i = 0; i<100; i++) {

        let lane = Math.floor(Math.random() * 4);
        let plaement = i * 100;
        let speed = Math.floor(Math.random()*4);
        cars.push(new Car(road.getLaneCenter(lane),- plaement, 100, 300, "DUMMY", speed ))

    }
    return cars;
}

const canvas = document.getElementById('canvas');
canvas.width = 600;

const networkCanvas = document.getElementById('networkcanvas');
networkCanvas.width = 600;

const ctx = canvas.getContext('2d');
const networkCTX = networkCanvas.getContext('2d');

const road = new Road(canvas.width/2, canvas.width * 0.9, 4);
const car =  new Car(road.getLaneCenter(1), 100, 60, 100, "KEYS");
const traffic = createCars();


// [ new Car(road.getLaneCenter(1), -100, 70, 200, "DUMMY", 1),
//                 new Car(road.getLaneCenter(0), 400, 50, 100, "DUMMY", 2),
//                 new Car(road.getLaneCenter(2), 400, 50, 100, "DUMMY", 2),
//                 new Car(road.getLaneCenter(1), 800, 50, 100, "DUMMY", 2),
//                 new Car(road.getLaneCenter(2), -00, 50, 100, "DUMMY", 2),
//                 new Car(road.getLaneCenter(3), 300, 50, 100, "DUMMY", 2),
//                 new Car(road.getLaneCenter(4), 250, 50, 100, "DUMMY", 2),
//     ];


animate();

function animate(){
    for(let i=0; i<traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height*0.7);
    road.draw(ctx);
    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(ctx, "blue");
    }
    car.draw(ctx, "black");

    ctx.restore();
    Visualizer.drawNetwork(networkCTX, car.brain);
    requestAnimationFrame(animate);
}

// function createCars(){
//     cars = [];
//     for(let i = 0; i<100; i++) {

//         let lane = Math.floor(Math.random() * 3);
//         let plaement = i * 100;
//         let speed = Math.floor(Math.random()*3);
//         cars.push(new Car(road.getLaneCenter(lane), plaement, 50, 100, "DUMMY", speed))

//     }
//     return cars;
// }