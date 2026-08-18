const asset = filename => `${import.meta.env.BASE_URL}images/${filename}`;

export const products = [
  { id: 1, name: 'Nala Draped Midi', category: 'Dresses', price: 1890, colour: 'Espresso', image: asset('nala-dress.png'), description: 'Sculptural draping meets effortless elegance. Cut in fluid jersey for a refined, feminine silhouette.' },
  { id: 2, name: 'Imani Asymmetric Blouse', category: 'Tops', price: 1490, colour: 'Ivory', image: asset('ivory-blouse.png'), description: 'A one-shoulder study in proportion, finished in softly structured crepe.' },
  { id: 3, name: 'Ayo Belted Suit', category: 'Tailoring', price: 3250, colour: 'Cacao', image: asset('tailored-suit.png'), description: 'Confident tailoring with a defined waist and an easy, elongated trouser.' },
  { id: 4, name: 'Curve Leather Shoulder Bag', category: 'Accessories', price: 1950, colour: 'Espresso', image: asset('curve-bag.png'), description: 'A sculptural crescent in smooth leather with brushed brass hardware.' },
  { id: 5, name: 'Lira Silk Cami', category: 'Tops', price: 1490, colour: 'Ivory', image: asset('silk-cami.png'), description: 'A liquid silk essential with an architectural neckline and barely-there straps.' },
];

export const money = value => `R ${value.toLocaleString('en-ZA')}`;
