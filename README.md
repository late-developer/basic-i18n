# basic-i18n

.js for filling paramters into template resources which can be both, strings and functions returning strings


# What does it do?

With templates defined and organized in language packs and a language activated, the text(id, parameters) function 
returns strings in the active language. The function chooses templates by id and expands paramters in the template with 
help of the parameter object before returning a string.

A template can be a function. If present, it is called by the text function which passes its parameters argument. The 
return value of a template function is expected to be a string and will subsequently (further) parameter expanded by the
text function.

Template functions allow for more than basic functionality.


# How does it look like?

- Language packs are JavaScript objects containing identifiers, template strings and template functions. 

- Parameters in template strings are enclosed by '%'.

- In order to activate a language, its pack object needs to be passed to the basic-i18n object.

- Member names of the parameter object passed to text(id, parameters) are the ones which should be expanded in the 
template, member values are taken and inserted into the template.

- Missing template strings and missing parameters are replaced by '???'.
