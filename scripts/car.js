class Car {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.1;
        this.sideways = 2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;
        this.controls = new Controls();
    }

    update() {
        this.#move();

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
        ctx.save();
        ctx.translate(this.x, this.y); // center according to the car
        ctx.rotate(-this.angle); // our 0 deg to faced towards top
        ctx.beginPath();
        ctx.rect(-this.width / 2, - this.height / 2, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
}