import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ChatService } from '@services/chat/chat.service';
import { StorageService } from '@services/storage/storage.service';

export const chatGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  const chatService = inject(ChatService);

  let confirmUser = false;
  let chat = await chatService.getChatById(route.params['chatId']);

  if (chat) {
    const ids = chat.data();
    const userId = storageService.get('userToken');

    if (ids?.['uid1'] === userId || ids?.['uid2'] === userId) {
      confirmUser = true;
    }

    if (!confirmUser) {
      router.navigate(['/home']);
    }

    return confirmUser;
  }

  return false;
};
