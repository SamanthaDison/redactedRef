import { Case } from "./Models/Case.js"
import { Value } from "./Models/Value.js"
import { EventEmitter } from "./Utils/EventEmitter.js"
import { isValidProp } from "./Utils/isValidProp.js"
import { loadState } from "./Utils/Store.js"

class AppState extends EventEmitter {
  /** @type {import('./Models/Value').Value[]} */
  values = loadState('values', [Value])

  /** @type {import('./Models/Case').Case[]} */

  cases = loadState('cases', [Case])
  // cases = [
  //   new Case({
  //     report: 'A un identified flying object was seen over code works the other day.',
  //     clearance: 'secret',
  //     agency: '👾'
  //   }),
  //   new Case({
  //     report: 'A large hairy chinned humanoid, was seen tripping on camera behind the full-stack classroom',
  //     clearance: 'none',
  //     agency: '🦄'
  //   }),
  //   new Case({
  //     report: 'Mole People living on the roof of the building.',
  //     clearance: 'top secret',
  //     agency: '🏫'
  //   })
  // ]

  /** @type {import('./Models/Case').Case|null} */

  activeCase = null

  classfiedWords = ['codeworks', 'alien', 'star', 'bitcoin', 'ufo', 'mole', 'hairy', 'flying', 'roof', 'full-stack', 'classroom', 'humanoid', 'camera']

  clearanceLevels = {
    'none': '',
    'secret': 'secret',
    'top secret': 'topsecret',
    'super duper secret': 'soup'
  }
}

export const appState = new Proxy(new AppState(), {
  get(target, prop) {
    isValidProp(target, prop)
    return target[prop]
  },
  set(target, prop, value) {
    isValidProp(target, prop)
    target[prop] = value
    target.emit(prop, value)
    return true
  }
})
