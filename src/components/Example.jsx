// Any component
import { addToast } from '@/store/slices/tostSlice';
import { useDispatch } from 'react-redux';

function Example() {
  const dispatch = useDispatch();

  const showSuccess = () => {
    dispatch(
      addToast({
        message: 'Profile updated successfully!',
        variant: 'success',
      })
    );
  };

  const showError = () => {
    dispatch(
      addToast({
        message: 'Failed to save dsfsaf. sdfdfs daf sdfasdfdsf. sdfdsfdsf.  sdfsdfsdf.  sdfsdfsdfsd. sdfsdf.  sdfsd.  sdfsdfsdaf. sdf.  s. sdfsdfsdfdsf.  sdfsdf  changes',
        variant: 'error',
        duration: 6000,
      })
    );
  };

  return (
    <div className="p-6">
      <button
        onClick={showSuccess}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-3"
      >
        Success Toast
      </button>

      <button
        onClick={showError}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Error Toast
      </button>
    </div>
  );
}

export default Example;
