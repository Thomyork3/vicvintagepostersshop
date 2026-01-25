# Posters Vicvintage - TODO

## Cambios Solicitados
- [x] Eliminar sección de categorías (botones)
- [x] Agregar funcionalidad de editar posters
- [x] Agregar funcionalidad de eliminar posters
- [x] Implementar autenticación con contraseña y bcrypt
- [x] Eliminar botones de perfil y carrito
- [x] Agregar diálogo de autenticación para modificaciones

## Base de Datos y Backend
- [x] Crear esquema de MySQL para posters (título, categoría, precio, imagen_url)
- [x] Crear procedimiento tRPC para obtener todos los posters
- [x] Crear procedimiento tRPC para obtener posters por categoría
- [x] Crear procedimiento tRPC para obtener últimos agregados
- [x] Integrar conexión a base de datos
- [ ] Integrar AWS S3 para almacenamiento de imágenes

## Frontend - Estructura General
- [x] Crear header con logo "Posters Vicvintage" y navegación
- [ ] Crear barra de búsqueda
- [x] Crear carrito de compras (icono)
- [x] Crear sección de cuenta/login
- [x] Crear formulario para agregar nuevos posters

## Frontend - Página Principal
- [x] Crear sección de categorías (Álbumes, Bandas, Películas, Personajes, Artistas/Deportistas, Otros)
- [x] Crear grid de productos con imágenes, títulos y precios
- [x] Implementar navegación a categorías al hacer clic
- [x] Crear sección "Últimos Agregados" con los posters más recientes
- [ ] Implementar carrusel/slider para productos destacados

## Frontend - Páginas de Categorías
- [x] Crear página de categoría con filtrado
- [x] Mostrar todos los posters de la categoría seleccionada
- [ ] Implementar paginación o scroll infinito

## Integración con AWS S3
- [x] Configurar variables de entorno (AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
- [x] Validar credenciales de AWS S3
- [ ] Implementar carga de imágenes a S3 desde el formulario

## Diseño y Estilos
- [ ] Aplicar estilos inspirados en balompie.mx
- [ ] Configurar Tailwind CSS con colores y tipografía adecuados
- [ ] Implementar responsive design para móviles y tablets

## Testing y Validación
- [x] Escribir tests para procedimientos tRPC
- [x] Probar integración con base de datos
- [x] Escribir tests para creación de posters
- [x] Validar credenciales de AWS S3
- [x] Validar diseño responsivo

## Deployment (Futuro)
- [ ] Preparar para deployment
- [ ] Configurar variables de entorno en producción


## Cambios Urgentes Solicitados
- [x] Cambiar base de datos de MySQL a MongoDB
- [x] Mover botones de editar/eliminar arriba junto con agregar poster
- [x] Crear .env.local con variables de MongoDB del usuario


## Cambios de Diseño Solicitados
- [x] Reemplazar título "POSTERS VICVINTAGE" por logo de S3
- [x] Hacer botones más pequeños (solo iconos, sin texto)
- [x] Mover botones hasta abajo de la página
- [x] Colores sutiles para los botones


## Sistema de Subcategorías y Mejoras
- [x] Actualizar esquema MongoDB para subcategorías
- [x] Crear modelo de Subcategoría (nombre, imagen_url, categoria_padre)
- [x] Actualizar categorías: Deportes, Música/Artistas, Famosos/Personajes, Películas, Photocards, Otros
- [x] Crear procedimientos tRPC para CRUD de subcategorías
- [x] Modificar flujo: Categoría → Subcategorías → Imágenes
- [x] Implementar buscador con autocompletado
- [x] Protección de imágenes (clic derecho + overlay)
- [x] Visualización ampliada de imágenes (lightbox)
- [x] Agregar redes sociales (Instagram, TikTok, WhatsApp)
- [x] Botón "¿No encontraste lo que buscabas?" con imagen
- [x] Actualizar formularios de admin para subcategorías


## Nuevas Mejoras y Limpieza
- [x] Crear modal de bienvenida que aparece al abrir la página (con espacio para imagen de Vic Vintage)
- [x] Agregar botón X para cerrar el modal
- [x] Agregar botón cerca de "¿No encontraste lo que buscabas?" para reabrir el modal
- [x] Cambiar año en footer de 2024 a 2026
- [x] Eliminar archivo .gitkeep de client/public
- [x] Eliminar todos los comentarios del código
- [x] Eliminar todos los emojis del código
- [x] Eliminar evidencia de uso de IA (comentarios TODO, etc.)
- [x] Aplicar cambios del usuario en Home.tsx (gap-30, h-19, bg-sky-300, etc.)
