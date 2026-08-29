import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { textToSign } from '../../src/services/api';

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

      <TouchableOpacity style={styles.button} onPress={handleTranslate}>
        <Text style={styles.buttonText}>ترجم للإشارة</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      <View style={styles.resultContainer}>
        {sequence.map((item, index) => (
          <View key={index} style={styles.card}>
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
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, textAlign: 'right' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginTop: 20, justifyContent: 'center' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, margin: 5, alignItems: 'center', minWidth: 70 },
  charText: { fontSize: 22, fontWeight: 'bold' },
  labelText: { fontSize: 12, color: '#666', marginTop: 5 }
});
