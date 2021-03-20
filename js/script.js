var direction = new THREE.Vector3();
let movement = {
    up: false, down: false, left: false, right:false,
}
let throttle = {
    up: false, down: false,
}
let thrust = 0;
let horizVelocity = 0;
let maxSpeed = 1;
let airspeedDisplay = document.getElementById("airspeed");
let thrustDisplay = document.getElementById("thrust");
let pitchDisplay = document.getElementById("pitch");
let rollDisplay = document.getElementById("roll");
let altitudeDisplay = document.getElementById("altitude");
let compassDisplay = document.getElementById("compass");
let compassDisplayRotation = 0;

AFRAME.registerComponent('custom-controls', {
    schema: {},
    init: function(){
        console.log("initialize custom controls");
        window.addEventListener('keydown', this.onkeydown.bind(this));
        window.addEventListener('keyup', this.onkeyup.bind(this));
        console.log("data: ", this);
        console.log("data: ", this.el.object3D.position);
    },

    onkeydown: function(){
        var code = event.code;
//        console.log("keyup: ", code);
//        console.log("This: ", this);
        if (code == "KeyS") {
            movement.up = true;
        } else if (code == "KeyA") {
            movement.left = true;
        } else if (code == "KeyW") {
            movement.down = true;
        } else if (code == "KeyD") {
            movement.right = true;
        } else if (code == "KeyE"){
            throttle.up = true;
        } else if (code == "KeyQ"){
            throttle.down = true;
        }
    },
    
    onkeyup: function(){
        var code = event.code;
//        console.log("keydown: ", code);
        if (code == "KeyS") {
            movement.up = false;
        } else if (code == "KeyA") {
            movement.left = false;
        } else if (code == "KeyW") {
            movement.down = false;
        } else if (code == "KeyD") {
            movement.right = false;
        } else if (code == "KeyE"){
            throttle.up = false;
        } else if (code == "KeyQ"){
            throttle.down = false;
        }
    },
    tick: function(){
        let { x, y, z} = this.el.getAttribute('rotation');
        if(movement.up){
            x += 0.8;
            this.el.setAttribute('rotation', {x,y,z});
        } else if (movement.down){
            x -= 0.8;
            this.el.setAttribute('rotation', {x,y,z});
        }
        
        if(movement.left){
            y += 0.8;
            if(z < 30){
               z += 0.5;
            }
            this.el.setAttribute('rotation', {x,y,z});
        } else if (movement.right){
            y -= 0.8;
            if(z > -30){
               z -= 0.5;
            }
            this.el.setAttribute('rotation', {x,y,z});
        } else {
            if (z > 0){
                z -= 0.5;
            } else if (z < 0){
                z += 0.5;
            }
//            console.log("z: ", z);
            if (0.5 > z && z > -0.5){
                z = 0;
            }
            this.el.setAttribute('rotation', {x,y,z});
        }
        rollDisplay.innerHTML = "Roll: " + z.toFixed(2);
        if(throttle.up){
            if (thrust < 1){
                thrust += 0.01;
                console.log("thrust: ", thrust);
            }
        } else if (throttle.down){
            if (thrust > 0){
                thrust -= 0.01;
                console.log("thrust: ", thrust);
            }
        }
        if(thrust <= 0.4 && horizVelocity > 0){
            horizVelocity -= 0.0005;
        } else if (thrust > 0.7 && horizVelocity < maxSpeed){
            horizVelocity += 0.0005 * (1+thrust);
        } else {
            
        }
        if (horizVelocity < 0){
            horizVelocity = 0;
        }
        
        airspeedDisplay.innerHTML = "Airspeed: " + horizVelocity.toFixed(2);
        x = this.el.getAttribute('position').x;
        y = this.el.getAttribute('position').y;
        z = this.el.getAttribute('position').z;
        let ry = this.el.getAttribute('rotation').y;
        let rx = this.el.getAttribute('rotation').x;
        z -= (Math.cos(ry * Math.PI / 180) / 2)* horizVelocity;
        x -= (Math.sin(ry * Math.PI / 180) / 2) * horizVelocity;
        y += (Math.sin(rx * Math.PI / 180) / 2) * horizVelocity;
        
        if (horizVelocity < 0.25 && y > 1.5) {
            y -= 0.01;
        }
        if (horizVelocity < 0.15 && y > 1.5) {
            y -= 0.1;
        }
        thrustDisplay.innerHTML = "Thrust: " + thrust.toFixed(2);
        pitchDisplay.innerHTML = "Pitch: " + rx.toFixed(2);
        altitudeDisplay.innerHTML = "Altitude: " + y.toFixed(2);
        compassDisplayRotation = ry / 360 * 1000 + 125;
        compassDisplay.style.backgroundPosition = compassDisplayRotation.toFixed(0) + "px";
        this.el.setAttribute('position', { x, y, z });
    }

});


var airplane = document.getElementById('airplane');
airplane.addEventListener('collide', function(e){
    console.log("hit: ", e.detail.body);
});