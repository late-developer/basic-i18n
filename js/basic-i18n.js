(function (factory){
    
    'use strict';
    
    if(typeof window === 'object'){
        let _OldI18n = window.I18n;
        let api = window.I18n = factory();
        api.noConflict = function () {
            window.I18n = _OldI18n;
            return api;
        };
    }

}(function(){

    'use strict';

    let constructor = function(){

        this.language = {};
    },

    prototype = {

        /**
         * Sets the language pack.
         * 
         * The language pack is expected to show either a templates, or a functions member, or both like in the 
         * following code: 
         * 
         *  let english = { 
         *      templates: { 
         *          HELLO: 'Hello, %who%!' 
         *      }, 
         *      functions: { 
         *          EXAMPLE: function(parameters){ return 'Example string with %parameter%.'; } 
         *      } 
         *  };
         * 
         * Parameters in the signature is a parameter object as described in the comments for text(id, parameters).
         *
         * Example: setLanguage(english);
         * 
         * @param {object} object
         * 
         * @returns true if successful, i. e. the language pack shows the expected structure, false otherwise.
         */
        setLanguage: function(object){

            let checks = {

                f: 'i18n.setLanguage(object): ',

                isObjectOk: function(){
                    if(! (object && (object.templates || object.functions))){
                        warn(this.f + 'Language object not set. ' 
                            + 'Is it undefined or missing both, the \'templates\' and \'functions\' member?');
                        return false;
                    }
                    return true;
                }
            };

            if(! checks.isObjectOk()) return false;
            
            this.language = object;
            return true;
        },

        /**
         * Retrieves a template, expands it, and returns the result.
         * 
         * If present, takes the function with the given id from the language pack and invokes it with the given
         * parameters. The returned string is expanded with help of the given parameters, then. 
         * 
         * If no function is present, the string with the given id is taken from the templates section of the language
         * pack, and expanded with help of the given parameters.
         * 
         * If a parameter is found in the template string but not present in the parameter object, its expansion will be
         * '???'.
         * 
         * Example: text('HELLO', { who: 'Coder' });
         * 
         * @param {string} id           Member name in either the functions or the templates object in the language
         *                              pack denoting a template.
         * @param {object} parameters   A template's parameter (enclosed in two %) is looked up here and replaced by the
         *                              literal value found.
         *
         * @returns A string that is an expanded template.
         */
        text: function(id, parameters){

            let templateFn
            ,   templateFnValue
            ,   templateValue;

            let checks = {

                f: 'i18n.text(id, parameters): ',

                doAllParametersExist: function(template){
                    let absentees = getMissingParameters(template, parameters);
                    if(absentees.length){
                        warn(this.f + 'Paramters missing in template \'' + id 
                            + '\' (from functions or templates): ' + absentees.join(', '));
                        return false;
                    }
                    return true;
                },

                isIdOk: function(){
                    if(! id){
                        warn(this.f + 'Returning empty string as id is falsy');
                        return false;
                    }
                    return true;
                },

                isTemplateFnOk: function(){
                    if(! templateFn || typeof templateFn !== 'function'){
                        warn(this.f + 'Returning empty string as \'' + id + '\' in functions is not a function');
                        return false;
                    }
                    return true;
                },

                isTemplateFnValueOk: function(){
                    if(templateFnValue === undefined || templateFnValue === null 
                        || typeof templateFnValue !== 'string')
                    {
                        warn(this.f + 'Returning empty string as \'' + id + '\' in functions does not return a string');
                        return false;
                    }
                    return true;
                },

                doAllParametersInTemplateFnValueExist: function(){
                    return this.doAllParametersExist(templateFnValue);
                },

                isTemplateValueOk: function(){
                    if(templateValue === undefined || templateValue === null || 
                        typeof templateValue !== 'string')
                    {
                        warn(this.f + 'Returning empty string as \'' + id + '\' in templates is not a string');
                        return false;
                    }
                    return true;
                },

                doAllParametersInTemplateValueExist: function(){
                    return this.doAllParametersExist(templateValue);
                },

                hasNoId: function(){
                    warn(this.f + 'Returning empty string as \'' + id + '\' does not exist');
                    return false;
                }

            };

            if(! checks.isIdOk()) return EMPTY_STRING;

            if(this.language.functions && id in this.language.functions){
                templateFn = this.language.functions[id]; 
                if(! checks.isTemplateFnOk()) return EMPTY_STRING;
                templateFnValue = templateFn(parameters);
                if(! checks.isTemplateFnValueOk()) return EMPTY_STRING;
                if(! checks.doAllParametersInTemplateFnValueExist());
                return stringAssembler(getParts(templateFnValue), parameters);
            }

            if(this.language.templates && id in this.language.templates){
                templateValue = this.language.templates[id];
                if(! checks.isTemplateValueOk()) return EMPTY_STRING;
                if(! checks.doAllParametersInTemplateValueExist());
                return stringAssembler(getParts(templateValue), parameters);
            }

            if(! checks.hasNoId());
            return EMPTY_STRING;

        }

    };

    constructor.prototype = prototype;

    // String used when parameter is unknown, or known and undefined.
    const MISSING_STRING = '???';

    // String used by text when parameters are inadequate.
    const EMPTY_STRING = '';

    // 'Hello, %who%!' returns [ 'Hello', 'who', '!' ]. Every 2nd array entry is a parameter name.
    function getParts(template){
        
        // ToDo Use a regexp pattern containing a (named) constant instead of a magical symbol
        return template.split(/%(\w*)%/);
    }

    // Builds a string from parts and parameters.
    function stringAssembler(parts, parameters){

        let ret = '';

        parts.forEach((part, index) => {
            if(index % 2 === 0){
                ret = ret + part;
            } else {
                let value = MISSING_STRING;
                if(parameters && part in parameters){
                    value = parameters[part]; // ToDo Is parameters[part] really convertible to a string?
                }
                ret = ret + value;
            }
        });

        return ret;
    }
    
    // Returns the names of parameters found in template but not present in parameters as an array.
    function getMissingParameters(template, parameters){
        
        let parts = getParts(template)
        ,   missing = [];

        parts.forEach((part, index) => {
            if(index % 2 === 1){
                if(! (part in parameters)){
                    missing.push(part);
                }
            }
        });
        
        return missing;
    }

    // Used by the public member functions when their arguments are inadequate.
    function warn(text){

        if(console){
            console.warn(text);
        }
    }

    return constructor;

}));
