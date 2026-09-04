const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static("."));

app.post("/api/payer", async (req, res) => {
    try {
        const { amount, description } = req.body;

        if (!amount || amount < 10) {
            return res.status(400).json({
                error: "Montant invalide."
            });
        }

        const apiKey = process.env.KPRIMEPAY_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "La clé KPRIMEPAY n'est pas configurée sur Render."
            });
        }

        const transactionId =
            "COMMANDE-" +
            Date.now();

        const response = await fetch(
            "https://api.kprimepay.com/v2/checkout",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Idempotency-Key": transactionId
                },
                body: JSON.stringify({
                    transaction_id: transactionId,
                    amount: Number(amount),
                    currency: "XOF",
                    mode: 2,
                    with_fees: 1,
                    description: description || "Commande Ma Boutique",
                    return_url: "https://TON-SITE.onrender.com",
                    locale: "fr"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (erreur) {
        console.error(erreur);

        res.status(500).json({
            error: "Impossible de créer le paiement."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Ma Boutique fonctionne sur le port ${PORT}`);
});
