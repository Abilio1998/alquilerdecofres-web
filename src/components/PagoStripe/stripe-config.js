// src/components/stripe-config.js
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = loadStripe('pk_test_51Q0SVKP7ohCTIGjvPYuOzOMw5iWLggrmFVmxUmI3gsGTnryzN9lUCPav6O0wV32zXepf6tuy0411i1WTgYehgm5K00y0YkmtaD');

export default STRIPE_PUBLIC_KEY;