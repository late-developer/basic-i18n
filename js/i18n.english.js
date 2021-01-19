let english = {

    // Template identifiers are alphanumerical strings which can contain underscores

    // Simple templates (with or without parameters) go here.
    templates: {
    
        HELLO_YOU: 'Hello, %name%!'
    },

    // For more than basic functionality (i. e. parameter substituion) functions will help out.
    functions: {
        DURATION: duration
    }

};

function duration(params){
    
    if(params.days === 1){
        
        return 'Tomorrow, I will start working on the project again...';

    } else if(params.days < 14) {
        
        // The string to be returned contains a parameter, as a regular template string could do.
        return 'Within the next %days% days, I will start working on the project again...';

    } else {
        
        return 'It will take a while before I start working on the project again...';
    }
}
