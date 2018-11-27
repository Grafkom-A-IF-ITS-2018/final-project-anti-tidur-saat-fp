class Game{

    constructor(scene,camera) {
        this.scene = scene;
        this.camera = camera;
        this.helix = new THREE.Group();
        this.gFloors = new THREE.Group();
        this.changeFloor = false;
        this.floors = [];

        var geometry = new THREE.SphereGeometry(0.5, 15, 15);
        var material =  Physijs.createMaterial(
            new THREE.MeshBasicMaterial( {color: 0xff0000} ),0.8,1.0
        );
    
        this.ball = new Physijs.SphereMesh( geometry, material );
        this.ball.translateY(4);
        this.ball.translateX(1.4);
        this.ball.setCcdMotionThreshold(1);
        // Set the radius of the embedded sphere such that it is smaller than the object
        this.ball.setCcdSweptSphereRadius(0.2);
        console.log(this.ball);
        this.ball.addEventListener('collision',function(object){
            let x = this.getLinearVelocity().x;
            let y = this.position.y;
            this.setLinearVelocity(new THREE.Vector3(0,this.getLinearVelocity().y,0));
            if(object.position.y < y){
                this.setLinearVelocity(new THREE.Vector3(x,16,0));
            }
            else{
                this.setLinearVelocity(new THREE.Vector3(x,-3,0));
            }

        });
        scene.add(this.ball);

        camera.lookAt(this.ball.position);
        scene.add(camera);
        this.floorHeight = 0;
        
        var floorGeom = new THREE.CubeGeometry(25,0.5, 0);
        var floorMaterial = Physijs.createMaterial(
            new THREE.MeshNormalMaterial({color: 0xff0000,wireframe:true}),
            0.8,2.0
        );
        //Physijs.CylinderMesh(geometry,material,gravity)
        var floor = new Physijs.BoxMesh(floorGeom,floorMaterial,0);
        floor.translateY(-2);
        this.floorHeight+=2;
        scene.add(floor);

        scene.add(this.getRandomDisc());
        scene.add(this.getRandomDisc());
        scene.add(this.getRandomDisc());
    }

    getRandomFloat(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //private
    getRandomDisc(){
        var floorGeom = new THREE.CubeGeometry(2.5,0.5, 0);
        var floorMaterial = Physijs.createMaterial(
            new THREE.MeshNormalMaterial({color: 0xff0000,wireframe:true}),
            0,2
        );
        //Physijs.CylinderMesh(geometry,material,gravity)
        var floor = new Physijs.BoxMesh(floorGeom,floorMaterial,0);
        floor.translateY(this.floorHeight);
        floor.translateX(this.getRandomFloat(-15,15));
        this.floorHeight+=4;
        return floor;
    }

    moveZ(right){
        this.ball.__dirtyPosition=true;
        this.ball.__dirtyRotation=true;
        this.ball.translateZ(((right)?-1:1)*0.2);
    }

    moveBallToLeftStop(){
        this.moveLeft = false;
    }

    moveBallToLeft(){
        this.moveLeft = true;
    }

    moveBallToRightStop(){
        this.moveRight = false;
    }

    moveBallToRight(){
        this.moveRight = true;
    }

    update(){
        this.ball.position.z=0;
        this.ball.rotation.x=0;
        this.ball.rotation.y=0;
        this.ball.rotation.z=0;
        this.ball._physijs.linearVelocity.x = 0;
        this.ball._physijs.linearVelocity.y = 0;
        this.ball._physijs.linearVelocity.z = 0;
        this.ball._physijs.angularVelocity.x = 0;
        this.ball._physijs.angularVelocity.y = 0;        
        this.ball._physijs.angularVelocity.z = 0;   
        this.ball.__dirtyPosition=true;
        this.ball.__dirtyRotation=true;

        if(this.moveLeft){
            this.ball.position.x-=0.12; 
        }
        else if(this.moveRight){
            this.ball.position.x+=0.12;
        }
        this.scene.simulate();
    }



}