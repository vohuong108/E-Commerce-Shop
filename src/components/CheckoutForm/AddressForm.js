import React, { useState, useEffect  } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce.js';
import FormInput from './CustomTextField';

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountryCode, setShippingCountryCode] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivisionCode, setShippingSubdivisionCode] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();

    const fetchShippingCountries = async (checkoutTokenId) => {
        try {
            const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
            setShippingCountries(countries);
            setShippingCountryCode(Object.keys(countries)[0]);
        } catch (error) {}
    }
    
    const fetchShippingSubdivisions = async (country_code) => {
        try {
            const { subdivisions } = await commerce.services.localeListSubdivisions(country_code);
            setShippingSubdivisions(subdivisions);
            setShippingSubdivisionCode(Object.keys(subdivisions)[0]);
        } catch (error) {}
        
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        try {
            const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });
            setShippingOptions(options);
            setShippingOption(options[0].id);
        } catch (error) {}
        
    };

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, [checkoutToken.id])

    useEffect(() => {
        if(shippingCountryCode) fetchShippingSubdivisions(shippingCountryCode);
    }, [shippingCountryCode])

    useEffect(() => {
        if (shippingSubdivisionCode) fetchShippingOptions(checkoutToken.id, shippingCountryCode, shippingSubdivisionCode);
    }, [shippingSubdivisionCode]);

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping address</Typography>
            <FormProvider {...methods}>
                {/* handle if did not fetched data */}
                <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountryCode, shippingSubdivisionCode, shippingOption}))} >
                    <Grid container spacing={3}>
                        <FormInput name='firstName' label='First name' />
                        <FormInput name="lastName" label="Last name" />
                        <FormInput name="address1" label="Address line 1" />
                        <FormInput name="email" label="Email" />
                        <FormInput name="city" label="City" />
                        <FormInput name="zip" label="Zip / Postal code" />
                        <Grid item xs={12} sm={6} >
                            <InputLabel>Shipping Country</InputLabel>
                            <Select 
                                value={shippingCountryCode} 
                                fullWidth 
                                onChange={(e) => setShippingCountryCode(e.target.value)}
                            >
                                {Object.entries(shippingCountries).map(([code, name]) => (
                                    <MenuItem key={code} value={code} >
                                        {name}
                                    </MenuItem>
                                ))}
                                
                            </Select>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} >
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select 
                                value={shippingSubdivisionCode} 
                                fullWidth 
                                onChange={(e) => setShippingSubdivisionCode(e.target.value)} 
                            >
                                {Object.entries(shippingSubdivisions).map(([code, name]) => (
                                    <MenuItem key={code} value={code} >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} >
                            <InputLabel>Shipping Options</InputLabel>
                            <Select 
                                value={shippingOption} 
                                fullWidth 
                                onChange={(e) => setShippingOption(e.target.value)} 
                            >
                                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
                        <Button disabled={!shippingOption} type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
