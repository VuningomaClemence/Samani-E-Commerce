const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const produits = [
  // Chaises
  {
    nomProduit: "Chaise en bois massif",
    description: "Chaise en bois massif, robuste et élégante.",
    quantite: 30,
    prix: 250,
    categorie: "chaises",
    image:
      "https://i.pinimg.com/736x/dd/94/c4/dd94c40798cf188f927c088886d025a8.jpg",
    pointsFidelite: 25,
  },
  {
    nomProduit: "Chaise en plastique moulé",
    description: "Chaise légère et moderne en plastique moulé.",
    quantite: 35,
    prix: 150,
    categorie: "chaises",
    image:
      "https://i.pinimg.com/originals/6d/f6/f7/6df6f71e4d978d9813bde86c052b26e6.jpg",
    pointsFidelite: 15,
  },
  {
    nomProduit: "Chaise TEODORES IKEA",
    description: "Chaise TEODORES de chez IKEA, pratique et design.",
    quantite: 40,
    prix: 49,
    categorie: "chaises",
    image:
      "https://www.ikea.com/ca/fr/images/products/teodores-chaise-bleu__1114277_pe871737_s5.jpg?f=s",
    pointsFidelite: 5,
  },
  {
    nomProduit: "Chaise design Laredoute",
    description: "Chaise design de La Redoute, confort et style.",
    quantite: 35,
    prix: 89,
    categorie: "chaises",
    image:
      "https://assets.wfcdn.com/im/03946552/resize-h800-w800%5Ecompr-r85/6273/62731561/Flannigan+Polyurethane+Task+Chair.jpg",
    pointsFidelite: 9,
  },
  {
    nomProduit: "Chaise scandinave bleu pétrole",
    description: "Chaise scandinave tendance bleu pétrole.",
    quantite: 30,
    prix: 120,
    categorie: "chaises",
    image:
      "https://media.but.fr/images_produits/produit-zoom/3662970113042_AMB1.jpg",
    pointsFidelite: 12,
  },
  {
    nomProduit: "Chaise en tissu rembourrée",
    description: "Chaise confortable en tissu rembourré.",
    quantite: 35,
    prix: 300,
    categorie: "chaises",
    image:
      "https://cdn.webshopapp.com/shops/263771/files/392315824/by-boo-moderne-eetkamerstoel-grijs-stof-armleuning.jpg",
    pointsFidelite: 30,
  },
  {
    nomProduit: "Chaise en métal style industriel",
    description: "Chaise en métal, style industriel.",
    quantite: 35,
    prix: 350,
    categorie: "chaises",
    image:
      "https://tse1.explicit.bing.net/th/id/OIP.1TCqvYbUwMml0R4nTgvYCgHaHa?r=0&w=700&h=700&rs=1&pid=ImgDetMain",
    pointsFidelite: 35,
  },

  // Canapés
  {
    nomProduit: "Canapé d'angle scandinave",
    description: "Canapé d'angle scandinave spacieux et confortable.",
    quantite: 40,
    prix: 950,
    categorie: "canape",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.iIx3kS1uGeQAzFepGHbjJQHaFj?r=0&w=735&h=551&rs=1&pid=ImgDetMain",
    pointsFidelite: 95,
  },
  {
    nomProduit: "Canapé Chesterfield Royal",
    description: "Canapé Chesterfield Royal, luxe et tradition.",
    quantite: 45,
    prix: 2100,
    categorie: "canape",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.LE-BDcENoC_BL4EQQd5MZQHaFd?rs=1&pid=ImgDetMain",
    pointsFidelite: 210,
  },
  {
    nomProduit: "Canapé Relaxation LUXE",
    description: "Canapé relaxation haut de gamme.",
    quantite: 40,
    prix: 1850,
    categorie: "canape",
    image:
      "https://th.bing.com/th/id/R.028713b0b52c8fcf57f02295f6637645?rik=Zd%2bI9njjto4WAQ&riu=http%3a%2f%2fmueblesvinaroz.com%2fwp-content%2fuploads%2f2017%2f12%2fSILLONMADRIDGRIS.jpg&ehk=vQ7kDakbr2%2fHrcMpj1khwbk6exuaIdgaUVs%2bNQdU7UA%3d&risl=&pid=ImgRaw&r=0",
    pointsFidelite: 185,
  },
  {
    nomProduit: "Canapé Convertible MILANO",
    description: "Canapé convertible MILANO, pratique et élégant.",
    quantite: 35,
    prix: 1200,
    categorie: "canape",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.KmI0bj7STJ06ljlE3m-ffwHaFP?w=1200&h=850&rs=1&pid=ImgDetMain",
    pointsFidelite: 120,
  },
  {
    nomProduit: "Canapé d'angle BOSTON",
    description: "Canapé d'angle BOSTON, moderne et spacieux.",
    quantite: 40,
    prix: 1450,
    categorie: "canape",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.HeIwe0eLQ4E_kdsr80TckAHaFa?rs=1&pid=ImgDetMain",
    pointsFidelite: 145,
  },
  {
    nomProduit: "Canapé Cuir NOIR",
    description: "Canapé en cuir noir, design intemporel.",
    quantite: 50,
    prix: 2300,
    categorie: "canape",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.-NEgYBI8lyJu6QiO2MEKsgHaE0?w=1600&h=1043&rs=1&pid=ImgDetMain",
    pointsFidelite: 230,
  },
  {
    nomProduit: "Canapé Tissu GRIS",
    description: "Canapé tissu gris, doux et confortable.",
    quantite: 35,
    prix: 990,
    categorie: "canape",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.dF-4PUf7gVUhI9kYKEOx8wHaFa?rs=1&pid=ImgDetMain",
    pointsFidelite: 99,
  },
  {
    nomProduit: "Canapé d'angle OSLO",
    description: "Canapé d'angle OSLO, style nordique.",
    quantite: 30,
    prix: 1100,
    categorie: "canape",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.ZGI6c6lfs3qsM-jFGfl7QQHaE0?w=1575&h=1024&rs=1&pid=ImgDetMain",
    pointsFidelite: 110,
  },
  {
    nomProduit: "Canapé Convertible TOKYO",
    description: "Canapé convertible TOKYO, gain de place.",
    quantite: 40,
    prix: 1250,
    categorie: "canape",
    image:
      "https://eu-images.contentstack.com/v3/assets/blt167b24547e5b1906/bltc402be71b40fdae4/64a83da4a17466538908d484/12.png?format=pjpg&auto=webp&quality=80&width=1920&disable=upscale",
    pointsFidelite: 125,
  },
  {
    nomProduit: "Canapé d'angle LUXURY",
    description: "Canapé d'angle LUXURY, confort et élégance.",
    quantite: 35,
    prix: 1750,
    categorie: "canape",
    image:
      "https://www.mobilierdefrance.com/10559/canape-dangle-modulable-spacer.jpg",
    pointsFidelite: 175,
  },
  {
    nomProduit: "Canapé Scandinave NORDIC",
    description: "Canapé scandinave NORDIC, design épuré.",
    quantite: 50,
    prix: 1550,
    categorie: "canape",
    image:
      "https://get.ru/upload/iblock/337/uv3ngs5bl4jn3jcibd21lmm6r966l234.jpg",
    pointsFidelite: 155,
  },
  {
    nomProduit: "Canapé KLIPPAN IKEA",
    description: "Canapé KLIPPAN de chez IKEA.",
    quantite: 40,
    prix: 299,
    categorie: "canape",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.g59vy8L3e-9pY4UVF7BORwHaE9?rs=1&pid=ImgDetMain",
    pointsFidelite: 29,
  },
  {
    nomProduit: "Canapé d'angle convertible Laredoute",
    description: "Canapé d'angle convertible de La Redoute.",
    quantite: 35,
    prix: 799,
    categorie: "canape",
    image:
      "https://cdn.laredoute.com/products/641by641/e/e/2/ee2740b21f94386841a6f85018bd4c92.jpg",
    pointsFidelite: 79,
  },
  {
    nomProduit: "Canapé velours LUNA",
    description: "Canapé velours LUNA, douceur et élégance.",
    quantite: 45,
    prix: 1600,
    categorie: "canape",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.vSyD-Eqn7QNxJRZWUAlawgHaHa?w=1000&h=1000&rs=1&pid=ImgDetMain",
    pointsFidelite: 160,
  },
  {
    nomProduit: "Canapé convertible LENA",
    description: "Canapé convertible LENA, pratique et confortable.",
    quantite: 40,
    prix: 980,
    categorie: "canape",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.vJUnLiUNRpU4hAvMb0Z6tQHaFj?r=0&rs=1&pid=ImgDetMain",
    pointsFidelite: 98,
  },
  {
    nomProduit: "Canapé scandinave OSLO",
    description: "Canapé scandinave OSLO, style nordique.",
    quantite: 30,
    prix: 520,
    categorie: "canape",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.r6TOgnC3ra_jreTHU17LpQHaE8?r=0&w=1200&h=800&rs=1&pid=ImgDetMain",
    pointsFidelite: 52,
  },

  // Tables
  {
    nomProduit: "Table d'appoint scandinave",
    description: "Petite table d'appoint scandinave.",
    quantite: 25,
    prix: 200,
    categorie: "table",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.Rw7sFaIOY5O0-C6yQ46lCQHaHa?r=0&w=1920&h=1920&rs=1&pid=ImgDetMain",
    pointsFidelite: 20,
  },
  {
    nomProduit: "Table console extensible",
    description: "Table console extensible, pratique pour les petits espaces.",
    quantite: 25,
    prix: 600,
    categorie: "table",
    image:
      "https://www.inside75.com/contents/refim/-c/console-extensible-stef-blanche-pietement-verre_4.jpg",
    pointsFidelite: 60,
  },
  {
    nomProduit: "Table avec rangement",
    description: "Table basse avec rangement intégré.",
    quantite: 40,
    prix: 350,
    categorie: "table",
    image:
      "https://th.bing.com/th/id/R.0c65ada0b98ba0fd0578559ec4b95cb1?rik=QhLBTFRcwgUd8Q&riu=http%3a%2f%2fwww.emberizaone.fr%2fwp-content%2fuploads%2f2019%2f05%2ftable-basse-design-noir-et-blanc-laque-avec-4-tiroirs-de-rangement-glamour-130-cm-2-2-1.jpg&ehk=smgpNUyDUdk0zHf7dCUfz4bFiJjJrADkodfR%2bQe09Gg%3d&risl=&pid=ImgRaw&r=0",
    pointsFidelite: 35,
  },
  {
    nomProduit: "Table en bois massif",
    description: "Table en bois massif, robuste et élégante.",
    quantite: 15,
    prix: 500,
    categorie: "table",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.acr7jVOBHsiN33WAo2hJ9gHaFj?r=0&w=2560&h=1920&rs=1&pid=ImgDetMain",
    pointsFidelite: 50,
  },
  {
    nomProduit: "Table de bar industrielle",
    description: "Table de bar au style industriel.",
    quantite: 15,
    prix: 450,
    categorie: "table",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.ddp28GkyWdewX7CkDmeqNwHaHa?r=0&w=600&h=600&rs=1&pid=ImgDetMain",
    pointsFidelite: 45,
  },
  {
    nomProduit: "Table à manger en verre",
    description: "Table à manger élégante en verre.",
    quantite: 20,
    prix: 750,
    categorie: "table",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_679460-MLA72841216556_112023-O.webp",
    pointsFidelite: 75,
  },
  {
    nomProduit: "Table basse moderne",
    description: "Table basse moderne, design épuré.",
    quantite: 30,
    prix: 300,
    categorie: "table",
    image:
      "https://jubileefurniturelv.com/cdn/shop/products/76679_1_grande.jpg?v=1585786917",
    pointsFidelite: 30,
  },
  {
    nomProduit: "Table d'appoint en marbre",
    description: "Table d'appoint en marbre véritable.",
    quantite: 10,
    prix: 400,
    categorie: "table",
    image:
      "https://a.1stdibscdn.com/art-deco-marble-top-side-table-for-sale/f_9238/f_304993521663685411134/f_30499352_1663685411455_bg_processed.jpg",
    pointsFidelite: 40,
  },

  // Armoires
  {
    nomProduit: "Armoire industrielle indio",
    description: "Armoire industrielle, robuste et tendance.",
    quantite: 45,
    prix: 500,
    categorie: "armoire",
    image:
      "https://www.monsieurbureau.com/rangement-pour-bureau/armoire-bois/armoire-basse-avec-niche-jules-photo-xxlarge-2b54f.jpg?v=1419",
    pointsFidelite: 50,
  },
  {
    nomProduit: "Armoire PAX blanche IKEA",
    description: "Armoire PAX blanche de chez IKEA.",
    quantite: 45,
    prix: 650,
    categorie: "armoire",
    image:
      "https://www.ikea.com/gb/en/images/products/pax-tyssedal-wardrobe-combination-white-white__0780671_pe760170_s5.jpg?f=sg",
    pointsFidelite: 65,
  },
  {
    nomProduit: "Armoire 3 portes chêne clair",
    description: "Armoire 3 portes en chêne clair.",
    quantite: 40,
    prix: 420,
    categorie: "armoire",
    image:
      "https://www.matelpro.com/8597-thickbox_default/armoire-adulte-3-portes-contemporaine-chene-clair-florine.jpg",
    pointsFidelite: 42,
  },
  {
    nomProduit: "Armoire portes coulissantes miroir",
    description: "Armoire avec portes coulissantes miroir.",
    quantite: 35,
    prix: 780,
    categorie: "armoire",
    image:
      "https://th.bing.com/th/id/R.f17882f493481e68d2b0f7e629493159?rik=Ya69OR3V4J0opg&riu=http%3a%2f%2fwww.leblogdeco.fr%2fwp-content%2f2014%2f03%2fArmoire-avec-des-portes-coulissantes-miroir.jpg&ehk=DMh%2fMPa8Ywq2gRdfurE%2fGf%2bza042%2fc33la2zpL6oIYg%3d&risl=&pid=ImgRaw&r=0",
    pointsFidelite: 78,
  },
  {
    nomProduit: "Armoire 2 portes blanc laqué",
    description: "Armoire 2 portes blanc laqué, moderne.",
    quantite: 30,
    prix: 350,
    categorie: "armoire",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.I0CEjLz_Y0ISTX08UbRP-QHaHQ?rs=1&pid=ImgDetMain",
    pointsFidelite: 35,
  },
  {
    nomProduit: "Armoire KLEPPSTAD 3 portes",
    description: "Armoire KLEPPSTAD 3 portes IKEA.",
    quantite: 25,
    prix: 299,
    categorie: "armoire",
    image:
      "https://www.ikea.com/sg/en/images/products/fonnes-door-white__0764389_pe753227_s5.jpg?f=m",
    pointsFidelite: 29,
  },
  {
    nomProduit: "Armoire portes battantes bois",
    description: "Armoire avec portes battantes en bois.",
    quantite: 20,
    prix: 250,
    categorie: "armoire",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.e9pJ--gxuwju-W-7zyBk4AAAAA?rs=1&pid=ImgDetMain",
    pointsFidelite: 25,
  },
  {
    nomProduit: "Armoire HEMNES 2 portes",
    description: "Armoire HEMNES 2 portes IKEA.",
    quantite: 25,
    prix: 399,
    categorie: "armoire",
    image:
      "https://www.ikea.com/ca/fr/images/products/hemnes-armoire-a-pharmacie-2-portes-miroir-gris__0640576_pe699927_s5.jpg?f=s",
    pointsFidelite: 39,
  },
  {
    nomProduit: "Armoire BRIMNES 3 portes",
    description: "Armoire BRIMNES 3 portes IKEA.",
    quantite: 30,
    prix: 349,
    categorie: "armoire",
    image:
      "https://tse1.mm.bing.net/th/id/OIP.Y4KJiCC2K3XwzuO-v_mFSQHaFj?w=1000&h=750&rs=1&pid=ImgDetMain",
    pointsFidelite: 34,
  },
  {
    nomProduit: "Armoire Pin Massif",
    description: "Armoire en pin massif, solide et naturelle.",
    quantite: 35,
    prix: 300,
    categorie: "armoire",
    image:
      "https://cdn.maisonetstyles.com/content/cache/produit/c_400x400/1344420_1_L.jpg",
    pointsFidelite: 30,
  },
  {
    nomProduit: "Armoire vintage",
    description: "Armoire vintage, style rétro.",
    quantite: 25,
    prix: 200,
    categorie: "armoire",
    image:
      "https://i.pinimg.com/originals/5c/95/95/5c959539106dd00938347a51f7da6399.jpg",
    pointsFidelite: 20,
  },
  {
    nomProduit: "Armoire chêne massif",
    description: "Armoire en chêne massif, grande capacité.",
    quantite: 20,
    prix: 950,
    categorie: "armoire",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.jpUCVJu4i6o_Lee4kz4HewHaIl?r=0&rs=1&pid=ImgDetMain",
    pointsFidelite: 95,
  },
];

const seedDatabase = async () => {
  const productsCollection = db.collection("produits");
  for (const produit of produits) {
    await productsCollection.add(produit);
  }
};

seedDatabase().then(() => process.exit(0));
