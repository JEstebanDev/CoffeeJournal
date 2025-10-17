# Services Architecture

Esta carpeta contiene todos los servicios de la aplicación organizados por funcionalidad.

## 📁 Estructura de Carpetas

### 🔐 `auth/`
Servicios relacionados con autenticación y autorización.
- `login.service.ts` - Manejo de login/logout y estado de usuario

### ☕ `coffee/`
Servicios relacionados con la gestión de cafés y catas.
- `coffee.service.ts` - CRUD de catas de café
- `coffee-card-info.service.ts` - Mapeo de datos para tarjetas de café

### 🗄️ `database/`
Servicios de base de datos y conexiones externas.
- `supabase.service.ts` - Cliente de Supabase

### 📊 `dashboard/`
Servicios específicos del dashboard.
- `dashboard-state.service.ts` - Estado centralizado del dashboard
- `statistics.service.ts` - Cálculos estadísticos
- `filter.service.ts` - Filtros y búsquedas

### 📝 `forms/`
Servicios relacionados con formularios y navegación de slides.
- `coffee-tasting-form.service.ts` - Gestión de formularios de cata
- `pending-tasting.service.ts` - Estado de catas pendientes
- `slide-navigation.service.ts` - Navegación entre slides
- `slide.interface.ts` - Interfaces y tipos
- `texts-forms.ts` - Textos y opciones de formularios

## 🚀 Uso

### Importación desde el índice principal
```typescript
import { Login, CoffeeService, DashboardStateService } from '../../services';
```

### Importación específica por categoría
```typescript
import { Login } from '../../services/auth';
import { CoffeeService } from '../../services/coffee';
import { DashboardStateService } from '../../services/dashboard';
```

## 📋 Principios de Organización

1. **Separación por Dominio**: Cada carpeta representa un dominio específico
2. **Responsabilidad Única**: Cada servicio tiene una responsabilidad clara
3. **Reutilización**: Los servicios pueden ser usados en múltiples componentes
4. **Mantenibilidad**: Estructura clara y fácil de navegar
5. **Escalabilidad**: Fácil agregar nuevos servicios en la categoría apropiada

## 🔄 Migración

Si necesitas agregar un nuevo servicio:

1. Identifica la categoría apropiada
2. Crea el servicio en la carpeta correspondiente
3. Actualiza el `index.ts` de la carpeta
4. Actualiza el `index.ts` principal si es necesario
5. Actualiza las importaciones en los componentes que lo usen
