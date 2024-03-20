window.addEventListener("load", () => {
	// le service est il disponible sur ce navigateur ? //
	if ("showOpenFilePicker" in window || "showSaveFilePicker" in window) {
		console.log("Service file system disponible !");
	} else {
		return console.log("Service file system non disponible !");
	}

	// bouton - créer un fichier .txt quand click //
	document
		.querySelector("#createFileButton")
		.addEventListener("click", async () => {
			try {
				// on ouvre le file picker et l'utilisateur séléctionne le dossier qui recevra le fichier .txt //
				const directoryHandle = await window.showDirectoryPicker();

				// on créé le .txt et on l'insère dans le dossier séléctionné, le fichier est créé s'il n'existe pas déjà //
				const fileHandle = await directoryHandle.getFileHandle("hello.txt", {
					create: true,
				});

				// ouverture de l'instance d'écriture pour le .txt //
				const writable = await fileHandle.createWritable();
				// insertion du texte //
				await writable.write("Hello File System !");
				// fermeture de l'instance //
				await writable.close();
			} catch (error) {
				// utilisation de try / catch pour gérer les erreurs ou refus de l'utilisateur //
				console.log(
					"Erreur lors de la création du fichier .txt : ",
					error.message
				);
			}
		});

	// bouton - charger le fichier fraichement créé quand click //
	document
		.querySelector("#getFileButton")
		.addEventListener("click", async () => {
			try {
				// ouverture du file picker de l'utilisateur //
				const [fileHandle] = await window.showOpenFilePicker();
				// on récupère le fichier choisi //
				const file = await fileHandle.getFile();
				// on récupère le texte contenue dans le fichier choisi //
				const text = await file.text();

				// insertion du texte dans l'élément <p> du HTML //
				document.querySelector("#fileText").innerText = text;
			} catch (error) {
				// utilisation de try / catch pour gérer les erreurs ou refus de l'utilisateur //
				console.log(
					"Erreur lors de la récupération du fichier .txt : ",
					error.message
				);
			}
		});
});
