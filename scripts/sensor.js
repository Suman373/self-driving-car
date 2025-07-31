class Sensor {
    // sensor must be aware of the car properties
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2; // 90deg for rays

        // segments of ray
        this.rays = [];
        this.readings = []; // detect road borders
    }

    update(roadBorders) {
        this.#castRays();
        this.readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            )
        }
    }

    #getReading() {
        let intersections = [];
        for (let i = 0; i < this.rayCount; i++) {
            const intersect = getIntersection(
                ray[0],
                ray[1], // one segment
                roadBorders[i][0],
                roadBorders[i][1], // other segment
            );
            if (intersect) {
                intersections.push(intersect);
            }
        }
        if (intersections.length === 0) {
            return null;
        } else {
            const offsets = intersections.map((el) => el.offset); // list of offset values from intersections with border
            const minOffset = Math.min(...offsets); // closest entity for collision
            // return the closest intersection reading
            return intersections.find((it) => it.offset === minOffset);
        }
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const t = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1); //for 1 ray -> 0.5
            let rayAngle = linearInterpolate(this.raySpread / 2, -this.raySpread / 2, t);
            rayAngle += this.car.angle; // add car's angle 

            const start = {
                x: this.car.x,
                y: this.car.y
            };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1]; // default end {x,y}
            if (this.readings[i]) {
                end = this.readings[i]; // update end with closest intersection coordinates
            }

            // yellow ray until intersection
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(
                this.rays[i][0].x, // [start,end]
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            // black ray from yellow ray end to intersection end
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}