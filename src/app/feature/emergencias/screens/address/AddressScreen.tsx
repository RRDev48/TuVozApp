import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import AddButton from "../../components/AddButton";
import ListItem from "../../components/ListItem";
import SaveButton from "../../components/SaveButton";
type AddressScreenRouteProp = RouteProp<
  RootStackParamsList,
  "AddressSelection"
>;
type AddressScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddressSelection"
>;

const AddressScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<AddressScreenNavigationProp>();
  const route = useRoute<AddressScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
      }),
    [themedColors],
  );

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

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={t('address')} />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {t('whatIsYourAddress')}
        </Text>

        <AddButton
          onPress={handleAddAddress}
          text={t('addNew')}
        />

        {addresses.map((address, index) => (
          <ListItem
            key={index}
            iconName="home"
            title={address}
            onPress={() => handleEditAddress(index)}
          />
        ))}
      </ScrollView>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default AddressScreen;
