/**!  */

import '/src/scss/main.scss'

import Info from './modules/Info'
import Scene3D from './modules/3d/Scene3D'

export default class Main {
  constructor() {
    this.init()
  }

  init() {
    Info.init()
    Scene3D.init()
  }
}

const main = new Main()
