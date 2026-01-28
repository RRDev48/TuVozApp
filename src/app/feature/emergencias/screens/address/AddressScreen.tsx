import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type AddressScreenRouteProp = RouteProp<
  RootStackParamsList,
  "AddressSelection"
>;

type AddressScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddressSelection"
>;

const AddressScreen = () => {
  const navigation = useNavigation<AddressScreenNavigationProp>();
  const route = useRoute<AddressScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [addresses, setAddresses] = useState<string[]>(
    route.params?.currentAddress
      ? route.params.currentAddress.split(",").map((a) => a.trim())
      : [],
  );

  const handleAddAddress = () => {
    navigation.navigate("AddAddress", {
      onAdd: (address: string) => {
        setAddresses((prev) => [...prev, address]);
      },
    });
  };

  const handleEditAddress = (index: number) => {
    navigation.navigate("EditAddress", {
      address: addresses[index],
      onUpdate: (updatedAddress: string) => {
        setAddresses((prev) => {
          const newAddresses = [...prev];
          newAddresses[index] = updatedAddress;
          return newAddresses;
        });
      },
      onDelete: () => {
        setAddresses((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(addresses.join(", "));
    }
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 10,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    backText: {
      fontSize: 16,
      fontWeight: "600",
      color: themedColors.text,
      marginLeft: 4,
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: themedColors.primary,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      marginBottom: 30,
    },
    addButton: {
      width: "100%",
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.white,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.white,
    },
    addressesList: {
      width: "100%",
    },
    addressItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.darkGray,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 15,
    },
    addressIcon: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.blue,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    addressInfo: {
      flex: 1,
    },
    addressText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.white,
    },
    saveButton: {
      position: "absolute",
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: colors.green,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.black,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <CustomText style={styles.backText}>
            {transformText("Atrás")}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <CustomText style={styles.headerTitle}>
          {transformText("Dirección")}
        </CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.title}>
          {transformText("¿Cuál es tu dirección?")}
        </CustomText>

        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <CustomText style={styles.addButtonText}>
            + {transformText("Añadir nuevo")}
          </CustomText>
        </TouchableOpacity>

        <View style={styles.addressesList}>
          {addresses.map((address, index) => (
            <TouchableOpacity
              key={index}
              style={styles.addressItem}
              onPress={() => handleEditAddress(index)}
            >
              <View style={styles.addressIcon}>
                <Ionicons name="home" size={30} color={colors.white} />
              </View>
              <View style={styles.addressInfo}>
                <CustomText style={styles.addressText}>{address}</CustomText>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.white} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <CustomText style={styles.saveButtonText}>
          {transformText("Guardar cambios")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default AddressScreen;
