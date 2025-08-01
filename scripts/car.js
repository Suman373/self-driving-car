class Car {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.3;
        this.maxSpeed = 5;
        this.friction = 0.02;
        this.angle = 0;
        this.damaged = false;


        this.sensor = new Sensor(this); // pass car context
        this.controls = new Controls();
    }

    update(roadBorders) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (checkPolysIntersect(this.polygon, roadBorders[i])) {
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

    draw(ctx) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y); // from 1 point
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y); // to other points
        }
        ctx.fill();
        this.sensor.draw(ctx); // car responsible for rendering it's own sensors
    }
}

