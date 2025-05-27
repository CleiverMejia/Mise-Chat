import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { createClient } from '@supabase/supabase-js';

const { v4: uuidv4 } = require('uuid');

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase;
  private readonly supabaseUrl = environment.supabaseUrl;
  private readonly supabaseKey = environment.supabaseKey;
  private readonly bucketName = 'storage';

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  uploadFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const filePath = `${uuidv4()}_${file.name}`;

      this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file)
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(this.getPublicUrl(data.path));
          }
        });
    });
  }

  getPublicUrl(filePath: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
