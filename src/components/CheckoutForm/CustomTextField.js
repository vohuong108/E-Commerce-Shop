import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Grid } from '@material-ui/core';

const FormInput = ({ name, label }) => {
    const { control } = useFormContext();
    return (
        <Grid item xs={12} sm={6} >
            <Controller
                render={({ field }) => {
                    return <TextField defaultValue="" label={label} required fullWidth {...field}/>}}
                control={control}
                name={name}
            />
        </Grid>
    );
}

export default FormInput;
