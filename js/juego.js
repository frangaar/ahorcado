addEventListener('DOMContentLoaded',function(){

    const NUMERRORES = 6;
    
    let userName = localStorage.getItem('playerName');
    let arrayObjList = [];

    //Por si se juegan varias partidas seguidas y poder guardar en ranking
    if(localStorage.getItem('arrayObjetosMultiple') != "" && localStorage.getItem('arrayObjetosMultiple') != "null"
        && localStorage.getItem('arrayObjetosMultiple') != null  && localStorage.getItem('arrayObjetosMultiple') != undefined){
        arrayObjList = JSON.parse(localStorage.getItem('arrayObjetosMultiple'));
    }

    let lblPlayerName = document.getElementById('userName');
    let lblCategoria = document.getElementById('categoria');
    let lblFallos = document.getElementById('lblFallos');
    let lblTiempo = document.getElementById('tiempoJuego');

    let letrasUtilizadas = {letras:{}};
    let tmpLetras = new Array();

    let pulsadas = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    const LETRAS = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','ñ','z','x','c','v','b','n','m'];
    let letra;
    let fichas = document.getElementById('letras');
    let fallos = 0;
    let tmpLetrasRecuperadas;

    let categoria = '';
    let palabra = '';
    let definicion = ''; 
    let imagen = '';
    
    let intervalID = setInterval(incrementaTiempo,1000)
    //Persistencia de datos
    //Recupera palabra guardada
    if(localStorage.getItem('palabraSeleccionada') != "" && localStorage.getItem('palabraSeleccionada') != "null"
        && localStorage.getItem('palabraSeleccionada') != null  && localStorage.getItem('palabraSeleccionada') != undefined){
        palabra = localStorage.getItem('palabraSeleccionada');
        categoria = localStorage.getItem('categoriaSeleccionada');
        definicion = localStorage.getItem('definicionSeleccionada');
        imagen = localStorage.getItem('imagenSeleccionada');
        lblFallos.innerHTML = lblFallos.innerText + ' ' + localStorage.getItem('intentos');
        lblTiempo.innerHTML = localStorage.getItem('tiempo');
    }else{
        escogePalabra();
        lblFallos.innerHTML = lblFallos.innerText + ' ' + NUMERRORES;
        lblTiempo.innerHTML = 0;
    }
    

    //Persistencia de datos
    localStorage.setItem('palabraSeleccionada',palabra);
    localStorage.setItem('categoriaSeleccionada',categoria);
    localStorage.setItem('definicionSeleccionada',definicion);
    localStorage.setItem('imagenSeleccionada',imagen);
    localStorage.setItem('intentos',NUMERRORES);
    localStorage.setItem('tiempo',parseInt(lblTiempo.innerHTML));


    lblPlayerName.innerHTML = userName;
    lblCategoria.innerHTML = categoria;

    
    let palabraSecreta = document.getElementById('palabra');

    for (let index = 0; index < palabra.length; index++) {
        
        letraPalabra = document.createElement('div');
        letraPalabra.setAttribute('class','letraOculta');
        letraPalabra.setAttribute('data-letra',palabra[index].toUpperCase());
        letraPalabra.setAttribute('data-oculta','true');
        if(palabra[index] == ' '){
            letraPalabra.style.backgroundImage = 'none';
        }
        
        palabraSecreta.appendChild(letraPalabra);
    }
    

    //Persistencia de datos
    if(localStorage.getItem('letrasUtilizadas') != "" && localStorage.getItem('letrasUtilizadas') != "null"
        && localStorage.getItem('letrasUtilizadas') != null  && localStorage.getItem('letrasUtilizadas') != undefined){

        tmpLetrasRecuperadas = Object.values(JSON.parse(localStorage.getItem('letrasUtilizadas')).letras.letra);
    }

    for (let index = 0; index < LETRAS.length; index++) {
        
        letra = document.createElement('input');
        letra.setAttribute('type','button');
        letra.setAttribute('class','letra btn btn-info');
        letra.setAttribute('data-letra',LETRAS[index].toUpperCase());
        letra.setAttribute('value',LETRAS[index].toUpperCase());

        //Persistencia de datos
        //Deshabilita letras utilizadas
        if(tmpLetrasRecuperadas != undefined){
            for (let indice = 0; indice < tmpLetrasRecuperadas.length; indice++) {
                if(LETRAS[index].toUpperCase() == tmpLetrasRecuperadas[indice]){
                    letra.setAttribute('disabled','');
                    compruebaLetra(tmpLetrasRecuperadas[indice]);
                    guardarLetras(tmpLetrasRecuperadas[indice]);
                }
            }
        }
        
        fichas.appendChild(letra);

        deshabilitarTodas();

        letra.addEventListener('click', function (event){
            let item = event.currentTarget;
            item.setAttribute('disabled','');
            let letraSeleccionada = item.value;

            // Persistencia de datos
            guardarLetras(letraSeleccionada);            
            
            compruebaLetra(letraSeleccionada);
        });

        addEventListener('keypress',function(event){            

            if(localStorage.getItem('finJuego') == "false"){
                let encontrada = false;
                let index = 0;

                while(!encontrada && index < LETRAS.length){
                    
                    if(!pulsadas[index]){
                        if(event.key.toLowerCase() == LETRAS[index]){
                        
                            let valor = event.key.toUpperCase();
                            let letraPulsada = document.querySelector(".letra[data-letra='"+valor+"']");
                            utilizaLetra(letraPulsada);
                            pulsadas[index] = true;
                            encontrada = true;
                        }
                    }

                    index++;
                }
            }            
        });
    }

    
    function utilizaLetra(letraPulsada){

        letraPulsada.setAttribute('disabled','');
        let letraSeleccionada = letraPulsada.value;
        
        // Persistencia de datos
        guardarLetras(letraSeleccionada);            
        
        compruebaLetra(letraSeleccionada);
    }

    function incrementaTiempo(){

        lblTiempo.innerHTML = parseInt(lblTiempo.innerHTML) + 1;
        localStorage.setItem('tiempo',parseInt(lblTiempo.innerHTML));
    }
    

    function guardarLetras(letraSeleccionada){
        tmpLetras.push(letraSeleccionada);
        letrasUtilizadas.letras['letra'] = tmpLetras;
        localStorage.setItem('letrasUtilizadas',JSON.stringify(letrasUtilizadas));
    }

    function compruebaLetra(letraSeleccionada){

        let acierto = false;
        let espacios = document.querySelectorAll('#palabra div.letraOculta');

        for (let index = 0; index < espacios.length; index++) {
            
            if(espacios[index].getAttribute('data-letra') === letraSeleccionada){
                espacios[index].innerHTML = letraSeleccionada;
                espacios[index].style.backgroundImage = "none";
                espacios[index].removeAttribute('data-oculta');
                acierto = true;
                faltan = document.querySelectorAll('[data-oculta]').length;
            }

            // Miramos si la palabra no es simple
            if(espacios[index].getAttribute('data-letra') === ' '){
                espacios[index].innerHTML =  ' ';
                espacios[index].removeAttribute('data-oculta');
                faltan = document.querySelectorAll('[data-oculta]').length;
            }
        }

        if(!acierto){
            fallos++;

            let intentos = localStorage.getItem('intentos') - 1;
            localStorage.setItem('intentos', intentos)
            lblFallos.innerHTML = 'Intentos pendientes: ' + localStorage.getItem('intentos');
            pintarAhorcado();
            
        }

        deshabilitarTodas();
    }

    function rellenarInformacion(){

        let imgWord = document.querySelector('#wordInfo #info img');
        let infoTitulo = document.querySelector('#wordInfo #info .card-title');
        let infoDescripcion = document.querySelector('#wordInfo #info .card-text');
        imgWord.setAttribute('src',imagen);
        infoTitulo.innerHTML = palabra;
        infoDescripcion.innerHTML = definicion;

        let bloqueDescripcion = document.querySelector('#wordInfo');
        bloqueDescripcion.style.display = 'block';
    }

    function pintarAhorcado(){

        switch (fallos) {
            
            case 1:
                document.querySelector("[data-id='6']").style.opacity = 1;
                    
                break;
        
            case 2:
                document.querySelector("[data-id='5']").style.opacity = 1;
                    
                break;

            case 3:
                document.querySelector("[data-id='3']").style.opacity = 1;
                    
                break;

            case 4:
                document.querySelector("[data-id='1']").style.opacity = 1;    
                    
                break;

            case 5:
                document.querySelector("[data-id='2']").style.opacity = 1;
                    
                break;
            
            case 6:
                document.querySelector("[data-id='4']").style.opacity = 1;
                    
                break;
        }
    }

    function deshabilitarTodas(){

        let faltan = document.querySelectorAll('[data-oculta]').length;;
        let todasLetras = document.querySelectorAll('#letras .letra');

        if((faltan === 0) || (fallos === NUMERRORES)){
            for (let index = 0; index < todasLetras.length; index++) {
                todasLetras[index].setAttribute('disabled','');
            }
            rellenarInformacion();
            clearInterval(intervalID);

            if(faltan === 0 && (localStorage.getItem('finJuego') == "false")){
                let objJson = {
                    [palabra]:[{
                        'Nombre': userName,
                        'Tiempo': parseInt(localStorage.getItem('tiempo')),
                        'Errores': fallos
                    }]
                };
    
                arrayObjList.push(objJson);
                localStorage.setItem('arrayObjetosMultiple',JSON.stringify(arrayObjList));
                sessionStorage.setItem('objJson',JSON.stringify(arrayObjList));
                finPartida = true;
            }

            localStorage.setItem('finJuego',true);
            
            let mensaje = document.getElementById('reintentar');
            mensaje.classList.add('mostrar');
        }
    }


    function escogePalabra(){

        const PALABRAS = [
            {
                'Medios de transporte':
                    [
                        {'Nombre':'Avion', 'Descripcion': 'Medio de transporte rápido y común para viajes internacionales','Imagen': 'img/palabras/avion.jpg'},
                        {'Nombre':'Barco', 'Descripcion': 'Utilizado para travesías marítimas y cruceros alrededor del mundo','Imagen': 'img/palabras/barco.jpg'},
                        {'Nombre':'Tren', 'Descripcion': 'Medio de transporte terrestre que conecta diversas regiones','Imagen': 'img/palabras/tren.jpg'},
                        {'Nombre':'Bicicleta', 'Descripcion': 'Modo sostenible para explorar lugares y recorrer distancias cortas','Imagen': 'img/palabras/bici.jpg'},
                        {'Nombre':'Automovil', 'Descripcion': 'Ideal para road trips y explorar distintos paisajes en diferentes países','Imagen': 'img/palabras/automovil.jpg'},
                        {'Nombre':'Autobus', 'Descripcion': 'Medio de transporte público que conecta ciudades y regiones','Imagen': 'img/palabras/autobus.jpg'},
                        {'Nombre':'Motocicleta', 'Descripcion': 'Opción ágil para explorar destinos con mayor libertad','Imagen': 'img/palabras/moto.jpg'},
                        {'Nombre':'Camper', 'Descripcion': 'Vehículo recreativo para viajar con comodidad y flexibilidad','Imagen': 'img/palabras/camper.jpg'},
                        {'Nombre':'Ferri', 'Descripcion': 'Embarcación utilizada para cruzar cuerpos de agua más pequeños','Imagen': 'img/palabras/ferri.jpg'},
                        {'Nombre':'Tranvia', 'Descripcion': 'Medio de transporte urbano que ofrece una forma pintoresca de explorar ciudades','Imagen': 'img/tranvia.jpg'}
                    ]
            },
            {
                'Paises':
                    [
                        {'Nombre':'Estados Unidos', 'Descripcion': 'Una nación diversa en América del Norte, conocida por su influencia cultural y económica a nivel mundial','Imagen': 'img/palabras/eeuu.jpg'},
                        {'Nombre':'China', 'Descripcion': 'El país más poblado del mundo, con una rica historia, cultura y una creciente importancia global','Imagen': 'img/palabras/china.jpg'},
                        {'Nombre':'India', 'Descripcion': 'Ubicada en el sur de Asia, es conocida por su diversidad cultural, historia antigua y economía en desarrollo','Imagen': 'img/palabras/india.jpg'},
                        {'Nombre':'Brasil', 'Descripcion': 'La nación más grande de América del Sur, famosa por su selva amazónica, playas y el Carnaval de Río de Janeiro','Imagen': 'img/palabras/brasil.jpg'},
                        {'Nombre':'Rusia', 'Descripcion': 'Extendiéndose a través de Europa del Este y Asia del Norte, es conocida por su vasto territorio, historia y recursos naturales','Imagen': 'img/palabras/rusia.jpg'},
                        {'Nombre':'Francia', 'Descripcion': 'En el corazón de Europa, es famosa por su arte, arquitectura, cocina y estilo de vida sofisticado','Imagen': 'img/palabras/francia.jpg'},
                        {'Nombre':'Japon', 'Descripcion': 'Un país insular en Asia Oriental, conocido por su tecnología avanzada, cultura tradicional y deliciosa gastronomía','Imagen': 'img/palabras/japon.jpg'},
                        {'Nombre':'Mexico', 'Descripcion': 'En América del Norte, famoso por su rica cultura, comida picante y sitios arqueológicos como Chichen Itzá','Imagen': 'img/palabras/mexico.jpg'},
                        {'Nombre':'Egipto', 'Descripcion': 'Ubicado en el noreste de África, es conocido por su historia antigua, con las pirámides y el río Nilo como características destacadas','Imagen': 'img/palabras/egipto.jpg'},
                        {'Nombre':'Australia', 'Descripcion': 'Un continente y un país en sí mismo, conocido por su biodiversidad única, playas prístinas y ciudades cosmopolitas','Imagen': 'img/palabras/australia.jpg'}
                    ]},
            {
                'Comidas del mundo':
                    [
                        {'Nombre':'Sushi', 'Descripcion': 'Un plato japonés que ha ganado popularidad globalmente', 'Imagen': 'img/palabras/sushi.jpg'},
                        {'Nombre':'Paella', 'Descripcion': 'Un plato español de arroz con mariscos y azafrán', 'Imagen': 'img/palabras/paella.jpg'},
                        {'Nombre':'Curry', 'Descripcion': 'Una mezcla de especias utilizada en la cocina india', 'Imagen': 'img/palabras/curry.jpg'},
                        {'Nombre':'Tacos', 'Descripcion': 'Un platillo mexicano que consiste en tortillas rellenas', 'Imagen': 'img/palabras/tacos.jpg'},
                        {'Nombre':'Baguette', 'Descripcion': 'Un pan francés largo y delgado, esencial en la cocina francesa', 'Imagen': 'img/palabras/baguette.jpg'},
                        {'Nombre':'Sashimi', 'Descripcion': 'Rodajas finas de pescado crudo, una especialidad de la cocina japonesa', 'Imagen': 'img/palabras/sashimi.jpg'},
                        {'Nombre':'Dim sum', 'Descripcion': 'Pequeños bocados de la cocina china, generalmente servidos en cestas de bambú', 'Imagen': 'img/palabras/dimsum.jpg'},
                        {'Nombre':'Fondue', 'Descripcion': 'Un plato suizo que implica sumergir alimentos en queso derretido', 'Imagen': 'img/palabras/fondue.jpg'},
                        {'Nombre':'Kebab', 'Descripcion': 'Trozos de carne asada, una delicia de la cocina del Medio Oriente', 'Imagen': 'img/palabras/kebab.jpg'},
                        {'Nombre':'Gelato', 'Descripcion': 'Un helado italiano que se ha convertido en un postre globalmente apreciado.', 'Imagen': 'img/palabras/gelato.jpg'}
                    ]
            }
        ];



        let keyIndex = Object.keys(PALABRAS)[Math.floor(Math.random()*Object.keys(PALABRAS).length)];

        let indexCategoria = Object.keys(PALABRAS[keyIndex]);
        categoria = Object.values(indexCategoria).toString();

        let values = Object.values(PALABRAS[keyIndex])[Math.floor(Math.random()*Object.values(PALABRAS[keyIndex]).length)];

        let word = values[Math.floor(Math.random()*Object.keys(values).length)];

        palabra = word['Nombre'].toString();
        definicion = word['Descripcion'].toString();
        imagen = word['Imagen'].toString();
    }

    let btnSi = document.getElementById('si');
    let btnNo = document.getElementById('no');

    btnSi.addEventListener('click',reiniciar);

    function reiniciar(){

        localStorage.setItem('palabraSeleccionada','');
        localStorage.setItem('categoriaSeleccionada','');
        localStorage.setItem('definicionSeleccionada','');
        localStorage.setItem('imagenSeleccionada','');
        localStorage.setItem('letrasUtilizadas','');
        localStorage.setItem('intentos','');
        localStorage.setItem('tiempo','');
        localStorage.setItem('finJuego',false);

        window.location.href = 'juego.html';
    }

    btnNo.addEventListener('click',nuevoJuego);

    function nuevoJuego(){

        window.location.href = 'index.html';
    }

    
});