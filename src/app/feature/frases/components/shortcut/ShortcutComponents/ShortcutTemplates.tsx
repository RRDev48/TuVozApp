import { usePersonalization } from '@/src/app/contexts/PersonalizationContext';
import { useLanguageRefresh } from '@/src/app/contexts/useLanguageRefresh';
import CachedPictogramImage from '@/src/app/feature/common/CachedPictogramImage';
import CustomText from '@/src/app/feature/common/CustomText';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Pictogram } from '../../../../expresate/models/pictogram.types';
import { PREDEFINED_TEMPLATES } from '../../../data/templates';
import { SavedPhrase, useSavedPhrases } from '../../../hooks/useSavedPhrases';

interface ShortcutTemplatesProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectTemplate: (pictograms: Pictogram[]) => void;
}

const ShortcutTemplates: React.FC<ShortcutTemplatesProps> = ({
  isVisible,
  onClose,
  onSelectTemplate
}) => {
  const { t } = useLanguageRefresh();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const { savedPhrases, deletePhrase, renamePhrase } = useSavedPhrases();

  const [activeCategory, setActiveCategory] = useState<'all' | 'greetings' | 'needs' | 'emotions' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: t('allCategories'), icon: 'grid-outline' },
    { id: 'greetings', name: t('greetings'), icon: 'hand-left-outline' },
    { id: 'needs', name: t('needs'), icon: 'fast-food-outline' },
    { id: 'emotions', name: t('emotions'), icon: 'happy-outline' },
    { id: 'custom', name: t('customTemplates'), icon: 'bookmark-outline' },
  ];

  const filteredTemplates = useMemo(() => {
    let list = [...PREDEFINED_TEMPLATES];

    if (activeCategory !== 'all' && activeCategory !== 'custom') {
      list = list.filter(t => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => t(item.name).toLowerCase().includes(q));
    }

    return list;
  }, [activeCategory, searchQuery, t]);

  const filteredSavedPhrases = useMemo(() => {
    if (activeCategory !== 'all' && activeCategory !== 'custom') return [];

    let list = [...savedPhrases];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => item.name.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, savedPhrases, searchQuery]);

  const handleLongPress = (phrase: SavedPhrase) => {
    Alert.alert(
      phrase.name,
      t('choose_action'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => deletePhrase(phrase.id)
        },
      ]
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: themedColors.background }]}>
          <View style={styles.header}>
            <View style={{ width: 28 }} />
            <CustomText style={[styles.headerTitle, { color: themedColors.text }]}>{t('templates')}</CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={themedColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={[styles.searchWrapper, { backgroundColor: themedColors.cardBackground }]}>
              <Ionicons name="search" size={20} color={themedColors.secondary} />
              <TextInput
                style={[styles.searchInput, { color: themedColors.text }]}
                placeholder={t('Search')}
                placeholderTextColor={themedColors.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.categoriesWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id as any)}
                  style={[
                    styles.categoryTab,
                    activeCategory === cat.id
                      ? { backgroundColor: themedColors.primary }
                      : { backgroundColor: '#9E9E9E25' }
                  ]}
                >
                  <CustomText style={[
                    styles.categoryText,
                    activeCategory === cat.id
                      ? { color: '#FFF' }
                      : { color: themedColors.primary }
                  ]}>
                    {cat.name}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
            {activeCategory !== 'custom' && filteredTemplates.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, { backgroundColor: themedColors.cardBackground }]}
                onPress={() => onSelectTemplate(template.pictograms as Pictogram[])}
              >
                <View style={styles.templateHeader}>
                  <CustomText style={[styles.templateName, { color: themedColors.text }]}>
                    {transformText(t(template.name))}
                  </CustomText>
                  <Ionicons name="chevron-forward" size={20} color={themedColors.secondary} />
                </View>
                <View style={styles.pictogramPreview}>
                  {template.pictograms.map((pic, idx) => (
                    <View key={`${template.id}-pic-${idx}`} style={[styles.miniPic, { backgroundColor: themedColors.background + '80' }]}>
                      <CachedPictogramImage
                        arasaacId={pic.arasaac_id!}
                        style={styles.miniImage}
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}

            {(activeCategory === 'all' || activeCategory === 'custom') && filteredSavedPhrases.map(phrase => (
              <TouchableOpacity
                key={phrase.id}
                style={[styles.templateCard, { backgroundColor: themedColors.cardBackground, borderColor: themedColors.primary + '30', borderWidth: 1 }]}
                onPress={() => onSelectTemplate(phrase.pictograms)}
                onLongPress={() => handleLongPress(phrase)}
              >
                <View style={styles.templateHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="bookmark" size={16} color={themedColors.primary} />
                    <CustomText style={[styles.templateName, { color: themedColors.text }]}>{phrase.name}</CustomText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={themedColors.secondary} />
                </View>
                <View style={styles.pictogramPreview}>
                  {phrase.pictograms.map((pic, idx) => (
                    <View key={`${phrase.id}-pic-${idx}`} style={[styles.miniPic, { backgroundColor: themedColors.background + '80' }]}>
                      <CachedPictogramImage
                        arasaacId={pic.arasaac_id}
                        style={styles.miniImage}
                      />
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}

            {filteredTemplates.length === 0 && filteredSavedPhrases.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={50} color={themedColors.secondary + '40'} />
                <CustomText style={{ color: themedColors.secondary, marginTop: 10 }}>
                  {t('no_results')}
                </CustomText>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  categoriesWrapper: {
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  templateCard: {
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pictogramPreview: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  miniPic: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 4,
  },
  miniImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
    opacity: 0.6,
  }
});

export default ShortcutTemplates;
