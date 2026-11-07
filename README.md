# Miam · prototype interactif

Prototype web mobile-first des parcours client, équipe Miam et livreur. Les commandes, paiements et statuts sont simulés ; aucune transaction, notification ou navigation réelle n’est déclenchée.

## Lancer le prototype

```sh
npm install
npm run dev
```

Ouvre l’adresse locale indiquée par Vite. Le sélecteur en haut de page permet de passer d’un rôle à l’autre ; sur mobile, utilise la barre en bas.

## Parcours de démonstration

1. Dans **Commander**, choisis Petit, Moyen ou Grand, compose ton assiette, indique où livrer et choisis si les frais de livraison sont payés à la commande ou à la livraison.
2. Appuie sur **J’ai payé** pour créer une commande fictive en attente de vérification.
3. Dans **Équipe Miam**, sélectionne cette commande, confirme le paiement, marque le repas prêt, note le règlement de la vendeuse et assigne un livreur.
4. Dans **Livreur**, confirme le retrait, démarre la course et clôture-la. Si les frais sont dus à la livraison, le dernier bouton les note comme perçus.

Les tarifs, les inclusions des formules, les vendeuses, clients, adresses et horaires sont des données de démonstration à remplacer après validation avec le terrain.
