
# Instrucciones para generar APK

## Prerrequisitos
1. Android Studio instalado
2. Variable ANDROID_HOME configurada
3. Node.js y npm instalados

## Comandos para generar APK

```bash
# 1. Instalar dependencias
npm install

# 2. Construir la aplicación
npm run build

# 3. Agregar plataforma Android (solo la primera vez)
npx cap add android

# 4. Sincronizar cambios
npx cap sync

# 5. Ir al directorio Android
cd android

# 6. Configurar SDK (si es necesario)
echo "sdk.dir=$ANDROID_HOME" > local.properties

# 7. Generar APK debug
./gradlew assembleDebug

# 8. Generar APK release (firmado)
./gradlew assembleRelease
```

## Ubicación del APK generado
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

## Configuración de firma (para release)
Crear archivo `android/app/build.gradle` con configuración de keystore si necesitas APK firmado para producción.

## Troubleshooting
- Si falla `./gradlew`: usar `./gradlew.bat` en Windows
- Si no encuentra Android SDK: verificar ANDROID_HOME
- Si falla el build: limpiar con `./gradlew clean`
