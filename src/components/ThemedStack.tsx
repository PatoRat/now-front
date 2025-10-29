import { useTheme } from '@/src/components/context-provider/Theme';
import { View } from 'react-native';

export default function ThemedStack() {
    const { theme } = useTheme();

    return (
        <View style={{backgroundColor: theme.colors.background}}>
            
        </View>
    );
}
