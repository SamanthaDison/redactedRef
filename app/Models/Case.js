import { appState } from "../AppState.js";
import { generateId } from "../Utils/generateId.js";

export class Case {
    constructor(data) {
        this.id = generateId()
        this.report = data.report || 'no report'
        this.clearance = data.clearance
        this.agency = data.agency
        this.date = data.date ? new Date(data.date) : new Date()
        this.unlocked = false
    }

    get ListTemplate() {
        return `
         <div class="col-12 bg-primary selectable p-2" onclick="app.casesController.setActive('${this.id}')">
              <div class="row">
                <div class="col-1">${this.agency}</div>
                <div class="col-7">${this.ComputeTitle}</div>
                <div class="col-3">${this.ComputeDate}</div>
              </div>
            </div>`
    }

    get UnredactedTemplate() {
        return `
                <div class="col-8">
              <h1>${this.agency} ${this.clearance}</h1>
            </div>
            <div class="col-4"><button class="btn btn-warning" onclick="app.casesController.saveCase()"><i class="mdi mdi-content-save"></i></button>
              <button class="btn btn-success"><i class="mdi mdi-delete"></i></button>
            </div>
            <div class="col-12">${this.ComputeDate}</div>

            <textarea class="col-10 mt-2 report" name="" id="" cols="30"
              rows="10" onblur="app.casesController.saveCase()">${this.report}</textarea>`
    }

    get RedactedTemplate() {
        return `
        <div class="col-8">
              <h1>${this.agency} ${this.clearance}</h1>
            </div>
            <div class="col-4"><button class="btn btn-warning" onclick="app.casesController.unlockCase()"><i class="mdi mdi-key"></i></button>
              <button class="btn btn-success"><i class="mdi mdi-delete"></i></button>
            </div>
            <div class="col-12">${this.ComputeDate}</div>

            <textarea class="col-10 mt-2 report" name="" id="" cols="30"
              rows="10">${this.ComputeRedactedReport}</textarea>`
    }

    // make sure to show off the date constructor methods in MDN web docs before just showing this off
    get ComputeDate() {
        let date = this.date
        return (date.getMonth() + 1) + '/' + (date.getDay()) + '/' + (date.getFullYear())
    }

    get ComputeTitle() {
        return this.report.slice(0, 15) + '...'
    }

    get ComputeRedactedReport() {
        // NOTE this splits the report on spaces and pushes ea. word into an array
        let origReportArry = this.report.split(' ')
        let redactedReportArr = origReportArry.map
            (word => {
                // ANCHOR check to see if the 'word' in our orig array is also a word in the classified list
                if (appState.classfiedWords.includes(word.toLowerCase())) {
                    // ANCHOR if 'word' is also in the classified list, then map (transform) it into a redacted characters, otherwise return the orig. 'word'
                    return '⬛⬛⬛⬛'
                } else {
                    return word
                }
            })
        // ANCHOR lastly, join the indiv. words back into a string
        return redactedReportArr.join(' ')
    }

}