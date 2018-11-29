class Game{

    constructor(scene,camera) {
        this.init();
    }

    init(){
        this.scene = new Physijs.Scene();
        this.scene.setGravity(new THREE.Vector3(0, -22, 0));
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.scene.add(this.camera);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        // scene.add(directionalLight);

        // add subtle ambient lighting
        // scene.add(ambientLight);

        this.helix = new THREE.Group();
        this.gFloors = new THREE.Group();
        this.changeFloor = false;
        this.floors = [];
        this.moveLeft=false;
        this.moveRight=false;
        this.moveTop=false;
        this.moveBottom=false;

        this.camera.position.x = 0;
        this.camera.position.y = 2;
        this.camera.position.z = 25;
        
        var geometry = new THREE.SphereGeometry(0.5, 15, 15);
        var material =  Physijs.createMaterial(
            new THREE.MeshBasicMaterial( {color: 0xff0000} ),0.8,1.0
        );
    
        this.ball = new Physijs.SphereMesh( geometry, material );
        this.ball.translateY(4);
        this.ball.translateX(1.4);
        this.ball.setCcdMotionThreshold(1);
        this.ball.addEventListener('collision',function(floor){
            let x = this.getLinearVelocity().x;
            let y = this.position.y;
            this.setLinearVelocity(new THREE.Vector3(0,this.getLinearVelocity().y,0));
            floor.hopLeft-=1;
            if(floor.position.y < y){
                this.setLinearVelocity(new THREE.Vector3(x,16,0));
            }
            else{
                this.setLinearVelocity(new THREE.Vector3(x,-3,0));
            }
        });
        this.scene.add(this.ball);

        this.floorHeight = 0;
        
        var floorGeom = new THREE.CubeGeometry(25,0.5, 0);
        var floorMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({color: 0xff0000}),
            0.8,2.0
        );
        //Physijs.CylinderMesh(geometry,material,gravity)
        var floor = new Physijs.BoxMesh(floorGeom,floorMaterial,0);
        floor.translateY(-2);
        floor.name=floor.uuid;
        floor.hopLeft=4;
        this.scene.add(floor);
        this.floors.push({obj:floor,speed:0});
        this.floorHeight+=2;

        for(let i=0;i<5;i++){
            this.addNewFloor();
        }
    }

    getRandomFloat(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //private
    addNewFloor(){
        //Physijs.CylinderMesh(geometry,material,gravity)
        for(let i=0;i<2;i++){
            var floorGeom = new THREE.CubeGeometry(2.5,0.5, 0);
            var floorMaterial = Physijs.createMaterial(
                new THREE.MeshBasicMaterial({color: 0xff0000}),
                0,2
            );
            var floor = new Physijs.BoxMesh(floorGeom,floorMaterial,0);
            floor.translateY(this.floorHeight);
            floor.translateX(this.getRandomFloat(-15,15));    
            floor.hopLeft=5;
            floor.name=floor.uuid;
            this.scene.add(floor);
            this.floors.push({obj:floor,speed:this.getRandomFloat(-10,10)/100.0});
        }
        this.floorHeight+=4;
        
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

    getFloorColor(hopLeft){
        switch(hopLeft){
            case 5:
            return 0x00ff00;
            case 4:
            return 0x9dff00;
            case 3:
            return 0xfaff00;
            case 2:
            return 0xff7700;
            case 1:
            return 0xff0000;
        }
    }

    updateFloor(){
        for(let i=0;i<this.floors.length;i++){
            let f = this.floors[i];
            f.obj.__dirtyPosition=true;
            f.obj.translateX(f.speed);
            if(f.obj.position.x < -15 || f.obj.position.x > 15){
                f.speed*=-1;
            }
            if(f.obj.hopLeft <= 0){
                //remove object from scene and array list
                let obj = this.scene.getObjectByName(f.obj.name);
                this.scene.remove(obj);
                this.floors.splice(i,1);
            }
            else{
                f.obj.material.color = new THREE.Color(this.getFloorColor(f.obj.hopLeft));
            }
        }
    }

    update(){
        if(this.getCameraHeight()+15 > this.floorHeight){
            this.addNewFloor();
        }
        this.updateFloor();

        this.ball.position.z=0;
        this.ball.rotation.x=0;
        this.ball.rotation.y=0;
        this.ball.rotation.z=0;
        this.ball._physijs.linearVelocity.x = 0;
        this.ball._physijs.linearVelocity.z = 0;
        this.ball._physijs.angularVelocity.x = 0;
        this.ball._physijs.angularVelocity.y = 0;        
        this.ball._physijs.angularVelocity.z = 0;
        this.ball.__dirtyPosition=true;
        this.ball.__dirtyRotation=true;
        let bPos = this.ball.position;
        if(bPos.y < -1){
            this.init();
        }
        if(this.moveLeft){
            this.ball.position.x-=0.12;
        }
        else if(this.moveRight){
            this.ball.position.x+=0.12;
        }
        this.camera.position.set(0,this.getCameraHeight(),25);
        this.camera.lookAt(bPos);    
        this.scene.simulate();

    }

    getCameraHeight(){
        return this.ball.position.y;
    }



}