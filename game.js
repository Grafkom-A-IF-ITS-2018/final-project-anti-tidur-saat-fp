class Game{

    constructor() {
        this.init();
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
            0,0
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
            if(sound.isPlaying){sound.stop();}
            sound.play();
            if(floor.position.y < y){
                if(this._physijs.linearVelocity.y<0){
                    this.setLinearVelocity(new THREE.Vector3(x,16,0));
                    floor.hopLeft-=1;    
                }
            }
            else{
                this.setLinearVelocity(new THREE.Vector3(x,-3,0));
            }
        });
        this.scene.add(this.ball);
    }        
        
    initSpike(){
        var material = new THREE.MeshPhongMaterial({color:0xffff00})
        
        var loader = new THREE.TextureLoader();
        var scene = this.scene;
        var context = this
        loader.load(
            'assets/red-hot-metal.jpg',
            function ( texture ) {
                material = new THREE.MeshBasicMaterial( {
                    map: texture
                } );
                var sphereGeometry = new THREE.ConeGeometry(0.5, 1, 32);
        
        
                var createCone = function() {
                    var sphere = new THREE.Mesh(sphereGeometry, material);
                    sphere.castShadow = true;
                    return sphere;
                }
                var groupGeometry = new THREE.Geometry();

                for(let i = -25 ; i < 51; i++){
                    var sphereMesh = createCone()
                    sphereMesh.position.set(i,0,0)
                    sphereMesh.updateMatrix()
                    
                    groupGeometry.merge(sphereMesh.geometry, sphereMesh.matrix)
                }

                context.spikes = new THREE.Mesh(groupGeometry,material)
                context.spikes.position.y= -100
                scene.add(context.spikes)
            }
        );
    }

    init(){
        this.end = false;
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


        var loader = new THREE.FontLoader();

        loader.load( 'assets/font.typeface.json', function ( font ) {
            var geometry = new THREE.TextGeometry( 'Hello', {
                font: font,
                size: 100,
                height: 50,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 10,
                bevelSize: 8,
                bevelSegments: 5
                } );
            var material = new THREE.MeshNormalMaterial({color : 0x000000});
            var mesh = new THREE.Mesh(geometry,material);
            console.log(mesh.position);
            GameContext.scene.add(mesh);
        } );


        this.scene.add(this.camera);
        this.initSpike()
        this.score = 0;
        if(this.scoreHtml == null){
            var scoreHtml = document.createElement('div');
            scoreHtml.style.position = 'absolute';
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

    showGameOver()
    {

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
                        mesh.scale.setScale(2,1,1);
                        fTexture = mesh;
                        GameContext.scene.add(mesh);                        
                    })
                })
            } else {
                fTexture = this.floorTexture.clone();
                fTexture.position.set(floor.position.x,floor.position.y,floor.position.z + 1);
                fTexture.position.x -= 1.3;
                fTexture.position.y -= 0.7;
                fTexture.scale.set(2.6,1,1.5);
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
            if(f.obj.position.y < this.spikes.position.y){
                this.scene.remove(f.obj);
                this.scene.remove(f.texture);
                this.floors.splice(i,1);
                i--;
                continue;
            }
            f.obj.__dirtyPosition=true;
            f.obj.translateX(f.speed);
            if (typeof f.texture != 'undefined')f.texture.translateX(f.speed);
            // f.view.position.set(f.position.x, f.position.y, f.position.z + 1);
            if(f.obj.position.x < -15 || f.obj.position.x > 15){
                f.speed*=-1;
            }
            if(f.obj.hopLeft <= 0){                
                this.scene.remove(f.obj);
                this.scene.remove(f.texture);
                this.floors.splice(i,1);
                i--;
            }
            else{
                f.obj.material.color = new THREE.Color(this.getFloorColor(f.obj.hopLeft));
            }
        }
    }

    updateScore(){
        this.score = Math.max(this.score, this.ball.position.y);
        this.scoreHtml.innerHTML = "Score: "+Math.floor(this.score);
    }

    update(){
        if(this.getCameraHeight()+15 > this.floorHeight){
            this.addNewFloor();
        }
        else if(this.spikes == undefined){
            return
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
        if(this.spikes){
            if(bPos.y < this.spikes.position.y){
                this.end = true;
            }
            this.spikes.position.y=this.score-10
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

    isEnd(){
        return this.end;
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