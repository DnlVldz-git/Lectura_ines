module.exports = class Palabras {  
    constructor(ruta) {        
        var jsonT = require(ruta);
        this.jsonP = jsonT;
        return this;
    }    
        
    nombreIncludes(text) {                                
        for(var z = 0; z < this.jsonP.nombre.length; z++){                    
            if(text.includes(this.jsonP.nombre[z]))
                return true;            
        }
        return false;
    }

    obtenerNombreIncludes(text) {                                
        for(var z = 0; z < this.jsonP.obtenerNombre.length; z++){                    
            if(text.includes(this.jsonP.obtenerNombre[z]))
                return true;            
        }
        return false;
    }

    domicilioIncludes(text) {
        for( var z = 0; z < this.jsonP.domicilio.length; z++){
            if(text == this.jsonP.domicilio[z]||text.includes(this.jsonP.domicilio[z])||(text.includes('DO')&&(text.includes('ICILIO'))))
                return true;            
        }
        return false;
    }

    seccionIncludes(text) {
        for( var z = 0; z < this.jsonP.seccion.length; z++){
            if(text == this.jsonP.seccion[z]||text.includes(this.jsonP.seccion[z]))
                return true;            
        }
        return false;
    }

    domicilioErroresIsNot(text) {
        for( var z = 0; z < this.jsonP.domicilioErrores.length; z++){
            if(text != this.jsonP.domicilioErrores[z]);
            else{
                return false;
            }
        }
        return true;
    }

    replaceCaracteres(text){
        for( var z = 0; z < this.jsonP.caracteres.length; z++){
            if(text.includes(this.jsonP.caracteres[z]))
                text = text.replace(this.jsonP.caracteres[z], ' ');
        }
        return text;
    }

    carateresIncludes(text){
        for( var z = 0; z < this.jsonP.caracteres.length; z++){
            if(text.includes(this.jsonP.caracteres[z]))
                return true;
        }
        return false;
    }

    claveIncludes(text) {
        for( var z = 0; z < this.jsonP.clave.length; z++){
            if(text.includes(this.jsonP.clave[z]))
                return true;            
        }
        return false;
    }

    vigenciaIncludes(text) {
        for( var z = 0; z < this.jsonP.vigencia.length; z++){
            if(this.jsonP.vigencia.includes(this.jsonP.vigencia[z]))
                return true;            
        }
        return false;
    }

    claveErroresIncludes(text) {
        for( var z = 0; z < this.jsonP.claveErrores.length; z++){
            if(this.jsonP.claveErrores[z] == text||text.includes(this.jsonP.claveErrores[z]))
                return true;            
        }
        return false;
    }

    sexoIncludes(text) {
        for(var z = 0; z < this.jsonP.sexo.length; z++){
            if(text.includes(this.jsonP.sexo[z]))
                return true;            
        }
        return false;
    }
}
