import * as Location from 'expo-location';

let watchId = null;

export const startLocationTracking = async (callback) => {
    // Ask for location tracking permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Location permission not granted');
        return;
    }

    // Remove the previous subscription if there was one before
    watchId?.remove();

    // Subscribe to watchPosition to track whenever the location changes
    watchId = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation },
        callback
    );
};

export const stopLocationTracking = () => {
    if (watchId !== null) {
        watchId.remove()
        watchId = null;
    }
};

