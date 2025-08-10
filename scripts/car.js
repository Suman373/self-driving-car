class Car {

    constructor(x, y, width, height, controlType, maxSpeed = 5, color = "blue") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.3;
        this.maxSpeed = maxSpeed;
        this.friction = 0.02;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType === "AI";

        if (controlType !== "NPC") {
            this.sensor = new Sensor(this); // pass car context
            this.brain = new ANN(
                [this.sensor.rayCount, 6, 4]
            ); // 6-hidden neurons, 4 - output : 4 directions
        }
        this.controls = new Controls(controlType);

        this.img = new Image();
        this.img.src = "/scripts/Car.png";
        this.mask = document.createElement("canvas");
        this.mask.height = height;
        this.mask.width = width;
        const maskCtx = this.mask.getContext("2d");
        this.img.onload = () => {
            maskCtx.fillStyle = color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation = "destination-atop"; // drawing new shape where it overlaps w our existing canvas content
            maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
        };
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map((sensor) => sensor === null ? 0 : 1 - sensor.offset);
            // if object is close, neurons will receive higher values
            const outputs = ANN.feedForward(offsets, this.brain);

            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (checkPolysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (checkPolysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    // polygons for car
    /*
            w/2
        -------
        |    /
    h/2 |   / -> rad
        |  /
        | /-> angle - atan2(w/2, h/2), 
        |/

        atan2(y,x)-> angle forward and diagonal to the
    */
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width / 2, this.height / 2);
        const alpha = Math.atan2(this.width, this.height); // angle from center (0,0) to corner
        // top right corner
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        const frontOffset = this.height / 2 + 10;
        points.push({
            x: this.x - Math.sin(this.angle) * frontOffset,
            y: this.y - Math.cos(this.angle) * frontOffset,
        }); // 4 - nose
        // top left corner
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        // bottom left, we add 180deg ~ PI
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        // bottom right
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });
        return points;
    }

    // method for movement of car 
    #move() {
        // utilizing acceleration when moving in any direction
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed; // we can max speed at constant
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2; // -ve for backward movement, reduced the value by 2 to show less acceleration 
        }
        if (this.speed > 0) {
            this.speed -= this.friction; // include friction
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // sideways control
        if (this.speed !== 0) {
            const flipDirection = this.speed > 0 ? 1 : -1;
            // change angle when car goes in reverse
            if (this.controls.left) {
                this.angle += 0.02 * flipDirection;
            }
            if (this.controls.right) {
                this.angle -= 0.02 * flipDirection;
            }
        }

        /*
            Unit circle
                    0
            pi/2    |    -pi/2
                    pi   
        
            angle =  α 
            hypotenuse = 1 (speed)
            perpendicular = Math.sin(α) * hypotenuse; (x)
            base = Math.cos(α) * hypotenuse; (y)
        */
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx, drawSensor = false) {
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx); // car responsible for rendering it's own sensors
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        if (!this.damaged) {
            ctx.drawImage(this.mask, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = "multiply";
        }
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
        // if (this.damaged) {
        //     ctx.fillStyle = "gray";
        // } else {
        //     ctx.fillStyle = color;
        // }
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x, this.polygon[0].y); // from 1 point
        // for (let i = 1; i < this.polygon.length; i++) {
        //     ctx.lineTo(this.polygon[i].x, this.polygon[i].y); // to other points
        // }
        // ctx.fill();
    }
}

