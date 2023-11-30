import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFAutocomplete({ name, label, helperText, ...other }) {
  const { control, setValue, getValues } = useFormContext();

  const value = getValues(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          value={value || null}
          onChange={(event, newValue) => {
            setValue(name, newValue, { shouldValidate: true });
          }}
          renderInput={(params) => (
            <TextField
              label={label}
              helperText={helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
