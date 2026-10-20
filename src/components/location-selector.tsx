
import { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type LocationSelectorProps = {
  onLocationChange?: (
    location: string,
    radius: number
  ) => void;
};

const radiusOptions = [1, 3, 5, 10];

export function LocationSelector({
  onLocationChange,
}: LocationSelectorProps) {
  const [location, setLocation] = useState(
    'Menteng, Jakarta Pusat'
  );
  const [radius, setRadius] = useState(3);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempRadius, setTempRadius] = useState(radius);
  const [visible, setVisible] = useState(false);

  function openModal() {
    setTempLocation(location);
    setTempRadius(radius);
    setVisible(true);
  }

  function saveLocation() {
    const newLocation = tempLocation.trim();

    if (!newLocation) return;

    setLocation(newLocation);
    setRadius(tempRadius);
    onLocationChange?.(newLocation, tempRadius);
    setVisible(false);
  }

  return (
    <View>
      <View style={styles.locationBar}>
        <Text style={styles.pin}>●</Text>

        <Text style={styles.locationText} numberOfLines={1}>
          {location}
        </Text>

        <Text style={styles.dot}>•</Text>

        <Text style={styles.radiusText}>
          Radius {radius} km
        </Text>

        <Pressable
          onPress={openModal}
          style={styles.changeButton}
        >
          <Text style={styles.changeText}>Ubah ☷</Text>
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <Text style={styles.title}>Ubah Lokasi</Text>

              <Pressable
                onPress={() => setVisible(false)}
                hitSlop={10}
              >
                <Text style={styles.close}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.description}>
              Temukan makanan enak di sekitar lokasi pilihan lu.
            </Text>

            <Text style={styles.label}>
              Lokasi pencarian
            </Text>

            <TextInput
              value={tempLocation}
              onChangeText={setTempLocation}
              placeholder="Contoh: Menteng, Jakarta Pusat"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              returnKeyType="done"
            />

            <Text style={styles.label}>
              Jarak pencarian
            </Text>

            <View style={styles.radiusContainer}>
              {radiusOptions.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setTempRadius(item)}
                  style={[
                    styles.radiusOption,
                    tempRadius === item &&
                      styles.radiusSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.radiusOptionText,
                      tempRadius === item &&
                        styles.radiusSelectedText,
                    ]}
                  >
                    {item} km
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={saveLocation}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>
                Terapkan Lokasi
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 8,
  },
  pin: {
    color: '#0284C7',
    fontSize: 17,
  },
  locationText: {
    flexShrink: 1,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  dot: {
    color: '#64748B',
  },
  radiusText: {
    color: '#334155',
    fontSize: 13,
  },
  changeButton: {
    marginLeft: 'auto',
    paddingLeft: 4,
  },
  changeText: {
    color: '#0284C7',
    fontSize: 14,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    marginBottom: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
  },
  close: {
    color: '#64748B',
    fontSize: 20,
    padding: 4,
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 14,
    padding: 15,
    color: '#0F172A',
    fontSize: 14,
    marginBottom: 22,
  },
  radiusContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  radiusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  radiusSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  radiusOptionText: {
    color: '#025091',
    fontWeight: '600',
  },
  radiusSelectedText: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#0284C7',
    alignItems: 'center',
    borderRadius: 30,
    padding: 16,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 14,
    marginTop: 4,
  },
  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
});
