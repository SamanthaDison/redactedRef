import { appState } from "../AppState.js"
import { casesService } from "../Services/CasesService.js"
import { getFormData } from "../Utils/FormHandler.js"
import { Pop } from "../Utils/Pop.js"
import { setHTML } from "../Utils/Writer.js"

function _drawCases() {
    let cases = appState.cases
    let template = ''
    cases.forEach(c => template += c.ListTemplate)
    setHTML('cases', template)
}

function _drawActiveCase() {
    console.log('drawing');
    let activeCase = appState.activeCase
    if (activeCase.unlocked) {
        setHTML('active', activeCase.UnredactedTemplate)
    } else {
        setHTML('active', activeCase.RedactedTemplate)
    }
}

export class CasesController {
    constructor() {
        console.log('hello from the cases controller')
        _drawCases()
        appState.on('activeCase', _drawActiveCase)
        appState.on('cases', _drawCases)
    }

    setActive(caseId) {
        console.log(caseId);
        casesService.setActive(caseId)
    }

    async unlockCase() {
        let input = ''
        console.log('unlock this case');
        if (appState.activeCase.clearance != 'none') {
            // NOTE review pop util, this second arg just removes the cancel btn on popup
            input = await Pop.prompt('password', true)
            console.log('you gotta unlock bro', input);
        }
        casesService.unlockCase(input)
        // @ts-ignore
        document.querySelector('.report').focus()
    }

    saveCase() {
        // console.log('save case');
        let reportBody = document.querySelector('.report')
        // NOTE this grabs the entire elem
        // console.log(reportBody);
        // @ts-ignore
        console.log(reportBody.value);
        // @ts-ignore
        casesService.saveCase(reportBody.value)
    }

    createCase() {
        window.event.preventDefault()
        console.log('creating case');
        // NOTE 'target' the onsubmit event
        const form = window.event.target
        // NOTE provide form util w the form from the onsubmit...this will strip our input values
        let caseData = getFormData(form)
        console.log(caseData, 'new case');
        // NOTE make sure to pass the data to the service before clearing the form
        casesService.createCase(caseData)
        // @ts-ignore
        form.reset()
        // @ts-ignore
        document.querySelector('.report').focus()
    }
}