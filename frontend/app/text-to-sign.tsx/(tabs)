import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { textToSign } from '../../src/services/api';
import { config } from '../../src/config';

export default function TextToSignScreen() {
  const [inputText, setInputText] = useState('');
  const [sequence, setSequence] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await textToSign(inputText);
      setSequence(data.sequence || []);
    } catch (error) {
      console.error(error);
      Alert.alert('خطأ', 'تعذر الاتصال بالسيرفر للحصول على صور الإشارات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>تحويل النص إلى لغة الإشارة</Text>
      
      <TextInput
        style={styles.input}
        placeholder="أدخل الكلمة أو النص هنا..."
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity style={styles.button} onPress={handleTranslate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'جاري التحميل...' : 'ترجم للإشارة'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      <View style={styles.resultContainer}>
        {sequence.map((item, index) => (
          <View key={index} style={styles.card}>
            {item.image_url ? (
              <Image 
                source={{ uri: ${config.BASE_URL}${item.image_url} }} 
                style={styles.signImage} 
                resizeMode="contain" 
              />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>لا توجد صورة</Text>
              </View>
            )}
            <Text style={styles.charText}>{item.char}</Text>
            <Text style={styles.labelText}>{item.display_name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, textAlign: 'right', fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginTop: 25, justifyContent: 'center' },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, margin: 6, alignItems: 'center', backgroundColor: '#fff', width: 95 },
  signImage: { width: 75, height: 75, marginBottom: 8 },
  noImage: { width: 75, height: 75, backgroundColor: '#f0f0f0', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  noImageText: { fontSize: 10, color: '#888' },
  charText: { fontSize: 20, fontWeight: 'bold' },
  labelText: { fontSize: 11, color: '#666', marginTop: 3, textAlign: 'center' }
});
