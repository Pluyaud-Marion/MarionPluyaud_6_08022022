/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const urlPhotographer = window.location.search;
const urlSearchParams = new URLSearchParams(urlPhotographer);
const idPhotographer = Number(urlSearchParams.get("id")); 

const arrayLikes = [];

async function getElementsPhotographers(){
	let photographers = [];
	
	await fetch("./data/photographers.json")
		.then(response => response.json())
		.then(data => photographers = data.photographers)
		.catch(error => error);

	return ({
		photographers: [...photographers]});
}

async function getMediaPhotographers(){
	let media = [];
	
	await fetch("./data/photographers.json")
		.then(response => response.json())
		.then(data => {
			media = data.media;
			//console.log(media);
		})
		.catch(error => error);

	return ({
		media: [...media]});
}

async function displayDataPhotographers(photographers) {
	const photographHeader = document.querySelector(".photograph-header");
	const containerButtonInfos = document.querySelector(".container-button-infos");

	for (photographer of photographers) {
		if (idPhotographer === photographer.id) { // cible le photographe avec l'id dans l'url 
			const divHeader = document.createElement("div");
			containerButtonInfos.appendChild(divHeader);
			divHeader.className = "container-infos";

			const tagH1 = document.createElement("h1");
			divHeader.appendChild(tagH1);
			tagH1.innerHTML = photographer.name; 

			const tagCity = document.createElement("span");
			divHeader.appendChild(tagCity);
			tagCity.innerHTML = photographer.city + ", ";
			tagCity.className = "city-country";
      
			const tagCountry = document.createElement("span");
			divHeader.appendChild(tagCountry);
			tagCountry.innerHTML = photographer.country;
			tagCountry.className = "city-country";

			const tagLine = document.createElement("p");
			divHeader.appendChild(tagLine);
			tagLine.innerHTML = photographer.tagline;

			const tagImg = document.createElement("img");
			photographHeader.appendChild(tagImg);
			tagImg.src = `assets/photographers/${photographer.portrait}`; //chemin pour la photo du portrait + le nom de la photo récupéré du fetch
			tagImg.className = "photo-page-photographe"; //ajout de la classe pour le style
		}
	}
}

async function displayMediaPhotographers(media) {
	for (item of media) {
		if (idPhotographer === item.photographerId) { // cible le photographe avec l'id dans l'url 
			
			const factoryModel = displayPictureVideoFactory(item); //appel de la factory qui créé toutes les balises sauf img et video
			
			if(item.image) { //s'il y a une image, appelle la fonction qui créé balise img dans la factory
				factoryModel.createPicture(item);
			} else { // sinon = vidéo, appelle la fonction qui créé balise video dans la factory
				factoryModel.createVideo(item);
			}
		}
	}
}

function addLike(media){
	for (item of media) {
		if (idPhotographer === item.photographerId){ //cible le photographe
			const tagNumberLike = document.getElementById(`${item.id}`);
			//console.log(tagNumberLike);
			
			let numberLikes = Number(tagNumberLike.innerHTML); //transforme en number le numbre de likes
			//console.log("avant", numberLikes);
			const idTagNumberLike = tagNumberLike.id;
			const iconLike = document.getElementById(`like-${item.id}`);
			const idIconLike = iconLike.id.split("-"); //retourne une tableau autour du - le 2ème élément du tableau est l'id
		
			iconLike.addEventListener("click", () => {
				if(idIconLike[1] === idTagNumberLike){
					tagNumberLike.innerHTML++;
					// console.log("avant", numberLikes);
					//console.log("apres", tagNumberLike.innerHTML);
					//const newLike = tagNumberLike.innerHTML;
					
					// console.log(arrayLikes);
				}
				
			});
			arrayLikes.push(numberLikes);
			
		}
	}
}


