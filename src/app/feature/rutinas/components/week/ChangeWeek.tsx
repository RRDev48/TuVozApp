// React
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Componentes
import { ChangeWeekProps } from "../../(models)/component.props";

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales
import { colors } from "@/src/app/design-system/themes/globalColors-theme";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
});

/**
 * Componente para cambiar rápidamente de semana en la vista de rutinas.
 *
 * Muestra dos flechas (anterior y siguiente) y un texto central. Al pulsar
 * cada flecha, ajusta la fecha de inicio de la semana actual sumando o
 * restando 7 días y notifica el nuevo valor mediante `onChangeWeek`.
 */
const ChangeWeek = ({ currentWeekStart, onChangeWeek }: ChangeWeekProps) => {
  // const { formatText } = usePersonalization();

  // Calcula una nueva fecha de inicio de semana a partir de la actual,
  // moviéndose `increment` semanas hacia adelante o hacia atrás.
  const handleChangeWeek = (increment: number) => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(currentWeekStart.getDate() + increment * 7);
    onChangeWeek(newStartDate);
  };

  return (
    <View style={styles.container}>
      {/* Botón para ir a la semana anterior (resta 7 días). */}
      <TouchableOpacity onPress={() => handleChangeWeek(-1)}>
        <Ionicons name="chevron-back-outline" size={24} color={colors.black} />
      </TouchableOpacity>

      {/* Texto central que funciona como encabezado de la sección de rutinas. */}
      <Text style={styles.title}>{"¿Comenzamos el día?"}</Text>

      {/* Botón para ir a la semana siguiente (suma 7 días). */}
      <TouchableOpacity onPress={() => handleChangeWeek(1)}>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={colors.black}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChangeWeek;
