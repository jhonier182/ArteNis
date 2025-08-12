'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Button,
  Badge,
  Alert,
  Spinner,
  Tabs,
  TabsRef,
  Timeline,
  Progress,
  Carousel,
  Tooltip,
  Breadcrumb,
  Pagination,
  Rating
} from 'flowbite-react';
import { 
  HiHome, 
  HiUser, 
  HiHeart, 
  HiEye, 
  HiPhoto,
  HiExclamationCircle,
  HiCheckCircle,
  HiInformationCircle,
  HiArrowRight
} from 'react-icons/hi';

// Importar nuestros componentes personalizados
import { ArtemisButton } from '@/components/ui/FlowbiteButton';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { UserDropdown, Dropdown, DropdownMenuItem } from '@/components/ui/Dropdown';
import { TattooCard, ArtistCard } from '@/components/ui/Card';
import { TextField, SelectField, TextAreaField, CheckboxField, Form } from '@/components/ui/Forms';
import { Toast, ToastContainer, useToast, toast } from '@/components/ui/Toast';

export function FlowbiteShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Datos de ejemplo
  const mockUser = {
    name: 'Ana García',
    email: 'ana@artenis.com',
    avatar: '/perfil.jpg'
  };

  const mockTattoo = {
    image: '/descarga.jpg',
    title: 'Tatuaje Floral Minimalista',
    artist: {
      name: 'Carlos Ink',
      avatar: '/tatuadora.jpg'
    },
    likes: 142,
    isLiked: false,
    tags: ['floral', 'minimalista', 'blackwork']
  };

  const mockArtist = {
    id: '1',
    name: 'María Tattoo',
    avatar: '/tatuadora.jpg',
    bio: 'Especialista en tatuajes realistas y retratos. 10 años de experiencia.',
    location: 'Barcelona, España',
    followers: 2840,
    posts: 156,
    rating: 4.8
  };

  const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: 'Operación completada exitosamente',
      error: 'Ha ocurrido un error inesperado',
      warning: 'Advertencia: revisa los datos',
      info: 'Información importante para ti'
    };
    
    toast[type](messages[type], `Notificación ${type}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Flowbite React + Artenis Showcase
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Demostración completa de todos los componentes de Flowbite React integrados con el tema personalizado de Artenis.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/settings">
            <Button color="purple" size="lg">
              Ver Menú de Configuración
            </Button>
          </Link>
        </div>
      </div>

      {/* Sección de Botones */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Botones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Botones básicos de Flowbite */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Botones Flowbite</h3>
            <div className="space-y-2">
              <Button color="purple" size="lg">Púrpura Principal</Button>
              <Button color="gray" size="md">Secundario</Button>
              <Button color="failure" size="sm">Peligro</Button>
              <Button color="success" size="xs">Éxito</Button>
            </div>
          </div>

          {/* Botones personalizados Artenis */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Botones Artenis</h3>
            <div className="space-y-2">
              <ArtemisButton variant="neon" size="lg">
                Efecto Neón
              </ArtemisButton>
              <ArtemisButton variant="glass" size="md">
                Glass Morphism
              </ArtemisButton>
              <ArtemisButton variant="gradient" size="sm">
                Gradiente
              </ArtemisButton>
              <ArtemisButton 
                color="primary" 
                size="md"
                isLoading={false}
                loadingText="Guardando..."
              >
                Con Loading
              </ArtemisButton>
            </div>
          </div>

          {/* Botones con iconos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Con Iconos</h3>
            <div className="space-y-2">
              <Button color="purple">
                <HiHeart className="mr-2 h-5 w-5" />
                Me Gusta
              </Button>
              <Button color="gray" outline>
                <HiEye className="mr-2 h-5 w-5" />
                Ver Detalles
              </Button>
              <Button color="success" pill>
                <HiPhoto className="mr-2 h-5 w-5" />
                Subir Foto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tarjetas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TattooCard 
            {...mockTattoo}
            onClick={() => console.log('Ver tatuaje')}
            onLike={() => console.log('Like tatuaje')}
            onArtistClick={() => console.log('Ver artista')}
          />
          <ArtistCard 
            artist={mockArtist}
            isFollowing={false}
            onFollow={() => console.log('Seguir artista')}
            onViewProfile={() => console.log('Ver perfil')}
          />
        </div>
      </section>

      {/* Sección de Modales */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Modales</h2>
        <div className="flex gap-4">
          <Button color="purple" onClick={() => setShowModal(true)}>
            Abrir Modal
          </Button>
          <Button color="failure" onClick={() => setShowConfirmModal(true)}>
            Modal de Confirmación
          </Button>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal de Ejemplo"
          size="lg"
          footer={
            <div className="flex gap-3">
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button color="purple" onClick={() => setShowModal(false)}>
                Confirmar
              </Button>
            </div>
          }
        >
          <p className="text-gray-700 dark:text-gray-300">
            Este es un ejemplo de modal usando nuestro componente personalizado.
            Incluye header, body y footer personalizables.
          </p>
        </Modal>

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            console.log('Confirmado');
            setShowConfirmModal(false);
          }}
          title="¿Estás seguro?"
          message="Esta acción no se puede deshacer. ¿Deseas continuar?"
          confirmText="Sí, continuar"
          cancelText="Cancelar"
          confirmColor="failure"
        />
      </section>

      {/* Sección de Formularios */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Formularios</h2>
        <div className="max-w-2xl">
          <Form
            title="Formulario de Ejemplo"
            description="Demostración de campos de formulario personalizados"
            footer={
              <div className="flex gap-3">
                <Button color="gray" type="button">
                  Cancelar
                </Button>
                <Button color="purple" type="submit">
                  Enviar
                </Button>
              </div>
            }
          >
            <TextField
              label="Nombre completo"
              placeholder="Ingresa tu nombre"
              required
              icon={<HiUser className="h-5 w-5" />}
            />
            
            <SelectField
              label="Tipo de tatuaje"
              placeholder="Selecciona un tipo"
              options={[
                { value: 'tradicional', label: 'Tradicional' },
                { value: 'realista', label: 'Realista' },
                { value: 'minimalista', label: 'Minimalista' },
                { value: 'geometric', label: 'Geométrico' }
              ]}
              required
            />

            <TextAreaField
              label="Descripción"
              placeholder="Describe tu idea de tatuaje..."
              rows={4}
            />

            <CheckboxField
              label="Acepto los términos y condiciones"
              description="Lee nuestros términos antes de continuar"
              required
            />
          </Form>
        </div>
      </section>

      {/* Sección de Navegación */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Navegación</h2>
        
        {/* Breadcrumb */}
        <div>
          <h3 className="text-lg font-medium mb-3">Breadcrumb</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="#" icon={HiHome}>
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">
              Tatuajes
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              Realistas
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* Tabs */}
        <div>
          <h3 className="text-lg font-medium mb-3">Pestañas</h3>
          <Tabs style="underline">
            <Tabs.Item title="Populares" icon={HiHeart}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contenido de tatuajes populares...
              </p>
            </Tabs.Item>
            <Tabs.Item title="Recientes" icon={HiPhoto}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contenido de tatuajes recientes...
              </p>
            </Tabs.Item>
            <Tabs.Item title="Mis Favoritos" icon={HiUser}>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contenido de favoritos...
              </p>
            </Tabs.Item>
          </Tabs>
        </div>

        {/* Pagination */}
        <div>
          <h3 className="text-lg font-medium mb-3">Paginación</h3>
          <Pagination currentPage={1} totalPages={10} showIcons />
        </div>
      </section>

      {/* Sección de Alertas y Notificaciones */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Alertas y Notificaciones</h2>
        
        {/* Alertas */}
        <div className="space-y-4">
          <Alert color="success" icon={HiCheckCircle}>
            <span className="font-medium">¡Éxito!</span> Tu tatuaje se ha guardado correctamente.
          </Alert>
          <Alert color="failure" icon={HiExclamationCircle}>
            <span className="font-medium">Error:</span> No se pudo procesar la solicitud.
          </Alert>
          <Alert color="warning" icon={HiInformationCircle}>
            <span className="font-medium">Advertencia:</span> Revisa los datos antes de continuar.
          </Alert>
        </div>

        {/* Botones para Toast */}
        <div>
          <h3 className="text-lg font-medium mb-3">Toast Notifications</h3>
          <div className="flex gap-3">
            <Button color="success" size="sm" onClick={() => handleToastDemo('success')}>
              Éxito
            </Button>
            <Button color="failure" size="sm" onClick={() => handleToastDemo('error')}>
              Error
            </Button>
            <Button color="warning" size="sm" onClick={() => handleToastDemo('warning')}>
              Advertencia
            </Button>
            <Button color="info" size="sm" onClick={() => handleToastDemo('info')}>
              Info
            </Button>
          </div>
        </div>
      </section>

      {/* Sección de Dropdown */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Dropdowns</h2>
        <div className="flex gap-4">
          <UserDropdown
            user={mockUser}
            onProfile={() => console.log('Ver perfil')}
            onSettings={() => console.log('Configuración')}
            onLogout={() => console.log('Cerrar sesión')}
          />
          
          <Dropdown
            trigger={
              <Button color="gray">
                Opciones
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuItem icon={<HiHeart className="h-4 w-4" />}>
              Agregar a favoritos
            </DropdownMenuItem>
            <DropdownMenuItem icon={<HiPhoto className="h-4 w-4" />}>
              Descargar imagen
            </DropdownMenuItem>
          </Dropdown>
        </div>
      </section>

      {/* Sección de Indicadores */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Indicadores</h2>
        
        {/* Progress */}
        <div>
          <h3 className="text-lg font-medium mb-3">Progreso</h3>
          <div className="space-y-4">
            <Progress progress={45} color="purple" />
            <Progress progress={75} color="green" size="lg" />
            <Progress progress={30} color="red" size="sm" />
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-medium mb-3">Badges</h3>
          <div className="flex gap-2">
            <Badge color="purple">Nuevo</Badge>
            <Badge color="green">Activo</Badge>
            <Badge color="red">Popular</Badge>
            <Badge color="yellow" size="sm">Premium</Badge>
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="text-lg font-medium mb-3">Calificación</h3>
          <Rating>
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star />
            <Rating.Star filled={false} />
            <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              4.0 de 5
            </p>
          </Rating>
        </div>

        {/* Spinner */}
        <div>
          <h3 className="text-lg font-medium mb-3">Cargando</h3>
          <div className="flex gap-4 items-center">
            <Spinner color="purple" size="md" />
            <Spinner color="success" size="lg" />
            <div className="flex items-center gap-2">
              <Spinner color="failure" size="sm" />
              <span className="text-sm text-gray-500">Cargando...</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Timeline</h2>
        <Timeline>
          <Timeline.Item>
            <Timeline.Point icon={HiCheckCircle} />
            <Timeline.Content>
              <Timeline.Time>Febrero 2024</Timeline.Time>
              <Timeline.Title>Registro en Artenis</Timeline.Title>
              <Timeline.Body>
                Te uniste a la comunidad de tatuadores más grande de España.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point icon={HiPhoto} />
            <Timeline.Content>
              <Timeline.Time>Marzo 2024</Timeline.Time>
              <Timeline.Title>Primera publicación</Timeline.Title>
              <Timeline.Body>
                Subiste tu primer tatuaje y recibiste 50 likes.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point icon={HiHeart} />
            <Timeline.Content>
              <Timeline.Time>Abril 2024</Timeline.Time>
              <Timeline.Title>100 seguidores</Timeline.Title>
              <Timeline.Body>
                Alcanzaste los 100 seguidores en tu perfil.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
      </section>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
