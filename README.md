# Alexa Skill: La boca de Ignatius

Ejemplo de implementación de una skill a la que le podemos pedir que reproduzca sonidos de una categoria, y reproducirá como respuesta uno de ellos aleatoriamente.

![Image](resources/imgs/logo512.png)

## Configuración

### Variables de entorno necesarias

* S3_CONTAINER: ej. "https://s3-eu-west-1.amazonaws.com/xxxxxxxx.sounds"; 

### Ficheros de sonido

Los sonidos deben ser codificados en un formato compatible con la salida de audio de Alexa (hay algunas herramientas en la carpeta tools para ello, que requieren ffmpeg para funcionar).

Despues, deben ser ubicados en carpetas en un almacenamiento de Amazon S3 (por ejemplo). Cada carpeta representa una categoria y debe estar nombrada como un valor categorico de category en el modelo de la skill.

Los ficheros dentro de cada carpeta/categoria deben estar nombrados del 1 al N.

En el fichero de la funcion lambda __SoundManager.js__ hay que especificar las categorias existentes (soundsCategories) asi como el numero de ficheros que contiene la categoria, para puedan ser seleccionados aleatoriamente sin necesidad de consultas a S3 (mejora la velocidad).

Ver la carpeta sounds para tener un ejemplo de esto.

## Tools

Para codificar los audios en un formato compatible con Alexa, es necesario usar ffmpeg y el script tools/convert_script.sh que transforma todos los mp3 existentes en una carpeta.

## Licencia

By [@findemor](http://twitter.com/findemor)
Consultar [Licencia y Políticas](resources/DCSKILLIGNATIUS001.htm)
