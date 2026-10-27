// Stubbed marketplace data for the product preview.
// A later milestone replaces this module with Netlify Database queries (see PLAN.md).

export type CategoryId = 'vehicules' | 'immobilier' | 'maison' | 'electronique' | 'emploi'

export type Category = {
  id: CategoryId
  label: string
  description: string
  count: number
}

export const categories: Category[] = [
  { id: 'vehicules', label: 'Véhicules', description: 'Voitures, motos, vélos', count: 48210 },
  { id: 'immobilier', label: 'Immobilier', description: 'Ventes, locations, colocations', count: 31954 },
  { id: 'maison', label: 'Meubles & Maison', description: 'Ameublement, déco, électroménager', count: 72318 },
  { id: 'electronique', label: 'Électronique', description: 'Téléphones, ordinateurs, consoles', count: 56702 },
  { id: 'emploi', label: 'Emploi', description: 'Offres d’emploi, missions', count: 12487 },
]

export type Listing = {
  id: string
  title: string
  price: number
  priceSuffix?: string
  category: CategoryId
  city: string
  postcode: string
  postedAt: string
  image: string
  description: string
  attributes: { label: string; value: string }[]
  seller: { name: string; memberSince: string; listings: number; pro?: boolean }
  urgent?: boolean
  delivery?: boolean
}

