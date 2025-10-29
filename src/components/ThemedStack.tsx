import { useContextApp } from '@/src/components/context-provider/Theme';
import { View } from 'react-native';

export default function ThemedStack() {
    const { theme } = useContextApp();

    return (
        <View style={{backgroundColor: theme.colors.background}}>
            
        </View>
    );
}
