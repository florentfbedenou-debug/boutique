let produits = JSON.parse(localStorage.getItem("produits")) || [];
let panier = JSON.parse(localStorage.getItem("panier")) || [];

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

         <button class="btn-panier" onclick="ajouterAuPanier(${produit.id})">
    🛒 Ajouter au panier
</button>

<button class="btn-acheter" onclick="acheterMaintenant(${produit.id})">
    💳 Acheter maintenant
</button>

            <button class="btn-supprimer" onclick="supprimerProduit(${produit.id})">
                🗑️ Supprimer
            </button>
        `;

        liste.appendChild(article);
    });
}


/* AJOUTER AU PANIER */
function ajouterAuPanier(id) {

    const produit = produits.find(function (produit) {
        return produit.id === id;
    });

    if (!produit) {
        return;
    }

    panier.push(produit);

    localStorage.setItem("panier", JSON.stringify(panier));

    afficherPanier();

    alert("🛒 Produit ajouté au panier !");
}


/* AFFICHER LE PANIER */
function afficherPanier() {

    const articlesPanier = document.getElementById("articles-panier");
    const totalPanier = document.getElementById("total-panier");

    articlesPanier.innerHTML = "";

    if (panier.length === 0) {
        articlesPanier.innerHTML = "<p>Votre panier est vide.</p>";
        totalPanier.textContent = "0 FCFA";
        return;
    }

    let total = 0;

    panier.forEach(function (produit, index) {

        total += produit.prix;

        const article = document.createElement("div");

        article.innerHTML = `
            <p>
                <strong>${produit.nom}</strong>
                — ${produit.prix.toLocaleString()} FCFA

                <button onclick="retirerDuPanier(${index})">
                    ❌
                </button>
            </p>
        `;

        articlesPanier.appendChild(article);
    });

    totalPanier.textContent = total.toLocaleString() + " FCFA";
}


/* RETIRER DU PANIER */
function retirerDuPanier(index) {

    panier.splice(index, 1);

    localStorage.setItem("panier", JSON.stringify(panier));

    afficherPanier();
}


/* SUPPRIMER UN PRODUIT */
function supprimerProduit(id) {

    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmation) {
        return;
    }

    produits = produits.filter(function (produit) {
        return produit.id !== id;
    });

    panier = panier.filter(function (produit) {
        return produit.id !== id;
    });

    localStorage.setItem("produits", JSON.stringify(produits));
    localStorage.setItem("panier", JSON.stringify(panier));

    afficherProduits(produits);
    afficherPanier();

    alert("🗑️ Produit supprimé !");
}


afficherProduits(produits);
afficherPanier();