function cardLikesAndPrice(photographers) {
	const tagPriceTotalLike = document.querySelector(".price-total-like");
	// création span prix
	const tagPrice = document.createElement("span");
	tagPriceTotalLike.appendChild(tagPrice);

	//création div globale nb likes + icone
	const tagContainer = document.createElement("div");
	tagPriceTotalLike.appendChild(tagContainer);
	tagContainer.className = "likes";

	// création span total des likes
	const tagTotalLike = document.createElement("span");
	tagContainer.appendChild(tagTotalLike);

	const like = document.createElement("i");
	tagContainer.appendChild(like);
	like.className = "fas fa-heart";

	// boucle sur chaque photographe pour récupérer dans le Json le prix
	for(photographer of photographers) {
		if (idPhotographer === photographer.id){ //cible le photographe
			tagPrice.innerHTML = photographer.price + "€ / jour";
		}
	}

	// reducer pour additionner tous les likes (dans le tableau)
	const reducer = (previousValue, currentValue) => previousValue + currentValue;
	const totalLikes = arrayLikes.reduce(reducer);
	//console.log(totalLikes);
	tagTotalLike.innerHTML = totalLikes;
}

function sort(media) {
	const containerMedia = document.querySelector(".photograph-galery");

	const select = document.querySelector("#select-sort");
	select.value = -1; // 1er n'est pas affiché par défaut
			
	select.addEventListener("change", () => {
		let valueSelect = select.value; // récupération de la valeur sélectionnée
				
		if (valueSelect === "popularity") {
			//vide les médias
			containerMedia.innerHTML = "";
			/*
					Méthode sort qui prend en paramètre une fonction de calcul par ordre inversé - retourne un nouveau tableau classé du plus petit au plus grand
					Trie tous les médias du + grand au + petit like
					*/
			media.sort((a, b) =>{
				return b.likes - a.likes;
			});
			//appel de la fonction qui affiche les médias = ne fait afficher qu
			displayMediaPhotographers(media);
					
		} else if (valueSelect === "date") {
			containerMedia.innerHTML = "";
			
			media.sort((a,b) => { //tri par date
				return new Date(a.date) - new Date(b.date);
			});
			displayMediaPhotographers(media);
		} else {
			containerMedia.innerHTML = "";
	
			media.sort((a,b) => {
				if (a.title < b.title)
					return -1;
			});
			displayMediaPhotographers(media);
		}
	});
}


class Lightbox {
	
	static init() {
		const links = Array.from(document.querySelectorAll(".picture"));
		const video = Array.from(document.querySelectorAll(".video"));
		const gallery = links.map(link => link.getAttribute("src"));
		const galleryVideo = video.map(item => item.getAttribute("src"));
	
		console.log(galleryVideo);
		console.log(gallery);
		links.forEach(link => {
			link.addEventListener("click", e =>{
				e.preventDefault();
				new Lightbox(e.currentTarget.getAttribute("src"), gallery); //récupère l'url de l'image cliquée
			});
			
		});

		video.forEach(item => {
			item.addEventListener("click", e =>{
				e.preventDefault();
				new Lightbox(e.currentTarget.getAttribute("src"), galleryVideo); //récupère l'url de l'image cliquée
			});
			
		});
	}
	

	constructor (url, gallery, galleryVideo) {
		this.element = this.buildDOM(url); // construction du DOM à partir de l'url
		this.gallery = gallery;
		this.galleryVideo = galleryVideo;
		
		document.body.appendChild(this.element); // insertion dans le body des éléments

		console.log(url);
		if(url.includes("jpg")) {
			this.loadImage(url);
		} else if (url.includes("mp4")) {
			this.loadVideo(url);
		}
		
		
		this.onKeyUp = this.onKeyUp.bind(this);
		document.addEventListener("keyup", this.onKeyUp); // écoute le keyup
	
		
	}

	loadVideo(url) {
		this.url = null;
		const video = document.createElement("video");
		const container = this.element.querySelector(".media-container");

		container.innerHTML = "";

		container.appendChild(video);
		this.url = url;
		video.src = url;
		video.setAttribute("controls", "");
		
	}

