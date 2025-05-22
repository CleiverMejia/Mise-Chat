import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ChatService } from '@services/chat/chat.service';
import { StorageService } from '@services/storage/storage.service';

export const chatGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  const chatService = inject(ChatService);

  chatService.getChatById('')
  .then()

  if (storageService.get('userToken')) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
