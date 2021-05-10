let canvas;
let ctx;
let fps = 20; //frame x segundos

let canvasX = 500; //ancho
let canvasY = 500; //largo
let tileX, tileY; //tamaño de los cuadritos

//Variables relacionadas con el tablero de juego
let tablero;
let filas = 100;
let columnas = 100;

let blanco = '#f00';
let negro = '#000';


/* let lista = [0,0,0,0,0];
let tabla = [
  [0, 0, 0, 0, 0], f f f f f f
  [0, 0, 0, 0, 0], c
  [0, 0, 0, 0, 0], c
  [0, 0, 0, 0, 0], c
  [0, 0, 0, 0, 0]  c
] esto es un ejemplo de lo q esta abajo pero grafico*/

//de esta forma se hacen las matrices
//f=fila, c=columna
function crearArray2D(f,c){
  let obj = new Array(f);
  for(y=0; y<f; y++){
    obj[y] = new Array(c)
  }
  return obj;
}

//Objeto Agente o turmita (esto es una function constructora, por eso declaro todas las variables con this)
let Agente = function (x, y, estado) {
  this.x = x;
  this.y = y;
  this.estado = estado; //vivo = 1, muerto = 2
  this.estadoProximo = this.estado;  //estado q tendra en el siguiente ciclo

  this.vecinos = []; //guardamos el estado de sus vecinos

  //Metosdo q añade los vecinos del objeto actual
  this.addVecinos = function(){
    let xVecino;
    let yVecino;

    for(i=-1; i<2; i++){
      for(j=-1; j<2; j++){

        /* ejemplo grafico
            [(-1, -1), (0, -1), (1, -1)]
            [(-1, 0 ), (0, 0 ), (1, 0 )]
            [(-1, 1 ), (0, 1 ), (1, 1 )]
         */

        xVecino = (this.x + j + columnas) % columnas;
        yVecino = (this.y + i + filas) % filas;
        //cn el modulo abra continuidad cuando se salgan de un lado entraran por el otro


        //descartamos el agente actual () yo no puedo ser mi propio vecino)
        if(i !=0 || j !=0){
          this.vecinos.push(tablero[yVecino][xVecino]);
        }
      }
    }

  }

  this.dibuja = function () {
    let color;

    if (this.estado == 1) {
      color = blanco;
    } else {
      color = negro;
    }
    ctx.fillStyle = color;
    ctx.fillRect(this.x*tileX, this.y*tileY, tileX, tileY)
  }

  //Programamos las leyes de Conway
  this.nuevoCiclo = function(){
    let suma = 0;

    //calculamos la cantidad de vecimnos vivos
    for(i=0; i<this.vecinos.length; i++){
      suma += this.vecinos[i].estado;
    }

    //Aplicamos las normas
    this.estadoProximo = this.estado; //por defecto lo dejamos igual

    //Muerte: tiene menos de 2 o mas de 3
    if(suma <2 || suma>3){
      this.estadoProximo = 0;
    }

    //VIDA/REPRODUCCION: tiene exactamente 3 vecinos
    if(suma == 3){
      this.estadoProximo = 1;
    }
  }

  this.mutacion = function () {
    this.estado = this.estadoProximo;
  }
}


function inicializaTablero(obj){

  let estado;

  for(y=0; y<filas; y++){
    for(x=0; x<columnas; x++){

      estado = Math.floor(Math.random()*2);
      obj[y][x] = new Agente(x, y, estado)
    }
  }

  for (y = 0; y < filas; y++) {
    for (x = 0; x < columnas; x++) {

      obj[y][x].addVecinos();
    }
  }
}



function inicializa(){

  //Asociamos el canvas
  canvas = document.getElementById('pantalla');
  ctx = canvas.getContext('2d');

  //Ajustamos el tamaño del canvas
  canvas.width = canvasX;
  canvas.height = canvasY;

  //calculamos tiles(cuadros de tablero)
  tileX = Math.floor(canvasX / filas);//Math.floor(redondeo numero menor)
  tileY = Math.floor(canvasY / columnas);

  //creamos tablero
  tablero = crearArray2D(filas, columnas);
  //lo inicializamos
  inicializaTablero(tablero);

  //Ejecutamos el bucle principal
  setInterval(principal,1000/fps)//velocidad(fps= 1seg/ 30)
}

function dibujarTablero(obj) {
   
  //DIBUJA LOS AGENTES
  for (y = 0; y < filas; y++) {
    for (x = 0; x < columnas; x++){
      obj[y][x].dibuja();
  }
}

//CLACULA EL SIGUIENTE CICLO
  for (y = 0; y < filas; y++) {
    for (x = 0; x < columnas; x++) {
      obj[y][x].nuevoCiclo();
    }
  }

//APLICA LA MUTACION
  for (y = 0; y < filas; y++) {
    for (x = 0; x < columnas; x++) {
      obj[y][x].mutacion();
    }
  }
}

function borrarCanvas(){
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}

function principal(){
  borrarCanvas();
  dibujarTablero(tablero)
}



