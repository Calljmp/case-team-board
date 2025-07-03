import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

/**
 * Post creation screen with title and content form fields
 * Demonstrates form validation and navigation patterns
 */
export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your post');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('New post created:', {
        title: title.trim(),
        content: content.trim(),
        timestamp: new Date(),
      });

      setTitle('');
      setContent('');
      
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
      console.error('Post creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Discard Post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const renderHeader = () => (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingTop: insets.top + 16, 
      paddingHorizontal: 16, 
      paddingBottom: 16, 
      backgroundColor: '#ffffff', 
      borderBottomWidth: 1, 
      borderBottomColor: '#f3f4f6' 
    }}>
      <TouchableOpacity onPress={handleCancel}>
        <Text style={{ color: '#6b7280', fontSize: 16, fontWeight: '500' }}>Cancel</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937' }}>New Post</Text>
      <TouchableOpacity onPress={handlePost} disabled={isLoading}>
        <Text style={{ 
          color: '#28e2ad', 
          fontSize: 16, 
          fontWeight: '600',
          opacity: isLoading ? 0.5 : 1
        }}>
          {isLoading ? 'Posting...' : 'Post'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {renderHeader()}
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={{ flex: 1, backgroundColor: '#f9fafb' }} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={{ padding: 16 }}>
            <View style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: 16, 
              padding: 20, 
              marginBottom: 16, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.05, 
              shadowRadius: 4, 
              elevation: 2,
              borderWidth: 1,
              borderColor: '#f3f4f6'
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 12 }}>
                Title *
              </Text>
              <TextInput
                style={{ 
                  fontSize: 17, 
                  fontWeight: '500', 
                  color: '#1f2937', 
                  minHeight: 60, 
                  textAlignVertical: 'top', 
                  paddingTop: 0 
                }}
                placeholder="What's on your mind?"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
                multiline
                textAlignVertical="top"
                maxLength={100}
                editable={!isLoading}
              />
              <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 8 }}>
                {title.length}/100
              </Text>
            </View>

            <View style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: 16, 
              padding: 20, 
              marginBottom: 16, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.05, 
              shadowRadius: 4, 
              elevation: 2,
              borderWidth: 1,
              borderColor: '#f3f4f6'
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 12 }}>
                Content
              </Text>
              <TextInput
                style={{ 
                  fontSize: 16, 
                  color: '#1f2937', 
                  minHeight: 120, 
                  textAlignVertical: 'top', 
                  paddingTop: 0 
                }}
                placeholder="Add more details..."
                placeholderTextColor="#9ca3af"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxLength={500}
                editable={!isLoading}
              />
              <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right', marginTop: 8 }}>
                {content.length}/500
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}