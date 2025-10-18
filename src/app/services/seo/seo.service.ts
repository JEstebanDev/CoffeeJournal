import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly defaultTitle = 'CoffeeJournal - Tu Diario de Café Personal';
  private readonly defaultDescription = 'Registra, evalúa y descubre tus cafés favoritos. Una aplicación completa para amantes del café que quieren llevar un registro detallado de sus experiencias.';
  private readonly defaultKeywords = 'café, coffee, diario, journal, tasting, cata, evaluación, notas, registro, barista';
  private readonly defaultImage = '/assets/logo.png';
  private readonly siteUrl = 'https://coffeejournal.netlify.app';

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSEO(data: SEOData): void {
    // Actualizar título
    const title = data.title ? `${data.title} | CoffeeJournal` : this.defaultTitle;
    this.title.setTitle(title);

    // Meta tags básicos
    this.meta.updateTag({ name: 'description', content: data.description || this.defaultDescription });
    this.meta.updateTag({ name: 'keywords', content: data.keywords || this.defaultKeywords });
    this.meta.updateTag({ name: 'author', content: data.author || 'CoffeeJournal' });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: data.description || this.defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: data.image || this.defaultImage });
    this.meta.updateTag({ property: 'og:url', content: data.url || this.siteUrl });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: data.siteName || 'CoffeeJournal' });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description || this.defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: data.image || this.defaultImage });

    // Meta tags adicionales
    if (data.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: data.publishedTime });
    }
    if (data.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedTime });
    }

    // Structured Data (JSON-LD)
    if (data.structuredData) {
      this.addStructuredData(data.structuredData);
    }
  }

  private addStructuredData(data: any): void {
    // Remover structured data existente
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Agregar nuevo structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  // Métodos específicos para diferentes páginas
  setHomePageSEO(): void {
    this.updateSEO({
      title: 'CoffeeJournal - Tu Diario de Café Personal',
      description: 'Registra, evalúa y descubre tus cafés favoritos. Una aplicación completa para amantes del café que quieren llevar un registro detallado de sus experiencias.',
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'CoffeeJournal',
        description: 'Aplicación para registrar y evaluar experiencias de café',
        url: this.siteUrl,
        applicationCategory: 'Food & Drink',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    });
  }

  setDashboardSEO(): void {
    this.updateSEO({
      title: 'Dashboard - Mis Cafés',
      description: 'Revisa tus cafés registrados, estadísticas y experiencias de cata. Mantén un control completo de tu colección de cafés.',
      type: 'website'
    });
  }

  setSlidesSEO(): void {
    this.updateSEO({
      title: 'Registrar Nuevo Café',
      description: 'Registra una nueva experiencia de café con detalles completos: origen, método de preparación, notas de cata y evaluación.',
      type: 'website'
    });
  }

  setAuthSEO(): void {
    this.updateSEO({
      title: 'Iniciar Sesión - CoffeeJournal',
      description: 'Accede a tu cuenta de CoffeeJournal para sincronizar tus datos y acceder desde cualquier dispositivo.',
      type: 'website'
    });
  }
}
