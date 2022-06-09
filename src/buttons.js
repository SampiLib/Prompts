import "./buttons.scss"
import { button } from "../components/button";
import { remToPx } from "../ui/common";
import { Codes, createPromptWindow, Prompt, promptsNameStart, promptsWindowLayer, PromptBaseOptions } from "./common";

/**Defines the return object for a prompt
 * @typedef {Object} PromptButtonsReturnInternal
 * @property {string} data return data
 * @typedef {PromptReturnBase & PromptButtonsReturnInternal} PromptButtonsReturn*/

/**Data to pass for each button in the button prompt
 * @typedef {Object} ButtonPromptButtonValues
 * @property {string} text text in button
 * @property {string|number|boolean} value value to return when button is pressed
 * @property {SVGElement} [symbol] symbol to add to button
 * @property {string} [key] keyboard shortcut for button
 * 
 * Defines buttons prompt options
 * @typedef {Object} PromptButtonsBaseOptions
 * @property {string} [text] the long text of the prompt
 * @property {[ButtonPromptButtonValues]} [buttons] the long text of the prompt
 * 
 * Defines buttons prompt options
 * @typedef {PromptBaseOptions & PromptButtonsBaseOptions} PromptButtonsOptions*/

class Buttons extends Prompt {
    constructor() {
        super();
        this.__buttons = this.appendChild(document.createElement('div'));
    }

    /**Options toggeler
     * @param {PromptButtonsOptions} options*/
    options(options) {
        super.options(options);
        if (options.text) { this.text = options.text; }
        if (options.buttons) { this.buttons = options.buttons; }
    }

    /**Creates an instance of the button prompt
     * @param {PromptButtonsOptions} options
     * @returns {Buttons}*/
    static create(options) {
        if (!(typeof options == 'object')) { console.warn('Parameters not supplied'); return; }
        return createPromptWindow(options, Buttons, { height: 'content', parent, width: remToPx(25), sizeable: false, moveable: false, modal: true, layer: promptsWindowLayer });
    }

    /**Webcomponent name of prompt
     * @returns {string}*/
    static get elementName() { return promptsNameStart + 'buttons'; }

    /**This changes the text of the prompt
     * @param {string} text*/
    set text(text) {
        if (typeof text == 'string') {
            if (!this.__text) { this.__text = this.insertBefore(document.createElement('div'), this.__buttons); }
            this.__text.innerHTML = text;
        } else if (this.__text) {
            this.removeChild(this.__text);
            delete this.__text;
        }
    }

    /**This changes the buttons in the prompt
     * @param {[ButtonPromptButtonValues]} buttons*/
    set buttons(buttons) {
        this.__buttons.innerHTML = '';
        this.__butts = [];
        this.__buttsKeys = {};
        if (buttons instanceof Array) {
            for (let i = 0, m = buttons.length; i < m; i++) {
                this.__buttsKeys[buttons[i].key] = buttons[i].value;
                this.__butts.push(this.__buttons.appendChild(button({
                    symbol: buttons[i].symbol,
                    text: buttons[i].text,
                    click: () => { this.___finish(Codes.ENTER, { data: buttons[i].value }); }
                })));
            }
        } else {
            console.warn('Invalid buttons passed');
        }
    }

    /**Returns a promise for the return from the prompt
     * @returns {Promise<PromptButtonsReturn>} */
    get promise() {
        return super.promise;
    }

    /**Handler for keyboard events
     * @param {KeyboardEvent} e
     * @protected*/
    __keyboard(e) {
        if (e.key == 'Escape') {
            this.___finish(Codes.CLOSED);
        } else if (e.key in this.__buttsKeys) {
            this.___finish(Codes.ENTER, { data: this.__buttsKeys[e.key] });
        }
    }
}
customElements.define(Buttons.elementName, Buttons);
export let buttons = Buttons.create;