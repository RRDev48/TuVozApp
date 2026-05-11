import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useActiveProfile } from "../../contexts/ActiveProfileContext";
import { colors } from "../../design-system/themes/globalColors-theme";
import { useCurrentUserProfile } from "../../feature/ajustes/hooks/useCurrentUserProfile";
import { useEmergencyActions } from "../../feature/emergencias/hooks/useEmergencyActions";
import { emergencyService } from "../../feature/emergencias/services/emergency.Service";
import RootStackParamsList from "../../navigation/navigation.types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const FAB_SIZE = 60;
const MINI_FAB_SIZE = 45;
const MARGIN = 20;

const FloatingAdipFAB = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { displayName } = useActiveProfile();
  const { profileId } = useCurrentUserProfile();
  const { sendAlert, confirmEmergencyCall } = useEmergencyActions();

  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name);
  const isAuthScreen = !currentRouteName ||
    ["splash", "onboarding", "login", "register", "password", "verification", "terms", "setup", "role", "type", "support"].some(keyword =>
      currentRouteName.toLowerCase().includes(keyword)
    );

  const isVisible = !!displayName && !isAuthScreen;

  const [isOpen, setIsOpen] = useState(false);
  const [emergencyProfile, setEmergencyProfile] = useState<any>(null);
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - FAB_SIZE - MARGIN, y: SCREEN_HEIGHT - FAB_SIZE - MARGIN * 4 })).current;
  const animation = useRef(new Animated.Value(0)).current;

  // Precargar perfil de emergencia para que el envío sea instantáneo
  useEffect(() => {
    const prefetchProfile = async () => {
      if (profileId) {
        try {
          const profile = await emergencyService.getEmergencyProfile(profileId);
          setEmergencyProfile(profile);
        } catch (error) {
          console.error("Error preloading emergency profile:", error);
        }
      }
    };
    prefetchProfile();
  }, [profileId]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        let finalX = (pan.x as any)._value;
        const middle = SCREEN_WIDTH / 2 - FAB_SIZE / 2;

        if (finalX < middle) {
          finalX = MARGIN;
        } else {
          finalX = SCREEN_WIDTH - FAB_SIZE - MARGIN;
        }

        let finalY = (pan.y as any)._value;
        if (finalY < MARGIN) finalY = MARGIN;
        if (finalY > SCREEN_HEIGHT - FAB_SIZE - MARGIN * 4) finalY = SCREEN_HEIGHT - FAB_SIZE - MARGIN * 4;

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const toggleMenu = () => {
    if (isOpen) {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAction = (action: string) => {
    toggleMenu();
    setTimeout(async () => {
      switch (action) {
        case "frases":
          navigation.navigate("Frases");
          break;
        case "alerta":
          if (emergencyProfile) {
            sendAlert(emergencyProfile, displayName || "Usuario");
          } else if (profileId) {
            // Si por alguna razón no se precargó, cargamos ahora
            const profile = await emergencyService.getEmergencyProfile(profileId);
            if (profile) {
              setEmergencyProfile(profile);
              sendAlert(profile, displayName || "Usuario");
            }
          }
          break;
        case "emergencia":
          confirmEmergencyCall();
          break;
      }
    }, 300);
  };

  if (!isVisible) return null;

  const getVariantStyle = (index: number) => {
    const radius = 80;
    const isAtLeft = (pan.x as any)._value < SCREEN_WIDTH / 2;
    const finalAngle = isAtLeft ? (index * 60) - 60 : (index * 60) + 120;

    const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, radius * Math.cos((finalAngle * Math.PI) / 180)],
    });
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, radius * Math.sin((finalAngle * Math.PI) / 180)],
    });

    return {
      transform: [{ translateX }, { translateY }, { scale: animation }],
      opacity: animation,
    };
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Animated.View style={[styles.miniFab, getVariantStyle(0), { backgroundColor: colors.blue }]}>
          <TouchableOpacity onPress={() => handleAction("frases")} style={styles.miniFabTouch}>
            <Ionicons name="chatbubbles" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.miniFab, getVariantStyle(1), { backgroundColor: colors.yellow }]}>
          <TouchableOpacity onPress={() => handleAction("alerta")} style={styles.miniFabTouch}>
            <Ionicons name="warning" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.miniFab, getVariantStyle(2), { backgroundColor: colors.red }]}>
          <TouchableOpacity onPress={() => handleAction("emergencia")} style={styles.miniFabTouch}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleMenu}
          style={[styles.mainFab, { backgroundColor: "white", borderColor: colors.blue, borderWidth: 2 }]}
        >
          <Image
            source={require("../../assets/image/adip_icon.png")}
            style={styles.adipIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  fabWrapper: {
    position: "absolute",
    width: FAB_SIZE,
    height: FAB_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  mainFab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  adipIcon: {
    width: "70%",
    height: "70%",
  },
  miniFab: {
    position: "absolute",
    width: MINI_FAB_SIZE,
    height: MINI_FAB_SIZE,
    borderRadius: MINI_FAB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  miniFabTouch: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingAdipFAB;
