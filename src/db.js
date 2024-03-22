window.addEventListener("load", () => {
	// send to db button //
	document
		.querySelector("#sendToDbButton")
		.addEventListener("click", async () => {
			// check if photo and geo exists //
			if (
				!document.querySelector("#photo").src ||
				!document.querySelector("#geoLatitude").innerText ||
				!document.querySelector("#geoLongitude").innerText
			)
				return console.log(
					"Récupérer la géolocalisation et prendre une photo avant d'envoyer les données vers la base de données !"
				);

			// parse data before sending to db //
			const image = canvas.toDataURL("image/png");
			const latitude = document.querySelector("#geoLatitude").innerText;
			const longitude = document.querySelector("#geoLongitude").innerText;

			const data = {
				image,
				position: {
					latitude,
					longitude,
				},
			};

			// send data to DB //
			try {
				const response = await fetch("", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) throw new Error("Request was rejected !");

				console.log("Request was resolved !");
			} catch (error) {
				console.log("Error sending data to DB : ", error.message);
			}
		});

	// get data from DB button //
	document
		.querySelector("#getFromDbButton")
		.addEventListener("click", async () => {
			// initialise data //
			let data = null;

			// get data from DB //
			try {
				const response = await fetch("");
				data = await response.json();
			} catch (error) {
				console.log("Error getting data from DB : ", error.message);
			}

			if (data) console.log("data : ", data);

			// create cards according data recevied //
			for (let [key, value] of Object.entries(data)) {
				// get template //
				const template = document
					.querySelector("#fromDbTemplate")
					.content.cloneNode(true);

				// set data into elements //
				template
					.querySelector(".fromDbTemplate--container")
					.setAttribute("data-id", key);
				template.querySelector(".fromDbTemplate--img").src = value.image;
				template.querySelector(".fromDbTemplate--latitude").innerText =
					value.position.latitude;
				template.querySelector(".fromDbTemplate--longitude").innerText =
					value.position.longitude;

				// insert into DOM //
				document.querySelector("#templateContainer").appendChild(template);
			}
		});
});
