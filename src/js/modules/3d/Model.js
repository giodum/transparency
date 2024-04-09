import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'

/* *********** */
/* Model Class */
/* *********** */

// The constructor of the class needs an object with
// - name (string): name of the model to be imported
// - file (string): name of the file of the model to be imported
// - scene (THREE.Scene): reference to the scene where the model has to be placed
// - placeOnLoad (boolean - default 'true'): immediately added to the scene
// - mapName (string): name of the texture file
// - envMapName (string): name of the env texture file

// TODO - implement import of uncompressed models

export default class Model {
  // loaders
  static loader = new GLTFLoader()
  static dracoLoader = new DRACOLoader()
  static textureLoader = new THREE.TextureLoader()

  constructor(object) {
    // parameters obtained from constructor object
    this.name = object.name
    this.file = object.file
    this.scene = object.scene
    this.placeOnLoad = object.placeOnLoad || true
    this.mapName = object.mapName
    this.envMapName = object.envMapName

    // flag for model status
    this.isActive = false

    // loader parameters and configuration
    Model.dracoLoader.setDecoderPath('./draco/')
    Model.loader.setDRACOLoader(Model.dracoLoader)

    this.init()
  }

  init() {
    const promises = []

    // promise - loading map texture
    if (this.mapName) {
      const loadMapTexturePromise = new Promise((resolve, reject) => {
        Model.textureLoader.load(this.mapName, resolve, undefined, reject)
      })
      promises.push(loadMapTexturePromise)
    }

    // promise - loading env map texture
    if (this.envMapName) {
      const loadEnvMapTexturePromise = new Promise((resolve, reject) => {
        Model.textureLoader.load(this.envMapName, resolve, undefined, reject)
      })
      promises.push(loadEnvMapTexturePromise)
    }

    // promise - loading model
    const loadModelPromise = new Promise((resolve, reject) => {
      Model.loader.load(this.file, resolve, undefined, reject)
    })
    promises.push(loadModelPromise)

    Promise.all(promises).then((results) => {
      let mapTexture = null
      let envMapTexture = null
      let model = null

      // all three parameters passed
      if (this.mapName && this.envMapName) {
        mapTexture = results[0]
        envMapTexture = results[1]
        model = results[2]
      } else if (this.mapName && !this.envMapName) {
        mapTexture = results[0]
        model = results[1]
      } else if (!this.mapName && this.envMapName) {
        envMapTexture = results[0]
        model = results[1]
      } else {
        model = results[0]
      }

      if (envMapTexture) {
        envMapTexture.mapping = THREE.EquirectangularReflectionMapping
      }

      // generate material
      this.material = new THREE.MeshPhysicalMaterial({
        clearcoat: 1,
        clearcoatRoughness: 0,
        color: 0x00ff00,
        ior: 1.5,
        reflectivity: 0.5,
        roughness: 0.05,
        thickness: 0.2,
        transmission: 1,
        transparent: true,
        // clearcoat: 0.9,
        // color: 0x020202,
        // envMap: envMapTexture,
        // envMapIntensity: 1.5,
        // ior: 1.0,
        // map: mapTexture,
        // roughness: 0.0,
      })

      // save the model mesh
      this.mesh = model.scene.children[0]

      // substitued material
      this.mesh.material = this.material

      // save geometry
      this.geometry = this.mesh.geometry

      // add object to the scene
      if (this.placeOnLoad) {
        this.addToScene()
      }
    })
  }

  addToScene() {
    this.scene.add(this.mesh)
    this.isActive = true
  }

  removeFromScene() {
    this.scene.remove(this.mesh)
    this.isActive = false
  }
}
