import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const options: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

async function fromGallery(): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync(options);
  return res.canceled ? null : res.assets[0].uri;
}

async function fromCamera(): Promise<string | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Izin kamera ditolak', 'Aktifkan izin kamera di pengaturan HP kamu.');
    return null;
  }
  const res = await ImagePicker.launchCameraAsync(options);
  return res.canceled ? null : res.assets[0].uri;
}

/** Tampilkan pilihan kamera/galeri, kembalikan URI lokal foto atau null jika batal. */
export function chooseAvatar(): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      'Foto profil',
      'Ambil foto dari mana?',
      [
        { text: 'Kamera', onPress: () => fromCamera().then(resolve) },
        { text: 'Galeri', onPress: () => fromGallery().then(resolve) },
        { text: 'Batal', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}