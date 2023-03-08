import { appState } from "../AppState.js"
import { Case } from "../Models/Case.js";
import { Pop } from "../Utils/Pop.js";
import { saveState } from "../Utils/Store.js";


class CasesService {

    setActive(caseId) {
        let foundCase = appState.cases.find(c => c.id == caseId)
        console.log(foundCase);
        appState.activeCase = foundCase
    }
    async unlockCase(input) {
        // console.log(input, 'service unlock');
        let activeCase = appState.activeCase
        let password = appState.clearanceLevels[activeCase.clearance]

        // ANCHOR two console logs here to show off/cross ref the clearance of activeCase and the password pulled from the appState obj using [] notation
        console.log(activeCase);
        console.log(password, 'activeCase password');

        // NOTE if no input (none clearance) or input matches password
        if (password == '' || input == password) {
            console.log("you go it! yay");
            activeCase.unlocked = true
            appState.emit('activeCase')
        } else {
            await Pop.toast("[UNAUTHORIZED] We've tracked your IP")
        }
    }

    saveCase(reportBody) {
        let activeCase = appState.activeCase
        activeCase.report = reportBody
        // lock the case back up after editing it
        activeCase.unlocked = false
        appState.emit('activeCase')
        saveState('cases', appState.cases)
    }

    createCase(caseData) {
        console.log(caseData, 'creating case service');
        // NOTE pass our formdata into our constructor
        const newCase = new Case(caseData)
        appState.cases = [...appState.cases, newCase]
        // console.log(appState.cases);
        newCase.unlocked = true
        appState.activeCase = newCase
        saveState('cases', appState.cases)
    }

}

export const casesService = new CasesService()