```javascript
let produits = JSON.parse(localStorage.getItem("produits")) || [];

function afficherFormulaire() {
    const formulaire = document.getElementById("formulaire-produit");

    if (formulaire.style.display === "none") {
        formulaire.style.display = "block";
    } else {
        formulaire.style.display = "none";
    }
}

function ajouterProduit() {

    const nom = document.getElementById("nom-produit").value.trim();
    const prix = document.getElementById("prix-produit").value;
    const fichierImage = document.getElementById("image-produit").files[0];

    if (nom === "" || prix === "" || !fichierImage) {
        alert("Remplis tous les champs.");
        return;
    }

    const lecteur = new FileReader();

    lecteur.onload = function(e) {

        const produit = {
            id: Date.now(),
            nom: nom,
            prix: Number(prix),
            image: e.target.result
        };

        produits.push(produit);

        localStorage.setItem("produits", JSON.stringify(produits));

        afficherProduits();

        document.getElementById("nom-produit").value = "";
        document.getElementById("prix-produit").value = "";
        document.getElementById("image-produit").value = "";

        alert("✅ Produit enregistré !");
    };

    lecteur.readAsDataURL(fichierImage);
}

function afficherProduits() {

    const liste = document.getElementById("liste-produits");

    liste.innerHTML = "";

    produits.forEach(function(produit) {

        const article = document.createElement("div");

        article.innerHTML = `
            <img src="${produit.image}" width="200">
            <h2>${produit.nom}</h2>
            <p>${produit.prix.toLocaleString()} FCFA</p>
        `;

        liste.appendChild(article);
    });
}

afficherProduits();
```
