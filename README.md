npx create-expo-app@latest

npm update

npm install @supabase/supabase-js

npm install @react-navigation/stack

npm install react-native-calendars

npm install @react-navigation/native

npm install react-native-screens react-native-safe-area-context

npm install react-native-gesture-handler

npm install react-native-svg

npm install --save-dev react-native-svg-transformer

-- IMPORTANTE
-- Modificar la función del trigger para manejar casos sin metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo insertar si hay metadata completa
  IF new.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    INSERT INTO public.users (id, full_name, age, role)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      COALESCE((new.raw_user_meta_data->>'age')::integer, 0),
      COALESCE(new.raw_user_meta_data->>'role', 'self')
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
