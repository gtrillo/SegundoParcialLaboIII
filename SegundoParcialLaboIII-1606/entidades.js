class Vehiculo {
    #id;
    #modelo;
    #anoFab;
    #velMax;
  
    constructor(id, modelo, anoFab, velMax) {
      this.#id = id;
      this.#modelo = modelo;
      this.#anoFab = anoFab;
      this.#velMax = velMax;
    }
  
    toString() {
      return `ID: ${this.#id}, Modelo: ${this.#modelo}, Año de fabricación: ${this.#anoFab}, Velocidad máxima: ${this.#velMax}`;
    }
  
    getId() {
      return this.#id;
    }
  
    getModelo() {
      return this.#modelo;
    }
  
    getAnoFab() {
      return this.#anoFab;
    }
  
    getVelMax() {
      return this.#velMax;
    }
  
    setId(id) {
      this.#id = id;
    }
  
    setModelo(modelo) {
      this.#modelo = modelo;
    }
  
    setAnoFab(anoFab) {
      this.#anoFab = anoFab;
    }
  
    setVelMax(velMax) {
      this.#velMax = velMax;
    }
  }
  


  class Aereo extends Vehiculo {
    #altMax;
    #autonomia;
  
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
      super(id, modelo, anoFab, velMax);
      this.#altMax = altMax;
      this.#autonomia = autonomia;
    }
  
    getAltMax() {
      return this.#altMax;
    }
  
    getAutonomia() {
      return this.#autonomia;
    }
  
    setAltMax(altMax) {
      this.#altMax = altMax;
    }
  
    setAutonomia(autonomia) {
      this.#autonomia = autonomia;
    }
  
    toString() {
      return `${super.toString()}, Altura máxima: ${this.#altMax}, Autonomía: ${this.#autonomia}`;
    }
  }
  
  class Terrestre extends Vehiculo {
    #cantPue;
    #cantRue;
  
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
      super(id, modelo, anoFab, velMax);
      this.#cantPue = cantPue;
      this.#cantRue = cantRue;
    }
  
    getCantPue() {
      return this.#cantPue;
    }
  
    getCantRue() {
      return this.#cantRue;
    }
  
    setCantPue(cantPue) {
      this.#cantPue = cantPue;
    }
  
    setCantRue(cantRue) {
      this.#cantRue = cantRue;
    }
}  
