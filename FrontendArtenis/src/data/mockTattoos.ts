// Mock data con imágenes locales de la carpeta public para simular posts reales
const localImages = [
  '/descarga.jpg',
  '/descarga (1).jpg',
  '/descarga (2).jpg',
  '/descarga (3).jpg',
  '/descarga (4).jpg',
  '/descarga (5).jpg',
  '/descarga (6).jpg',
  '/descarga (7).jpg',
  '/inicio.jpg',
  '/tatuadora.jpg',
];

export const mockTattooData = [
  {
    id: '1',
    imageUrl: localImages[0],
    title: 'Tatuaje de Rosa Realista en Brazo',
    artist: {
      id: 'artist1',
      name: 'InkMaster_Sofia',
      avatar: '/tatuadora.jpg',
      isVerified: true
    },
    likes: 234,
    isLiked: false,
    tags: ['realismo', 'rosa', 'brazo', 'color'],
    style: 'Realismo'
  },
  {
    id: '2',
    imageUrl: localImages[1],
    title: 'Mandala Geométrico Minimalista',
    artist: {
      id: 'artist2',
      name: 'GeometricTattoo',
      isVerified: false
    },
    likes: 156,
    isLiked: true,
    tags: ['mandala', 'geometrico', 'minimalista'],
    style: 'Geométrico'
  },
  {
    id: '3',
    imageUrl: localImages[2],
    title: 'Dragón Japonés Tradicional',
    artist: {
      id: 'artist3',
      name: 'TokyoInk_Master',
      avatar: '/perfil.jpg',
      isVerified: true
    },
    likes: 445,
    isLiked: false,
    tags: ['dragon', 'japones', 'tradicional', 'color'],
    style: 'Japonés'
  },
  {
    id: '4',
    imageUrl: localImages[3],
    title: 'Líneas Finas Blackwork',
    artist: {
      id: 'artist4',
      name: 'BlackLineStudio',
      isVerified: true
    },
    likes: 89,
    isLiked: false,
    tags: ['blackwork', 'lineas', 'minimal'],
    style: 'Blackwork'
  },
  {
    id: '5',
    imageUrl: localImages[4],
    title: 'Acuarela Abstracta en Espalda',
    artist: {
      id: 'artist5',
      name: 'WatercolorTats',
      avatar: '/tatuadora.jpg',
      isVerified: false
    },
    likes: 312,
    isLiked: true,
    tags: ['acuarela', 'abstracto', 'espalda', 'color'],
    style: 'Acuarela'
  },
  {
    id: '6',
    imageUrl: localImages[5],
    title: 'Retrato Hiperrealista',
    artist: {
      id: 'artist6',
      name: 'RealisticPortraits',
      isVerified: true
    },
    likes: 678,
    isLiked: false,
    tags: ['retrato', 'realismo', 'cara'],
    style: 'Realismo'
  },
  {
    id: '7',
    imageUrl: localImages[6],
    title: 'Pequeño Tatuaje de Luna',
    artist: {
      id: 'artist7',
      name: 'TinyTattoos',
      isVerified: false
    },
    likes: 123,
    isLiked: false,
    tags: ['pequeno', 'luna', 'minimalista'],
    style: 'Minimalista'
  },
  {
    id: '8',
    imageUrl: localImages[7],
    title: 'Sleeve Completo Biomecánico',
    artist: {
      id: 'artist8',
      name: 'CyberTattoos',
      avatar: '/perfil.jpg',
      isVerified: true
    },
    likes: 892,
    isLiked: true,
    tags: ['sleeve', 'biomecanico', 'brazo'],
    style: 'Biomecánico'
  },
  {
    id: '9',
    imageUrl: localImages[8],
    title: 'Flor de Cerezo Delicada',
    artist: {
      id: 'artist9',
      name: 'FloralInk',
      isVerified: false
    },
    likes: 267,
    isLiked: false,
    tags: ['flor', 'cerezo', 'delicado', 'color'],
    style: 'Botánico'
  },
  {
    id: '10',
    imageUrl: localImages[9],
    title: 'Tribal Moderno Geométrico',
    artist: {
      id: 'artist10',
      name: 'ModernTribal',
      avatar: '/tatuadora.jpg',
      isVerified: true
    },
    likes: 445,
    isLiked: false,
    tags: ['tribal', 'moderno', 'geometrico'],
    style: 'Tribal'
  }
];

// Función para generar más datos (infinite scroll)
export const generateMoreTattoos = (startId: number, count: number = 10) => {
  const styles = ['Realismo', 'Blackwork', 'Japonés', 'Minimalista', 'Acuarela', 'Geométrico', 'Tribal'];
  const tags = ['realismo', 'blackwork', 'japones', 'minimalista', 'acuarela', 'geometrico', 'tribal', 'color', 'negro', 'brazo', 'pierna', 'espalda'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    const style = styles[Math.floor(Math.random() * styles.length)];
    const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);
    
    return {
      id: id.toString(),
      imageUrl: localImages[id % localImages.length],
      title: `Tatuaje ${style} #${id}`,
      artist: {
        id: `artist${id}`,
        name: `Artist_${id}`,
        avatar: Math.random() > 0.5 ? '/perfil.jpg' : undefined,
        isVerified: Math.random() > 0.7
      },
      likes: Math.floor(Math.random() * 1000) + 10,
      isLiked: Math.random() > 0.8,
      tags: randomTags,
      style
    };
  });
};
