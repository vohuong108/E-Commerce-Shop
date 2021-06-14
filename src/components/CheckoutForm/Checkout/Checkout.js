import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { commerce } from '../../../lib/commerce';
import useStyles from './styles.js';
import AddressForm from '../AddressForm.js';
import PaymentForm from '../PaymentForm.js';
const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    console.log('render Checkout');
    console.log('Cart: ', cart);
    const classes = useStyles();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    useEffect(() => {
        console.log('run in useEffect Checkout')
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'});
                setCheckoutToken(token);
            } catch(error) {
                console.log('generateToken', error);
                //Go back to Home Page if get Error
                if(activeStep !== steps.length) history.push('/')
            }
        }

        generateToken();
        
    }, [cart])

    const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
    const backStep = () => setActiveStep((prevStep) => prevStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )
    
    if (error) {
        Confirmation = () => (
          <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
          </>
        );
    }

    const Form = () => activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} next={next} /> 
        : <PaymentForm 
            shippingData={shippingData} 
            checkoutToken={checkoutToken}
            nextStep={nextStep}
            backStep={backStep} 
            onCaptureCheckout={onCaptureCheckout}
          />
    
    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
    </>
    )
}

export default Checkout
