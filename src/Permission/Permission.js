import {Alert} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

function showAlert(msg) {
  Alert.alert('', msg, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Settings',
      onPress: () => {
        openSettings().catch(() => console.warn('cannot open settings'));
      },
    },
  ]);
}

const hasGalleryPermission = async (withAlert = true) => {
  try {
    const permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const response = await check(permission);
    let gallery;
    if (response !== RESULTS.GRANTED) {
      gallery = await request(permission);
    }
    if (gallery === RESULTS.DENIED || gallery === RESULTS.BLOCKED) {
      if (withAlert) {
        showAlert(
          'Permission not granted for accessing the gallery. You will not be able to select images in this application.',
        );
      }
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const PermissionsService = {
  hasGalleryPermission,
};

export default PermissionsService;
