import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/useTheme';

const ZENPAE_LOGO = require('../../assets/icon.png');

type AccountCardProps = {
  width: number;
  name: string;
  network: string;
  logo: number;
};

export default function AccountCard({ width, name, network, logo }: AccountCardProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.timing(expandAnim, {
      toValue,
      duration: 260,
      useNativeDriver: true,
    }).start();
  };

  const CardSurface = (
    <View
      style={[
        styles.cardShadow,
        {
          width,
          borderColor: 'rgba(255,255,255,0.08)',
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.overlayRing} />
        <View style={styles.overlayRingSecondary} />

        <View style={styles.topRow}>
          <Image source={ZENPAE_LOGO} style={styles.zenpaeLogo} resizeMode="contain" />
          <View style={styles.logoWrap}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={[styles.bankName, { color: theme.colors.textSecondary }]}>
            ZenPae Bank
          </Text>
        </View>

        <Text style={[styles.cardNumber, { color: theme.colors.textPrimary }]}>
          **** **** **** 45
        </Text>

        <View style={styles.footerRow}>
          <Text style={[styles.cardHolder, { color: theme.colors.textSecondary }]}>
            {name}
          </Text>
          <Text style={[styles.cardNetwork, { color: theme.colors.muted }]}>
            {network}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Pressable onPress={toggleExpanded} style={{ width }}>
        {CardSurface}
      </Pressable>

      <Modal visible={expanded} transparent animationType="fade" onRequestClose={toggleExpanded}>
        <Pressable onPress={toggleExpanded} style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.focusWrap,
              {
                opacity: expandAnim,
                transform: [
                  { scale: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) },
                ],
              },
            ]}
          >
            {CardSurface}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: 18,
    borderWidth: 0.5,
    shadowColor: '#99FF32',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  card: {
    backgroundColor: '#272B2F',
    borderRadius: 18,
    padding: 18,
    overflow: 'hidden',
  },
  overlayRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    top: -110,
    right: -40,
  },
  overlayRingSecondary: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    bottom: -90,
    left: -60,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  zenpaeLogo: {
    width: 28,
    height: 28,
  },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 22,
    height: 22,
  },
  bankName: {
    fontSize: 12,
    letterSpacing: 0.6,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolder: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
  cardNetwork: {
    fontSize: 12,
    letterSpacing: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  focusWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
