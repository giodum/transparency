import {GUI} from 'dat.gui'

// singleton pattern
export default class Parameters {
  static #params = {
    param1: 5,
  }

  constructor() {}

  static getInstance() {
    // if never initialized
    // initialize a new instance
    if (!Parameters.instance) {
      Parameters.instance = new Parameters()
    }

    // return the instance
    return Parameters.instance
  }

  // public getter for params
  get params() {
    return Parameters.#params
  }

  // setter object for callback functions
  setObject(object) {
    this.object = object
  }

  // initialize GUI
  // to be run after setting object
  initGui() {
    if (!this.object) {
      throw new Error('Object for callbacks has not been passed')
    }

    // init new dat.GUI
    this.gui = new GUI()

    // set GUI width
    this.gui.width = 350
    this.gui.closed = true

    // add parameters to guid
    this.gui
      .add(Parameters.#params, 'param1')
      .min(1)
      .max(30)
      .step(1)
      .name('Param 1')
      .onChange(() => {
        // use callback function from object
        // this.object.callback()
      })
  }
}
