Palabras = require('./palabras');

module.exports = function getDatos(json){    
    var data = json;

    var apPat = "";
    var apMat = "";
    var nombre = "";
    var numEx = "";
    var numIn = "";
    var calle = "";
    var colonia = "";
    var cp = "";
    var municipio = "";
    var estado = "";
    var clave = "";
    var seccion = "";

    //cambiar ruta del archivo json de palabras
    var palabras = new Palabras('./palabras.json');

    function obtenerNombre(){
        var contador = 0;
        var contador2 = 0;
        for(i=0; i<data.Blocks.length; i++){                
            if(data.Blocks[i].BlockType == 'LINE'){                 
                if(palabras.nombreIncludes(data.Blocks[i].Text)){   //si encuentra la palabra nombre comenzará a buscar
                    if(i >= 12){
                        break;
                    }
                    for(j = i; j < 14; j++){                        
                        if(palabras.obtenerNombreIncludes(data.Blocks[j].Text)){//si encuentra una palabra que no sea un nombre, no hará nada                 
                            continue;
                        }                        
                        if(palabras.domicilioIncludes(data.Blocks[j].Text)){ //si encuentra domicilio, significa que ya se pasó y probablemente no viene la calle
                            contador2++;
                            continue;
                        }                                                            
                        if(data.Blocks[j].Text.includes('EDAD')){
                            var palabra = data.Blocks[j].Text;
                            var array = palabra.split(' ');
                            var banderaEdad = false;
                            
                            for(z = 0; z < array.length; z++){
                                if(array[z].trim() == 'EDAD'){
                                    banderaEdad = true;
                                    break;
                                }else;                                
                            }
                            if(banderaEdad){
                                continue;
                            }                                        
                        }                                                  
                        if((data.Blocks[j].Text).length <= 2){//si es un texto muy pequeño tendrá error
                            continue;
                        }                        
                        if(contador == 3){
                            break;
                        }                              
                        if(contador == 0){
                            apPat = data.Blocks[j].Text;                        
                            contador++;
                        }else if(contador == 1){                            
                            apMat = data.Blocks[j].Text;                            
                            contador++;                                                    
                        }else if(contador == 2 && (contador2 != 1)){
                            nombre = data.Blocks[j].Text;                            
                            contador++;
                            break;
                        }    
                        if(contador2 == 1){
                            nombre = data.Blocks[j-2].Text;
                            if(palabras.domicilioIncludes(nombre)){
                                nombre = data.Blocks[j-3].Text;
                                
                            }  
                            if(palabras.sexoIncludes(nombre)){
                                nombre = data.Blocks[j-3].Text;
                            }                             
                            apMat = "";                                                       
                            break;                                
                        }                                        
                    }                                      
                }
            }   
            if(i > 30 && nombre == '' && apMat != ''){ //si llega y el nombre está vacío, entonces solo tiene un apellido
                nombre = apMat;
                apMat = '';
            }
        }
    }

    function obtenerClaveElector(){
        for(i= 0; i< data.Blocks.length; i++){
            if(data.Blocks[i].BlockType == 'WORD'){
                if(palabras.claveIncludes(data.Blocks[i].Text)){ //si encuentra clave, leerá
                    clave = data.Blocks[i+1].Text;
                    if(palabras.claveErroresIncludes(clave)){
                        clave = 'INDETECTABLE';
                    }                    
                }
            }    
        }
    }

    function obtenerSeccion(){
        for(i= 0; i< data.Blocks.length; i++){
            if(data.Blocks[i].BlockType == 'WORD'){
                if(palabras.seccionIncludes(data.Blocks[i].Text)){ //si encuentra sección, se detendrá
                    seccion = data.Blocks[i+1].Text;
                    if(data.Blocks[i].Text.length > 7){
                        var array = data.Blocks[i].Text.split(" ");                        
                        if(array.length == 2){
                            seccion = array[1];
                        }                        
                    }                                                            


                    //si encuentra vigencia en el siguiente bloque, significa que la sección está debajo, no a la izquierda
                    if(palabras.vigenciaIncludes(data.Blocks[i+1].Text)){  
                        seccion = data.Blocks[i+3].Text;                        
                        if(data.Blocks[i].Text.length > 7){
                            var array = data.Blocks[i].Text.split(" ");                        
                            if(array.length == 2){
                                seccion = array[1];
                            }
                        }   
                        
                    }
                    if(seccion.length != 4){
                        seccion = 'INDETECTABLE';
                    }                    
                    break;
                }
                if(i ==  data.Blocks.length-1){
                    seccion = 'NO ENCONTRADA';
                }

            }    
        }
    }            

    function obtenerDireccion(){
        var contador = 0;
        var bandera = false;
        var banderaCalleMal = false;
        var banderaColoniaMal = false;
        var banderaError = false;
        for(i=0; i<data.Blocks.length; i++){
            if(data.Blocks[i].BlockType == 'LINE'){
                if(data.Blocks[i].Text.includes('S/N')){//si encuentra s/n es porque es una calle pero no detectó la palabra domicilio
                    bandera = true;                    
                }           
                if(palabras.domicilioIncludes(data.Blocks[i].Text)){//si encuentra domicilio o algo similiar entrará
                    bandera = true;
                    continue;
                }                          
                if(bandera && contador < 3 && isNaN(data.Blocks[i].Text)&&palabras.domicilioErroresIsNot(data.Blocks[i].Text)){ //si no tiene errores, entrará
                    var bandera2LineasDomicilio = false;
                    
                    if(palabras.claveIncludes(data.Blocks[i].Text)){ //si encuentra elector, significa que ya se pasó y probablemente no tiene calle
                        calle = "NO SE ENCONTRÓ";
                        contador = 1;
                        bandera2LineasDomicilio = true;
                    }
                    if(data.Blocks[i].Text.length <= 6||palabras.domicilioIncludes(data.Blocks[i].Text)){ //si hay errores, continuará
                        banderaError = true;
                        continue;
                    }
                    if(contador == 0){//aquí obtiene la calle y los números
                        if(!palabras.domicilioErroresIsNot(data.Blocks[i].Text)){
                            banderaCalleMal = true;
                           continue;
                        }                 

                        var cadena = data.Blocks[i].Text;

                        cadena = palabras.replaceCaracteres(cadena);

                        var arrayDeCadenas = cadena.split(" ");                    
                        if(!isNaN(parseInt(arrayDeCadenas[arrayDeCadenas.length-2]))){
                            numEx = arrayDeCadenas[arrayDeCadenas.length-2];
                            numIn = arrayDeCadenas[arrayDeCadenas.length-1];

                            for(j = 0; j < arrayDeCadenas.length-2; j++ ){     
                                if(j == 0)
                                    calle = calle.concat(arrayDeCadenas[j]);  
                                else             
                                    calle = calle.concat(" " + arrayDeCadenas[j]);
                            }

                        }else{
                            if(arrayDeCadenas[arrayDeCadenas.length-1].length <=4){
                                numEx = arrayDeCadenas[arrayDeCadenas.length-1];                                

                                for(j = 0; j < arrayDeCadenas.length-1; j++ ){
                                    if(j == 0)
                                        calle = calle.concat(arrayDeCadenas[j]);  
                                    else             
                                        calle = calle.concat(" " + arrayDeCadenas[j]);                   
                                }

                            }else{
                                numEx = 'NUMERO INDETECTABLE';

                                for(j = 0; j < arrayDeCadenas.length; j++ ){
                                    if(j == 0)
                                        calle = calle.concat(arrayDeCadenas[j]);  
                                    else             
                                        calle = calle.concat(" " + arrayDeCadenas[j]);                   
                                }
                                
                            }                            
                        }                                                                                                   
                    }
                    if(contador == 1){//aquí obtiene la colonia y el código postal                   
                        if(bandera2LineasDomicilio){
                            var arrayDeCadenas = data.Blocks[i-2].Text.split(" ");                            
                            contador = 2;
                            calle = "NO SE ENCONTRÓ";
                            colonia = "";
                        }else{
                            var arrayDeCadenas = data.Blocks[i].Text.split(" ");
                        }                                                                   

                        cp = arrayDeCadenas[arrayDeCadenas.length-1];

                        cp = palabras.replaceCaracteres(cp);

                        for(j = 0; j < arrayDeCadenas.length-1; j++ ){
                            if(j == 0)
                                colonia = colonia.concat(arrayDeCadenas[j]);  
                            else             
                                colonia = colonia.concat(" " + arrayDeCadenas[j]);                   
                        }
                                                           
                    }       
                    var cadena2 = "";          
                    if(contador == 2){//aquí obtiene municipio y estado
                        if(bandera2LineasDomicilio){
                            var arrayDeCadenas = data.Blocks[i-1].Text.split(" ");
                        }else{
                            var arrayDeCadenas = data.Blocks[i].Text.split(" ");
                        }
                        
                        for(j = 0; j < arrayDeCadenas.length; j++){       
                            if(j == 0){
                                cadena2 = cadena2.concat(arrayDeCadenas[j]);  
                            }else{
                                cadena2 = cadena2.concat(" "+arrayDeCadenas[j]);  
                            }                                                                          
                        }   
                        var arrayDeCadenas2;                        
                        if(palabras.carateresIncludes(cadena2)){                             
                            cadena2 = palabras.replaceCaracteres(cadena2);
                        }else{ 
                            arrayDeCadenas2 = arrayDeCadenas;
                        }

                        arrayDeCadenas2 = cadena2.split(" ");                                            

                        for(j = 0; j < arrayDeCadenas2.length; j++){
                            if(arrayDeCadenas2[j] == ""){
                                arrayDeCadenas2.splice(j, 1);
                            }
                        }                        
                        
                        for(j = 0; j < arrayDeCadenas2.length-1; j++){
                            if(j == 0){
                                municipio = municipio.concat(arrayDeCadenas2[j]);
                            }else{
                                municipio = municipio.concat(" "+ arrayDeCadenas2[j]);
                            } 

                            if(palabras.carateresIncludes(municipio)){
                                municipio = palabras.replaceCaracteres(municipio);                                
                            }
                        }

                        estado = arrayDeCadenas2[arrayDeCadenas2.length-1];

                        if(palabras.carateresIncludes(estado))
                            estado = palabras.replaceCaracteres(estado);
                                                    
                    }
                    if(banderaError){
                        banderaError = false;
                        if(contador == 0){
                            contador = 1;
                        }else if(contador == 1){
                            contador = 2;
                        }else if(contador == 2){
                            contador = 3;
                        }
                        
                    }else if(banderaCalleMal){
                        contador = 1;
                        banderaCalleMal = false;  
                    }else
                        contador++;                                        
                }
            }
        }
    }

    obtenerNombre();
    obtenerDireccion();
    obtenerClaveElector();
    obtenerSeccion()

    let persona = {
        apellidoPat: apPat,
        apellidoMat: apMat,
        nombre: nombre,
        numEx: numEx,
        numIn: numIn,
        calle: calle,
        colonia: colonia,
        cp: cp,
        municipio: municipio,
        estado: estado,
        clave: clave,
        seccion: seccion
    }

    const fs = require('fs');

    let datos = JSON.stringify(persona, null, 2);    

    return datos;
}




