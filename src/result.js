import { R } from "../common/common";
import { remToPx } from "../ui/common";
import { createPromptWindow, Prompt, promptsNameStart, promptsWindowLayer, PromptBaseOptions } from "./common";

/** Defines result prompt options
 * @typedef {Object} PromptResultInternalOptions
 * @property {R} result the result object to display
 * @property {boolean} showSuccess wether successfull results should be shown
 * 
 * Defines result prompt options
 * @typedef {PromptBaseOptions & PromptResultInternalOptions} PromptResultOptions*/

export class Result extends Prompt {
    /**Options toggeler
     * @param {PromptResultOptions} options*/
    options(options) {
        super.options(options);
        if (options.result) { this.result = options.result; }
    }

    /**Creates an instance of the result prompt
     * @param {PromptResultOptions} options
     * @returns {Result}*/
    static create(options) {
        if (!(typeof options == 'object')) { console.warn('Parameters not supplied'); return; }
        if (options.result instanceof R && (!options.showSuccess || options.result.success)) {
            return createPromptWindow(options, Result, { modal: true, width: remToPx(20), showContent: false, sizeable: false, moveable: false, layer: promptsWindowLayer });
        }
    }

    /**Webcomponent name of prompt
     * @returns {string}*/
    static get elementName() { return promptsNameStart + 'result'; }

    /**Changes the displayd result for the prompt
     * @param {R} r*/
    set result(r) { this.title = (r.success ? 'Success: ' : 'Failure: ') + r.reason; }
}
customElements.define(Result.elementName, Result);
export let result = Result.create;