export const listings: Listing[] = [
  {
    id: 'clio-2-rouge',
    title: 'Renault Clio II 1.2 16V – 5 portes',
    price: 2900,
    category: 'vehicules',
    city: 'Villefranche-sur-Saône',
    postcode: '69400',
    postedAt: '2026-10-26T08:12:00',
    image: 'voiture-citadine.png',
    description:
      'Vends ma Clio II, idéale premier véhicule. Entretien régulier chez un garagiste, factures à l’appui. Distribution faite à 120 000 km. Contrôle technique OK de moins de 6 mois. Quelques rayures d’usage sur le pare-choc arrière.',
    attributes: [
      { label: 'Année', value: '2004' },
      { label: 'Kilométrage', value: '148 500 km' },
      { label: 'Carburant', value: 'Essence' },
      { label: 'Boîte', value: 'Manuelle' },
    ],
    seller: { name: 'Julien M.', memberSince: '2019', listings: 4 },
  },
  {
    id: 'break-familial',
    title: 'Break familial diesel – très bon état',
    price: 11490,
    category: 'vehicules',
    city: 'Périgueux',
    postcode: '24000',
    postedAt: '2026-10-25T17:40:00',
    image: 'voiture-break.png',
    description:
      'Break spacieux parfait pour les vacances en famille. Attelage, GPS, régulateur de vitesse. Pneus neufs. Carnet d’entretien complet, non-fumeur.',
    attributes: [
      { label: 'Année', value: '2017' },
      { label: 'Kilométrage', value: '112 000 km' },
      { label: 'Carburant', value: 'Diesel' },
      { label: 'Boîte', value: 'Manuelle' },
    ],
    seller: { name: 'Garage des Deux Rives', memberSince: '2015', listings: 37, pro: true },
  },
  {
    id: 'appartement-haussmannien',
    title: 'Appartement T3 haussmannien – 68 m²',
    price: 1450,
    priceSuffix: '/mois',
    category: 'immobilier',
    city: 'Lyon 6e',
    postcode: '69006',
    postedAt: '2026-10-26T07:05:00',
    image: 'appartement-lyon.png',
    description:
      'Magnifique T3 au 3e étage avec ascenseur. Parquet point de Hongrie, moulures, cheminée décorative, balcon filant. Deux chambres, cuisine équipée. Proche métro Foch. Disponible au 1er décembre.',
    attributes: [
      { label: 'Type', value: 'Location' },
      { label: 'Surface', value: '68 m²' },
      { label: 'Pièces', value: '3' },
      { label: 'DPE', value: 'D' },
    ],
    seller: { name: 'Claire D.', memberSince: '2021', listings: 1 },
    urgent: true,
  },
  {
    id: 'maison-pierre-bretagne',
    title: 'Maison en granit avec jardin – 4 chambres',
    price: 289000,
    category: 'immobilier',
    city: 'Morlaix',
    postcode: '29600',
    postedAt: '2026-10-24T12:30:00',
    image: 'maison-bretagne.png',
    description:
      'Belle longère en pierre rénovée, toiture ardoise refaite en 2022. 4 chambres, grand séjour avec poêle à bois, jardin clos de 900 m². À 15 minutes de la mer.',
    attributes: [
      { label: 'Type', value: 'Vente' },
      { label: 'Surface', value: '132 m²' },
      { label: 'Terrain', value: '900 m²' },
      { label: 'DPE', value: 'C' },
    ],
    seller: { name: 'Immo Armor', memberSince: '2012', listings: 84, pro: true },
  },
  {
    id: 'canape-velours-vert',
    title: 'Canapé 3 places velours vert sapin',
    price: 380,
    category: 'maison',
    city: 'Bordeaux',
    postcode: '33000',
    postedAt: '2026-10-26T09:48:00',
    image: 'canape-velours.png',
    description:
      'Canapé en velours très confortable, acheté il y a 2 ans. Aucune tache, pas d’animaux. Dimensions : 210 × 90 × 85 cm. À récupérer sur place (3e étage sans ascenseur).',
    attributes: [
      { label: 'État', value: 'Très bon état' },
      { label: 'Matière', value: 'Velours' },
      { label: 'Couleur', value: 'Vert' },
    ],
    seller: { name: 'Sophie L.', memberSince: '2018', listings: 9 },
    delivery: true,
  },
  {
    id: 'table-chene-massif',
    title: 'Table de ferme en chêne massif + 6 chaises',
    price: 650,
    category: 'maison',
    city: 'Annecy',
    postcode: '74000',
    postedAt: '2026-10-25T10:15:00',
    image: 'table-chene.png',
    description:
      'Grande table en chêne massif fabriquée par un artisan local, 200 × 95 cm. Vendue avec ses 6 chaises assorties. Idéale pour les grandes tablées.',
    attributes: [
      { label: 'État', value: 'Bon état' },
      { label: 'Matière', value: 'Chêne massif' },
      { label: 'Places', value: '6 à 8' },
    ],
    seller: { name: 'Marc & Léa', memberSince: '2020', listings: 3 },
  },
  {
    id: 'fauteuil-teck-vintage',
    title: 'Fauteuil vintage en teck années 60',
    price: 220,
    category: 'maison',
    city: 'Nantes',
    postcode: '44000',
    postedAt: '2026-10-23T16:20:00',
    image: 'fauteuil-vintage.png',
    description:
      'Fauteuil scandinave d’époque, structure en teck restaurée, coussins jaune moutarde retapissés. Pièce de caractère.',
    attributes: [
      { label: 'État', value: 'Restauré' },
      { label: 'Matière', value: 'Teck' },
      { label: 'Époque', value: '1960' },
    ],
    seller: { name: 'Brocante du Quai', memberSince: '2016', listings: 152, pro: true },
    delivery: true,
  },
  {
    id: 'smartphone-128go',
    title: 'Smartphone 128 Go noir – avec boîte',
    price: 340,
    category: 'electronique',
    city: 'Marseille',
    postcode: '13008',
    postedAt: '2026-10-26T10:02:00',
    image: 'smartphone.png',
    description:
      'Téléphone en parfait état, toujours protégé par une coque et un verre trempé. Batterie à 91 %. Vendu avec boîte, câble et facture d’achat.',
    attributes: [
      { label: 'État', value: 'Comme neuf' },
      { label: 'Stockage', value: '128 Go' },
      { label: 'Couleur', value: 'Noir' },
    ],
    seller: { name: 'Nadia B.', memberSince: '2022', listings: 2 },
    delivery: true,
  },
  {
    id: 'ordinateur-portable-ultrafin',
    title: 'Ordinateur portable ultrafin 14" – 16 Go RAM',
    price: 590,
    category: 'electronique',
    city: 'Toulouse',
    postcode: '31000',
    postedAt: '2026-10-25T20:11:00',
    image: 'ordinateur-portable.png',
    description:
      'Portable léger (1,2 kg), SSD 512 Go, 16 Go de RAM. Parfait pour les études ou le télétravail. Chargeur d’origine inclus.',
    attributes: [
      { label: 'État', value: 'Très bon état' },
      { label: 'Écran', value: '14 pouces' },
      { label: 'Mémoire', value: '16 Go' },
    ],
    seller: { name: 'Thomas R.', memberSince: '2017', listings: 6 },
    delivery: true,
  },
  {
    id: 'console-salon-blanche',
    title: 'Console de salon + manette – peu servie',
    price: 290,
    category: 'electronique',
    city: 'Lille',
    postcode: '59000',
    postedAt: '2026-10-24T18:45:00',
    image: 'console-jeux.png',
    description:
      'Console achetée l’an dernier, très peu utilisée. Livrée avec une manette, câble HDMI et alimentation.',
    attributes: [
      { label: 'État', value: 'Très bon état' },
      { label: 'Accessoires', value: '1 manette' },
    ],
    seller: { name: 'Kevin P.', memberSince: '2023', listings: 1 },
    urgent: true,
    delivery: true,
  },
  {
    id: 'velo-electrique-ville',
    title: 'Vélo électrique de ville avec panier',
    price: 890,
    category: 'vehicules',
    city: 'Montpellier',
    postcode: '34000',
    postedAt: '2026-10-25T14:00:00',
    image: 'velo-electrique.png',
    description:
      'VAE urbain, autonomie environ 60 km, batterie amovible. Révisé le mois dernier. Panier avant et porte-bagages.',
    attributes: [
      { label: 'État', value: 'Bon état' },
      { label: 'Autonomie', value: '60 km' },
      { label: 'Taille', value: 'M' },
    ],
    seller: { name: 'Élodie V.', memberSince: '2020', listings: 5 },
  },
  {
    id: 'boulanger-cdi',
    title: 'Boulanger·ère H/F – CDI temps plein',
    price: 2100,
    priceSuffix: ' brut/mois',
    category: 'emploi',
    city: 'Strasbourg',
    postcode: '67000',
    postedAt: '2026-10-26T06:30:00',
    image: 'boulangerie.png',
    description:
      'Boulangerie artisanale du centre-ville recherche un·e boulanger·ère expérimenté·e. Travail sur levain, viennoiseries pur beurre. Horaires de nuit, 2 jours de repos consécutifs. Débutant·e motivé·e accepté·e.',
    attributes: [
      { label: 'Contrat', value: 'CDI' },
      { label: 'Temps', value: 'Temps plein' },
      { label: 'Expérience', value: '1 an minimum' },
    ],
    seller: { name: 'Fournil Saint-Thomas', memberSince: '2014', listings: 3, pro: true },
    urgent: true,
  },
]

export function getListing(id: string) {
  return listings.find((l) => l.id === id)
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id)
}
