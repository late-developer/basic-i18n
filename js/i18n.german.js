let german = {

    // Template identifiers are alphanumerical strings which can contain underscores

    // Simple templates (with or without parameters) go here.
    templates: {
    
        HELLO_YOU: 'Hallo, %name%!'
    },

    // For more than basic functionality (i. e. parameter substituion) functions will help out.
    functions: {
        DURATION: duration
    }

};

function duration(params){
    
    if(params.days === 1){
        
        return 'Morgen beginne ich, wieder am Projekt zu arbeiten ...';

    } else if(params.days < 14) {

        // The string to be returned contains a parameter, as a regular template string could do.
        return 'Innerhalb der nächsten %days% Tage beginne ich, wieder am Projekt zu arbeiten ...';

    } else {
        
        return 'Es wird etwas dauern, bevor ich wieder am Projekt zu arbeiten beginne ...';
    }
}
