# 💈 Barber Gang MX — Premium Urban Web Application

Bienvenido al repositorio oficial de **Barber Gang MX**, una aplicación web full-stack premium diseñada con una estética urbana, grunge y high-end para la barbería líder en Poza Rica, Veracruz. 

Esta plataforma combina un diseño visual disruptivo (estilo street-art con texturas de papel rasgado y acentos neón) con una arquitectura moderna de alto rendimiento para la gestión de citas en tiempo real.

---

## 🛠️ Tech Stack & Arquitectura

El proyecto está construido utilizando las herramientas más modernas del ecosistema web para garantizar velocidad, SEO y una experiencia de usuario fluida:

* **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/) con TypeScript para un tipado seguro.
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) para el diseño responsivo y utilitario.
* **Componentes de UI:** [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/) (complementado con vectores SVG personalizados para la estética grunge).
* **Base de Datos & Backend:** [Supabase](https://supabase.com/) (PostgreSQL) con funcionalidad **Realtime** habilitada para la sincronización inmediata de la agenda.

---

## 🎨 Identidad Visual y Estética (Urban Grunge)

La interfaz de usuario rompe con los diseños corporativos tradicionales, adoptando una identidad de *streetwear* de alta gama:

* **Texturas de Fondo:** Transiciones dinámicas entre secciones usando fondos claros de papel arrugado (*crumpled paper*) y paneles negros mate profundo, separados por efectos visuales de bordes rasgados (**Torn Paper Divider UI**).
* **Paleta de Colores:** Base de negro mate y carbón, contrastada con verde neón eléctrico (`Lime #00FF00` / `#A3FF00`), cian cibernético y salpicaduras de pintura en amarillo brillante.
* **Tipografía:** Fuentes display geométricas y ultra-bold en mayúsculas (con bordes iluminados/neón) para títulos principales; sans-serif limpia para textos informativos y navegación.
* **Acentos Gráficos:** Caritas sonrientes neón (con ojos de rayos), superposiciones de recortes de periódico estilo NYC, manchas de pintura en aerosol y vectores minimalistas de coronas.

---

## 🗺️ Estructura de la Aplicación y Secciones

### 1. Navigation Bar (Sticky)
Menú superior con efecto de *glassmorphism* oscuro y desenfoque de fondo. Incluye enlaces rápidos a las secciones principales (*Inicio, Cortes, Barbers, Horarios*) y un botón destacado con brillo neón para **"Agendar Cita"**.

### 2. Landing Page (Vista Principal)
* **Hero Section:** Fondo con gradiente en malla (azul/púrpura/magenta), capas de graffiti sutiles, tipografía robusta con el logo de "BARBER GANG MX" y llamado a la acción (CTA) principal.
* **Haircut Showcase (Catálogo Visual):** Grid dinámico de marcos circulares con texto curvado perimetral que muestra los estilos: *BUZZ, MILITAR, FADE, MOHICANO, MULLET y UNDERCUT*.
* **Services Menu Card:** Tarjeta contenedora con estética de colage de periódico y bordes rasgados que lista los servicios premium (Cortes, Rituales de barba, Mascarillas, Tintura, tratamientos capilares, etc.).
* **Team Section ("Conoce a Nuestros Barbers"):** Grid interactivo con las tarjetas de los profesionales: *Mauricio, Armando, Fidel, Rubén, Dulce, Jessica y Amairani*. Cada tarjeta cuenta con marcos iluminados en cian/verde y un badge distintivo.
* **Info & Ubicación Interactiva:** Layout dividido. Lado izquierdo con mapa minimalista oscuro localizado en la *Av. 20 de Noviembre y Calle 10* (Poza Rica, Ver.).