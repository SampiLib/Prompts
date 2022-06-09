import "./info.scss"
import { Prompt, promptsNameStart, promptsWindowLayer, PromptBaseOptions, createPromptWindow } from "./common";
import { remToPx } from "../ui/common";

/**Defines info prompt options
 * @typedef {Object} PromptInfoBaseOptions
 * @property {string} [text] the long text of the prompt*/
/**Defines info prompt options
 * @typedef {PromptBaseOptions & PromptInfoBaseOptions} PromptInfoOptions*/

export class Info extends Prompt {
    /**Options toggeler
     * @param {PromptInfoOptions} options*/
    options(options) {
        super.options(options);
        if (typeof options.text === 'string') { this.text = options.text; }
    }

    /**Creates an instance of the result prompt
     * @param {PromptInfoOptions} options
     * @returns {Info}*/
    static create(options) {
        if (!options) { console.warn('Parameter must be passed'); return; }
        //Parent is determined must lead to a window manager
        let prom = createPromptWindow(options, Info, { height: 'content', modal: true, width: remToPx(20), sizeable: false, moveable: false, layer: promptsWindowLayer, showContent: (options.text ? true : false) });
        return prom;
    }

    /**Webcomponent name of prompt
     * @returns {string}*/
    static get elementName() { return promptsNameStart + 'info'; }

    /**This changes the text of the prompt
     * @param {string} text*/
    set text(text) {
        if (typeof text == 'string' && text != '') {
            this.innerHTML = text;
            this.container.showContent = true;
        } else {
            this.innerHTML = '';
            this.container.showContent = false;
        }
    }
}
customElements.define(Info.elementName, Info);
export let info = Info.create;