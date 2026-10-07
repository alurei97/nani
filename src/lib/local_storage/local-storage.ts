import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTutorialSeen = async (value: boolean) => {
    try {
        await AsyncStorage.setItem('tutorial_seen', value.toString());
    } catch (e) {
        console.error('Error saving to local storage', e);
    }
};

export const getTutorialSeen = async (): Promise<boolean | null> => {
    try {
        const value = await AsyncStorage.getItem('tutorial_seen');
        return value === 'true';
    } catch (e) {
        console.error('Error reading from local storage', e);
        return null;
    }
};
