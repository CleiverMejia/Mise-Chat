# 📱 Mise-Chat

Una aplicación de mensajería construida con **Ionic Framework**, que permite a los usuarios comunicarse en tiempo real, registrar contactos, compartir archivos, editar su perfil, y más. Utiliza **Firebase** para la autenticación y base de datos en tiempo real, y **Supabase** para el almacenamiento de archivos.

---

## 🚀 Características

- 🔐 **Autenticación de usuarios** con Firebase (registro, login, logout).
- 🗣️ **Mensajería en tiempo real** entre usuarios registrados.
- 📇 **Gestión de contactos**: Agregar, editar y ver contactos.
- 🖼️ **Envío de archivos**: Imágenes, videos, documentos.
- 📍 **Compartir ubicación** actual.
- ✏️ **Perfil personal**: Cambiar apodo, editar nombre, imagen de perfil, etc.
- ☁️ **Almacenamiento en Supabase** para archivos multimedia.

---

## 🛠️ Tecnologías Usadas

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [Supabase Storage](https://supabase.io/)
- [Capacitor](https://capacitorjs.com/) (para funcionalidades nativas)

---

## 🧪 Requisitos Previos

- Node.js ≥ 16
- Ionic CLI: `npm install -g @ionic/cli`
- Cuenta de Firebase y Supabase
- Configuración previa de entornos y credenciales

---

## ⚙️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ionic-messenger-app.git
cd ionic-messenger-app

# Instalar dependencias
npm install

# Ejecutar en el navegador
ionic serve
