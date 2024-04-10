document.addEventListener('DOMContentLoaded', function() {

    obtenerEmpresas(); // Llama a la función para iniciar la solicitud
    obtenerNoticias();
    obtenerNoticia();

    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente
        var editor = tinymce.get('contenidoHTML');

        // Capturar los valores de los campos del formulario
       // Capturar los valores de los campos del formulario
       const idEmpresa = document.getElementById('idEmpresa').value;
       const tituloNoticia = document.getElementById('tituloNoticia').value;
       const resumenNoticia = document.getElementById('resumenNoticia').value;
       const contenidoHTML = editor.getContent();
       const publicada = document.getElementById('publicada').checked; // Usar checked para obtener el estado de la casilla de verificación
       const fechaPublicacion = document.getElementById('fechaPublicacion').value;
       const imagen = document.getElementById('imagen').files[0];

       // Construir el objeto JSON
       const noticiaData = {
           idEmpresa: idEmpresa,
           noticia: {
               tituloNoticia: tituloNoticia,
               resumenNoticia: resumenNoticia,
               imagenNoticia: "",
               contenidoHTML: contenidoHTML,
               publicada: publicada ? "Y" : "N", // Convertir el valor booleano a "Y" o "N"
               fechaPublicacion: fechaPublicacion
           }
       };
        const formData = new FormData();
        formData.append('file', imagen);
        

        function subirImagenCrearNotice(datos){
            return fetch('http://localhost:8080/noticias/subirImagen', {
                method: 'POST',
                body: datos
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear la noticia');
                }
                return response.text(); // Cambiar a response.text() para leer el nombre del archivo
    
            })
            .then(data => {
                noticiaData.noticia.imagenNoticia = data;
                crearNoticia(noticiaData);
                // Manejar la respuesta del backend, por ejemplo, mostrar un mensaje de éxito
                console.log('Imagen subida exitosamente:', data);
                alert('Imagen subida exitosamente');
                // Redirigir a otra página si es necesario
            })
            .catch(error => {
                // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
                console.error('Error al subir la imagen:', error.message);
                alert('Error al subir la imagen, intentalo de nuevo.');
            });
        }

        function crearNoticia(data){
            // Enviar la solicitud POST al backend
            return fetch('http://localhost:8080/noticias/crear', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear la noticia');
                }
                return response.text();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                alert('Noticia creada exitosamente');
                // Redirigir a otra página si es necesario
            })
            .catch(error => {
                console.error('Error al crear la noticia:', error.message);
                alert('Error al crear la noticia. Por favor, inténtelo de nuevo.');
            });
        }
        // crearNoticia(noticiaData)
        subirImagenCrearNotice(formData)




    });
});
    function subirImagenModificar(idNoticia, datos){
        return fetch('http://localhost:8080/noticias/subirImagen', {
            method: 'POST',
            body: datos
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear la noticia');
            }
            return response.text(); // Cambiar a response.text() para leer el nombre del archivo

        })
        .then(data => {
            const noticiaModificar = {
                imagenNoticia: data,    
            };
            modificarNoticia(idNoticia, noticiaModificar)
            // Manejar la respuesta del backend, por ejemplo, mostrar un mensaje de éxito
            console.log('Imagen subida exitosamente:', data);
            alert('Imagen subida exitosamente');
            // Redirigir a otra página si es necesario
        })
        .catch(error => {
            // Manejar errores, por ejemplo, mostrar un mensaje de error al usuario
            console.error('Error al subir la imagen:', error.message);
            alert('Error al subir la imagen, intentalo de nuevo.');
        });
    }
    function obtenerEmpresas() {
        let empresas = document.getElementById("idEmpresa");
        fetch('http://localhost:8080/empresas', {
            method: 'GET' // Cambiar el método a GET
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las empresas');
            }
            return response.json(); // Cambiar a response.json() para obtener el contenido JSON de la respuesta
        })
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                id = data[i].id;
                denominacioin = data[i].denominacion;
                let option = document.createElement('option');
                option.value = data[i].id; // Establecemos el valor de la opción como el id de la empresa
                option.textContent = data[i].denominacion; // Establecemos el texto de la opción como la denominación de la empresa
                empresas.appendChild(option);        
            }
            // Aquí puedes manejar los datos de las empresas, como mostrarlas en la página o realizar alguna otra acción
        })
        .catch(error => {
            console.error('Error al obtener las empresas:', error.message);
            alert('Error al obtener empresas, inténtalo de nuevo.');
        });
    }
    function obtenerNoticias() {
        const apiUrl = 'http://localhost:8080/noticias';
    
        fetch(`${apiUrl}`, {
            method: 'GET' // Cambiar el método a GET
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las noticias');
            }
            return response.json(); // Obtener el contenido JSON de la respuesta
        })
        .then(data => {
            console.log(data);
            // Obtener el contenedor donde se agregarán las cards
            const contenedor = document.getElementById('contenedor-noticias');
    
            // Función para manejar el evento click del botón "Upload imagen"
            function handleUploadImagen(idNotice) {
                return function() {
                    const inputImagen = document.getElementById(`uploadImagen_${idNotice}`);
                    const formData = new FormData();
                    formData.append('file', inputImagen.files[0]);
                    subirImagenModificar(idNotice, formData);
                };
            }
    
            // Iterar sobre cada noticia en los datos recibidos
            data.forEach(noticia => {
                // Crear un div para la card de la noticia
                const card = document.createElement('div');
                card.classList.add('card');
    
                const idNotice = noticia.id;
                // Agregar el contenido de la noticia a la card
                card.innerHTML = `
                    <h2>${noticia.tituloNoticia}</h2>
                    <p>${noticia.resumenNoticia}</p>
                    <img src="picture/${noticia.imagenNoticia}" alt="Imagen de la noticia" width="30%">
                    <input type="file" id="uploadImagen_${idNotice}" style="display: none;">
                    <button class="btn btn-primary col-md-2" onclick="document.getElementById('uploadImagen_${idNotice}').click()">Upload imagen</button>
                    <div>${decodeEntities(noticia.contenidoHTML)}</div>
                    <p>Publicada: ${noticia.publicada}</p>
                    <p>Fecha de publicación: ${noticia.fechaPublicacion}</p>
                `;
                // Adjuntar un event listener al input de archivo para escuchar cambios
                const inputImagen = card.querySelector(`#uploadImagen_${idNotice}`);
                inputImagen.addEventListener('change', handleUploadImagen(idNotice));
                // Agregar la card al contenedor
                contenedor.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error al obtener las noticias:', error.message);
            alert('Error al obtener noticias, inténtalo de nuevo.');
        });
    }
    
    function obtenerNoticia() {
        const apiUrl = 'http://localhost:8080/noticias/buscar/1';
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener la noticia');
                }
                return response.json(); // Obtener el contenido JSON de la respuesta
            })
            .then(noticia => {
                const idNotice = noticia.id;
                // Obtener el contenedor donde se agregará la card
                const contenedor = document.getElementById('contenedor-noticia');
    
                // Crear un div para la card de la noticia
                const card = document.createElement('div');
                card.classList.add('card');
    
                // Agregar el contenido de la noticia a la card
                card.innerHTML = `
                    <h2>${noticia.tituloNoticia}</h2>
                    <p>${noticia.resumenNoticia}</p>
                    <img src="picture/${noticia.imagenNoticia}" alt="Imagen de la noticia" width="30%">
                    <input type="file" id="uploadImagen" style="display: none;">
                    <button class="btn btn-primary col-md-2" onclick="document.getElementById('uploadImagen').click()">Upload imagen</button>
                    <div>${decodeEntities(noticia.contenidoHTML)}</div>
                    <p>Publicada: ${noticia.publicada}</p>
                    <p>Fecha de publicación: ${noticia.fechaPublicacion}</p>
                `;
                // Adjuntar un event listener al input de archivo para escuchar cambios
                const inputImagen = card.querySelector('#uploadImagen');
                inputImagen.addEventListener('change', () => {
                    const formData = new FormData();
                    formData.append('file', inputImagen.files[0]);
                    // console.log('Archivo seleccionado:', inputImagen.files[0]);
                    subirImagenModificar(idNotice, formData);
                });
                // Agregar la card al contenedor
                contenedor.appendChild(card);
            })
            .catch(error => {
                console.error('Error al obtener la noticia:', error.message);
                alert('Error al obtener la noticia, inténtalo de nuevo.');
            });
    }
    
    function obtenerImagen(nombreArchivo) {
        const urlImagen = `picture/${nombreArchivo}`;
        document.getElementById('img').src = urlImagen;
    }
    function decodeEntities(encodedString) {
        console.log('Cadena codificada:', encodedString); // Verifica si la cadena se pasa correctamente
        const textarea = document.createElement('textarea');
        textarea.innerHTML = encodedString;
        const decodedString = textarea.value;
        console.log('Cadena decodificada:', decodedString); // Verifica la cadena decodificada
        return decodedString;
    }
    
    function modificarNoticia(id, cambios) {
        fetch(`http://localhost:8080/noticias/modificar/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cambios)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al modificar la noticia');
            }
            return response.json();
        })
        .then(data => {
            console.log('Noticia modificada:', data);
            // Realizar alguna acción adicional si es necesario
        })
        .catch(error => {
            console.error('Error al modificar la noticia:', error.message);
            alert('Error al modificar la noticia, inténtalo de nuevo.');
        });
    }
    
    // Ejemplo de cómo llamar a la función modificarNoticia con un ID de noticia y cambios
    const idNoticia = 1; // ID de la noticia que deseas modificar
    const cambios = {
        // Aquí define los cambios que deseas aplicar a la noticia
        // Por ejemplo:
        // tituloNoticia: 'Nuevo título',
        // resumenNoticia: 'Nuevo resumen',
        // imagenNoticia: 'Nueva URL de imagen',
        // contenidoHTML: 'Nuevo contenido HTML',
        // publicada: true/false, etc.
    };
    
    modificarNoticia(idNoticia, cambios);
    






