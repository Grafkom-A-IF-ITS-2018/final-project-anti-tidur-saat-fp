class Helix{

    constructor(scene) {
        this.scene = scene;
        this.helix = new THREE.Group();
        this.gFloors = new THREE.Group();
        this.changeFloor = false;
        this.floors = [];

        var geometry = new THREE.SphereGeometry(0.3, 15, 15);
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        this.ball = new Physijs.SphereMesh( geometry, material );
        
        this.ball.translateZ(2);
        this.ball.translateY(4);
        this.ball.isFall = true;
        this.ball.height = 0;
        this.ball.addEventListener('collision',function(other_object, relative_velocity, relative_rotation,
            contact_normal){
            //collided
        });
        this.helix.add(this.ball);
        scene.add(this.ball);


        var mainCylinderGeom = new THREE.CylinderGeometry(0.5, 0.5, 16, 16, 1,true);
        var meshMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var mainCylinder = new Physijs.CylinderMesh(mainCylinderGeom,meshMaterial,0);
        this.helix.add(mainCylinder);
        scene.add(mainCylinder);

        var floor = this.getRandomDisc();
        floor.translateY(1.5);
        this.gFloors.add(floor);
        this.floors.push(floor);

        scene.add(floor);

        floor = this.getRandomDisc();
        floor.translateY(-3);
        this.gFloors.add(floor);
        this.floors.push(floor);
        scene.add(floor);


        floor = this.getRandomDisc();
        floor.translateY(-7.5);
        this.gFloors.add(floor);
        this.floors.push(floor);
        scene.add(floor);

        this.helix.add(this.gFloors);
    }

    getRandomFloat(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //private
    getRandomDisc(){
        var floorGeom = new THREE.CylinderGeometry(2, 2, 0.5, 20, 1
            ,false,this.getRandomFloat(0,Math.PI*2),Math.PI*1.5
        );
        var floorMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var floor = new Physijs.CylinderMesh(floorGeom,floorMaterial,0)
        return floor;
    }

    rotate(clockwise){
        for(let i=0;i<3;i++){
            let x = this.floors[i];
            x.__dirtyRotation = true;
            this.floors[i].rotateY(((clockwise)?-1:1)*0.2);
        }
    }

    //private
    isCollide(){
        //not implemented yet
        var vt = this.ball.geometry.vertices
        var len = vt.length;
        for(let i=0; i < len; i++){
            
        }
        
        return false;
    }

    //private
    isPassedTopFloor(){
        //not implemented yet
    }

    update(){
        this.scene.simulate();
    }



}