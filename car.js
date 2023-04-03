class Car{
    constructor( x, y, width, height, controlType, maxSpeed = 3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.accelaration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;

        this.dammaged = false;

        this.useBrain=controlType=="AI";

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this, 5, 200, 1);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }
        
        this.controls = new Controls(controlType);
     }

    update(roadBoarders, traffic){

        if(!this.dammaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.dammaged = this.#assessDamage(roadBoarders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBoarders, traffic);
            const offset=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offset,this.brain);
            

            if(this.useBrain) {
                
                console.log(outputs);

                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
        
            }
        }  
    }

    #assessDamage(roadBoarders, traffic){

        for(let i=0; i<roadBoarders.length; i++){
            if(polysIntersect( this.polygon, roadBoarders[i])){
                return true;
            }
        }

        for(let i=0; i< traffic.length; i++){
            if(polysIntersect( this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });

        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });

        points.push({
            x: this.x - Math.sin( Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos( Math.PI +  this.angle - alpha) * rad
        });

        points.push({
            x: this.x - Math.sin( Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos( Math.PI + this.angle + alpha) * rad
        });

        return points;

    }

    #move(){

        if(this.controls.forward){
            this.speed += this.accelaration; 
        }

        if(this.controls.reverse){
            this.speed -= this.accelaration;
        }

        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }

        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed -= this.friction;
        }

        if(this.speed < 0){
            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        if (this.speed != 0) {

            const flip =  this.speed<0 ? 1 : -1;

            if (this.controls.left) {
                this.angle -= 0.03 * flip;
            }

            if (this.controls.right) {
                this.angle += 0.03 * flip;
            }
        }

        this.x -=Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

     draw(ctx, color){
        if(this.dammaged){
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }
        if(this.polygon){

            ctx.beginPath();
            ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

            for(let i=1; i<this.polygon.length; i++){
                ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
            }

            ctx.fill();

            if(this.sensor){
                this.sensor.draw(ctx);
            }
            
        }
        
     }
}

