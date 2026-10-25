import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    TextInput,
    View,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { styles } from '@/styles/profile.styles';
import { Colors } from '@/theme';

type EditProfileModalProps = {
  visible: boolean;
  initialName: string;
  initialEmail: string;
  onClose: () => void;
  onSave: (name: string, email: string) => void;
};

export function EditProfileModal({
  visible,
  initialName,
  initialEmail,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [lastInitials, setLastInitials] = useState({
    initialName,
    initialEmail,
    visible,
  });

  // Reset form saat modal dibuka atau nilai awal dari parent berubah
  // (adjusting state during render — pola yang direkomendasikan React untuk
  // merespon perubahan props, menggantikan setState di dalam useEffect).
  if (
    lastInitials.initialName !== initialName ||
    lastInitials.initialEmail !== initialEmail ||
    lastInitials.visible !== visible
  ) {
    setLastInitials({ initialName, initialEmail, visible });
    setName(initialName);
    setEmail(initialEmail);
  }

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert('Periksa kembali', 'Masukkan nama dan alamat email yang valid.');
      return;
    }

    onSave(trimmedName, trimmedEmail);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <View style={styles.editModal}>
          <View style={styles.modalHeading}>
            <View>
              <AppText variant="headlineSm">Edit profil</AppText>
              <AppText variant="bodySm" color={Colors.onSurfaceVariant}>
                Sesuaikan informasi akunmu
              </AppText>
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Tutup"
              onPress={onClose}
              style={styles.closeButton}>
              <Icon name="close" size={22} color={Colors.onSurfaceVariant} />
            </PressableScale>
          </View>
          <AppText variant="labelMd">Nama</AppText>
          <TextInput
            accessibilityLabel="Nama"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            placeholder="Nama kamu"
            placeholderTextColor={Colors.outline}
            style={styles.input}
          />
          <AppText variant="labelMd">Email</AppText>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="nama@email.com"
            placeholderTextColor={Colors.outline}
            style={styles.input}
          />
          <PressableScale
            accessibilityRole="button"
            onPress={handleSave}
            style={styles.saveButton}>
            <AppText variant="labelLg" color={Colors.onPrimary}>
              Simpan perubahan
            </AppText>
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}