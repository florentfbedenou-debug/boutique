let produits = JSON.parse(localStorage.getItem("produits")) || [];

const btnAjouter = document.getElementById("btn-ajouter");
const btnEnregistrer = document.getElementById("btn-enregistrer");
const btnAnnuler = document.getElementById("btn-annuler");
const recherche = document.getElementById("recherche-produit");

const formulaire = document.getElementById("formulaire-produit");

btnAjouter.addEventListener("click", function () {
    formulaire.style.display = "block";
});

btnAnnuler.addEventListener("click", function () {
    formulaire.style.display = "none";
});

btnEnregistrer.addEventListener("click", function () {

    const nom = document.getElementById("nom-produit").value.trim();
    const prix = document.getElementById("prix-produit").value;
    const description = document.getElementById("description-produit").value.trim();
    const fichierImage = document.getElementById("image-produit").files[0];

    if (nom === "" || prix === "" || description === "" || !fichierImage) {
        alert("⚠️ Remplis tous les champs.");
        return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function (e) {

        const produit = {
            id: Date.now(),
            nom: nom,
            prix: Number(prix),
            description: description,
            image: e.target.result
        };

        produits.push(produit);

        localStorage.setItem("produits", JSON.stringify(produits));

        afficherProduits(produits);

        document.getElementById("nom-produit").value = "";
        document.getElementById("prix-produit").value = "";
        document.getElementById("description-produit").value = "";
        document.getElementById("image-produit").value = "";

        formulaire.style.display = "none";

        alert("✅ Produit ajouté avec succès !");
    };

    lecteur.readAsDataURL(fichierImage);
});


/* RECHERCHE */
recherche.addEventListener("input", function () {

    const texte = recherche.value.toLowerCase().trim();

    const produitsFiltres = produits.filter(function (produit) {
        return (
            produit.nom.toLowerCase().includes(texte) ||
            produit.description.toLowerCase().includes(texte)
        );
    });

    afficherProduits(produitsFiltres);
});


/* AFFICHER LES PRODUITS */
function afficherProduits(listeProduits) {

    const liste = document.getElementById("liste-produits");

    liste.innerHTML = "";

    if (listeProduits.length === 0) {
        liste.innerHTML = "<p>Aucun produit trouvé.</p>";
        return;
    }

    listeProduits.forEach(function (produit) {

        const article = document.createElement("div");

        article.innerHTML = `
            <img src="${produit.image}" alt="${produit.nom}">
            <h2>${produit.nom}</h2>
            <p>${produit.prix.toLocaleString()} FCFA</p>
            <p>${produit.description}</p>

            <button class="btn-supprimer" onclick="supprimerProduit(${produit.id})">
                🗑️ Supprimer
            </button>
        `;

        liste.appendChild(article);
    });
}


/* SUPPRIMER UN PRODUIT */
function supprimerProduit(id) {

    const confirmation = confirm("Voulez-vous vraiment supprimer ce produit ?");

    if (!confirmation) {
        return;
    }

    produits = produits.filter(function (produit) {
        return produit.id !== id;
    });

    localStorage.setItem("produits", JSON.stringify(produits));

    afficherProduits(produits);

    alert("🗑️ Produit supprimé !");
}


afficherProduits(produits);
