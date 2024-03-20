window.addEventListener("load", () => {
	// le service est il disponible sur ce navigateur ? //
	if ("geolocation" in navigator) {
		console.log("Service geolocation disponible !");
	} else {
		return console.log("Service geolocation non disponible !");
	}

	// bouton - obtenir la géolocalisation quand click //
	document.querySelector("#geoButton").addEventListener("click", () => {
		// .getCurrentPosition(resolve, reject, options) //
		navigator.geolocation.getCurrentPosition(
			// resolve(position) => { ... } //
			(position) => {
				console.log("Position : ", position);

				// affichage de la latitude et de la longitude dans le DOM //
				document.querySelector("#geoLatitude").innerHTML =
					"latitude : " + position.coords.latitude;
				document.querySelector("#geoLongitude").innerHTML =
					"longitude : " + position.coords.longitude;
			},
			// reject(error) => { ... } //
			(error) => {
				console.log(
					"Erreur lors de l'obtention de la géolocalisation : ",
					error.message
				);
			},
			// options = { ... } //
			{
				// pour les GPS //
				enableHighAccuracy: false,
				// délai avant déclenchement du callback reject //
				timeout: 15000,
				// temps maximum de mise en cache de la position
				maximumAge: 0,
			}
		);
	});
});
