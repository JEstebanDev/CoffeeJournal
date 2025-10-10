import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface CoffeeTasting {
  id?: string;
  user_id: string;
  brand: string;
  coffee_name: string;
  bean_type: string;
  origin: string;
  roast_level: string;
  brew_method: string;
  aroma: string;
  flavor: string;
  body: string;
  acidity: string;
  aftertaste: string;
  impression: string;
  score: number;
  image?: string; // base64 or URL
}

export interface CoffeeApiResponse {
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CoffeeService {
  private supabaseService = inject(SupabaseService);

  /**
   * Guarda una nueva cata de café en Supabase
   * @param tasting Datos de la cata de café
   * @returns Observable con la respuesta
   */
  saveCoffeeTasting(tasting: CoffeeTasting): Observable<CoffeeApiResponse> {
    return from(this.saveCoffeeTastingAsync(tasting));
  }

  /**
   * Método async para guardar en Supabase
   */
  private async saveCoffeeTastingAsync(tasting: CoffeeTasting): Promise<CoffeeApiResponse> {
    try {
      // Si hay imagen en base64, primero la subimos a Supabase Storage
      let imageUrl = null;
      if (tasting.image && tasting.image.startsWith('data:image')) {
        imageUrl = await this.uploadImage(tasting.image, tasting.id || Date.now().toString());
      }

      // Preparar los datos para insertar
      const dataToInsert = {
        user_id: tasting.user_id,
        brand: tasting.brand,
        coffee_name: tasting.coffee_name,
        bean_type: tasting.bean_type,
        origin: tasting.origin,
        roast_level: tasting.roast_level,
        brew_method: tasting.brew_method,
        aroma: tasting.aroma,
        flavor: tasting.flavor,
        body: tasting.body,
        acidity: tasting.acidity,
        aftertaste: tasting.aftertaste,
        impression: tasting.impression,
        score: tasting.score,
        image: imageUrl, // URL de la imagen en Supabase Storage
      };

      // Insertar en la tabla coffeejournal
      const { data, error } = await this.supabaseService.client
        .from('coffeejournal')
        .insert([dataToInsert])
        .select();

      if (error) {
        console.error('Error al guardar en Supabase:', error);
        throw new Error(error.message);
      }

      return {
        message: 'Cata guardada exitosamente',
        data: data,
      };
    } catch (error: any) {
      console.error('Error en saveCoffeeTastingAsync:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen a Supabase Storage
   * @param base64Image Imagen en formato base64
   * @param id ID único para el nombre del archivo
   * @returns URL pública de la imagen
   */
  private async uploadImage(base64Image: string, id: string): Promise<string | null> {
    try {
      // Convertir base64 a blob
      const base64Data = base64Image.split(',')[1];
      const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Generar nombre único para el archivo
      const fileExt = mimeType.split('/')[1];
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      const filePath = `coffee-images/${fileName}`;

      // Subir a Supabase Storage
      const { data, error } = await this.supabaseService.client.storage
        .from('coffee-images') // Nombre del bucket en Supabase
        .upload(filePath, blob, {
          contentType: mimeType,
          upsert: false,
        });

      if (error) {
        console.error('Error al subir imagen:', error);
        return null;
      }

      // Obtener URL pública
      const { data: publicUrlData } = this.supabaseService.client.storage
        .from('coffee-images')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      return null;
    }
  }

  /**
   * Obtiene todas las catas de café de un usuario
   * @param userId ID del usuario
   * @returns Observable con las catas
   */
  getCoffeeTastingsByUser(userId: string): Observable<CoffeeTasting[]> {
    return from(this.getCoffeeTastingsByUserAsync(userId));
  }

  /**
   * Método async para obtener catas por usuario
   */
  private async getCoffeeTastingsByUserAsync(userId: string): Promise<CoffeeTasting[]> {
    try {
      const { data, error } = await this.supabaseService.client
        .from('coffeejournal')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error al obtener catas:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error en getCoffeeTastingsByUserAsync:', error);
      throw error;
    }
  }

  /**
   * Convierte un archivo a base64 para enviarlo al API
   * @param file Archivo de imagen
   * @returns Promise con la imagen en base64
   */
  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
