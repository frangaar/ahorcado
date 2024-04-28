addEventListener('DOMContentLoaded',function(){

    // localStorage.setItem('palabraSeleccionada','');
    // localStorage.setItem('categoriaSeleccionada','');
    // localStorage.setItem('definicionSeleccionada','');
    // localStorage.setItem('letrasUtilizadas','');
    // localStorage.setItem('intentos','');
    // localStorage.setItem('tiempo','');

    let inicio = this.document.getElementById('modal');
    
    inicio.classList.add('mostrar');

    let btnJugar = document.getElementById('iniciar');

    btnJugar.addEventListener('click', iniciarJuego);

    function iniciarJuego(){
        
        let playerName = document.getElementById('userName');

        if(playerName.value == ''){
            playerName.classList.add('is-invalid');
            document.getElementById('userName').focus();
        }else{

            localStorage.setItem('palabraSeleccionada','');
            localStorage.setItem('categoriaSeleccionada','');
            localStorage.setItem('definicionSeleccionada','');
            localStorage.setItem('letrasUtilizadas','');
            localStorage.setItem('intentos','');
            localStorage.setItem('tiempo','');
            sessionStorage.setItem('objJson','');
            localStorage.setItem('arrayObjetosMultiple','');
            localStorage.setItem('finJuego',false);

            playerName.classList.remove('is-invalid');
            localStorage.setItem('playerName',playerName.value);

            window.location.href = 'juego.html';
        }        
    }

    addEventListener('keydown',function(event){

        switch(event.key){

            case 'Enter':
                
                btnJugar.click();
                break;
        }

        
    })

    
    let rankingList;
    displayRanking();

    function displayRanking(){

        if(localStorage.getItem('rankingHistorial') != "" && localStorage.getItem('rankingHistorial') != "null"
        && localStorage.getItem('rankingHistorial') != null  && localStorage.getItem('rankingHistorial') != undefined){
            rankingList = JSON.parse(localStorage.getItem('rankingHistorial'));
        }else{
            rankingList = [];
        }

        if(sessionStorage.getItem('objJson') != '' && sessionStorage.getItem('objJson') != "null"
            && sessionStorage.getItem('objJson') != null && sessionStorage.getItem('objJson') != undefined){

            let objToAdd = JSON.parse(sessionStorage.getItem('objJson'));

            let palabra;
            let existe;
            let index = 0;

            for (let indice = 0; indice < objToAdd.length; indice++) {
                existe = false;
                let palabraSeleccionada = Object.keys(objToAdd[indice]);
                index = 0;
                while(!existe && index < rankingList.length) {
                
                    // palabra = localStorage.getItem('palabraSeleccionada');
                    palabra = palabraSeleccionada;
                    existe = Object.values(rankingList)[index].hasOwnProperty(palabra);
                    index++;
                }
    
                if(existe){
                    let elementoActual = Object.values(rankingList[index-1]);
                    elementoActual[0].push(objToAdd[indice][palabra][0]);
                }else{
                    
                    rankingList.push(objToAdd[indice])                
                }
            }
            
        }        


        function ordenar(prop1,prop2) {    
            return function(a, b) {    
                if (a[prop1] > b[prop1]) {    
                    return 1;    
                } else if (a[prop1] < b[prop1]) {    
                    return -1;    
                } 
                
                if (a[prop2] > b[prop2]) {    
                    return 1;    
                } else if (a[prop2] < b[prop2]) {    
                    return -1;    
                } 
                return 0;    
            }    
        }    

        
        if(Object.keys(rankingList).length > 0){

            let modalContent = document.querySelector('#ranking .modal-body');

            for (let index = 0; index < rankingList.length; index++) {

                let container = document.createElement('div')
                container.setAttribute('class','contenedor-palabra');

                let palabraRanking = Object.keys(rankingList[index]);

                let titulo = document.createElement('h5');
                titulo.setAttribute('class','palabra');
                titulo.innerHTML = palabraRanking;
                container.appendChild(titulo)
                
                
                let tmp = Object.values(rankingList[index]);
                let values = Object.values(tmp[0]);
                let ordenado = values.sort(ordenar("Errores","Tiempo"));     
                
                
                let table = document.createElement('table');
                let tableHead = document.createElement('thead');
                let tableBody = document.createElement('tbody');
                table.appendChild(tableHead);
                table.appendChild(tableBody);

                
                for (let contador = 0; contador < ordenado.length; contador++) {
                    if(contador < 3){
                        if(contador == 0){
                            let tr = document.createElement('tr');
                            let th1 = document.createElement('th');
                            th1.innerHTML = Object.keys(ordenado[contador])[0]
                            tr.appendChild(th1);
    
                            let th2 = document.createElement('th');
                            th2.innerHTML = Object.keys(ordenado[contador])[1]
                            tr.appendChild(th2);
    
                            let th3 = document.createElement('th');
                            th3.innerHTML = Object.keys(ordenado[contador])[2]
                            tr.appendChild(th3);
    
                            tableHead.appendChild(tr);               
                        }
    
    
                        let tr = document.createElement('tr');
                        let td1 = document.createElement('td');
                        td1.innerHTML = ordenado[contador].Nombre;
                        tr.appendChild(td1);
                        let td2 = document.createElement('td');
                        td2.innerHTML = ordenado[contador].Tiempo;
                        tr.appendChild(td2);
                        let td3 = document.createElement('td');
                        td3.innerHTML = ordenado[contador].Errores;
                        tr.appendChild(td3);
                        
                        tableBody.appendChild(tr);
                    }
                                    
                }         
                    
                container.appendChild(table)
                modalContent.appendChild(container);
            }
        }  
        
        localStorage.setItem('rankingHistorial',JSON.stringify(rankingList));
        sessionStorage.setItem('objJson','')
    }

    let btnCerrar = document.getElementById('cerrar');
    btnCerrar.addEventListener('click',function(){
        let modalRanking = document.getElementById('ranking');

        modalRanking.style.display = 'none';

    });

    let btnVerRanking = document.getElementById('verRanking');
    btnVerRanking.addEventListener('click',function(){
        let modalRanking = document.getElementById('ranking');

        modalRanking.style.display = 'block';

    });
    
});