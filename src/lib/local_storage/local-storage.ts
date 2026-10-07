import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTutorialSeen = async () => {
    try {
        await AsyncStorage.setItem('tutorial_seen', 'true');
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
        return false;
    }
};

export const deleteAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.error('Error deleting all from local storage', e);
    }
};
