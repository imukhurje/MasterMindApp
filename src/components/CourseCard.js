// src/components/CourseCard.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const CourseCard = ({
  title,
  description,
  author,
  priceMinor,
  currency = '₹',
  imageUrl,
  rating = 4,
  onPress,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const price = priceMinor ? (priceMinor / 100).toFixed(2) : '0.00';

  const displayCurrency =
    currency === 'INR' || currency === '₹' ? '₹' : currency || '₹';

  const firstLetter = useMemo(() => {
    const t = (title || '').trim();
    return t ? t[0].toUpperCase() : '?';
  }, [title]);

  const shouldShowImage = !!imageUrl && !imageFailed;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        {shouldShowImage ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImageBackground
            source={require('./../../assets/gradients/thumb-gradient.jpg')}
            style={styles.fallbackThumb}
            resizeMode="cover"
          >
            <Text style={styles.fallbackLetter}>{firstLetter}</Text>
          </ImageBackground>
        )}

        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>
            {Math.round(Number(rating) || 4)}★
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>

        <Text numberOfLines={1} style={styles.description}>
          {description || title}
        </Text>

        <Text numberOfLines={1} style={styles.author}>
          by <Text style={styles.authorName}>{author || 'Unknown'}</Text>
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {displayCurrency} {price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 260,
    backgroundColor: '#0B1730',
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,

    borderWidth: 1,
    borderColor: '#1F5C96',

    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 10,
    elevation: 6,
  },

  imageWrap: {
    width: '100%',
    height: 138,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  fallbackThumb: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fallbackLetter: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
  },

  ratingBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: '#EF4444',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  infoBox: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 8,
  },

  title: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    marginBottom: 5,
  },

  description: {
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 8,
  },

  author: {
    color: '#CBD5E1',
    fontSize: 11,
  },

  price: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
  },

  authorName: {
    color: '#F8FAFC',
    fontWeight: '700',
  },

  priceRow: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default CourseCard;
