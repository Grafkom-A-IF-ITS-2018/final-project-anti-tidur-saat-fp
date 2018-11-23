class Helix{

    constructor() {
        this.helix = new THREE.Group();
        this.gFloors = new THREE.Group();
        this.changeFloor = false;
        this.floors = [];

        var mainCylinderGeom = new THREE.CylinderGeometry(0.5, 0.5, 16, 16, 1,true);
        var meshMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var mainCylinder = new THREE.Mesh(mainCylinderGeom,meshMaterial);

        this.helix.add(mainCylinder);

        var floor = this.getRandomDisc();
        floor.translateY(1.5);
        this.gFloors.add(floor);
        this.floors.push(floor);

        floor = this.getRandomDisc();
        floor.translateY(-3);
        this.gFloors.add(floor);
        this.floors.push(floor);

        floor = this.getRandomDisc();
        floor.translateY(-7.5);
        this.gFloors.add(floor);
        this.floors.push(floor);


        this.helix.add(this.gFloors);

    }
    getRandomFloat(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //private
    getRandomDisc(){
        var floorGeom = new THREE.CylinderGeometry(2, 2, 0.5, 20, 1
            ,false,this.getRandomFloat(0,Math.PI*2),Math.PI*1.6
        );
        var floorMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var floor = new THREE.Mesh(floorGeom,floorMaterial)
        return floor;
    }

    getObject(){
        return this.helix;
    }

    rotate(clockwise){
        this.gFloors.rotateY(((clockwise)?-1:1)*0.2);
    }

    //private
    isCollide(){
        //not implemented yet
    }

    //private
    isPassedTopFloor(){
        //not implemented yet
    }

    update(){
        if(this.isCollide()){
            if(this.isPassedTopFloor()){
                
            }
            else{

            }
        }
    }



}