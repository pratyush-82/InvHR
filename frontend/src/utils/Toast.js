import { useSnackbar } from "../components/snackbar";

export default function Toast() {
    const { enqueueSnackbar } = useSnackbar();
    // eslint-disable-next-line no-shadow
    const Toast = (message, configuration = {}) => {
        enqueueSnackbar(message, configuration);
    };
    const ToastError = (message) => {
        enqueueSnackbar(message, {
            variant: "error",
        });
    };
    window.Toast = Toast;
    window.ToastError = ToastError;
    return '';
}