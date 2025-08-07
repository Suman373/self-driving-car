function lerp(A, B, t) {
    return A + (B - A) * t;
}


function getIntersection(A, B, C, D) {
    const top_t = (A.y - C.y) * (D.x - C.x) - (D.y - C.y) * (A.x - C.x);
    const top_u = (A.y - C.y) * (B.x - A.x) - (B.y - A.y) * (A.x - C.x);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = top_t / bottom; // interpolation factor (offset on the segment)
        const u = top_u / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) { // t ε [0,1]
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            };
        }
    }
    return null;
}

// check if lines of 2 polygons intersect or not
function checkPolysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const intersected = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length],
            )
            if (intersected) {
                return true;
            }
        }
    }
    return false;
}

// get rgba values from weights value
function getRGBA(value) {
    // value -> [-1,1]
    const alpha = Math.abs(value); // intensity depends on the value 
    const R = value < 0 ? 255 : 0; // show red when -ve value
    const G = value > 0 ? 255 : 0;  // show skyblue when +ve value
    const B = G;
    // const R = value > 0 ? 255 : 0;
    // const G = R;
    // const B = value < 0 ? 255: 0;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}


function getRandomColor(){
    const hue = 290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}


const TRAFFIC_DATA = [
    {
        "lane": 0,
        "y": -300
    },
    {
        "lane": 2,
        "y": -300
    },
    {
        "lane": 0,
        "y": -600
    },
    {
        "lane": 1,
        "y": -600
    },
    {
        "lane": 2,
        "y": -1500
    },
    {
        "lane": 0,
        "y": -1200
    },
    {
        "lane": 1,
        "y": -1500
    },
    {
        "lane": 0,
        "y": -1800
    },
    {
        "lane": 1,
        "y": -2200
    },
    {
        "lane": 2,
        "y": -2500
    },
    {
        "lane": 0,
        "y": -3000
    },
]