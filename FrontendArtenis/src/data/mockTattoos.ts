// Mock data para simular posts de tatuajes tipo Pinterest
export const mockTattooData = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    title: 'Tatuaje de Rosa Realista en Brazo',
    artist: {
      id: 'artist1',
      name: 'InkMaster_Sofia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b8d5?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    likes: 234,
    isLiked: false,
    tags: ['realismo', 'rosa', 'brazo', 'color'],
    style: 'Realismo'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1565022093792-dc53d7d2b7a0?w=400&h=500&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=400&h=700&fit=crop',
    title: 'Dragón Japonés Tradicional',
    artist: {
      id: 'artist3',
      name: 'TokyoInk_Master',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    likes: 445,
    isLiked: false,
    tags: ['dragon', 'japones', 'tradicional', 'color'],
    style: 'Japonés'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=600&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=550&fit=crop',
    title: 'Acuarela Abstracta en Espalda',
    artist: {
      id: 'artist5',
      name: 'WatercolorTats',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      isVerified: false
    },
    likes: 312,
    isLiked: true,
    tags: ['acuarela', 'abstracto', 'espalda', 'color'],
    style: 'Acuarela'
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=650&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1608057208132-16fe33d7d069?w=400&h=500&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1581281863883-2469417a1668?w=400&h=750&fit=crop',
    title: 'Sleeve Completo Biomecánico',
    artist: {
      id: 'artist8',
      name: 'CyberTattoos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isVerified: true
    },
    likes: 892,
    isLiked: true,
    tags: ['sleeve', 'biomecanico', 'brazo'],
    style: 'Biomecánico'
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1599582909646-64f8c2ed1d63?w=400&h=600&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1565022093792-dc53d7d2b7a0?w=400&h=800&fit=crop',
    title: 'Tribal Moderno Geométrico',
    artist: {
      id: 'artist10',
      name: 'ModernTribal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
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
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000000)}?w=400&h=${Math.floor(Math.random() * 300) + 500}&fit=crop`,
      title: `Tatuaje ${style} #${id}`,
      artist: {
        id: `artist${id}`,
        name: `Artist_${id}`,
        avatar: Math.random() > 0.5 ? `https://images.unsplash.com/photo-${1400000000000 + Math.floor(Math.random() * 100000000000)}?w=100&h=100&fit=crop&crop=face` : undefined,
        isVerified: Math.random() > 0.7
      },
      likes: Math.floor(Math.random() * 1000) + 10,
      isLiked: Math.random() > 0.8,
      tags: randomTags,
      style
    };
  });
};
