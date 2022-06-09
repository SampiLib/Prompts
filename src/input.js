import "./input.scss"
import { Codes, Prompt, promptsNameStart, promptsWindowLayer, PromptBaseOptions, createPromptWindow, PromptReturnBase } from "./common";
import { remToPx } from "../ui/common";
import { inputBox, InputBoxOptions } from "../components/inputBox";
import { button } from "../components/button";

/**Defines the return object for a prompt
 * @typedef {Object} PromptInputReturnInternal
 * @property {string} data return data
 * @typedef {PromptReturnBase & PromptInputReturnInternal} PromptInputReturn*/

/**Defines input prompt options
 * @typedef {Object} PromptInputBaseOptions
 * @property {string} [text] the long text of the prompt
 * @property {string} [buttonText] The text in the confirming button
 * @property {InputBoxOptions} input the options to pass to the inputbox
 * Defines input prompt options
 * @typedef {PromptBaseOptions & PromptInputBaseOptions} PromptInputOptions*/

class Input extends Prompt {
    /**Options toggeler
     * @param {PromptInputOptions} options*/
    options(options) {
        super.options(options);
        if ('text' in options) { this.text = options.text; }
        this.input = this.appendChild(inputBox({ ...options.input, }));
        this.__button = this.appendChild(button({
            text: options.buttonText || 'OK',
            click: () => { this.___finish(Codes.ENTER, { data: this.input.value }); }
        }));
    }

    /**Creates an instance of the input prompt
     * @param {PromptInputOptions} options
     * @returns {Input}*/
    static create(options) {
        if (!options) { console.warn('Parameter must be passed'); return; }
        //Parent is determined must lead to a window manager
        let prom = createPromptWindow(options, Input, { height: 'content', parent, width: remToPx(20), sizeable: false, moveable: false, modal: true, layer: promptsWindowLayer });
        return prom;
    }

    /**Webcomponent name of prompt
     * @returns {string}*/
    static get elementName() { return promptsNameStart + 'input'; }

    /**This changes the text of the prompt
     * @param {string} text*/
    set text(text) {
        if (typeof text == 'string') {
            if (!this.__text) { this.__text = this.insertBefore(document.createElement('div'), this.input); }
            this.__text.innerHTML = text;
        } else if (this.__text) {
            this.removeChild(this.__text);
            delete this.__text;
        }
    }

    /**This changes the text of the confirmation button
     * @param {string} text*/
    set buttonText(text) { if (typeof text == 'string') { this.__button.text = text; } }

    /**Method handeling key events for prompt
     * @param {KeyboardEvent}
     * @protected */
    __keyboard(e) {
        if (e.key == 'Escape') {
            this.___finish(Codes.CLOSED);
        } else {
            this.input.focus();
        }
    }

    /**Method handeling key events for prompt
     * @param {KeyboardEvent}
     * @protected */
    __keyboardUp(e) {
        if (e.key == 'Enter') {
            this.___finish(Codes.ENTER, { data: this.input.value });
        }
    }

    /**Returns a promise for the return from the prompt
     * @returns {Promise<PromptInputReturn>} */
    get promise() {
        return super.promise;
    }

    focus() {
        super.focus();
        this.input.focus();
    }
}
customElements.define(Input.elementName, Input);
export let input = Input.create;