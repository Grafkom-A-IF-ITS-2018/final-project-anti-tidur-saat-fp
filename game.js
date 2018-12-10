class Game{

    constructor(renderer) {
        this.init(renderer);
    }

    initFloor(){
        this.helix = new THREE.Group();
        this.gFloors = new THREE.Group();
        this.changeFloor = false;
        this.floors = [];
        this.floorsTextures = [];
        this.moveLeft=false;
        this.moveRight=false;
        this.moveTop=false;
        this.moveBottom=false;
        this.score = 0;

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
        
        //console.log(floor.position)
        // floor.mass=2;
        // floor.obj.position.z = floor.position.z -1 ;
        this.scene.add(floor);
        this.floors.push({obj:floor,speed:0});
        this.floorsTextures.push({obj:floor});
        this.floorHeight+=2;                
        for(let i=0;i<5;i++){
            this.addNewFloor();
        }
    }
    initBall(){
        var listener = new THREE.AudioListener();
        this.camera.add(listener);

        var sound = new THREE.PositionalAudio( listener );

        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'assets/bounce.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setRefDistance( 2 );
        });

        var geometry = new THREE.SphereGeometry(0.5, 15, 15);
        var material =  Physijs.createMaterial(
            new THREE.MeshPhongMaterial( {color: 0xff0000} ),0.8,1.0
        );
    
        this.ball = new Physijs.SphereMesh( geometry, material );
        this.ball.translateY(4);
        this.ball.translateX(1.4);
        this.ball.setCcdMotionThreshold(1);
        this.ball.add(sound);            
        this.ball.addEventListener('collision',function(floor){
            let x = this.getLinearVelocity().x;
            let y = this.position.y;
            this.setLinearVelocity(new THREE.Vector3(0,this.getLinearVelocity().y,0));            
            sound.play();
            if(floor.position.y < y){
                this.setLinearVelocity(new THREE.Vector3(x,16,0));
                floor.hopLeft-=1;
            }
            else{
                this.setLinearVelocity(new THREE.Vector3(x,-3,0));
            }
        });
        this.scene.add(this.ball);
    }

    init(renderer){
        this.floorTexture;
        let GameContext = this;        
        var mtlLoader = new THREE.MTLLoader();                        
        mtlLoader.load("assets/block.mtl", function(materials){            
            materials.preload()            
            var objLoader = new THREE.OBJLoader()
            objLoader.setMaterials(materials)

            objLoader.load("assets/block.obj", function(mesh){                                       
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                GameContext.floorTexture = mesh;  
                console.log("Done");
            })
        }) 
        //  while(isLoading);        
        this.scene = new Physijs.Scene();
        this.scene.setGravity(new THREE.Vector3(0, -22, 0));
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = 2;
        this.camera.position.z = 25;
        
        var ambientLight = new THREE.AmbientLight(0xffffff,0.7);
        this.scene.add(ambientLight);
        var light = new THREE.PointLight(0xffffff, 0.5, Infinity);
        this.camera.add(light);

        this.scene.add(this.camera);

        this.score = 0;
        if(this.scoreHtml == null){
            var scoreHtml = document.createElement('div');
            scoreHtml.style.position = 'absolute';
            //scoreHtml.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
            scoreHtml.style.width = 100;
            scoreHtml.style.height = 100;
            scoreHtml.style.color = "red";
            scoreHtml.style.fontSize = "30px";
            scoreHtml.innerHTML = "0";
            scoreHtml.style.top = 10 + 'px';
            scoreHtml.style.left = 100 + 'px';
            document.body.appendChild(scoreHtml);
    
            this.scoreHtml = scoreHtml;    
        }

        this.initBall();
        this.initFloor();

        var video = document.getElementById('video');
        var texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.NearestFilter;
        this.scene.background = texture;

    }

    getRandomFloat(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    addNewFloor(){
        //Physijs.CylinderMesh(geometry,material,gravity)                

        //console.log(this.floorTexture[0]);
        //let tempFloorTexture = this.fl
        for(let i=0;i<2;i++){            
            var floorGeom = new THREE.CubeGeometry(2.5,0.5, 0);
            var floorMaterial = Physijs.createMaterial(
                new THREE.MeshPhongMaterial({color: 0xff0000}),
                0,2
            );        
            
            var floor = new Physijs.BoxMesh(floorGeom,floorMaterial,0);
            floor.translateY(this.floorHeight);
            floor.translateX(this.getRandomFloat(-15,15));    
            floor.hopLeft=5;
            floor.name=floor.uuid;
                            
            let fTexture;            
            if (this.floorTexture == undefined){
                let GameContext = this;
                let x = floor.position.x;
                let y = floor.position.y;
                let z = floor.position.z + 1;
                var mtlLoader = new THREE.MTLLoader();                        
                mtlLoader.load("assets/block.mtl", function(materials){            
                    materials.preload()            
                    var objLoader = new THREE.OBJLoader()
                    objLoader.setMaterials(materials)

                    objLoader.load("assets/block.obj", function(mesh){                                       
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        fTexture = mesh;
                        GameContext.scene.add(mesh);                        
                    })
                })
            } else {
                fTexture = this.floorTexture.clone();
                fTexture.position.set(floor.position.x,floor.position.y,floor.position.z + 1);
                this.scene.add(fTexture);
            }
            

            this.scene.add(floor);            
            let tempSpeed = this.getRandomFloat(-10,10)/100.0;
            this.floors.push({obj:floor,texture: fTexture,speed:tempSpeed});                                       
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
        
        for(let i=1;i<this.floors.length;i++){            
            let f = this.floors[i];
            let t = this.floorsTextures[i];                        
            f.obj.__dirtyPosition=true;
            f.obj.translateX(f.speed);
            if (typeof f.texture != 'undefined')f.texture.translateX(f.speed);
            // f.view.position.set(f.position.x, f.position.y, f.position.z + 1);
            if(f.obj.position.x < -15 || f.obj.position.x > 15){
                f.speed*=-1;
            }
            if(f.obj.hopLeft <= 0){
                //remove object from scene and array list
                let obj = this.scene.getObjectByName(f.obj.name);
                //console.log(obj);                
                this.scene.remove(f.obj);
                this.scene.remove(f.texture);
                this.floors.splice(i,1);
            }
            else{
                f.obj.material.color = new THREE.Color(this.getFloorColor(f.obj.hopLeft));
            }
        }
    }

    updateScore(){
        this.score = Math.max(this.score, this.ball.position.y);
        this.scoreHtml.innerHTML = Math.floor(this.score);
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
        if(bPos.y < -2){
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
        this.updateScore();
    }

    getCameraHeight(){
        return this.ball.position.y;
    }

    getScore(){
        let temp = this.getCameraHeight();
        if(temp > this.score)
            this.score = temp;
        return Math.floor(this.score);
    }

}