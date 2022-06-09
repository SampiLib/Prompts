import { Content, ContentBaseOptions } from '../ui/content';
import { mainWindowManager, uiWindow } from '../ui/windows.js';

export let promptsNameStart = 'prompts-';
export let promptsWindowLayer = 99999;

/**To keep a prompt from closing the manualClosing option needs to be set true
 * 
 * For prompts which return values the prompt can be kept open until the correct value is returned using the below example in an async function
 * let prompt = prompt({});
 * while (true) {
 *   let result = await prompt.promise;
 *   if (result) {
 *      prompt.close();
 *      return;
 *   }
 * }
 */

/**A prompt returns an object with the following values {prompt:a reference to the prompt itself, window:a reference to the prompts window, promise:a promise for the prompts completion}
 * The promise value is an object with the close code and any other data made by the prompt {code:''}
 * Standard closing codes for prompts
 * @readonly
 * @enum {string}*/
export let Codes = {
    CLOSED: 'closed', //Code used when prompt is closed
    ENTER: 'enter', //Code used when data is entered
}

/**This function creates a window for the prompt
 * @param {PromptBaseOptions} options
 * @param {typeof Prompt} promptClass
 * @returns {Prompt}*/
export let createPromptWindow = (options, promptClass, windowParams) => {
    //Parent is determined must lead to a window manager
    let prompt = new promptClass();

    prompt.window = uiWindow({ ...windowParams, content: prompt });
    prompt.options(options);
    (options.parent instanceof HTMLElement ? options.parent.windowManager : mainWindowManager).appendWindow(prompt.window);
    prompt.window.select();
    return prompt;
}


/**Defines the return object for a prompt
 * @typedef {Object} PromptReturnBase
 * @property {Codes} code return code */

/**Defines base prompt options
 * @typedef {Object} PromptBaseOptionsInternal
 * @property {string} [title] the title of the prompt
 * @property {boolean} [manualClose] whether the prompt will be closed manually
 * 
 * @typedef {ContentBaseOptions & PromptBaseOptionsInternal} PromptBaseOptions*/

export class Prompt extends Content {
    constructor() {
        super();
        /**Stores all callbacks for the prompt
         * @type {Promise<PromptReturnBase>}
         * @protected */
        this.___promise = null;
    }

    /**Options toggeler
     * @param {PromptBaseOptions} options*/
    options(options) {
        super.options(options);
        if (options.title) { this.title = options.title; }
        if (options.manualClose) { this.manualClose = options.manualClose; }
    }

    /**This changes the title of the prompt
     * @param {string} title*/
    set title(title) {
        if (typeof title == 'string') {
            this.name = title;
        } else {
            console.warn('Title must be string');
        }
    }

    /**This makes it so the prompt 
     * @param {boolean} mc*/
    set manualClose(mc) {
        this.___manualClose = Boolean(mc);
    }

    /**Returns a promise for the return from the prompt
     * @returns {Promise<PromptReturnBase>} */
    get promise() {
        return new Promise((a) => this.___promise = a);
    }

    /**Called when the prompt is finished
     * @param {Codes} code 
     * @param {Object} data
     * @protected*/
    ___finish(code, data) {
        this.___runCallbacks(code, data);
        if (!this.___manualClose || code === Codes.CLOSED) {
            this.close({ code, ...data });
        }
    }

    /**Called when the prompt is finished
     * @param {Codes} code 
     * @param {Object} data
     * @protected*/
    ___runCallbacks(code, data) {
        if (this.___promise) {
            this.___promise({ code, ...data });
        }
    }

    /**Overwrite for closing function*/
    onClose() {
        this.___runCallbacks(Codes.CLOSED);
    }

    /** Keyboard event processed for content
     * @param {KeyboardEvent} event
     * @protected*/
    __keyboard(e) {
        if (e.key == 'Escape') {
            this.___finish(Codes.CLOSED);
        }
    }
}