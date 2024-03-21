# STRUCTURE

L'application est très simple :

## index.html

Séparé en 3 sections :

- Gélocalisation :

  - <code>button</code> pour utiliser la géolocalisation en instantané
  - <code>p</code> pour afficher latitude et longitude

- MediaDevides :

  - <code>button</code> pour démarer la camera
  - <code>video</code> pour afficher le flux de la camera
  - <code>button</code> pour prendre une photo
  - <code>img</code> pour afficher la photo prise
  - <code>canvas</code> pour récupérer les données de la camera et en extraire une image

- File System :

  - <code>button</code> pour crééer un fichier .txt dans le dossier ciblé
  - <code>button</code> pour charger un fichier depuis un dossier ciblé
  - <code>p</code> pour affiché le contenue du fichier chargé

- <code>script</code> :
  Les 3 fonctionalités sont chargées séparément et sont indépendantes

## API geolocation

On vérifie si le service est disponible depuis le navigateur utilisé :

```js
// le service est il disponible sur ce navigateur ? //
if ("geolocation" in navigator) {
	console.log("Service geolocation disponible !");
} else {
	return console.log("Service geolocation non disponible !");
}
```

Au click sur le bouton, on déclenche la fonctionnalité. On utilise la méthode <code>.getCurrentPosition()</code> de l'API :

```js
navigotor.geolocation.getCurrentPosition(resolve, reject, options);
```

Les arguments sont :

- callback en cas de réussite de l'opération (obligatoire) :

```js
(position) => {
	console.log("Position : ", position);

	// affichage de la latitude et de la longitude dans le DOM //
	document.querySelector("#geoLatitude").innerHTML =
		"latitude : " + position.coords.latitude;
	document.querySelector("#geoLongitude").innerHTML =
		"longitude : " + position.coords.longitude;
};
```

- callback en cas d'échec de l'opération (optionnel) :

```js
(error) => {
	console.log(
		"Erreur lors de l'obtention de la géolocalisation : ",
		error.message
	);
};
```

- les options (optionnelles) :

```js
{
    // pour les GPS //
    enableHighAccuracy: false,
    // délai avant déclenchement du callback reject //
    timeout: 15000,
    // temps maximum de mise en cache de la position
    maximumAge: 0,
}
```

## API mediaDevices

On vérifie si le service est disponible depuis le navigateur utilisé :

```js
// le service est il disponible sur ce navigateur ? //
if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
	console.log("Service mediaDevices disponible !");
} else {
	return console.log("Service mediaDevices non disponible !");
}
```

### Camera

Au click du bouton camera, on active l'utilisation de la cette dernière. On utilise la méthode <code>.getCurrentPosition()</code> de l'API qui nous renvoie un objet <code>stream</code> correspondant au flux video de la camera :

```js
const stream = await navigator.mediaDevices.getUserMedia({ options });
```

On insère le flux video dans l'élément <code>video</code> de notre HTML et active la lecture :

```js
const video = document.querySelector("#video");
// on attribue à l'élément video la source "stream" //
video.srcObject = stream;
// on met en route la difusion de la video //
video.play();
```

### Photo

Au click du bouton photo, on récupère un instané du flux que l'on insère dans le <code>canvas</code> gràce à sa méthode <code>.drawImage()</code>. On peut générer une url depuis la canvas gràce à sa méthode <code>.toDataURL()</code> que l'on insère directement dans l'élément <code>img</code> de notre HTML :

```js
const video = document.querySelector("#video");
const canvas = document.querySelector("#canvas");
const photo = document.querySelector("#photo");

// pour dessiner une image sur un canvas, on doit préciser les dimensions du dessin //
// on récupère donc les dimensions de la video en cours de diffusion //
const { width, height } = video.getBoundingClientRect();

// création du context du canvas et utilisation de .drawImage() pour y appliquer la video //
const context = canvas.getContext("2d");
context.drawImage(video, 0, 0, width, height);

// on extrait une url du canvas gràce à .toDataURL() //
const data = canvas.toDataURL("image/png");
// on applique l'url obtenue dans l'élément image //
photo.src = data;
```

## API file system

On vérifie si le service est disponible depuis le navigateur utilisé :

```js
// le service est il disponible sur ce navigateur ? //
if ("showOpenFilePicker" in window || "showSaveFilePicker" in window) {
	console.log("Service file system disponible !");
} else {
	return console.log("Service file system non disponible !");
}
```

### Création d'un fichier .txt

Au click du bouton, on ouvre le folder picker de l'utilisateur et y insère un fichier. Les options précisent le nom du fichier etpermettent sa création s'il n'existe pas déjà :

```js
// on ouvre le file picker et l'utilisateur séléctionne le dossier qui recevra le fichier .txt //
const directoryHandle = await window.showDirectoryPicker();

// on créé le .txt et on l'insère dans le dossier séléctionné, le fichier est créé s'il n'existe pas déjà //
const fileHandle = await directoryHandle.getFileHandle("hello.txt", {
	create: true,
});
```

On insère ensuite dans ce fihier un contenue en utilsant le <code>writer</code> de l'interface <code>fileHandler</code>. Ici on intègre une simple chaîne de catactères (fichier .txt),mais cette mèthode permet d'intégrer des images, video ou autre selon la nature du fichier :

```js
// ouverture de l'instance d'écriture pour le .txt //
const writable = await fileHandle.createWritable();
// insertion du texte //
await writable.write("Hello File System !");
// fermeture de l'instance //
await writable.close();
```

Attention, l'utilisation du bloc <code>try</code> & <code>catch</code> est requise : si l'utilisateur ferme son folderpicker en cours d'utilisation, cela déclenche une erreur qu'il faut gérer bien entendu.

### Ouverture d'un fichier

On récupère un fichier ciblé depuis le filePicker de l'utilisateur que l'on insère dans la variable <code>file</code>.

```js
// ouverture du file picker de l'utilisateur //
const [fileHandle] = await window.showOpenFilePicker();
// on récupère le fichier choisi //
const file = await fileHandle.getFile();
```

&Agrave; partir de cet instant, on peut gérer se fichier comme à l'habitude et par exemple en extraire son contenue :

```js
// on récupère le texte contenue dans le fichier choisi //
const text = await file.text();
// insertion du texte dans l'élément <p> du HTML //
document.querySelector("#fileText").innerText = text;
```

Pour la même raison que citée précédement, l'utilisation d'un bloc <code>try</code> & <code>catch</code> est requise.
