window.addEventListener("load", () => {
	// le service est il disponible sur ce navigateur ? //
	if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
		console.log("Service mediaDevices disponible !");
	} else {
		return console.log("Service mediaDevices non disponible !");
	}

	// bouton - activer la camera quand click //
	document
		.querySelector("#cameraButton")
		.addEventListener("click", async () => {
			// stream contient le flux de la video en cours //
			const stream = await navigator.mediaDevices.getUserMedia({
				// on active uniquement la camera pour cet exemple //
				video: true,
				audio: false,
			});

			const video = document.querySelector("#video");
			// on attribue à l'élément video la source "stream" //
			video.srcObject = stream;
			// on met en route la difusion de la video //
			video.play();
		});

	// bouton - prendre une photo depuis la camera quand click //
	document.querySelector("#photoButton").addEventListener("click", () => {
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
	});
});