	loadImage(url) {
		// const titleMedia = document.querySelectorAll(".title");
		// for (title of titleMedia){
		// 	const titre = title.innerHTML;
		// 	console.log(titre);
		// }
	
		this.url = null;
		const image = new Image(); 
		
		const container = this.element.querySelector(".media-container");
		// const loader = document.createElement("div");
		// loader.classList.add("ligthbox-loader");
		container.innerHTML = "";
		// container.appendChild(loader);
		// image.onload = () => {
		// container.removeChild(loader);
		container.appendChild(image);
		this.url = url;
		// };
		image.src = url;
	}
	//méthode qui prend en paramètre un évenement de type Keyboard event = fermer avec esc clavier
	onKeyUp(e) {
		if (e.key === "Escape") {
			this.close(e); // si la clé pressée est la touche esc -> appel de la méthode close
		} else if (e.key === "ArrowLeft") {
			this.prev(e); // si la clé pressée est la touche fleche gauche-> appel de la méthode prev
		} else if (e.key === "ArrowRight") {
			this.next(e); // si la clé pressée est la touche fleche droite -> appel de la méthode next
		}
	}

	//méthode qui prend en paramètre un évenement de type mouse event
	close(e) {
		e.preventDefault();
		this.element.classList.add("fadeOut");
		this.element.parentElement.removeChild(this.element);
		document.removeEventListener("keyup", this.onKeyUp);

	}
	//méthode qui prend en paramètre un évenement de type mouse event ou keyboard event
	next(e) {
		e.preventDefault();
		// console.log(this.gallery);
		// console.log(this.galleryVideo);
		if(this.url.includes("jpg")) {
			let i = this.gallery.findIndex(image => image === this.url);
			if(i === this.gallery.length - 1 ) { //si c'est la dernière image
				i = -1; // on revient à 0
			}
			this.loadImage(this.gallery[i + 1]);
		} else if (this.url.includes("mp4")) {
			let n = this.galleryVideo.findIndex(video => video === this.url);
			if(n === this.galleryVideo.length - 1 ) { //si c'est la dernière image
				n = -1; // on revient à 0
			}
			this.loadVideo(this.galleryVideo[n + 1]);
		}
	}

	//méthode qui prend en paramètre un évenement de type mouse event ou keyboard event
	prev(e) {
		e.preventDefault();
		console.log("video",this.galleryVideo);
		console.log("image", this.gallery);
		if(this.url.includes("jpg")) {
			let i = this.gallery.findIndex(image => image === this.url);
			if(i === 0 ) { // si c'est la première image
				i = this.gallery.length; // on passe à la dernière image
			}
			this.loadImage(this.gallery[i - 1]);
		} else if (this.url.includes("mp4")) {

			let n = this.galleryVideo.findIndex(video => video === this.url);
			if(n === 0 ) { // si c'est la première image
				n = this.galleryVideo.length; // on passe à la dernière image
			}
			this.loadVideo(this.galleryVideo[n - 1]);
		}
	}

	// création des éléments HTML + return 
	buildDOM (url) {
		const dom = document.createElement("section");
		dom.classList.add("lightbox");
		dom.innerHTML = 
			`<button type="button" class="lightbox-close">Fermer</button>
			<button type="button" class="lightbox-next">Suivant</button>
			<button type="button" class="lightbox-prev">Précédent</button>
			<div class="media-container"></div>
			`;

		dom.querySelector(".lightbox-close").addEventListener("click", this.close.bind(this));
		dom.querySelector(".lightbox-next").addEventListener("click", this.next.bind(this));
		dom.querySelector(".lightbox-prev").addEventListener("click", this.prev.bind(this));
		return dom;
	}
}

async function init() {
	// Récupère les datas des photographes
	const { photographers } = await getElementsPhotographers();
	const { media } = await getMediaPhotographers();
	displayDataPhotographers(photographers);
	displayMediaPhotographers(media);
	addLike(media);
	cardLikesAndPrice(photographers);
	sort(media);
	Lightbox.init();//

}

init();
